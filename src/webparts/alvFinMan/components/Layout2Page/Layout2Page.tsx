import * as React from 'react';
import styles from '../AlvFinMan.module.scss';
import styles2 from './Layout2.module.scss';
import { ILayoutGPage, ILayoutSPage, ILayoutAPage, IFMBuckets, IPagesContent, IAnyContent  } from '../IAlvFinManProps';
import { ILayout2PageProps, ILayout2PageState, ILayout2Page, Layout2PageValues } from './ILayout2Props';

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

import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';
import { ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, IChartSeries, ICharNote, } 
    from '@mikezimm/npmfunctions/dist/CSSCharts/ICSSCharts';

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';

import { ISourceProps, LookupColumns, SourceInfo } from '../DataInterface';
import { filter } from 'lodash';
import { makeToggleJSONCmd } from '../Elements/CmdButton';

//  NOTE:   linkNoLeadingTarget is used in Layouts1, Layouts2 and Modern Pages... maybe consolidate
export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //

const consoleLineItemBuild: boolean = false;


export default class Layout2Page extends React.Component<ILayout2PageProps, ILayout2PageState> {

  private ToggleJSONCmd = makeToggleJSONCmd( this._toggleJSON.bind( this ) );

  private _toggleJSON( ) {
    let newState = this.state.showPanelJSON === true ? false : true;
    this.setState( { showPanelJSON: newState });
  }

  private buildLayout2List( Items: IAnyContent[], sortProp: ISeriesSort, order: ISeriesSort, showItem: IAnyContent ) {
    console.log('buildLayout2List:', Items );

    let itemsList : any[] = [];
    let showArticle: IAnyContent = showItem ? showItem : null;

    // debugger;

    let SortedItems: IAnyContent[] = sortObjectArrayByNumberKey( Items, order, sortProp );

    SortedItems.map( ( item, idx ) => {
      let classNames = [ styles2.titleListItem, styles.leftFilter ];
      if ( showItem && ( item.ID === showItem.ID ) ) { 
        classNames.push( styles2.isSelected ) ;
        showArticle = item;
      }
      if ( !showItem && idx === 0 ) { 
        classNames.push( styles2.isSelected ) ;
        // showArticle = item;
      }
      itemsList.push( <li className={ classNames.join( ' ' ) } onClick= { this.clickLayout2Item.bind( this, item.ID, 'appLinks', item, 'none'  )} style={ null }>
        { item.Title } </li>  );
    });

    if ( !showArticle && SortedItems.length > 0 ) { showArticle = SortedItems[0]; }

    const articleTitle = showArticle ? showArticle.Title : 'Select appLinks to show...';
    const articleDesc = showArticle ? showArticle.Description : '';
    const richText = showArticle ? showArticle.RichTextPanel : null;

    const content = !richText ? null : 
      <div dangerouslySetInnerHTML={{ __html: richText }} />;

    let linkInfo: any = null;

    if ( showArticle && showArticle.LinkColumn ) {
      linkInfo = [ <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Click here to go to <a href={ showArticle.LinkColumn.Url } > { showArticle.LinkColumn.Description }</a>.</div>,
      <div style={{ paddingBottom: '20px' }}>TIP:  You can also CTRL-Click any bullet items to quickly open the link in a new tab :)</div> ];
    }

    let pageTitle: any = this.props.mainPivotKey;
    if ( pageTitle ==='Statements' ) { pageTitle = 'Financial Statements' ; }
    else if ( pageTitle ==='General' ) { pageTitle = 'General Information' ; }
    else if ( pageTitle ==='Links' ) { pageTitle = 'Links to other systems' ; }


