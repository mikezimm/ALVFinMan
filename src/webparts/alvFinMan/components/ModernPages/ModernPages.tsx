import * as React from 'react';
import styles from '../AlvFinMan.module.scss';
import stylesM from './ModernPages.module.scss';
import { ILayoutGPage, ILayoutSPage, ILayoutAPage, IFMBuckets, IPagesContent,   } from '../IAlvFinManProps';
import { IModernPagesProps, IModernPagesState, ModernPageValues, } from './IModernPagesProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Web, ISite } from '@pnp/sp/presets/all';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { DefaultButton, PrimaryButton, CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

import { Panel, IPanelProps, IPanelStyleProps, IPanelStyles, PanelType } from 'office-ui-fabric-react/lib/Panel';

import { Pivot, PivotItem, IPivotItemProps, PivotLinkFormat, PivotLinkSize,} from 'office-ui-fabric-react/lib/Pivot';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";

import * as strings from 'AlvFinManWebPartStrings';

import ReactJson from "react-json-view";

import { replaceHTMLEntities } from '@mikezimm/npmfunctions/dist/Services/Strings/html';
import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';
import { ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, IChartSeries, ICharNote, } 
    from '@mikezimm/npmfunctions/dist/CSSCharts/ICSSCharts';

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';

import { LookupColumns, SourceInfo } from '../DataInterface';
import { divide, stubFalse } from 'lodash';
import { makeToggleJSONCmd } from '../Elements/CmdButton';
import { getDocWiki } from './SinglePage/getModernContent';
import { getModernHumanReadable } from './SinglePage/processModernContent';

import SinglePage from './SinglePage/SingleModernPage';
import SingleModernPage from './SinglePage/SingleModernPage';

//  NOTE:   linkNoLeadingTarget is used in Layouts1, Layouts2 and Modern Pages... maybe consolidate
export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //

const consoleLineItemBuild: boolean = false;

/**
 *
  Never list these page titles in the list of pages:
*/
const ignoreThesePages: string[] = [
  'Easy Contnets', // 
  'EasyContents', // 
];

export default class ModernPages extends React.Component<IModernPagesProps, IModernPagesState> {

  private imageStyle = '';

  public constructor(props:IModernPagesProps){
    super(props);
    console.log('constructor:',   );
    this.state = {
      showItemPanel: false,
      showCanvasContent1: this.props.canvasOptions.pagePreference === 'canvasContent1' ? true : false,
      showPanelJSON: false,
      showThisItem: this.props.pages.length > 0 ? this.props.pages[ 0 ] : null,
      refreshId: `${this.props.refreshId}`,
      sort: {
        prop: this.props.sort.prop,
        order: this.props.sort.order,
      },
    };
  }

  public componentDidMount() {
    console.log('componentDidMount:',   );
    this.updateWebInfo( '', false );
  }

  public async updateWebInfo ( webUrl: string, listChangeOnly : boolean ) {
    console.log('updateWebInfo:',   );
    if ( this.state.showCanvasContent1 === true ) {
      getDocWiki( this.state.showThisItem , this.props.source, this.props.canvasOptions, this.state.showCanvasContent1, this.updateModernState.bind( this ) );
    }

    // this.setState({ docs: docs, buckets: buckets, sups: sups });

  }

  //        
    /***
   *         d8888b. d888888b d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b 
   *         88  `8D   `88'   88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     
   *         88   88    88    88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo 
   *         88   88    88    88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~ 
   *         88  .8D   .88.   88  .8D      88b  d88 88      88  .8D 88   88    88    88.     
   *         Y8888D' Y888888P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P 
   *                                                                                         
   *                                                                                         
   */

  public componentDidUpdate(prevProps){
    //Just rebuild the component
    if ( this.props.refreshId !== prevProps.refreshId ) {

      console.log('componentDidUpdate: refreshId', prevProps.refreshId, this.props.refreshId  );
      let showThisItem: IPagesContent = this.state.showThisItem;
      if ( !showThisItem && this.props.pages.length > 0 ) showThisItem = this.props.pages[0];
      this.setState({ refreshId: this.props.refreshId, showThisItem: showThisItem });

    } else if ( JSON.stringify( this.props.canvasOptions) !== JSON.stringify( prevProps.canvasOptions ) ) {
      console.log('ModernPages style update: ', this.imageStyle );
      this.setState({ refreshId: this.props.refreshId, });
    }
  }

