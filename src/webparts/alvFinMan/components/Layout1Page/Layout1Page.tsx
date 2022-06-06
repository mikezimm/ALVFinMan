import * as React from 'react';
import styles from '../AlvFinMan.module.scss';
import { ILayoutGPage, ILayoutSPage, ILayoutAll, ILayoutAPage, IFMBuckets, IAnyContent,   } from '../IAlvFinManProps';
import { ILayout1PageProps, ILayout1PageState, ILayout1Page, Layout1PageValues, } from './ILayout1PageProps';
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
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';
import { IFrameDialog,  } from "@pnp/spfx-controls-react/lib/IFrameDialog";

import * as strings from 'AlvFinManWebPartStrings';

import ReactJson from "react-json-view";

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';

import AlvAccounts from '../Accounts/Accounts';
import { ISourceInfo, ISourceProps, LookupColumns, SourceInfo } from '../DataInterface';
import { IFMSearchType, SearchTypes } from '../DataInterface';
import { getSearchTypeIcon } from '../Elements/FileTypeIcon';
import { makeToggleJSONCmd } from '../Elements/CmdButton';
import { IFramePanel } from '@pnp/spfx-controls-react';
import { IFPSUser } from '@mikezimm/npmfunctions/dist/Services/Users/IUserInterfaces';

export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //

const consoleLineItemBuild: boolean = false;

// const AccountSearch = [ 'Title', 'Description', 'ALGroup', 'Name1' ];

// const thisSelect = ['*','ID','FileRef','FileLeafRef','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','CheckoutUserId','HasUniqueRoleAssignments','Title','FileSystemObjectType','FileSizeDisplay','FileLeafRef','LinkFilename','OData__UIVersion','OData__UIVersionString','DocIcon'];

// const sitePagesColumns: string[] = [ "ID", "Title0", "Author/Title", "File/ServerRelativeUrl", "FileRef", ]; //Do not exist on old SitePages library:   "Descritpion","BannerImageUrl.Url", "ServerRelativeUrl"
// const libraryColumns: string[] = [ 'ID','FileRef','FileLeafRef','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','CheckoutUserId','HasUniqueRoleAssignments','Title','FileSystemObjectType','FileSizeDisplay','FileLeafRef','LinkFilename','OData__UIVersion','OData__UIVersionString','DocIcon'];

// const FinManSite: string ="/sites/ALVFMTest/";
// const StandardsLib: string = "StandardDocuments";
// const SupportingLib: string = "SupportDocuments";
// const LookupColumns: string[] = ['Functions/Title', 'Topics/Title', 'ALGroup/Title', 'Sections/Title','Processes/Title' ];
// const AccountsList: string = "HFMAccounts";

// const pivotStyles = {
//   root: {
//     whiteSpace: "normal",
//     marginTop: '30px',
//     color: 'white',
//   //   textAlign: "center"
//   }};

// const pivotHeading0 : ILayoutMPage = 'Main';
// const pivotHeading1 : ILayoutSPage = 'Statements';
// const pivotHeading2 : ILayout1Page = 'Reporting';
// const pivotHeading3 : ILayout1Page = 'Processes';
// const pivotHeading4 : ILayout1Page = 'Functions';
// const pivotHeading5 : ILayout1Page = 'Topics';
// const pivotHeading6 : ILayoutAPage = 'Accounts';

// const allPivots: ILayoutAll[] = [ pivotHeading0, pivotHeading1, pivotHeading2, pivotHeading3, pivotHeading4, pivotHeading5, pivotHeading6 ];
// const layout1Pivots : ILayout1Page[] = [ pivotHeading2, pivotHeading3, pivotHeading4, pivotHeading5,  ];

// const pivotTitles = allPivots.map( pivot => { return pivot.split('|')[0] ; } );
// const pivotKeys = allPivots.map( pivot => { return pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ; } );
// const pivotItems = pivotKeys.map( ( key, idx ) => {
//   return <PivotItem headerText={ pivotTitles[idx] } ariaLabel={pivotTitles[idx]} title={pivotTitles[idx]} itemKey={ key } ></PivotItem>;
// });

