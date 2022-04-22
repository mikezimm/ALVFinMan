import * as React from 'react';
import styles from './AlvFinMan.module.scss';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';
import { DisplayMode, Version } from '@microsoft/sp-core-library';

import { IAlvFinManProps, IAlvFinManState, IFMBuckets, ILayoutMPage, ILayoutSPage, ILayoutAll, ILayoutAPage, ILayoutQPage, IAnyContent } from './IAlvFinManProps';
import { ILayout1Page, ILayout1PageProps, Layout1PageValues } from './Layout1Page/ILayout1PageProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Web, ISite } from '@pnp/sp/presets/all';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { DefaultButton, PrimaryButton, CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
// import { ISearchQuery, SearchResults, ISearchResult } from "@pnp/sp/search";

import { Panel, IPanelProps, IPanelStyleProps, IPanelStyles, PanelType } from 'office-ui-fabric-react/lib/Panel';

import { Pivot, PivotItem, IPivotItemProps, PivotLinkFormat, PivotLinkSize,} from 'office-ui-fabric-react/lib/Pivot';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";
import { Spinner, SpinnerSize, } from 'office-ui-fabric-react/lib/Spinner';


// import WebpartBanner from "./HelpPanel/banner/onLocal/component";
import WebpartBanner from "./HelpPanel/banner/onLocal/component";
import { defaultBannerCommandStyles, } from "@mikezimm/npmfunctions/dist/HelpPanel/onNpm/defaults";
import { _LinkIsValid, _LinkStatus } from "@mikezimm/npmfunctions/dist/Links/AllLinks";
import { encodeDecodeString, } from "@mikezimm/npmfunctions/dist/Services/Strings/urlServices";

import { IMyBigDialogProps, buildConfirmDialogBig } from "@mikezimm/npmfunctions/dist/Elements/dialogBox";

//Added for Prop Panel Help
import stylesP from './PropPaneHelp/PropPanelHelp.module.scss';
import { WebPartHelpElement } from './PropPaneHelp/PropPaneHelp';


import * as strings from 'AlvFinManWebPartStrings';

import ReactJson from "react-json-view";


import { IPerformanceOp, ILoadPerformanceALVFM, IHistoryPerformance } from './Performance/IPerformance';
import { startPerformInit, startPerformOp, updatePerformanceEnd,  } from './Performance/functions';
import stylesPerform from './Performance/performance.module.scss';
import { createCacheTableSmall, createPerformanceTableSmall,  } from './Performance/tables';

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';

import AlvAccounts from './Accounts/Accounts';
import Layout1Page from './Layout1Page/Layout1Page';
import SearchPage from './Search/SearchPage';
import {  getAppLinks, getStandardDocs, accountColumns, getAccounts, AppLinkSearch, FinManSite, AppLinksList, appLinkColumns, StandardsLib, SupportingLib, sitePagesColumns, libraryColumns, LookupColumns, AccountsList, AccountSearch, updateSearchCounts, updateSearchTypes,  } from './DataFetch';
import {  createEmptyBuckets,  updateBuckets } from './DataProcess';

export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //

const consoleLineItemBuild: boolean = false;

// const AccountSearch = [ 'Title', 'Description', 'ALGroup', 'Name1' ];

// const thisSelect = ['*','ID','FileRef','FileLeafRef','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','CheckoutUserId','HasUniqueRoleAssignments','Title','FileSystemObjectType','FileSizeDisplay','FileLeafRef','LinkFilename','OData__UIVersion','OData__UIVersionString','DocIcon'];

// const sitePagesColumns: string[] = [ "ID", "Title0", "Author/Title", "File/ServerRelativeUrl", "FileRef", ]; //Do not exist on old SitePages library:   "Descritpion","BannerImageUrl.Url", "ServerRelativeUrl"
// const libraryColumns: string[] = [ 'ID','FileRef','FileLeafRef','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','CheckoutUserId','HasUniqueRoleAssignments','Title','FileSystemObjectType','FileSizeDisplay','FileLeafRef','LinkFilename','OData__UIVersion','OData__UIVersionString','DocIcon'];