    let page = <div className={ [ styles2.modernPage, this.props.debugMode === true ? styles2.debugMode : null ].join(' ') } >
      {/* <div className={ styles.titleList }> <ul>{ newsList }</ul></div> */}
      <div className={ styles2.titleList }>
        <h3>{ pageTitle }</h3> 
        { itemsList } 
      </div>
      <div className={ styles2.article }>
        <h3 onClick= { this.clickLayout2Item.bind( this, showArticle ? showArticle.ID : null, 'appLinks', showArticle, '_blank'  )} style={{ cursor: showArticle && showArticle.LinkColumn ? 'pointer' : 'default' }}
        >{ articleTitle }</h3>
        { linkInfo }
        { content }
        { articleDesc }
      </div>
    </div>;
    return page;

  }

  public constructor(props:ILayout2PageProps){
    super(props);
    console.log('constructor:',   );
    this.state = {
      showItemPanel: false,
      showPanelJSON: false,

      selectedItem: null,
      refreshId: `${this.props.refreshId}`,
      filteredItems: [],
      sort: {
        prop: 'SortOrder',
        order: 'asc',
      }
    };
  }

  public componentDidMount() {
    console.log('componentDidMount:',   );
    this.updateWebInfo( null );
  }

  public async updateWebInfo ( selectedItem: IAnyContent  ) {
    console.log('updateWebInfo:',   );

    let filteredItems : IAnyContent[]= [];
    this.props.appLinks.map( item =>{
      if ( item.Tab === this.props.mainPivotKey ) {
        filteredItems.push( item );
      }
    });
    // if ( !selectedItem && filteredItems.length > 0 ) { selectedItem = filteredItems[0] ; }
    this.setState({ filteredItems: filteredItems, refreshId: this.props.refreshId, selectedItem: selectedItem });

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
  
      // debugger;
  
      if ( this.props.refreshId !== prevProps.refreshId ) {
        let selectedItem: IAnyContent = this.state.selectedItem;
        if ( this.props.mainPivotKey !== prevProps.mainPivotKey ) { selectedItem = null; }
        this.updateWebInfo( selectedItem );
      }
    }

  public render(): React.ReactElement<ILayout2PageProps> {

    if ( Layout2PageValues.indexOf( this.props.mainPivotKey ) < 0 ) {
      return ( null );

    } else {
      console.log('Layout2Page: ReactElement', this.props.refreshId  );

      const showPage = <div> { this.buildLayout2List( this.state.filteredItems, this.state.sort.prop, this.state.sort.order, this.state.selectedItem ) } </div>; 
  
      if ( this.state.selectedItem && this.state.selectedItem.WikiField ) {
        // const replaceString = '<a onClick=\"console.log(\'Going to\',this.href);window.open(this.href,\'_blank\')\" style="pointer-events:none" href=';
        const replaceString = '<a onClick=\"window.open(this.href,\'_blank\')\" href=';
        this.state.selectedItem.WikiField = this.state.selectedItem.WikiField.replace(linkNoLeadingTarget,replaceString);
      }
      
      const docsPage = !this.state.selectedItem || !this.state.selectedItem.WikiField ? null : <div dangerouslySetInnerHTML={{ __html: this.state.selectedItem.WikiField }} />;
      const panelContent = this.state.showPanelJSON !== true ? null : <div>
        <ReactJson src={ this.state.selectedItem } name={ 'Summary' } collapsed={ false } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '20px 0px' }}/>
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
          { docsPage }
          { this.ToggleJSONCmd }
          { panelContent }
      </Panel></div>;

      const debugContent = this.props.debugMode !== true ? null : <div>
        App in debugMode - Change in Web Part Properties - Page Preferences.  <b><em>Currently in Layout2Page</em></b>
      </div>;

      return (
        // <div className={ styles.alvFinMan }>
        <div className={ null }>
          {/* <div className={ stylesM.modernPage }> */}
          <div className={ null }>
            <div className={ styles.row }>
              {/* <div className={ styles.column }> */}
                { debugContent }
                { showPage }
                { userPanel }
              {/* </div> */}
            </div>
          </div>
        </div>
      );

    }

  }

  private clickLayout2Item( ID: number, category: string, item: IAnyContent, target: 'none' | '_blank', e: any ) {  //this, item.ID, 'news', item
    console.log('clickLayout2Item: target, ID, item', target, ID, item );
    // debugger;

    let newState = this.state.showItemPanel;

    if ( e.altKey === true ) {
      this.getDocWiki ( item );

    } else if ( e.ctrlKey === true && item.LinkColumn ) {
      if ( target === 'none' ) { //Do not open any links by default.
        window.open( item.LinkColumn.Url , '_blank' );
        

      } else if ( target === '_blank' ) { window.open( item.LinkColumn.Url , '_blank' ); }
    } else { 
      this.setState({ selectedItem: item, showItemPanel: newState });

    }

  }

  
  private async clickDocumentItem( pivot, supDoc: 'sups' | 'manual', item, title ) {
    console.log('clickDocumentItem:', pivot, supDoc, item );
    if ( supDoc === 'manual' ) {
      await this.getDocWiki( item );
    } else {
      this.setState({ showItemPanel: true, selectedItem: item });
    }

  }

   //Standards are really site pages, supporting docs are files
  private async getDocWiki( item: any, ) {

    let sourceInfo: ISourceProps = SourceInfo[ item.format ];

    //Someday maybe fetch followupLink content for Panel
    this.setState({ showItemPanel: true, selectedItem: item });

    return;

    let web = await Web( `${window.location.origin}${sourceInfo.webUrl}` );
    
    //followUpLink was intended to be able to show content from the LinkColumn as well but that's a little to much 
    let followUpLink = item.LinkColumn ? item.LinkColumn.Url : '';
    if ( followUpLink.indexOf( sourceInfo.webUrl ) > -1 ) {

    }

    const columns = sourceInfo.columns;

    let expColumns = getExpandColumns( columns );
    let selColumns = getSelectColumns( columns );
    
    const expandThese = expColumns.join(",");
    let extraFetch = sourceInfo.itemFetchCol && sourceInfo.itemFetchCol.length > 0 ? sourceInfo.itemFetchCol.join(",") + ',' : '';
    let selectThese = '*,' + extraFetch + selColumns.join(",");

    // Why an await does not work here is beyond me.  It should work :(
    // let fullItem = await web.lists.getByTitle( StandardsLib ).items.select(selectThese).expand(expandThese).getById( item.ID );
    web.lists.getByTitle( sourceInfo.listTitle ).items.select(selectThese).expand(expandThese).getById( item.ID )().then( result => {
      console.log( `Opening Panel for ${sourceInfo.listTitle} item:`, result );
      //Only real addition is the WikiField
      item.WikiField = result.WikiField;
      this.setState({ showItemPanel: true, selectedItem: item });

    }).catch( e => {
      console.log('Error getting item wiki');
    });

  }



  private _onClosePanel( ) {
    // this.setState({ showItemPanel: false, selectedItem: null });
    this.setState({ showItemPanel: false });
  }

}
