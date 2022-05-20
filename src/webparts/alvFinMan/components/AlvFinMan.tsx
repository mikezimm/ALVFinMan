import * as React from 'react';
import styles from './AlvFinMan.module.scss';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';
import { DisplayMode, Version } from '@microsoft/sp-core-library';

import { IAlvFinManProps, IAlvFinManState, IFMBuckets, ILayoutNPage, ILayoutGPage, ILayoutSPage, ILayoutAll, ILayoutAPage, ILayoutQPage, ILayoutHPage, IAnyContent, IFinManSearch, IAppFormat, ISearchBucket, IPagesContent, ILayoutLPage } from './IAlvFinManProps';
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


import WebpartBanner from "@mikezimm/npmfunctions/dist/HelpPanelOnNPM/banner/onLocal/component";
import { getWebPartHelpElement } from './PropPaneHelp/PropPaneHelp';
import { getBannerPages, IBannerPages } from './HelpPanel/AllContent';


import { defaultBannerCommandStyles, } from "@mikezimm/npmfunctions/dist/HelpPanelOnNPM/onNpm/defaults";
import { _LinkIsValid, _LinkStatus } from "@mikezimm/npmfunctions/dist/Links/AllLinks";
import { encodeDecodeString, } from "@mikezimm/npmfunctions/dist/Services/Strings/urlServices";

import { IMyBigDialogProps, buildConfirmDialogBig } from "@mikezimm/npmfunctions/dist/Elements/dialogBox";

//Added for Prop Panel Help
import stylesP from './PropPaneHelp/PropPanelHelp.module.scss';

import * as strings from 'AlvFinManWebPartStrings';

import ReactJson from "react-json-view";


import { IPerformanceOp, ILoadPerformanceALVFM, IHistoryPerformance } from './Performance/IPerformance';
import { startPerformInit, startPerformOp, updatePerformanceEnd,  } from './Performance/functions';
import stylesPerform from './Performance/performance.module.scss';
import { createCacheTableSmall, createPerformanceTableSmall,  } from './Performance/tables';

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';

import AlvAccounts from './Accounts/Accounts';
import Layout1Page from './Layout1Page/Layout1Page';
import Layout2Page from './Layout2Page/Layout2Page';
import SearchPage from './Search/SearchPage';
import NewsPage from './News/NewsPage';

import { MainHelpPage } from './AlvFMHelp';

import { SourceInfo, ISourceInfo, ISourceProps } from './DataInterface';
import {  updateSearchCounts, updateSearchTypes, getALVFinManContent, } from './DataFetch';


import {  createEmptyBuckets,  updateBuckets } from './DataProcess';
import { gitRepoALVFinManSmall } from '@mikezimm/npmfunctions/dist/Links/LinksRepos';

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

  
const pivotHeadingA : ILayoutNPage = 'News';
const pivotHeading0 : ILayoutGPage = 'General';

const pivotHeading1 : ILayoutSPage = 'Statements';
// const pivotHeading2 : ILayout1Page = 'Reporting|Sections';
const pivotHeading2 : ILayout1Page = 'Reporting';
const pivotHeading3 : ILayout1Page = 'Processes';
const pivotHeading4 : ILayout1Page = 'Functions';
const pivotHeading5 : ILayout1Page = 'Topics';
const pivotHeading6 : ILayoutAPage = 'Accounts';

const pivotHeading9 : ILayoutQPage = 'Search';
const pivotHeadingZ : ILayoutHPage = 'Help';
const pivotHeadingY : ILayoutLPage = 'Links';


export const allPivots: ILayoutAll[] = [ pivotHeading0, pivotHeadingA, pivotHeading1, pivotHeading2, pivotHeading3, pivotHeading4, pivotHeading5, pivotHeading6, pivotHeading9, pivotHeadingY, pivotHeadingZ ];
const layout1Pivots : ILayout1Page[] = [ pivotHeading2, pivotHeading3, pivotHeading4, pivotHeading5,  ];

const pivotTitles = allPivots.map( pivot => { return pivot.split('|')[0] ; } );
// const pivotKeys = allPivots.map( pivot => { return pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ; } );
const pivotKeys = allPivots.map( pivot => { return pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ; } );
const pivotItems = pivotKeys.map( ( key, idx ) => {
  return <PivotItem headerText={ pivotTitles[idx] } ariaLabel={pivotTitles[idx]} title={pivotTitles[idx]} itemKey={ key } ></PivotItem>;
});

// const pivotHeading6 = 'Function';

const FetchingSpinner = <Spinner size={SpinnerSize.large} label={"FetchingSpinner ..."} style={{ padding: 30 }} />;


export default class AlvFinMan extends React.Component<IAlvFinManProps, IAlvFinManState> {

  private newRefreshId() {

    let startTime = new Date();
    let refreshId = startTime.toISOString().replace('T', ' T'); // + ' ~ ' + startTime.toLocaleTimeString();
    return refreshId;

  }

  private WebPartHelpElement = getWebPartHelpElement( this.props.sitePresets );
  private contentPages : IBannerPages = getBannerPages( this.props.bannerProps );

  private mainHelp = MainHelpPage( gitRepoALVFinManSmall );


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

      mainPivotKey: this.props.defaultPivotKey ? this.props.defaultPivotKey : 'General',
      fetchedDocs: false,
      fetchedAccounts: false,
      fetchedNews: false,
      fetchedHelp: false,

      search: JSON.parse(JSON.stringify( this.props.search )),
      appLinks: [],
      docs: [],
      stds: [],
      sups: [],
      accounts: [],