// const appLinkColumns: string[] = [ 'ID','Title','Tab','SortOrder','LinkColumn','RichTextPanel','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','HasUniqueRoleAssignments','OData__UIVersion','OData__UIVersionString'];

// const FinManSite: string ="/sites/ALVFMTest/";
// const StandardsLib: string = "StandardDocuments";
// const SupportingLib: string = "SupportDocuments";
// const AppLinksList: string = "ALVFMAppLinks";
// const LookupColumns: string[] = ['Functions/Title', 'Topics/Title', 'ALGroup/Title', 'Sections/Title','Processes/Title' ];
// const AccountsList: string = "HFMAccounts";

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

const pivotHeading9 : ILayoutQPage = 'Search';

const allPivots: ILayoutAll[] = [ pivotHeading0, pivotHeading1, pivotHeading2, pivotHeading3, pivotHeading4, pivotHeading5, pivotHeading6, pivotHeading9 ];
const layout1Pivots : ILayout1Page[] = [ pivotHeading2, pivotHeading3, pivotHeading4, pivotHeading5,  ];

const pivotTitles = allPivots.map( pivot => { return pivot.split('|')[0] ; } );
const pivotKeys = allPivots.map( pivot => { return pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ; } );
const pivotItems = pivotKeys.map( ( key, idx ) => {
  return <PivotItem headerText={ pivotTitles[idx] } ariaLabel={pivotTitles[idx]} title={pivotTitles[idx]} itemKey={ key } ></PivotItem>;
});

// const pivotHeading6 = 'Function';

const FetchingSpinner = <Spinner size={SpinnerSize.large} label={"FetchingSpinner ..."} style={{ padding: 30 }} />;


export default class AlvFinMan extends React.Component<IAlvFinManProps, IAlvFinManState> {

  private reStyleButtons( ) {
    const buttonStyles = defaultBannerCommandStyles;
    buttonStyles.margin = '0px 10px';
    return buttonStyles;
  }

  private reStyleButtons2( background: string = null, color: string = null ) {
    let buttonStyles = JSON.parse(JSON.stringify( defaultBannerCommandStyles )) ;
    buttonStyles.margin = '0px 10px';

    if ( background ) { buttonStyles.background = background; }
    if ( color ) { buttonStyles.color = color; }

    return buttonStyles;
  }

  
  private newRefreshId() {

    let startTime = new Date();
    let refreshId = startTime.toISOString().replace('T', ' T'); // + ' ~ ' + startTime.toLocaleTimeString();
    return refreshId;

  }

  // private buildLay1Page( pivot: string, bucketClickKey: string, buckets: IFMBuckets, docs: any[] , sups: any[] ) {

  //     const key = pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ;
  //     const firstTitle = buckets[key][0];
  //     let titles = buckets[key].map( title => {
  //       let classNames = [ styles.leftFilter ];
  //       if ( title === bucketClickKey ) { classNames.push( styles.isSelected ) ; }
  //       return <li className={ classNames.join( ' ' ) } onClick = { this.clickBucketItem.bind( this, key, title ) }> { title } </li>;
  //     });

  //     let showDocs : any[] = [];
  //     let checkBucketKey = !bucketClickKey ? firstTitle : bucketClickKey;
  //     docs.map( item => {
  //       if ( Array.isArray( item [key] ) === true ) {
  //         item [key].map( value => {
  //           if ( consoleLineItemBuild === true ) console.log( 'key value - item', key, value, item ) ;
  //           if ( value.Title === checkBucketKey ) { showDocs.push( 
  //           <li onClick= { this.clickDocumentItem.bind( this, key, 'docs', item  )}> 
  //             { item.Title0 ? item.Title0 : item.Title } </li> ) ; }
  //         });
  //       } else { //This is not a multi-select key
  //           if ( item [key] && item [key].Title === checkBucketKey ) { showDocs.push(  
  //           <li onClick= { this.clickDocumentItem.bind( this, key, 'docs', item  )}>
  //             { item.Title0 ? item.Title0 : item.Title } </li>  ) ; }
  //       }
  //     });

