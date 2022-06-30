import * as React from 'react';
import styles from './AlvFinMan.module.scss';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';
import { DisplayMode, Version } from '@microsoft/sp-core-library';

import { IAlvFinManProps, IAlvFinManState, IFMBuckets, ILayoutNPage, ILayoutGPage, ILayoutSPage, ILayoutAPage,
  ILayoutQPage, ILayoutHPage, IAnyContent, IFinManSearch, IAppFormat, ISearchBucket,
  IPagesContent, ILayoutLPage, ILayoutEPage, ILayoutSourcesPage, ISourcePage, ICategoryPage, ILayoutCategorizedPage, ILayoutStdPage, ILayoutSupPage, IDeepLink, IMainPage, IDefaultPage, IDefMainPage, mainDefPivots, pivotHeadingCatgorized, pivotHeadingSources, IEntityContent, IAllContentType, IAcronymContent, IDeepLogic, IFormContent } from './IAlvFinManProps';

import { ILayout1Page, ILayout1PageProps, Layout1PageValues } from './Layout1Page/ILayout1PageProps';
import { ILayout2Page,  } from './Layout2Page/ILayout2Props';
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
import { ISpinnerStyles, Spinner, SpinnerSize, } from 'office-ui-fabric-react/lib/Spinner';


import WebpartBanner from "@mikezimm/npmfunctions/dist/HelpPanelOnNPM/banner/onLocal/component";
import { getWebPartHelpElement } from './PropPaneHelp/PropPaneHelp';
import { getBannerPages, IBannerPages } from './HelpPanel/AllContent';


import { defaultBannerCommandStyles, } from "@mikezimm/npmfunctions/dist/HelpPanelOnNPM/onNpm/defaults";
import { _LinkIsValid, _LinkStatus } from "@mikezimm/npmfunctions/dist/Links/AllLinks";
import { encodeDecodeString, } from "@mikezimm/npmfunctions/dist/Services/Strings/urlServices";

import { IMyBigDialogProps, buildConfirmDialogBig } from "@mikezimm/npmfunctions/dist/Elements/dialogBox";

//Added for Prop Panel Help

import * as strings from 'AlvFinManWebPartStrings';

import ReactJson from "react-json-view";


import { IPerformanceOp, ILoadPerformanceALVFM, IHistoryPerformance } from './Performance/IPerformance';
import { startPerformInit, startPerformOp, updatePerformanceEnd,  } from './Performance/functions';
import stylesPerform from './Performance/performance.module.scss';
import { createCacheTableSmall, createPerformanceTableSmall,  } from './Performance/tables';

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';

import Layout1Page from './Layout1Page/Layout1Page';
import Layout2Page from './Layout2Page/Layout2Page';
import SearchPage from './Search/SearchPage';
import ModernPages from './ModernPages/ModernPages';

import SourcePages from './SourcePages/SourcePages';

import { SourceInfo, ISourceInfo, ISourceProps } from './DataInterface';
import {  updateSearchCounts, updateSearchTypes, getALVFinManContent, } from './DataFetch';


import {  createEmptyBuckets,  updateBuckets } from './DataProcess';
import { gitRepoALVFinManSmall } from '@mikezimm/npmfunctions/dist/Links/LinksRepos';

import { allMainPivots, sourcePivots, categorizedPivots } from './IAlvFinManProps';


const mainPivotStyles = {
  root: {
    whiteSpace: "normal",
    marginTop: '30px',
    color: 'white',
  //   textAlign: "center"
  }};

  const secondaryPivotStyles = {
    root: {
      whiteSpace: "normal",
      marginTop: '5px',
      color: 'white',
    //   textAlign: "center"
    }};


//Original mainPivots before Sources and Categories

//

const mainTitles = allMainPivots.map( pivot => { return pivot.split('|')[0] ; } );
// const mainKeys = mainPivots.map( pivot => { return pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ; } );
const mainKeys = allMainPivots.map( pivot => { return pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ; } );
const mainItems = mainKeys.map( ( key, idx ) => {
  return <PivotItem headerText={ mainTitles[idx] } ariaLabel={mainTitles[idx]} title={mainTitles[idx]} itemKey={ key } ></PivotItem>;
});


const sourceKeys = sourcePivots.map( pivot => { return pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ; } );
const sourceItems = sourceKeys.map( ( key, idx ) => {
  return <PivotItem headerText={ sourcePivots[idx] } ariaLabel={sourcePivots[idx]} title={sourcePivots[idx]} itemKey={ key } ></PivotItem>;
});