      news: [],
      help: [],

      buckets: createEmptyBuckets(),
      standards: createEmptyBuckets(),
      supporting: createEmptyBuckets(),
      docItemKey: '',
      supItemKey: '',
      showItemPanel: false,
      showPanelItem: null,
      refreshId: '',

    };
  }


  public componentDidMount() {
    this.props.saveLoadAnalytics( 'ALV Fin Man', 'didMount');
    this.updateWebInfo( this.state.mainPivotKey );
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
      this.updateWebInfo( this.state.mainPivotKey );
    }

  }

  public async updateWebInfo ( mainPivotKey: ILayoutAll ) {

    let search = JSON.parse(JSON.stringify( this.state.search ));
    let updateBucketsNow: boolean = false;
    let appLinks: IAnyContent[] = this.state.appLinks;
    let docs: IAnyContent[] = this.state.docs;
    let sups: IAnyContent[] = this.state.sups;
    let news: IPagesContent[] = this.state.news;
    let help: IPagesContent[] = this.state.help;
    // let accounts: IAnyContent[] = this.state.accounts;
    let accounts: any = this.state.accounts;

    let fetchedDocs = this.state.fetchedDocs === true ? true : false;
    let fetchedNews = this.state.fetchedNews === true ? true : false;
    let fetchedHelp = this.state.fetchedHelp === true ? true : false;

    if ( appLinks.length === 0 ) {
      appLinks = await getALVFinManContent( SourceInfo.appLinks, this.props.search );
      search = updateSearchCounts( 'appLinks', appLinks, search );
      updateBucketsNow = true;
    }

    //Check if tab requires docs and sup and is not yet loaded
    let Layout1PageValuesAny: any = Layout1PageValues;

    if ( fetchedDocs !== true && ( Layout1PageValuesAny.indexOf( mainPivotKey ) > -1 || mainPivotKey === 'Search' ) ) {
      docs = await getALVFinManContent( SourceInfo.docs, this.props.search );
      search = updateSearchCounts( 'docs', docs, search );

      sups = await getALVFinManContent( SourceInfo.sups, this.props.search );
      search = updateSearchCounts( 'sups', sups, search );

      fetchedDocs = true;
      updateBucketsNow = true;

    }

   
    if ( fetchedNews !== true && ( mainPivotKey === 'News' || mainPivotKey === 'Search' ) ) {
      news = await getALVFinManContent( SourceInfo.news, this.props.search );
      search = updateSearchCounts( 'sups', sups, search );

      fetchedNews = true;

    }

    if ( ( mainPivotKey === 'Search' || mainPivotKey === 'Accounts' ) && this.state.accounts.length === 0 ) {
      accounts = await getALVFinManContent ( SourceInfo.accounts, this.props.search );
      search = updateSearchCounts( 'accounts', accounts, search );

    }

    let buckets = this.state.buckets;
    if ( updateBucketsNow === true ) {
      buckets = updateBuckets( buckets, docs, false );
      buckets = updateBuckets( buckets, sups, true );
    }
    // debugger;
    search = updateSearchTypes( [ ...appLinks, ...docs, ...sups, ...accounts, ], search );

    console.log('state:  search', search );
    this.setState({ search: search, docs: docs, buckets: buckets, sups: sups, appLinks: appLinks, mainPivotKey: mainPivotKey, fetchedDocs: fetchedDocs, accounts: accounts, news: news, help: help, refreshId: this.newRefreshId() });

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
      bannerProps,
    } = this.props;

    const {
    } = this.state;

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
  let bannerTitle = bannerProps.bannerWidth < 900 ? bannerProps.title : `${bannerProps.title} ${ ( bannerSuffix ? ' - ' + bannerSuffix : '' ) }`;
  
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
      source={ SourceInfo }
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

    const showPage2 = <Layout2Page 
      mainPivotKey={this.state.mainPivotKey}

      refreshId={ this.state.refreshId }
      source={ SourceInfo.appLinks }
      appLinks={ this.state.appLinks }
    ></Layout2Page>;

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

    const accounts = this.state.mainPivotKey !== 'Accounts' ? null : <AlvAccounts
      source={ SourceInfo }
      primarySource={ SourceInfo.accounts }
      refreshId={ this.state.refreshId }
      fetchTime={ 797979 }
      accounts={ this.state.accounts }
    ></AlvAccounts>;

    const defNewsSort ={
      prop: '',
      order: 'asc',
    };

    const news = <NewsPage

      mainPivotKey={this.state.mainPivotKey}
      sort = { defNewsSort }

      refreshId={ this.state.refreshId }
      source={ SourceInfo.news }
      news={ this.state.news }

    ></NewsPage>;

    const help = this.state.mainPivotKey === 'Help' ? this.mainHelp : null;
        

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

      displayMode={ this.props.bannerProps.displayMode }
      WebPartHelpElement={ this.WebPartHelpElement }
      forceNarrowStyles= { false }
      contentPages= { this.contentPages }
      feedbackEmail= { this.props.bannerProps.feedbackEmail }

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
            { componentPivot }
            { showPage }
            { showPage2 }
            { accounts }
            { news }
            { SearchContent }
            { help }
            {/* </div> */}
          </div>
        </div>
      </div>
    );
  }

  private pivotMainClick( temp ) {
    console.log('pivotMainClick:', temp.props.itemKey );

    this.updateWebInfo( temp.props.itemKey );
  }

  private togglePropsHelp(){
    let newState = this.state.showPropsHelp === true ? false : true;
    this.setState( { showPropsHelp: newState });
}


}