  //     let showSups : any[] = [];
  //     sups.map( item => {
  //       if ( Array.isArray( item [key] ) === true ) {
  //         item [key].map( value => {
  //           if ( consoleLineItemBuild === true ) console.log( 'key value - item', key, value, item ) ;
  //           if ( value.Title === checkBucketKey ) { showSups.push( 
  //           <li  onClick= { this.clickDocumentItem.bind( this, key, 'sups', item  )}>
  //             { item.Title0 ? item.Title0 : item.Title } </li> ) ; }
  //         });
  //       } else { //This is not a multi-select key
  //           if ( item [key] && item [key].Title === checkBucketKey ) { showSups.push(  
  //           <li  onClick= { this.clickDocumentItem.bind( this, key, 'sups', item  )}>
  //             { item.FileLeafRef ? item.FileLeafRef : item.Title } </li>  ) ; }

  //       }
  //     });

  //     let page = <div className={ styles.layout1 } >
  //       <div className={ styles.titleList }> { titles } </div>
  //       <div className={ styles.docsList }> { showDocs } </div>
  //       <div className={ styles.docsList }> { showSups } </div>
  //     </div>;
  //     return page;

  // }


  /***
 *    d8b   db d88888b  .d8b.  d8888b.      d88888b  .d8b.  d8888b.      d88888b db      d88888b 
 *    888o  88 88'     d8' `8b 88  `8D      88'     d8' `8b 88  `8D      88'     88      88'     
 *    88V8o 88 88ooooo 88ooo88 88oobY'      88ooo   88ooo88 88oobY'      88ooooo 88      88ooooo 
 *    88 V8o88 88~~~~~ 88~~~88 88`8b        88~~~   88~~~88 88`8b        88~~~~~ 88      88~~~~~ 
 *    88  V888 88.     88   88 88 `88.      88      88   88 88 `88.      88.     88booo. 88.     
 *    VP   V8P Y88888P YP   YP 88   YD      YP      YP   YP 88   YD      Y88888P Y88888P Y88888P 
 *                                                                                               
 *                                                                                               
 */

   private nearBannerElements = this.buildNearBannerElements();
   private farBannerElements = this.buildFarBannerElements();
 
   private buildNearBannerElements() {
     //See banner/NearAndFarSample.js for how to build this.
     let elements = [];
     // defaultBannerCommandStyles.fontWeight = 'bolder';
     // elements.push(<div style={{ paddingRight: null }} className={ '' } title={ title}>
     //   <Icon iconName='WindDirection' onClick={ this.jumpToParentSite.bind(this) } style={ defaultBannerCommandStyles }></Icon>
     // </div>);
     return elements;
   }
 
   private buildFarBannerElements() {
     //See banner/NearAndFarSample.js for how to build this.
     // minimizeTiles= { this.minimizeTiles.bind(this) }
     // searchMe= { this.searchMe.bind(this) }
     // showAll= { this.showAll.bind(this) }
     let farElements: any[] = [];
 
     if ( this.props.bannerProps.showTricks === true ) {
       farElements.push( null );
     }
     return farElements;
   }
 
 /***
  *     .o88b.  .d88b.  d8b   db .d8888. d888888b d8888b. db    db  .o88b. d888888b  .d88b.  d8888b. 
  *    d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~' 88  `8D 88    88 d8P  Y8 `~~88~~' .8P  Y8. 88  `8D 
  *    8P      88    88 88V8o 88 `8bo.      88    88oobY' 88    88 8P         88    88    88 88oobY' 
  *    8b      88    88 88 V8o88   `Y8b.    88    88`8b   88    88 8b         88    88    88 88`8b   
  *    Y8b  d8 `8b  d8' 88  V888 db   8D    88    88 `88. 88b  d88 Y8b  d8    88    `8b  d8' 88 `88. 
  *     `Y88P'  `Y88P'  VP   V8P `8888Y'    YP    88   YD ~Y8888P'  `Y88P'    YP     `Y88P'  88   YD 
  *                                                                                                  
  *                                                                                                  
  */
 