// const pivotHeading6 = 'Function';

export default class Layout1Page extends React.Component<ILayout1PageProps, ILayout1PageState> {
  private FPSWindow: any = window;
  private FPSUser: IFPSUser = this.FPSWindow.FPSUser ? this.FPSWindow.FPSUser : null;

  private ToggleJSONCmd = makeToggleJSONCmd( this._toggleJSON.bind( this ) );

  private buildLay1Page( pivot: string, bucketClickKey: string, buckets: IFMBuckets, manual: IAnyContent[] , sups: any[] ) {
    console.log('buildLay1Page:', pivot,bucketClickKey  );
    const key = pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ;

    //Create Left Title links 
    const firstTitle = buckets[key][0];
    let titles = buckets[key].map( ( title, idx ) => {
      let classNames = [ styles.leftFilter ];
      if ( title === bucketClickKey ) { classNames.push( styles.isSelected ) ; }
      else if ( bucketClickKey === '' && idx === 0 ) { classNames.push( styles.isSelected ) ; }

      return <li className={ classNames.join( ' ' ) } onClick = { this.clickBucketItem.bind( this, key, title ) }> { title } </li>;
    });

    let showDocs : any[] = [];
    let checkBucketKey = !bucketClickKey ? firstTitle : bucketClickKey;
    manual.map( item => {
      let showTitle = item.Title0 ? item.Title0 : item.Title? item.Title: item.searchTitle + '*';
      if ( Array.isArray( item [key] ) === true ) {
        item [key].map( value => {
          if ( consoleLineItemBuild === true ) console.log( 'key value - item', key, value, item ) ;
          if ( value.Title === checkBucketKey ) { showDocs.push( 
          <li onClick= { this.clickDocumentItem.bind( this, key, 'manual', item  )}> 
            { showTitle } </li> ) ; }
        });
      } else { //This is not a multi-select key
          if ( item [key] && item [key].Title === checkBucketKey ) { showDocs.push(  
          <li onClick= { this.clickDocumentItem.bind( this, key, 'manual', item  )}>
            { showTitle } </li>  ) ; }
      }
    });
    if ( showDocs.length === 0 ) { showDocs.push( <li >None found for { checkBucketKey }</li>  ) ; }

    let showSups : any[] = [];
    sups.map( item => {
      let showTitle = item.Title0 ? item.Title0 : item.Title? item.Title: item.searchTitle + '*';
      if ( Array.isArray( item [key] ) === true ) {
        item [key].map( value => {
          if ( consoleLineItemBuild === true ) console.log( 'key value - item', key, value, item ) ;
          if ( value.Title === checkBucketKey ) { showSups.push( 
          <li  className={ styles.supsLI } onClick= { this.clickDocumentItem.bind( this, key, 'sups', item  )}>
            { getSearchTypeIcon( SearchTypes.objs[item.typeIdx] ) }
            { showTitle } </li> ) ; }
        });
      } else { //This is not a multi-select key
          if ( item [key] && item [key].Title === checkBucketKey ) { showSups.push(  
          <li  onClick= { this.clickDocumentItem.bind( this, key, 'sups', item  )}>
            { getSearchTypeIcon( SearchTypes.objs[item.typeIdx] ) }
            { item.FileLeafRef ? item.FileLeafRef : showTitle } </li>  ) ; }
      }
    });

    if ( showSups.length === 0 ) { showSups.push( <li >None found for { checkBucketKey }</li>  ) ; }

    let page = <div className={ styles.layout1 } >
      <div className={ styles.titleList }><h3>{ this.props.mainPivotKey}</h3> { titles } </div>
      <div className={ styles.docsList }><h3 onClick={ this.clickLibrary.bind( this, SourceInfo.manual , )}>Standards Manual ({ showDocs.length })</h3> { showDocs } </div>
      <div className={ styles.docsList }><h3 onClick={ this.clickLibrary.bind( this, SourceInfo.sups , )}>Supporting Docs ({ showSups.length })</h3> { showSups } </div>
    </div>;
    return page;


  }
public constructor(props:ILayout1PageProps){
  super(props);

  console.log('constructor:',   );
  this.state = {
    bucketClickKey: '',
    docItemKey: '',
    supItemKey: '',
    showItemPanel: false,
    showPanelItem: null,
    refreshId: `${this.props.refreshId}`,
    showPanelJSON: false, //this.FPSUser && this.FPSUser.simple === 'SharePoint' ? true : false,
  };
}

public componentDidMount() {
  console.log('componentDidMount:',   );
  this.updateWebInfo( '', false );
}

public async updateWebInfo ( webUrl: string, listChangeOnly : boolean ) {
  console.log('updateWebInfo:',   );
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

      let bucketClickKey = this.state.bucketClickKey;
      if ( this.props.mainPivotKey !== prevProps.mainPivotKey ) {
        bucketClickKey = '';
      }

      this.setState({ refreshId: this.props.refreshId, bucketClickKey: bucketClickKey });
    }
  }

  public render(): React.ReactElement<ILayout1PageProps> {

    const showPanelItem = this.state.showPanelItem;
    
    if ( this.props.mainPivotKey === '' || Layout1PageValues.indexOf( this.props.mainPivotKey ) < 0 ) {
      return ( null );

    } else {
      console.log('Layout1Page: ReactElement', this.props.refreshId  );
      const layout1 = Layout1PageValues.indexOf( this.props.mainPivotKey as any) > -1 ? this.props.mainPivotKey :null;
      const showPage = !layout1 ? null :
      <div> { this.buildLay1Page( layout1 , this.state.bucketClickKey, this.props.buckets, this.props.manual , this.props.sups ) } </div>; 
  
      if ( showPanelItem && showPanelItem.WikiField ) {
        // const replaceString = '<a onClick=\"console.log(\'Going to\',this.href);window.open(this.href,\'_blank\')\" style="pointer-events:none" href=';
        const replaceString = '<a onClick=\"window.open(this.href,\'_blank\')\" href=';
        showPanelItem.WikiField = showPanelItem.WikiField.replace(linkNoLeadingTarget,replaceString);
      }
      
      let panelHeading = null;
      if ( showPanelItem ) {
        let panelTitle = 'Unknown Title';
        if ( showPanelItem.Title ) { panelTitle = showPanelItem.Title ; }
        else if ( showPanelItem.Title0 ) { panelTitle = showPanelItem.Title0 ; }
        else if ( showPanelItem.FileLeafRef ) { panelTitle = showPanelItem.FileLeafRef ; }

        panelHeading = <div className={ styles.supPanelHeader }>
          <h3>{ panelTitle }</h3>
          <div className={ styles.dateStamps}>
            <div>Created</div> <div>{ showPanelItem.createdLoc }</div> <div>{ showPanelItem['Author/Title'] }</div>
          </div>
          <div className={ styles.dateStamps}>
            <div>Modified</div> <div>{ showPanelItem.modifiedLoc }</div> <div>{ showPanelItem['Editor/Title'] }</div>
          </div>

          <div style={{ paddingBottom: '20px'}}>
            <h3 style={{ cursor: 'pointer', paddingTop: '15px', marginBottom: '0px' }} 
              onClick={ this.clickOpenInNewTab.bind( this, showPanelItem.FileRef ? showPanelItem.FileRef : showPanelItem.searchHref ) }>
              Click here to go to full page item ( in a new tab ) <Icon iconName='OpenInNewTab'></Icon></h3>
            <div>File Location: { showPanelItem.FileRef ? showPanelItem.FileRef : showPanelItem.searchHref }</div>
          </div>
          {/* <div className={ styles.dateStamps}>
            <div>Version</div> <div>{ showPanelItem.modifiedLoc }</div> <div>{ showPanelItem['Editor/Title'] }</div>
          </div> */}
        </div>;

      }

      let contentField = !showPanelItem ? null : showPanelItem.CanvasContent1 ? showPanelItem.CanvasContent1 : showPanelItem.WikiField;
      const docsPage = !showPanelItem || !contentField ? null : <div dangerouslySetInnerHTML={{ __html: contentField }} />;
      const fileEmbed = !showPanelItem || !showPanelItem.ServerRedirectedEmbedUrl ? null : <iframe src={ showPanelItem.ServerRedirectedEmbedUrl } height='350px' width='100%' style={{paddingTop: '20px' }}></iframe>;
      const panelContent = this.state.showPanelJSON !== true ? null : <div>
        <ReactJson src={ showPanelItem } name={ 'Summary' } collapsed={ false } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '20px 0px' }}/>
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
          { panelHeading }
          { fileEmbed }
          { docsPage }
          { this.ToggleJSONCmd }
          { panelContent }
      </Panel></div>;
  
      return (
        // <div className={ styles.alvFinMan }>
        //   <div className={ styles.container }>
            <div className={ styles.row }>
              {/* <div className={ styles.column }> */}
                { showPage }
                { userPanel }
              {/* </div> */}
            </div>
        //   </div>
        // </div>
      );

    }

  }

  private _toggleJSON( ) {
    let newState = this.state.showPanelJSON === true ? false : true;
    this.setState( { showPanelJSON: newState });
  }

  private clickOpenInNewTab( href ) {
    console.log('clickOpenInNewTab:', href );
    window.open( href , '_blank' );
  }

  private clickBucketItem( pivot, leftMenu, ex ) {
    console.log('clickBucketItem:', pivot, leftMenu );
    this.setState({ bucketClickKey: leftMenu });
  }

  
  private async clickDocumentItem( pivot, supDoc: 'sups' | 'manual', item, e ) {
    console.log('clickDocumentItem:', pivot, supDoc, item );
    if ( e.ctrlKey === true && item.FileRef ) {
      window.open( item.FileRef, '_blank' );

    }  else if ( e.ctrlKey === true && item.ServerRedirectedEmbedUrl ) {
      window.open( item.ServerRedirectedEmbedUrl, '_blank' );

    }  else if ( supDoc === 'manual' ) {
      await this.getDocWiki( item );

    } else {
      this.setState({ showItemPanel: true, showPanelItem: item });
    }

  }

    
  private async clickLibrary( item: ISourceProps, e ) {
    console.log('clickLibrary:', item, e );
    if ( e.ctrlKey === true ) {
      let gotoLink = item.webUrl + item.webRelativeLink;
      window.open( gotoLink, '_blank' );
    }

  }

   //Standards are really site pages, supporting docs are files
  private async getDocWiki( item: any, ) {
    
    let sourceInfo: ISourceProps = SourceInfo.manual;

    let web = await Web( `${window.location.origin}${sourceInfo.webUrl}` );
    
    const columns = sourceInfo.columns;

    let expColumns = getExpandColumns( columns );
    let selColumns = getSelectColumns( columns );
    
    const expandThese = expColumns.join(",");
    let contentField = sourceInfo.isModern === true ? 'CanvasContent1,LayoutsWebpartsContent,BannerImageUrl' : 'WikiField';
    let selectThese = `*,${contentField},FileRef,FileLeafRef,` + selColumns.join(",");

    // Why an await does not work here is beyond me.  It should work :(
    // let fullItem = await web.lists.getByTitle( StandardsLib ).items.select(selectThese).expand(expandThese).getById( item.ID );
    web.lists.getByTitle( sourceInfo.listTitle ).items.select(selectThese).expand(expandThese).getById( item.ID )().then( result => {
      console.log( 'ALVFinManDocs', result );
      //Only real addition is the WikiField
      item.WikiField = result.WikiField;
      this.setState({ showItemPanel: true, showPanelItem: item });

    }).catch( e => {
      console.log('Error getting item wiki');
    });

  }



  private _onClosePanel( ) {
    this.setState({ showItemPanel: false });
  }

}