  public render(): React.ReactElement<IModernPagesProps> {

    if ( ModernPageValues.indexOf( this.props.mainPivotKey )< 0  ) {
      return ( null );

    } else {
      console.log('ModernPages: ReactElement', this.props.refreshId  );

      let pagesList : any[] = [];
  
      let SortedPages: IPagesContent[] = sortObjectArrayByNumberKey( this.props.pages, this.state.sort.order, this.state.sort.prop );
  
      SortedPages.map( item => {
        let classNames = [ stylesM.titleListItem, styles.leftFilter ];
        if ( this.state.showThisItem && ( item.ID == this.state.showThisItem.ID ) ) { classNames.push( stylesM.isSelected ) ; }
        //Make sure page has Title and is not a dud, also check it's not a common page that does not belong in this component
        if ( item.Title && ignoreThesePages.indexOf( item.Title ) < 0 ) {
          pagesList.push( <li className={ classNames.join( ' ' ) } onClick= { this.clickNewsItem.bind( this, item.ID, 'pages', item  )} style={ null }>
          { item.Title } </li>  );
        }
      });

      let page = <div className={ [ stylesM.modernPage, this.props.debugMode === true ? stylesM.debugMode : null ].join(' ') } style={{  }} >
        {/* <div className={ styles.titleList }> <ul>{ pagesList }</ul></div> */}
        <div className={ stylesM.titleList }>
          <h3>{this.props.source.searchSource}</h3>
          <div className= { stylesM.pageDescription }>{this.props.source.searchSourceDesc}</div>
           { pagesList }
        </div>
        <SingleModernPage 
          page= { this.state.showThisItem }
          showCanvasContent1= { this.state.showCanvasContent1 }
          source= { this.props.source }
          refreshId= { this.props.refreshId  }
          canvasOptions= { this.props.canvasOptions }
          imageStyle= { this.imageStyle }
          debugMode= { this.props.debugMode }
        ></SingleModernPage>
      </div>;

      const userPanel = this.state.showItemPanel !== true ? null : <div><Panel
        isOpen={ this.state.showItemPanel === true ? true : false }
        // this prop makes the panel non-modal
        isBlocking={true}
        onDismiss={ this._onClosePanel.bind(this) }
        closeButtonAriaLabel="Close"
        type = { PanelType.large }
        isLightDismiss = { true }
        >
        <SingleModernPage 
          page= { this.state.showThisItem }
          showCanvasContent1= { true }
          source= { this.props.source }
          refreshId= { this.props.refreshId  }
          canvasOptions= { this.props.canvasOptions }
          imageStyle= { this.imageStyle }
          debugMode= { this.props.debugMode }
        ></SingleModernPage>
      </Panel></div>;

      const debugContent = this.props.debugMode !== true ? null : <div>
        App in debugMode - Change in Web Part Properties - Page Preferences.  <b><em>Currently in ModernPage</em></b>
      </div>;

      return (
        // <div className={ styles.alvFinMan }>
        <div className={ null }>
          {/* <div className={ stylesM.pagesPage }> */}
          <div className={ null }>
            {/* <div className={ styles.row }> */}
              {/* <div className={ styles.column }> */}
                { debugContent }
                { page }
                { userPanel }
              {/* </div> */}
            {/* </div> */}
          </div>
        </div>
      );

    }

  }

  //getDocWiki( item: IPagesContent, source: ISourceProps,  canvasOptions: ICanvasContentOptions, callBack: any )
  private updateModernState( item: IPagesContent, showCanvasContent1: boolean ) {

    this.setState({ 
      showItemPanel: showCanvasContent1 === false ? true : false, 
      showCanvasContent1: showCanvasContent1, 
      showThisItem: item });

  }
  private clickNewsItem( ID: number, category: string, item: IPagesContent, e: any ) {  //this, item.ID, 'pages', item
    console.log('clickNewsItem:', ID, item );
    // debugger;

    let newState = this.state.showItemPanel;

    if ( e.altKey === true ) {
      // newState = this.state.showItemPanel === true ? false : true;
      let showCanvasContent1 = e.ctrlKey === true ? true : false;
      getDocWiki( item , this.props.source, this.props.canvasOptions, showCanvasContent1, this.updateModernState.bind( this ) );

    } else if ( e.ctrlKey === true && item.File ) {
      window.open( item.File.ServerRelativeUrl , '_blank' );
      this.setState({ showThisItem: item, showItemPanel: newState });

    } else if ( this.state.showCanvasContent1 === true ) {
      getDocWiki( item , this.props.source, this.props.canvasOptions, true, this.updateModernState.bind( this ) );

    } else if ( this.props.canvasOptions.pagePreference === 'tab' && item.File ) {
      window.open( item.File.ServerRelativeUrl , '_blank' );
        this.setState({ showThisItem: item, showItemPanel: newState });

      } else {
        this.setState({ showThisItem: item, showItemPanel: newState });
      }


  }

  private _onClosePanel( ) {
    this.setState({ showItemPanel: false });
  }

}