const categorizedKeys = categorizedPivots.map( pivot => { return pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ; } );
const categorizedItems = categorizedKeys.map( ( key, idx ) => {
  return <PivotItem headerText={ categorizedPivots[idx] } ariaLabel={categorizedPivots[idx]} title={categorizedPivots[idx]} itemKey={ key } ></PivotItem>;
});

export interface IDeepStateChange {
  deepLinks: IDeepLink[];
  hasChanged: boolean;
}

export default class AlvFinMan extends React.Component<IAlvFinManProps, IAlvFinManState> {

  private newRefreshId() {

    let startTime = new Date();
    let refreshId = startTime.toISOString().replace('T', ' T'); // + ' ~ ' + startTime.toLocaleTimeString();
    return refreshId;

  }

  private WebPartHelpElement = getWebPartHelpElement( this.props.sitePresets );
  private contentPages : IBannerPages = getBannerPages( this.props.bannerProps );


  private getMainPivotKey( defaultPivotKey: IDefaultPage ) {

    let mainPivotKey: IMainPage = null;

    //Covers Category pages
    if ( categorizedPivots.indexOf( defaultPivotKey as any ) > -1 ) {
      mainPivotKey = pivotHeadingCatgorized;

    //Covers Sources that are also Main Pivots
    } else if ( mainDefPivots.indexOf( defaultPivotKey as any ) > -1 ) {
      mainPivotKey = defaultPivotKey as any;

    } else if ( sourcePivots.indexOf( defaultPivotKey as any ) > -1 ) {
      mainPivotKey = pivotHeadingSources;

    } else {
      alert('No Idea what mainPivotKey is for' + defaultPivotKey );
      mainPivotKey = 'Categorized';

    }

    return mainPivotKey;

  }

  /**
   * bumpDeepState will add this new deepState to the this.state.deepState object and return it.
   * NOTE:  It does not actually update the component state.  That should be done after.
   * @param main 
   * @param second 
   * @param deeps 
   * @returns 
   */
  private bumpDeepState( main: IMainPage | 'copyLast', second: ISourcePage | ICategoryPage | 'copyLast', deeps: string[], logic: IDeepLogic, deepLinks: IDeepLink[], count: number ) : IDeepStateChange {
    
    const historyPause = 2000;

    if ( main === 'History' ) { return { deepLinks: deepLinks, hasChanged: false } ; }

    const newmain = deepLinks[0] && main === 'copyLast' ? deepLinks[0].main : main;
    const newsecond = deepLinks[0] && second === 'copyLast' ? deepLinks[0].second : second;

    let newDeepState : IDeepLink[] = deepLinks.map( deep => {  return deep; } );
    let thisTime = new Date();
    let searchTextLC: string = `${newmain} || ${newsecond} `;
    searchTextLC += deeps.map( deep => { return `|| ${deep}` ; }).join('');

    const newDeep: IDeepLink = {
      main: main === 'copyLast' ? deepLinks[0].main : main,
      second: second === 'copyLast' ? deepLinks[0].second : second,
      deep1: deeps[0],
      deep2: deeps[1],
      deep3: deeps[2],
      deep4: deeps[3],
      count: count,
      time: thisTime,
      timeMs: thisTime.getTime(),
      timeLabel: thisTime.toLocaleString(),
      deltaMs: newDeepState.length === 0 ? 0 : thisTime.getTime() - newDeepState[0].timeMs,
      processTime: 0,
      searchTextLC: searchTextLC.toLowerCase(),
      logic: logic,
      searchTypeIdx: -1,

    };

    let hasChanged: any = false;
    if ( !deepLinks ) {
      alert('deepLinks should exist here :)');
      hasChanged = false;

    } else if ( deepLinks.length === 0 ) {
      newDeepState = [ newDeep ];
      hasChanged = true;

    } else { //There is a previous deep state item to compare to

      const prevDeep = deepLinks[0];

      let updateLast: any = false;

      if ( prevDeep.main !== newDeep.main || prevDeep.second !== newDeep.second ) {
        hasChanged = true;

      } else {//main and second are both equal, check for deeper updates
        [ 1,2,3,4 ].map( idx => {
          if ( prevDeep[ 'deep' + idx ] !== newDeep[ 'deep' + idx ] ) { 
            hasChanged = true ;

            if ( logic === 'Sources' || logic === 'Accounts' ) {
              if ( newDeep.timeMs < ( prevDeep.timeMs + historyPause ) ) {
                //Just update last deepLink because it is likely just clicking around or typing in search
                updateLast = true ;
  
              }
            }
          }
        });
        if ( prevDeep.count !== newDeep.count ) { 
          hasChanged = true ;
        }
      }

      if ( updateLast === true ) {
        //This will add the new delta to the previous one
        newDeep.deltaMs = newDeepState[0].deltaMs + newDeep.deltaMs; 
        newDeepState[0] = newDeep;

      } else if ( hasChanged === true ) {
        //Add this deep link to current history
        newDeepState.unshift( newDeep );

        //Remove the last item if the total length > than the max length
        if ( newDeepState.length > this.props.maxDeep ) { newDeepState.pop(); }
      }
    }


    this.updatePathNameDeepLink( main, second, deeps );

    return { deepLinks: newDeepState, hasChanged: hasChanged };

  }


