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

  private cke_editable = this.props.canvasOptions.addCkeEditToDiv !== false ? 'cke_editable' : '';
  private imageStyle = '';

  private ToggleJSONCmd = makeToggleJSONCmd( this._toggleJSON.bind( this ) );

  private buildPagesList( News: IPagesContent[], sortProp: ISeriesSort, order: ISeriesSort, showItem: IPagesContent, showCanvasContent1: boolean ) {
    console.log('buildPagesList:', News );

    let pagesList : any[] = [];

    // debugger;

    let SortedPages: IPagesContent[] = sortObjectArrayByNumberKey( News, order, sortProp );

    SortedPages.map( item => {
      let classNames = [ stylesM.titleListItem, styles.leftFilter ];
      if ( showItem && ( item.ID == showItem.ID ) ) { classNames.push( stylesM.isSelected ) ; }
      //Make sure page has Title and is not a dud, also check it's not a common page that does not belong in this component
      if ( item.Title && ignoreThesePages.indexOf( item.Title ) < 0 ) {
        pagesList.push( <li className={ classNames.join( ' ' ) } onClick= { this.clickNewsItem.bind( this, item.ID, 'pages', item  )} style={ null }>
        { item.Title } </li>  );
      }
    });

    let showArticle: IPagesContent = showItem ? showItem : null;

    const articleTitle = showArticle ? showArticle.Title : 'Select pages to show...';
    let articleDesc: any  = showArticle ? showArticle.Description : '';

    const imageUrl = showArticle ? showArticle.BannerImageUrl : null;

    const CanvasContent1 = !showArticle || showCanvasContent1 !== true ? null :
      <div className={ ['', this.cke_editable].join(' ') }>
        {/* <h2>CanvasContent1</h2> */}
        <div dangerouslySetInnerHTML={{ __html: showArticle.CanvasContent1Str }} />
      </div>;

    if ( CanvasContent1 ) { articleDesc = null ; } //Remove Description because full article is shown below

    let ClickInstructions = showCanvasContent1 === true ? null : 
    <div style={{ paddingTop: '15px'}}>
      <div>To go to article: <span style={{ cursor: 'pointer', color: 'darkblue' }}onClick={ this.openArticleNewTab.bind( this, showArticle )}>click here</span></div>
      <div>To open article in NEW full-size tab: <b>CTRL-Click the Title</b> </div>
      <div>To show it right here: <b>CTRL-ALT-Click the Title</b></div>
      <div>To show it in a side panel: <b>ALT-Click the Title</b></div>
    </div>;

    if ( showArticle && showArticle['OData__OriginalSourceUrl'] && showArticle['OData__OriginalSourceUrl'].indexOf( window.location.origin ) < 0 ) {
      //Link is external...  Use different instructions
      ClickInstructions =
      <div style={{ paddingTop: '15px'}}>
        <div style={{ paddingBottom: '10px', fontWeight: 600 }}>To go to article: <span style={{ cursor: 'pointer', color: 'darkblue' }}onClick={ this.openThisLink.bind( this, showArticle['OData__OriginalSourceUrl'] )}>click here</span></div>
        <div style={{ color: 'red', }}>Security check :)  This is the full link you will be clicking on</div>
        <div>{ showArticle['OData__OriginalSourceUrl'] } </div>
      </div>;
    }

    if ( !showItem && SortedPages.length > 0 ) { showArticle = SortedPages[0]; }
    const image = !showItem || !imageUrl ? null : 
    <img src={ imageUrl.Url } height="100px" width="100%" style={{ objectFit: "cover" }} title={ imageUrl.Url }></img>;

    let page = <div className={ [ stylesM.modernPage, this.props.debugMode === true ? stylesM.debugMode : null ].join(' ') } style={{  }} >
      {/* <div className={ styles.titleList }> <ul>{ pagesList }</ul></div> */}
      <div className={ stylesM.titleList }>
        <h3>{this.props.source.searchSource}</h3>
        <div className= { stylesM.pageDescription }>{this.props.source.searchSourceDesc}</div>
         { pagesList } </div>
      <div className={ [stylesM.article, '' ].join(' ') }>
        { image }
        <h3>{ articleTitle }</h3>
         { articleDesc }
         { ClickInstructions }
         { CanvasContent1 }
      </div>
    </div>;
    return page;

  }

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

      const showPage = <div> { this.buildPagesList( this.props.pages, this.state.sort.prop, this.state.sort.order, this.state.showThisItem, this.state.showCanvasContent1 ) } </div>; 
  
      if ( this.state.showThisItem && this.state.showThisItem.WikiField ) {
        // const replaceString = '<a onClick=\"console.log(\'Going to\',this.href);window.open(this.href,\'_blank\')\" style="pointer-events:none" href=';
        const replaceString = '<a onClick=\"window.open(this.href,\'_blank\')\" href=';
        this.state.showThisItem.WikiField = this.state.showThisItem.WikiField.replace(linkNoLeadingTarget,replaceString);
      }

      //CanvasContent1,LayoutsWebpartsContent'
      const CanvasContent1 = !this.state.showThisItem || !this.state.showThisItem.CanvasContent1Str ? null : 
      <div className={ ['', this.cke_editable].join(' ') }>
        <h2>CanvasContent1</h2>
        <div dangerouslySetInnerHTML={{ __html: this.state.showThisItem.CanvasContent1Str }} />
      </div>;

      const LayoutsWebpartsContent = !this.state.showThisItem || !this.state.showThisItem.LayoutsWebpartsContent ? null : 
      <div>
        <h2>LayoutsWebpartsContent</h2>
        <div dangerouslySetInnerHTML={{ __html: this.state.showThisItem.LayoutsWebpartsContent }} />
      </div>;

      const panelContent = this.state.showPanelJSON !== true ? null : <div>
        <ReactJson src={ this.state.showThisItem } name={ 'Summary' } collapsed={ false } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '20px 0px' }}/>
      </div>;

      const userPanel = <div><Panel
        isOpen={ this.state.showItemPanel === true ? true : false }
        // this prop makes the panel non-modal
        isBlocking={true}
        onDismiss={ this._onClosePanel.bind(this) }
        closeButtonAriaLabel="Close"
        type = { PanelType.large }
        isLightDismiss = { true }
        >
          { CanvasContent1 }
          { LayoutsWebpartsContent }
          { this.ToggleJSONCmd }
          { panelContent }
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
                { showPage }
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

  private openArticleNewTab( item: IPagesContent ) {
    window.open( item.File.ServerRelativeUrl , '_blank' );
  }

  private openThisLink( link:string ) {
    window.open( link , '_blank' );
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

    }


  }



  private _toggleJSON( ) {
    let newState = this.state.showPanelJSON === true ? false : true;

    let result = this.state.showThisItem;
    result = getModernHumanReadable( result );

    this.setState( { showThisItem: result , showPanelJSON: newState });
  }

  private _onClosePanel( ) {
    this.setState({ showItemPanel: false });
  }

}
