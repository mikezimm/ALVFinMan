import * as React from 'react';
import styles from './AlvFinMan.module.scss';
import { ILayoutMPage, ILayoutSPage, ILayoutAll, ILayoutAPage, IFMBuckets,   } from './IAlvFinancialManualProps';
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

import * as strings from 'AlvFinManWebPartStrings';

import ReactJson from "react-json-view";

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';

import AlvAccounts from './Accounts';

export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //

const consoleLineItemBuild: boolean = false;

const AccountSearch = [ 'Title', 'Description', 'ALGroup', 'Name1' ];

const thisSelect = ['*','ID','FileRef','FileLeafRef','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','CheckoutUserId','HasUniqueRoleAssignments','Title','FileSystemObjectType','FileSizeDisplay','FileLeafRef','LinkFilename','OData__UIVersion','OData__UIVersionString','DocIcon'];

const sitePagesColumns: string[] = [ "ID", "Title0", "Author/Title", "File/ServerRelativeUrl", "FileRef", ]; //Do not exist on old SitePages library:   "Descritpion","BannerImageUrl.Url", "ServerRelativeUrl"
const libraryColumns: string[] = [ 'ID','FileRef','FileLeafRef','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','CheckoutUserId','HasUniqueRoleAssignments','Title','FileSystemObjectType','FileSizeDisplay','FileLeafRef','LinkFilename','OData__UIVersion','OData__UIVersionString','DocIcon'];

const FinManSite: string ="/sites/ALVFMTest/";
const StandardsLib: string = "StandardDocuments";
const SupportingLib: string = "SupportDocuments";
const LookupColumns: string[] = ['Functions/Title', 'Topics/Title', 'ALGroup/Title', 'Sections/Title','Processes/Title' ];
const AccountsList: string = "HFMAccounts";

const pivotStyles = {
  root: {
    whiteSpace: "normal",
    marginTop: '30px',
    color: 'white',
  //   textAlign: "center"
  }};

const pivotHeading0 : ILayoutMPage = 'Main';
const pivotHeading1 : ILayoutSPage = 'Statements';
const pivotHeading2 : ILayout1Page = 'Reporting|Sections';
const pivotHeading3 : ILayout1Page = 'Processes';
const pivotHeading4 : ILayout1Page = 'Functions';
const pivotHeading5 : ILayout1Page = 'Topics';
const pivotHeading6 : ILayoutAPage = 'Accounts';

const allPivots: ILayoutAll[] = [ pivotHeading0, pivotHeading1, pivotHeading2, pivotHeading3, pivotHeading4, pivotHeading5, pivotHeading6 ];
const layout1Pivots : ILayout1Page[] = [ pivotHeading2, pivotHeading3, pivotHeading4, pivotHeading5,  ];

const pivotTitles = allPivots.map( pivot => { return pivot.split('|')[0] ; } );
const pivotKeys = allPivots.map( pivot => { return pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ; } );
const pivotItems = pivotKeys.map( ( key, idx ) => {
  return <PivotItem headerText={ pivotTitles[idx] } ariaLabel={pivotTitles[idx]} title={pivotTitles[idx]} itemKey={ key } ></PivotItem>;
});

// const pivotHeading6 = 'Function';

export default class Layout1Page extends React.Component<ILayout1PageProps, ILayout1PageState> {