  private currentPageUrl = this.props.bannerProps.pageContext.web.absoluteUrl + this.props.bannerProps.pageContext.site.serverRequestPath;

  public constructor(props:IAlvFinManProps){
    super(props);
    console.log('pivotTitles', pivotTitles );
    console.log('pivotKeys', pivotKeys );

    let urlVars : any = this.props.urlVars;
    let debugMode = urlVars.debug === 'true' ? true : false;
    let isWorkbench = this.currentPageUrl.indexOf('_workbench.aspx') > 0 ? true : false;

    let showDevHeader = debugMode === true || isWorkbench === true ? true : false;

    this.state = {
      showPropsHelp: false,
      showDevHeader: showDevHeader,  
      lastStateChange: '',

      mainPivotKey: this.props.defaultPivotKey ? this.props.defaultPivotKey : 'Main',
      fetchedDocs: false,
      fetchedAccounts: false,

      search: JSON.parse(JSON.stringify( this.props.search )),
      appLinks: [],
      docs: [],
      stds: [],
      sups: [],
      accounts: [],

      buckets: createEmptyBuckets(),
      standards: createEmptyBuckets(),
      supporting: createEmptyBuckets(),
      bucketClickKey: '',
      docItemKey: '',
      supItemKey: '',
      showItemPanel: false,
      showPanelItem: null,
      refreshId: '',

    };
  }


  public componentDidMount() {
    this.updateWebInfo( this.state.mainPivotKey, this.state.bucketClickKey );
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
    let refresh = false;

    if ( this.props.defaultPivotKey !== prevProps.defaultPivotKey ) {
      refresh = true;
    } else if ( this.props.description !== prevProps.description ) {
      refresh = true;
    }

    if ( refresh === true ) {
      this.updateWebInfo( this.state.mainPivotKey, this.state.bucketClickKey );
    }

  }

  public async updateWebInfo ( mainPivotKey: ILayoutAll, bucketClickKey: string ) {

    let search = JSON.parse(JSON.stringify( this.state.search ));
    let updateBucketsNow: boolean = false;
    let appLinks: IAnyContent[] = this.state.appLinks;
    let docs: IAnyContent[] = this.state.docs;
    let sups: IAnyContent[] = this.state.sups;
    // let accounts: IAnyContent[] = this.state.accounts;
    let accounts: any = {
      accounts: this.state.accounts
    };

    let fetchedDocs = this.state.fetchedDocs === true ? true : false;

    if ( appLinks.length === 0 ) {
      appLinks = await getAppLinks( FinManSite, AppLinksList, appLinkColumns, AppLinkSearch, this.props.search );
      search = updateSearchCounts( 'appLinks', appLinks, search );
      updateBucketsNow = true;
    }

    //Check if tab requires docs and sup and is not yet loaded
    let Layout1PageValuesAny: any = Layout1PageValues;
    if ( fetchedDocs !== true && ( Layout1PageValuesAny.indexOf( mainPivotKey ) > -1 || mainPivotKey === 'Search' ) ) {
      docs = await getStandardDocs( FinManSite, StandardsLib , [ ...sitePagesColumns, ...LookupColumns, ...[ 'DocumentType/Title' ] ], [ ...sitePagesColumns, ...LookupColumns, ...[ 'DocumentType/Title' ] ], this.props.search );
      search = updateSearchCounts( 'docs', docs, search );

      sups = await getStandardDocs( FinManSite, SupportingLib , [ ...libraryColumns, ...LookupColumns ], [ ...libraryColumns, ...LookupColumns ], this.props.search );
      search = updateSearchCounts( 'sups', sups, search );

      fetchedDocs = true;
      updateBucketsNow = true;

    }
    
    if ( ( mainPivotKey === 'Search' || mainPivotKey === 'Accounts' ) && this.state.accounts.length === 0 ) {
      accounts = await getAccounts ( FinManSite, AccountsList , [ ...accountColumns ] , [ ...AccountSearch, ], this.props.search );
      search = updateSearchCounts( 'accounts', accounts.accounts, search );

    }

    let buckets = this.state.buckets;
    if ( updateBucketsNow === true ) {
      buckets = updateBuckets( buckets, docs, false );
      buckets = updateBuckets( buckets, sups, true );
    }
    // debugger;
    search = updateSearchTypes( [ ...appLinks, ...docs, ...sups, ...accounts.accounts, ], search );

    console.log('state:  search', search );
    this.setState({ search: search, docs: docs, buckets: buckets, sups: sups, appLinks: appLinks, mainPivotKey: mainPivotKey, bucketClickKey: bucketClickKey, fetchedDocs: fetchedDocs, accounts: accounts.accounts, refreshId: this.newRefreshId() });

  }