  private bumpDeepStateByDefaultPivotKey( defaultPivotKey: IDefaultPage ) {
    let mainPivotKey = this.getMainPivotKey( defaultPivotKey );
    let secondKey = mainDefPivots.indexOf( mainPivotKey as any ) > -1 ? '' : defaultPivotKey;

    //Watchout for this one where I had to set secondKey as any...
    let deepChange : IDeepStateChange = this.bumpDeepState( mainPivotKey, secondKey as any, [], '',  this.state ? this.state.deepLinks : [], null );

    return deepChange;

  }

  private updatePathNameDeepLink( primary: string, secondary: string, remaining: string[] ) {

    if ( primary === 'copyLast' ) { primary = this.state.mainPivotKey; }
    if ( secondary === 'copyLast' ) { secondary = this.state.deepestPivot; }

    let newParameters = `?primary=${primary}`;
    newParameters = !secondary ? newParameters : `${newParameters}&secondary=${secondary}`;
    let theRest = remaining.length === 0 ? '' : remaining.map( (link, idx) => { return `&deep${idx}=${link}`; }).join('');
    newParameters += theRest;
    const nextURL = window.location.pathname + newParameters;
    const nextTitle = 'ALV Finance Manual';
    const nextState = { additionalInformation: 'Update the Url with app deep link' };

    // This will replace the current entry in the browser's history, without reloading
    window.history.replaceState(nextState, nextTitle, nextURL);

  }

  private bumpDeepStateFromComponent( primary: string, secondary: string, remaining: string[], count: number ) {

    let deepChange: IDeepStateChange = this.bumpDeepState( primary as any, secondary  as any, remaining, 'Sources',  this.state.deepLinks, count );

    if ( deepChange.hasChanged === true ) {
      this.setState( { deepLinks: deepChange.deepLinks });
    }

  }

  //updateWebInfo ( mainPivotKey: IMainPage, sourcePivotKey: ISourcePage, categorizedPivotKey: ICategoryPage, deepProps: string[] = [] ) 
  private jumpToDeepLink( mainPivotKey: IMainPage, sourcePivotKey: ISourcePage, categorizedPivotKey: ICategoryPage, deepProps: string[] = [] ) {
    this.updateWebInfo ( mainPivotKey, sourcePivotKey, categorizedPivotKey, deepProps );
  }

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

  private makeDebugCmdStyles( withLeftMargin: boolean ) {
    let propsCmdCSS: React.CSSProperties = JSON.parse(JSON.stringify( this.props.bannerProps.bannerCmdReactCSS ));
    propsCmdCSS.backgroundColor = 'transparent';
    propsCmdCSS.marginRight = '30px';
    propsCmdCSS.fontSize = '24px'; //Make sure icon is always visible

    return propsCmdCSS;
  }

  private debugCmdStyles: React.CSSProperties = this.makeDebugCmdStyles( true );

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
    console.log('mainTitles', mainTitles );
    console.log('mainKeys', mainKeys );

    let urlVars : any = this.props.urlVars;
    let debugMode = urlVars.debug === 'true' ? true : false;
    let isWorkbench = this.currentPageUrl.indexOf('_workbench.aspx') > 0 ? true : false;

    let showDevHeader = debugMode === true || isWorkbench === true ? true : false;