  private buildLay1Page( pivot: string, bucketClickKey: string, buckets: IFMBuckets, docs: any[] , sups: any[] ) {

      const key = pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ;
      const firstTitle = buckets[key][0];
      let titles = buckets[key].map( title => {
        let classNames = [ styles.leftFilter ];
        if ( title === bucketClickKey ) { classNames.push( styles.isSelected ) ; }
        return <li className={ classNames.join( ' ' ) } onClick = { this.clickBucketItem.bind( this, key, title ) }> { title } </li>;
      });

      let showDocs : any[] = [];
      let checkBucketKey = !bucketClickKey ? firstTitle : bucketClickKey;
      docs.map( item => {
        if ( Array.isArray( item [key] ) === true ) {
          item [key].map( value => {
            if ( consoleLineItemBuild === true ) console.log( 'key value - item', key, value, item ) ;
            if ( value.Title === checkBucketKey ) { showDocs.push( 
            <li onClick= { this.clickDocumentItem.bind( this, key, 'docs', item  )}> 
              { item.Title0 ? item.Title0 : item.Title } </li> ) ; }
          });
        } else { //This is not a multi-select key
            if ( item [key] && item [key].Title === checkBucketKey ) { showDocs.push(  
            <li onClick= { this.clickDocumentItem.bind( this, key, 'docs', item  )}>
              { item.Title0 ? item.Title0 : item.Title } </li>  ) ; }
        }
      });

      let showSups : any[] = [];
      sups.map( item => {
        if ( Array.isArray( item [key] ) === true ) {
          item [key].map( value => {
            if ( consoleLineItemBuild === true ) console.log( 'key value - item', key, value, item ) ;
            if ( value.Title === checkBucketKey ) { showSups.push( 
            <li  onClick= { this.clickDocumentItem.bind( this, key, 'sups', item  )}>
              { item.Title0 ? item.Title0 : item.Title } </li> ) ; }
          });
        } else { //This is not a multi-select key
            if ( item [key] && item [key].Title === checkBucketKey ) { showSups.push(  
            <li  onClick= { this.clickDocumentItem.bind( this, key, 'sups', item  )}>
              { item.FileLeafRef ? item.FileLeafRef : item.Title } </li>  ) ; }

        }
      });

      let page = <div className={ styles.layout1 } >
        <div className={ styles.titleList }> { titles } </div>
        <div className={ styles.docsList }> { showDocs } </div>
        <div className={ styles.docsList }> { showSups } </div>
      </div>;
      return page;


  }
public constructor(props:ILayout1PageProps){
  super(props);

  this.state = {
    bucketClickKey: '',
    docItemKey: '',
    supItemKey: '',
    showItemPanel: false,
    showPanelItem: null,
    refreshId: `${this.props.refreshId}`,
  };
}

public componentDidMount() {
  this.updateWebInfo( '', false );
}

public async updateWebInfo ( webUrl: string, listChangeOnly : boolean ) {

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
      this.setState({ refreshId: this.props.refreshId });
    }
  }

  public render(): React.ReactElement<ILayout1PageProps> {

    if ( this.props.mainPivotKey === '' || Layout1PageValues.indexOf( this.props.mainPivotKey ) < 0 ) {
      return ( null );

    } else {

      const layout1 = layout1Pivots.indexOf( this.props.mainPivotKey as any) > 0 ? this.props.mainPivotKey :null;
      const showPage = !layout1 ? null :
      <div> { this.buildLay1Page( layout1 , this.state.bucketClickKey, this.props.buckets, this.props.docs , this.props.sups ) } </div>; 
  
      if ( this.state.showPanelItem && this.state.showPanelItem.WikiField ) {
        // const replaceString = '<a onClick=\"console.log(\'Going to\',this.href);window.open(this.href,\'_blank\')\" style="pointer-events:none" href=';
        const replaceString = '<a onClick=\"window.open(this.href,\'_blank\')\" href=';
        this.state.showPanelItem.WikiField = this.state.showPanelItem.WikiField.replace(linkNoLeadingTarget,replaceString);
      }
      
      const docsPage = !this.state.showPanelItem || !this.state.showPanelItem.WikiField ? null : <div dangerouslySetInnerHTML={{ __html: this.state.showPanelItem.WikiField }} />;
      const panelContent = <div>
        <ReactJson src={ this.state.showPanelItem } name={ 'Summary' } collapsed={ false } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '20px 0px' }}/>
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
          { panelContent }
      </Panel></div>;
  
      return (
        <div className={ styles.alvFinMan }>
          <div className={ styles.container }>
            <div className={ styles.row }>
              {/* <div className={ styles.column }> */}
                { showPage }
                { userPanel }
              {/* </div> */}
            </div>
          </div>
        </div>
      );

    }

  }

  private clickBucketItem( pivot, leftMenu, ex ) {
    console.log('clickBucketItem:', pivot, leftMenu );
    this.setState({ bucketClickKey: leftMenu });
  }

  
  private async clickDocumentItem( pivot, supDoc, item, title ) {
    console.log('clickDocumentItem:', pivot, supDoc, item );
    if ( supDoc === 'docs' ) {
      await this.getDocWiki( item );
    } else {
      this.setState({ showItemPanel: true, showPanelItem: item });
    }

  }

   //Standards are really site pages, supporting docs are files
  private async getDocWiki( item: any, ) {

    let web = await Web( `${window.location.origin}${FinManSite}` );
    
    const columns = [ ...sitePagesColumns, ...LookupColumns, ...[ 'DocumentType/Title' ] ];

    let expColumns = getExpandColumns( columns );
    let selColumns = getSelectColumns( columns );
    
    const expandThese = expColumns.join(",");
    let selectThese = '*,WikiField' + selColumns.join(",");

    // Why an await does not work here is beyond me.  It should work :(
    // let fullItem = await web.lists.getByTitle( StandardsLib ).items.select(selectThese).expand(expandThese).getById( item.ID );
    web.lists.getByTitle( StandardsLib ).items.select(selectThese).expand(expandThese).getById( item.ID )().then( result => {
      console.log( 'ALVFinManDocs', result );
      this.setState({ showItemPanel: true, showPanelItem: result });
    }).catch( e => {
      console.log('Error getting item wiki');
    });

  }



  private _onClosePanel( ) {
    this.setState({ showItemPanel: false, showPanelItem: null });
  }

}