  /***
 *    d8888b. db    db d8888b. db      d888888b  .o88b.      d8888b. d88888b d8b   db d8888b. d88888b d8888b. 
 *    88  `8D 88    88 88  `8D 88        `88'   d8P  Y8      88  `8D 88'     888o  88 88  `8D 88'     88  `8D 
 *    88oodD' 88    88 88oooY' 88         88    8P           88oobY' 88ooooo 88V8o 88 88   88 88ooooo 88oobY' 
 *    88~~~   88    88 88~~~b. 88         88    8b           88`8b   88~~~~~ 88 V8o88 88   88 88~~~~~ 88`8b   
 *    88      88b  d88 88   8D 88booo.   .88.   Y8b  d8      88 `88. 88.     88  V888 88  .8D 88.     88 `88. 
 *    88      ~Y8888P' Y8888P' Y88888P Y888888P  `Y88P'      88   YD Y88888P VP   V8P Y8888D' Y88888P 88   YD 
 *                                                                                                            
 *                                                                                                            
 */

  public render(): React.ReactElement<IAlvFinManProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      bannerProps,

    } = this.props;

    const {
      // fetchInfo,
      // toggleTag,
      // showPanel,
      // panelFileType,
      // panelSource,
    } = this.state;

    
    let propsHelp = <div className={ this.state.showPropsHelp !== true ? stylesP.bannerHide : stylesP.helpPropsShow  }>
        { WebPartHelpElement }
    </div>;

   // let farBannerElementsArray = [];
   let farBannerElementsArray = [...this.farBannerElements,
    // this.props.showCodeIcon !== true ? null : <div title={'Show Code Details'}><Icon iconName={ 'Code' } onClick={ this.toggleOriginal.bind(this) } style={ bannerProps.bannerCmdReactCSS }></Icon></div>,
  ];


  if ( this.props.displayMode === DisplayMode.Edit ) {
    farBannerElementsArray.push( 
      <Icon iconName='OpenEnrollment' onClick={ this.togglePropsHelp.bind(this) } style={ bannerProps.bannerCmdReactCSS }></Icon>
    );
  }

  /***
   *    d8888b.  .d8b.  d8b   db d8b   db d88888b d8888b. 
   *    88  `8D d8' `8b 888o  88 888o  88 88'     88  `8D 
   *    88oooY' 88ooo88 88V8o 88 88V8o 88 88ooooo 88oobY' 
   *    88~~~b. 88~~~88 88 V8o88 88 V8o88 88~~~~~ 88`8b   
   *    88   8D 88   88 88  V888 88  V888 88.     88 `88. 
   *    Y8888P' YP   YP VP   V8P VP   V8P Y88888P 88   YD 
   *                                                      
   *                                                      
   */



  let bannerSuffix = '';
  //Exclude the props.bannerProps.title if the webpart is narrow to make more responsive
  let bannerTitle = bannerProps.bannerWidth < 900 ? bannerProps.title : `${bannerProps.title} - ${bannerSuffix}`;
  
  if ( bannerTitle === '' ) { bannerTitle = 'ALV Financial Manual' ; }
  if ( this.props.displayMode === DisplayMode.Edit ) { bannerTitle += '' ; }



    let componentPivot = 
    <Pivot
        styles={ pivotStyles }
        linkFormat={PivotLinkFormat.links}
        linkSize={PivotLinkSize.normal}
        selectedKey={ this.state.mainPivotKey }
        // onLinkClick={this.pivotMainClick.bind(this)}
        onLinkClick={ this.pivotMainClick.bind(this) }
    > 
      { pivotItems }

    </Pivot>;

    const showPage = <Layout1Page
      refreshId={ this.state.refreshId }
      description={ this.props.description }
      appLinks={ this.state.appLinks }
      docs={ this.state.docs }
      stds={ this.state.stds }
      sups={ this.state.sups }
      buckets={ this.state.buckets }
      standards={ this.state.standards }
      supporting={ this.state.supporting }
      mainPivotKey={ this.state.mainPivotKey as ILayout1Page }
    ></Layout1Page>;

    const SearchContent = <SearchPage
      refreshId={ this.state.refreshId }
      search={ this.state.search }
      appLinks={ this.state.appLinks }
      accounts={ this.state.accounts }
      docs={ this.state.docs }
      stds={ this.state.stds }
      sups={ this.state.sups }
      buckets={ this.state.buckets }
      standards={ this.state.standards }
      supporting={ this.state.supporting }
      mainPivotKey={ this.state.mainPivotKey }
      cmdButtonCSS={bannerProps.bannerCmdReactCSS }
    ></SearchPage>;

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

    const accounts = this.state.mainPivotKey !== 'Accounts' ? null : <AlvAccounts
      refreshId={ this.state.refreshId }
      accountsList={ AccountsList }
      fetchTime={ 797979 }
      accounts={ this.state.accounts }
      webUrl = { FinManSite }
      searchProps = { AccountSearch }
    ></AlvAccounts>;


        

      /***
     *    d8888b.  .d8b.  d8b   db d8b   db d88888b d8888b.      d88888b db      d88888b .88b  d88. d88888b d8b   db d888888b 
     *    88  `8D d8' `8b 888o  88 888o  88 88'     88  `8D      88'     88      88'     88'YbdP`88 88'     888o  88 `~~88~~' 
     *    88oooY' 88ooo88 88V8o 88 88V8o 88 88ooooo 88oobY'      88ooooo 88      88ooooo 88  88  88 88ooooo 88V8o 88    88    
     *    88~~~b. 88~~~88 88 V8o88 88 V8o88 88~~~~~ 88`8b        88~~~~~ 88      88~~~~~ 88  88  88 88~~~~~ 88 V8o88    88    
     *    88   8D 88   88 88  V888 88  V888 88.     88 `88.      88.     88booo. 88.     88  88  88 88.     88  V888    88    
     *    Y8888P' YP   YP VP   V8P VP   V8P Y88888P 88   YD      Y88888P Y88888P Y88888P YP  YP  YP Y88888P VP   V8P    YP    
     *                                                                                                                        
     *                                                                                                                        
     */

      let Banner = <WebpartBanner 

      FPSUser={ bannerProps.FPSUser }
      exportProps={ bannerProps.exportProps }
      showBanner={ bannerProps.showBanner }
      // Adding this to adjust expected width for when prop pane could be opened
      bannerWidth={ ( bannerProps.bannerWidth ) }
      pageContext={ bannerProps.pageContext }
      pageLayout={ bannerProps.pageLayout }
      title ={ bannerTitle }
      panelTitle = { bannerProps.panelTitle }
      infoElement = { bannerProps.infoElement }
      bannerReactCSS={ bannerProps.bannerReactCSS }
      bannerCmdReactCSS={ bannerProps.bannerCmdReactCSS }
      showTricks={ bannerProps.showTricks }
      showGoToParent={ bannerProps.showGoToParent }
      showGoToHome={ bannerProps.showGoToHome }
      onHomePage={ bannerProps.onHomePage }

      webpartHistory={ this.props.webpartHistory }
      
      showBannerGear={ bannerProps.showBannerGear }
      
      showFullPanel={ bannerProps.showFullPanel }
      replacePanelHTML={ bannerProps.replacePanelHTML }
      replacePanelWarning={ bannerProps.replacePanelWarning }

      hoverEffect={ bannerProps.hoverEffect }
      gitHubRepo={ bannerProps.gitHubRepo }
      earyAccess={ bannerProps.earyAccess }
      wideToggle={ bannerProps.wideToggle }
      nearElements = { this.nearBannerElements }
      farElements = { farBannerElementsArray }

      showRepoLinks={ bannerProps.showRepoLinks }
      showExport={ bannerProps.showExport }
      //2022-02-17:  Added these for expandoramic mode
      domElement = { bannerProps.domElement }
      enableExpandoramic = { bannerProps.enableExpandoramic }
      expandoDefault = { bannerProps.expandoDefault }
      expandoStyle = { bannerProps.expandoStyle}
      expandAlert = { bannerProps.expandAlert }
      expandConsole = { bannerProps.expandConsole }
      expandoPadding = { bannerProps.expandoPadding }
      beAUser = { bannerProps.beAUser }
      showBeAUserIcon = { bannerProps.showBeAUserIcon }
        beAUserFunction={ bannerProps.beAUserFunction }

    ></WebpartBanner>;

    let devHeader = this.state.showDevHeader === true ? <div><b>Props: </b> { 'this.props.lastPropChange' + ', ' + 'this.props.lastPropDetailChange' } - <b>State: lastStateChange: </b> { this.state.lastStateChange  } </div> : null ;
    
    return (
      <div className={ styles.alvFinMan }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            {/* <div className={ styles.column }> */}
            { devHeader }
            { Banner }
            { propsHelp }
            { componentPivot }
            { showPage }
            { userPanel }
            { accounts }
            { SearchContent }
            {/* </div> */}
          </div>
        </div>
      </div>
    );
  }

  private pivotMainClick( temp ) {
    console.log('pivotMainClick:', temp.props.itemKey );

    this.updateWebInfo( temp.props.itemKey, '' );
    // this.setState({ 
    //   mainPivotKey: temp.props.itemKey, 
    //   bucketClickKey: '', //Clear bucketItemClick for new page
    // });
  }

  // private clickBucketItem( pivot, leftMenu, ex ) {
  //   console.log('clickBucketItem:', pivot, leftMenu );
  //   this.updateWebInfo( this.state.mainPivotKey, leftMenu );
  //   // this.setState({ bucketClickKey: leftMenu });
  // }

  
  // private async clickDocumentItem( pivot, supDoc, item, title ) {
  //   console.log('clickDocumentItem:', pivot, supDoc, item );
  //   if ( supDoc === 'docs' ) {
  //     await this.getDocWiki( item );
  //   } else {
  //     this.setState({ showItemPanel: true, showPanelItem: item });
  //   }

  // }



   //Standards are really site pages, supporting docs are files
  // private async getDocWiki( item: any, ) {

  //   let web = await Web( `${window.location.origin}${FinManSite}` );
    
  //   const columns = [ ...sitePagesColumns, ...LookupColumns, ...[ 'DocumentType/Title' ] ];

  //   let expColumns = getExpandColumns( columns );
  //   let selColumns = getSelectColumns( columns );
    
  //   const expandThese = expColumns.join(",");
  //   let selectThese = '*,WikiField' + selColumns.join(",");

  //   // Why an await does not work here is beyond me.  It should work :(
  //   // let fullItem = await web.lists.getByTitle( StandardsLib ).items.select(selectThese).expand(expandThese).getById( item.ID );
  //   web.lists.getByTitle( StandardsLib ).items.select(selectThese).expand(expandThese).getById( item.ID )().then( result => {
  //     console.log( 'ALVFinManDocs', result );
  //     result.meta = item.meta;
  //     result.searchText = item.searchText;
  //     result.searchTextLC = item.searchTextLC;


  //     this.setState({ showItemPanel: true, showPanelItem: result });
  //   }).catch( e => {
  //     console.log('Error getting item wiki');
  //   });
  // }

  private _onClosePanel( ) {
    this.setState({ showItemPanel: false, showPanelItem: null });
  }

  private togglePropsHelp(){
    let newState = this.state.showPropsHelp === true ? false : true;
    this.setState( { showPropsHelp: newState });
}


  // private linkClick( this ) {
  //   console.log('linkClick', this);
  //   console.log('linkClick href', this, this.href);
  // }


}