    let mainPivotKey: IMainPage = this.getMainPivotKey( this.props.defaultPivotKey ); // IMainPage = this.props.defaultPivotKey ? this.props.defaultPivotKey : 'General';

    this.state = {
      showPropsHelp: false,
      showDevHeader: showDevHeader,  
      lastStateChange: '',

      mainPivotKey: mainPivotKey,
      sourcePivotKey: sourcePivots.indexOf( this.props.defaultPivotKey as any ) > -1 ? this.props.defaultPivotKey as any : '',
      categorizedPivotKey: categorizedPivots.indexOf( this.props.defaultPivotKey as any ) > -1 ? this.props.defaultPivotKey as any : '',
      deepestPivot: this.props.defaultPivotKey,

      deepLinks: this.bumpDeepStateByDefaultPivotKey( this.props.defaultPivotKey ).deepLinks,
      deepProps: [],
      fetchedStds: false,
      fetchedSups: false,
      fetchedAccounts: false,
      fetchedNews: false,
      fetchedHelp: false,
      fetchedAcronyms: false,
      fetchedEntities: false,
      fetchedForms: false,

      search: JSON.parse(JSON.stringify( this.props.search )),
      appLinks: [],
      entities: [],
      acronyms: [],
      manual: [],
      // stds: [],
      sups: [],
      accounts: [],

      news: [],
      help: [],
      forms: [],

      buckets: createEmptyBuckets(),
      standards: createEmptyBuckets(),
      supporting: createEmptyBuckets(),

      docItemKey: '',
      supItemKey: '',
      showItemPanel: false,
      showPanelItem: null,
      refreshId: '',

      debugMode: this.props.debugMode,
      showSpinner: true,
    };
  }


  public componentDidMount() {
    this.props.saveLoadAnalytics( 'ALV Fin Man', 'didMount');
    this.updateWebInfo( this.state.mainPivotKey, this.state.sourcePivotKey, this.state.categorizedPivotKey );
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
      this.updateWebInfo( this.state.mainPivotKey, this.state.sourcePivotKey, this.state.categorizedPivotKey );
    }

  }

  public async updateWebInfo ( mainPivotKey: IMainPage, sourcePivotKey: ISourcePage, categorizedPivotKey: ICategoryPage, deepProps: string[] = [] ) {

    let deepestKey: IMainPage | ISourcePage | ICategoryPage | any = mainPivotKey;
    if ( mainPivotKey === 'Sources' ) { deepestKey = sourcePivotKey ; }
    if ( mainPivotKey === 'Categorized' ) { deepestKey = categorizedPivotKey ; }

    let count = 0;
    let search = JSON.parse(JSON.stringify( this.state.search ));
    let updateBucketsNow: boolean = false;
    let appLinks: IAnyContent[] = this.state.appLinks;
    let manual: IAnyContent[] = this.state.manual;
    let acronyms: IAcronymContent[] = this.state.acronyms;
    let entities: IEntityContent[] = this.state.entities;
    let sups: IAnyContent[] = this.state.sups;
    let news: IPagesContent[] = this.state.news;
    let help: IPagesContent[] = this.state.help;
    let forms: IFormContent[] = this.state.forms;
    // let accounts: IAnyContent[] = this.state.accounts;
    let accounts: any = this.state.accounts;

    let fetchedStds = this.state.fetchedStds === true ? true : false;
    let fetchedSups = this.state.fetchedSups === true ? true : false;
    let fetchedNews = this.state.fetchedNews === true ? true : false;
    let fetchedHelp = this.state.fetchedHelp === true ? true : false;
    let fetchedForms = this.state.fetchedForms === true ? true : false;
    let fetchedEntities = this.state.fetchedEntities === true ? true : false;
    let fetchedAcronyms = this.state.fetchedAcronyms === true ? true : false;

    if ( appLinks.length === 0 ) {
      appLinks = await getALVFinManContent( SourceInfo.appLinks, this.props.search );
      search = updateSearchCounts( 'appLinks', appLinks, search );
      updateBucketsNow = true;
    }

    if ( deepestKey === 'Acronyms' ) { count = this.state.acronyms.length ; } //Presets count in case it is already loaded
    if ( fetchedAcronyms !== true && ( deepestKey === 'Acronyms' || deepestKey === 'Search' ) && this.state.acronyms.length === 0 ) {
      acronyms = await getALVFinManContent( SourceInfo.acronyms, this.props.search );
      search = updateSearchCounts( 'acronyms', acronyms as IAllContentType[], search );
      fetchedAcronyms = true;
      updateBucketsNow = true;
      count = acronyms.length;
    }

    if ( deepestKey === 'Entities' ) { count = this.state.entities.length ; } //Presets count in case it is already loaded
    if ( fetchedEntities !== true && ( deepestKey === 'Entities' || deepestKey === 'Search' && this.state.entities.length === 0 )  ) {
      entities = await getALVFinManContent( SourceInfo.entities, this.props.search );
      search = updateSearchCounts( 'entities', entities as IAllContentType[], search );
      fetchedEntities = true;
      updateBucketsNow = true;
      count = entities.length;
    }

    //Check if tab requires docs and sup and is not yet loaded
    let Layout1PageValuesAny: any = Layout1PageValues;

    if ( sourcePivotKey === 'Standards' ) { count = this.state.manual.length ; } //Presets count in case it is already loaded
    let getStds = false;
    if ( fetchedStds !== true ) {
      if ( sourcePivotKey === 'Standards' ) { getStds = true ; }
      else if ( Layout1PageValuesAny.indexOf( deepestKey ) > -1 || deepestKey === 'Search' ) { getStds = true ; }
    }
    if ( getStds === true ) {
      manual = await getALVFinManContent( SourceInfo.manual, this.props.search );
      search = updateSearchCounts( 'manual', manual, search );
      fetchedStds = true;
      updateBucketsNow = true;
      count = manual.length;
    }

    if ( sourcePivotKey === 'SupportDocs' ) { count = this.state.sups.length ; } //Presets count in case it is already loaded
    let getSups = false;
    if ( fetchedSups !== true ) {
      if ( sourcePivotKey === 'SupportDocs' ) { getSups = true ; }
      else if ( Layout1PageValuesAny.indexOf( deepestKey ) > -1 || deepestKey === 'Search' ) { getSups = true ; }
    }
    if ( getSups === true ) {
      sups = await getALVFinManContent( SourceInfo.sups, this.props.search );
      search = updateSearchCounts( 'sups', sups, search );
      fetchedSups = true;
      updateBucketsNow = true;
      count = sups.length;
    }

    if ( deepestKey === 'News' ) { count = this.state.news.length ; } //Presets count in case it is already loaded
    if ( fetchedNews !== true && ( deepestKey === 'News' || deepestKey === 'Search' ) ) {
      news = await getALVFinManContent( SourceInfo.news, this.props.search );
      search = updateSearchCounts( 'news', news, search );
      fetchedNews = true;
      count = news.length;
    }

    if ( deepestKey === 'Forms' ) { count = this.state.forms.length ; } //Presets count in case it is already loaded
    if ( fetchedForms !== true && ( deepestKey === 'Forms' || deepestKey === 'Search' ) ) {
      forms = await getALVFinManContent( SourceInfo.forms, this.props.search );
      search = updateSearchCounts( 'forms', forms as IAnyContent[], search );
      fetchedForms = true;
      count = forms.length;
    }

    if ( deepestKey === 'Help' ) { count = this.state.help.length ; } //Presets count in case it is already loaded
    if ( fetchedHelp !== true && ( deepestKey === 'Help' || deepestKey === 'Search' ) ) {
      help = await getALVFinManContent( SourceInfo.help, this.props.search );
      search = updateSearchCounts( 'help', help, search );
      fetchedHelp = true;
      count = help.length;
    }

    if ( deepestKey === 'Accounts' ) { count = this.state.accounts.length ; } //Presets count in case it is already loaded
    if ( ( deepestKey === 'Search' || deepestKey === 'Accounts' ) && this.state.accounts.length === 0 ) {
      accounts = await getALVFinManContent ( SourceInfo.accounts, this.props.search );
      search = updateSearchCounts( 'accounts', accounts, search );
      count = accounts.length;
    }

    let buckets = this.state.buckets;
    if ( updateBucketsNow === true ) {
      buckets = updateBuckets( buckets, manual, false );
      buckets = updateBuckets( buckets, sups, true );
    }
    // debugger;
    search = updateSearchTypes( [ ...appLinks, ...manual, ...sups, ...accounts, ...forms ], search );
    let deepSecond = deepestKey && deepestKey !== mainPivotKey ? deepestKey : '';

    let deepChange: IDeepStateChange = this.bumpDeepState( mainPivotKey, deepSecond ,  [], '',  this.state.deepLinks, count );

    console.log('state:  search', search );
    this.setState({ search: search, manual: manual, buckets: buckets, sups: sups, appLinks: appLinks,
      entities: entities, acronyms: acronyms,
      mainPivotKey: mainPivotKey, sourcePivotKey: sourcePivotKey, categorizedPivotKey: categorizedPivotKey, 
      deepLinks: deepChange.deepLinks, deepestPivot: deepestKey, deepProps: deepProps,
      accounts: accounts, news: news, help: help, forms: forms,
      refreshId: this.newRefreshId(),
      fetchedStds: fetchedStds, fetchedSups: fetchedSups, fetchedNews: fetchedNews, fetchedHelp: fetchedHelp, fetchedEntities: fetchedEntities,  fetchedAcronyms: fetchedAcronyms, fetchedForms: fetchedForms,
      showSpinner: false,
    });

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
    //  ...[<div title={'Show Code Details'}><Icon iconName={ 'Code' } onClick={ this.toggleDebugMode.bind(this) } style={ bannerProps.bannerCmdReactCSS }></Icon></div>],
  ];


  //Setting showTricks to false here ( skipping this line does not have any impact on bug #90 )
  if ( this.props.bannerProps.showTricks === true ) {
    farBannerElementsArray.push( 
      <div title={'Show Debug Info'}><Icon iconName='TestAutoSolid' onClick={ this.toggleDebugMode.bind(this) } style={ this.debugCmdStyles }></Icon></div>
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

    let mainPivot = 
    <Pivot
        styles={ mainPivotStyles }
        linkFormat={PivotLinkFormat.links}
        linkSize={PivotLinkSize.normal}
        selectedKey={ this.state.mainPivotKey }
        // onLinkClick={this.pivotMainClick.bind(this)}
        onLinkClick={ this.pivotMainClick.bind(this) }
    > 
      { mainItems }

    </Pivot>;

      
    let sourcePivot = 
    <Pivot
        styles={ secondaryPivotStyles }
        linkFormat={PivotLinkFormat.links}
        linkSize={PivotLinkSize.large}
        selectedKey={ this.state.sourcePivotKey }
        // onLinkClick={this.pivotMainClick.bind(this)}
        onLinkClick={ this.pivotSourceClick.bind(this) }
    > 
      { sourceItems }

    </Pivot>;

    let categorizedPivot = 
    <Pivot
        styles={ secondaryPivotStyles }
        linkFormat={PivotLinkFormat.links}
        linkSize={PivotLinkSize.large}
        selectedKey={ this.state.categorizedPivotKey }
        // onLinkClick={this.pivotMainClick.bind(this)}
        onLinkClick={ this.pivotCategorizedClick.bind(this) }
    > 
      { categorizedItems }

    </Pivot>;

    const showPage1 = <Layout1Page
      source={ SourceInfo }
      refreshId={ this.state.refreshId }
      description={ this.props.description }
      appLinks={ this.state.appLinks }
      manual={ this.state.manual }
      // stds={ this.state.stds }
      sups={ this.state.sups }
      buckets={ this.state.buckets }
      standards={ this.state.standards }
      supporting={ this.state.supporting }
      mainPivotKey={ this.state.deepestPivot as ILayout1Page }
      canvasOptions={ this.props.canvasOptions }
      debugMode={ this.state.debugMode }
    ></Layout1Page>;

    const showPage2 = <Layout2Page 
      mainPivotKey={ this.state.deepestPivot as ILayout2Page }
      refreshId={ this.state.refreshId }
      source={ SourceInfo.appLinks }
      appLinks={ this.state.appLinks }
      canvasOptions={ this.props.canvasOptions }
      debugMode={ this.state.debugMode }
    ></Layout2Page>;

    const SearchContent = <SearchPage
      refreshId={ this.state.refreshId }
      showSpinner={ this.state.showSpinner }
      search={ this.state.search }
      appLinks={ this.state.appLinks }
      accounts={ this.state.accounts }
      manual={ this.state.manual }
      forms={ this.state.forms as IAnyContent[] }
      // stds={ this.state.stds }
      sups={ this.state.sups }
      buckets={ this.state.buckets }
      standards={ this.state.standards }
      supporting={ this.state.supporting }
      mainPivotKey={ this.state.mainPivotKey }
      cmdButtonCSS={bannerProps.bannerCmdReactCSS }
      canvasOptions={ this.props.canvasOptions }
      debugMode={ this.state.debugMode }
    ></SearchPage>;

    const accounts = this.state.mainPivotKey !== 'Sources' || this.state.sourcePivotKey !== 'Accounts' ? null : <SourcePages
      source={ SourceInfo }
      search={ this.state.search }
      primarySource={ SourceInfo.accounts }
      pageWidth={ 1000 }
      topButtons={ this.props.search.accounts }
      refreshId={ this.state.refreshId }
      fetchTime={ 797979 }
      items={ this.state.accounts }
      debugMode={ this.state.debugMode }
      bumpDeepLinks= { this.bumpDeepStateFromComponent.bind(this) }
      deepProps={ this.state.deepProps }
      canvasOptions={ this.props.canvasOptions }
    ></SourcePages>;

    
    const acronyms = this.state.mainPivotKey !== 'Sources' || this.state.sourcePivotKey !== 'Acronyms' ? null : <SourcePages
      source={ SourceInfo }
      search={ this.state.search }
      primarySource={ SourceInfo.acronyms }
      pageWidth={ 1000 }
      topButtons={ this.props.search.acronyms }
      refreshId={ this.state.refreshId }
      fetchTime={ 797979 }
      items={ this.state.acronyms as IAnyContent[] }
      debugMode={ this.state.debugMode }
      bumpDeepLinks= { this.bumpDeepStateFromComponent.bind(this) }
      deepProps={ this.state.deepProps }
      canvasOptions={ this.props.canvasOptions }
    ></SourcePages>;

    
    const entities = this.state.mainPivotKey !== 'Sources' || this.state.sourcePivotKey !== 'Entities' ? null : <SourcePages
      source={ SourceInfo }
      search={ this.state.search }
      primarySource={ SourceInfo.entities }
      pageWidth={ 1000 }
      topButtons={ this.props.search.entities }
      refreshId={ this.state.refreshId }
      fetchTime={ 797979 }
      items={ this.state.entities as IAnyContent[] }
      debugMode={ this.state.debugMode }
      bumpDeepLinks= { this.bumpDeepStateFromComponent.bind(this) }
      deepProps={ this.state.deepProps }
      canvasOptions={ this.props.canvasOptions }
    ></SourcePages>;
    
    const standards = this.state.mainPivotKey !== 'Sources' || this.state.sourcePivotKey !== 'Standards' ? null : <SourcePages
      source={ SourceInfo }
      search={ this.state.search }
      primarySource={ SourceInfo.manual }
      pageWidth={ 1000 }
      topButtons={ this.props.search.manual }
      refreshId={ this.state.refreshId }
      fetchTime={ 797979 }
      items={ this.state.manual as IAnyContent[] }
      debugMode={ this.state.debugMode }
      bumpDeepLinks= { this.bumpDeepStateFromComponent.bind(this) }
      deepProps={ this.state.deepProps }
      canvasOptions={ this.props.canvasOptions }
    ></SourcePages>;
        
    const forms = this.state.mainPivotKey !== 'Sources' || this.state.sourcePivotKey !== 'Forms' ? null : <SourcePages
      source={ SourceInfo }
      search={ this.state.search }
      primarySource={ SourceInfo.forms }
      pageWidth={ 1000 }
      topButtons={ this.props.search.forms }
      refreshId={ this.state.refreshId }
      fetchTime={ 797979 }
      items={ this.state.forms as IAnyContent[] }
      debugMode={ this.state.debugMode }
      bumpDeepLinks= { this.bumpDeepStateFromComponent.bind(this) }
      deepProps={ this.state.deepProps }
      canvasOptions={ this.props.canvasOptions }
    ></SourcePages>;

    const supportingDocs = this.state.mainPivotKey !== 'Sources' || this.state.sourcePivotKey !== 'SupportDocs' ? null : <SourcePages
      source={ SourceInfo }
      search={ this.state.search }
      primarySource={ SourceInfo.sups }
      pageWidth={ 1000 }
      topButtons={ this.props.search.sups }
      refreshId={ this.state.refreshId }
      fetchTime={ 797979 }
      items={ this.state.sups as IAnyContent[] }
      debugMode={ this.state.debugMode }
      bumpDeepLinks= { this.bumpDeepStateFromComponent.bind(this) }
      deepProps={ this.state.deepProps }
      canvasOptions={ this.props.canvasOptions }
    ></SourcePages>;

    const defNewsSort ={
      prop: 'Title',
      order: 'asc',
    };

    const news = this.state.mainPivotKey !== 'News' ? null : <ModernPages
      mainPivotKey={this.state.mainPivotKey}
      sort = { defNewsSort }
      refreshId={ this.state.refreshId }
      source={ SourceInfo.news }
      pages={ this.state.news }
      canvasOptions={ this.props.canvasOptions }
      debugMode={ this.state.debugMode }

    ></ModernPages>;

    const defHelpSort ={
      prop: 'Title',
      order: 'asc',
    };

    const help = this.state.mainPivotKey !== 'Help' ? null : <ModernPages
      mainPivotKey={this.state.mainPivotKey}
      sort = { defHelpSort }
      refreshId={ this.state.refreshId }
      source={ SourceInfo.help }
      pages={ this.state.help }
      canvasOptions={ this.props.canvasOptions }
      debugMode={ this.state.debugMode }
    ></ModernPages>;

    const history = this.state.mainPivotKey !== 'History' ? null : <SourcePages
      source={ SourceInfo }
      search={ this.state.search }
      primarySource={ SourceInfo.history }
      pageWidth={ 1000 }
      topButtons={ this.props.search.history }
      refreshId={ this.state.refreshId }
      fetchTime={ 797979 }
      items={ this.state.deepLinks as any }
      debugMode={ this.state.debugMode }
      bumpDeepLinks= { null }
      jumpToDeepLink = { this.jumpToDeepLink.bind(this) }
      deepProps={ this.state.deepProps }
      canvasOptions={ this.props.canvasOptions }
    ></SourcePages>;


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
        // showTricks={ false }  //Does NOT fix https://github.com/mikezimm/ALVFinMan/issues/90
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

    const spinnerStyles : ISpinnerStyles = { label: {fontSize: '20px', fontWeight: '600',  }};
    const FetchingSpinner = this.state.showSpinner === false ? null : <Spinner size={SpinnerSize.large} label={"Fetching Information ..."} style={{ padding: 30 }} styles={ spinnerStyles } />;

    return (
      <div className={ styles.alvFinMan }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            {/* <div className={ styles.column }> */}
            { devHeader }
            { Banner }
            { mainPivot }
            { this.state.mainPivotKey === 'Sources' ? sourcePivot : null }
            { this.state.mainPivotKey === 'Categorized' ? categorizedPivot : null }
            { showPage1 }
            { showPage2 }
            { accounts }
            { acronyms }
            { entities }
            { standards }
            { supportingDocs }
            { news }
            { forms }
            { SearchContent }
            { help }
            { history }
            { FetchingSpinner }
            {/* </div> */}
          </div>
        </div>
      </div>
    );
  }

  private pivotMainClick( temp ) {
    console.log('pivotMainClick:', temp.props.itemKey );
    //This will force state update first, to show spinner, then will update the info.   https://stackoverflow.com/a/38245851
    this.setState({ showSpinner: true , mainPivotKey: temp.props.itemKey,
      }, () => this.updateWebInfo( temp.props.itemKey, this.state.sourcePivotKey, this.state.categorizedPivotKey ) // using `data` would work as well...
    );
  }

  private pivotSourceClick( temp ) {
    console.log('pivotSourceClick:', temp.props.itemKey );
    //This will force state update first, to show spinner, then will update the info.   https://stackoverflow.com/a/38245851
    this.setState({ showSpinner: true , sourcePivotKey: temp.props.itemKey,
      }, () => this.updateWebInfo( this.state.mainPivotKey, temp.props.itemKey, this.state.categorizedPivotKey ) // using `data` would work as well...
    );
  }

  private pivotCategorizedClick( temp ) {
    console.log('pivotCategorizedClick:', temp.props.itemKey );

    //This will force state update first, to show spinner, then will update the info.   https://stackoverflow.com/a/38245851
    this.setState({ showSpinner: true , categorizedPivotKey: temp.props.itemKey,
      }, () => this.updateWebInfo( this.state.mainPivotKey, this.state.sourcePivotKey, temp.props.itemKey ) // using `data` would work as well...
    );
  }

  private toggleDebugMode(){
    let newState = this.state.debugMode === true ? false : true;
    this.setState( { debugMode: newState });
  }

}
