import { PageContext } from '@microsoft/sp-page-context';
import { WebPartContext } from "@microsoft/sp-webpart-base";

import { IWebpartBannerProps, } from '@mikezimm/npmfunctions/dist/HelpPanelOnNPM/onNpm/bannerProps';
import { ISitePreConfigProps, } from '@mikezimm/npmfunctions/dist/PropPaneHelp/PreConfigFunctions';

import { DisplayMode, Version } from '@microsoft/sp-core-library';

import { IWebpartHistory, IWebpartHistoryItem2, } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryInterface';

export type IPageLoadPref = 'description' | 'canvasContent1' | 'tab';

export interface IPageLoadPrefChoices {
  key: IPageLoadPref | IObjectFit;
  text: string;
}
export const PageLoadPefs : IPageLoadPrefChoices[] = [ 
  { key: 'description' ,text: 'Just short description' }, 
  { key: 'canvasContent1',text: 'Full page' }, 
  { key: 'tab',text: 'Open full page in new tab' },
 ];


 export type IObjectFit = 'center' | 'contain' | 'cover' | 'none' | 'center-cover' | 'center-contain';

 export const ImageFitPrefs : IPageLoadPrefChoices[] = [ 
  { key: 'center' ,text: 'center' }, 
  { key: 'contain',text: 'contain' }, 
  { key: 'cover',text: 'cover' },
  { key: 'center-cover',text: 'center-cover' },
  { key: 'center-contain',text: 'center-contain' },
 ];


export interface IModernImageSettings {
  height: number | string;
  width: number | string;
  objectFit: string; //cover, contain, etc...
  style: string; //gets embedded directly into all image tags as:  <img style="Your style string here" - height: 150px; object-fit: "cover"; width: 100%;
  autoFix?: boolean; //Maybe eventually I could try to auto-fix but have this optional.
  lightBox?: boolean; //Option to add lightbox on click to show image full size
}

export interface ICanvasContentOptions {
  
  pagePreference: IPageLoadPref;

  addCkeEditToDiv?: boolean;  //Will add class="cke_editable" to the styles.article div so that Tables have some formatting when shown in app.
  imageOptions?: IModernImageSettings;

  h1Styles?: string; //Use similar to FPSPageOptions styling 
  h2Styles?: string; //Use similar to FPSPageOptions styling 
  h3Styles?: string; //Use similar to FPSPageOptions styling 
  
}

export interface IAlvFinManProps {
  //OOTB Props
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;

  //For PropPaneHelp
  sitePresets : ISitePreConfigProps;

  //FPS Banner and Options props
  displayMode: DisplayMode;
  debugMode: boolean; //Option to display visual ques in app like special color coding and text  DeviceBug

  //Environement props
  // pageContext: PageContext;
  context: WebPartContext;
  urlVars: {};

  //Banner related props
  errMessage: any;
  bannerProps: IWebpartBannerProps;

  //ADDED FOR WEBPART HISTORY:  
  webpartHistory: IWebpartHistory;

  defaultPivotKey: IDefaultPage;

  maxDeep: number;  //      maxDeep: 20,

  search: IFinManSearch ;

  canvasOptions: ICanvasContentOptions;

  saveLoadAnalytics: any;

}

export interface ISearchObject {
  Search: string;
  SearchLC: string;
  SearchCount: number;
}

export type IAllContentType = IAnyContent | IPagesContent;

export interface ISearchBucket {
  SearchFixed: boolean;
  SearchStr: string;
  Search: string[];
  SearchLC: string[];
  SearchCount: number[];

  Objects: ISearchObject[];

  items: IAllContentType[];
  appLinks: IAnyContent[];
  entities: IAnyContent[];
  manual: IAnyContent[];
  // docs: IAnyContent[];
  // stds: IAnyContent[]; //This is currently not used.... Originally considered it as Standards since the library was 'Standard Docs'.  Maybe could be list of relavant standards in the future?
  sups: IAnyContent[];
  accounts: IAnyContent[];
  news: IPagesContent[];
  help: IPagesContent[];
  acronyms: IAnyContent[];

}

export interface IFinManSearch {
  
  left: ISearchBucket;
  top: ISearchBucket;
  type: ISearchBucket;

  searchPlural: boolean; //Future use, basically search for the keywords specified in props but also look for ones with an s after it.
  searchType:  boolean; //Choose to also filter on type of content:

  manual: string[];
  news: string[];
  help: string[];
  appLinks: string[];
  entities: string[];
  acronyms: string[];
  sups: string[];
  accounts: string[];

}

import { ILayout1Page } from './Layout1Page/ILayout1PageProps';
import { ILayout2Page } from './Layout2Page/ILayout2Props';


export interface IFMBuckets {
  Functions: string[];
  Topics: string[];
  ALGroup: string[];
  // Sections: string[];
  Reporting: string[];
  Processes: string[];
  DocumentType: string[];
}

export interface IFMBucketItems {
  Functions: IAnyContent[];
  Topics: IAnyContent[];
  ALGroup: IAnyContent[];
  // Sections: IAnyContent[];
  Reporting: IAnyContent[];
  Processes: IAnyContent[];
  DocumentType: IAnyContent[];
}


export type ILayoutHistPage = 'History';
export type ILayoutNPage = 'News';
export type ILayoutLPage = 'Links';
export type ILayoutGPage = 'General';
export type ILayoutSPage = 'Statements';
export type ILayoutAPage = 'Accounts';
export type ILayoutQPage = 'Search';
export type ILayoutHPage = 'Help';
export type ILayoutEPage = 'Entities';

export type ILayoutStdPage = 'Standards';
export type ILayoutSupPage = 'SupportDocs';
export type ILayoutSourcesPage = 'Sources';
export type ILayoutCategorizedPage = 'Categorized';

export const pivotHeadingNews : ILayoutNPage = 'News';
export const pivotHeading0 : ILayoutGPage = 'General';

export const pivotHeading1 : ILayoutSPage = 'Statements';
// const pivotHeading2 : ILayout1Page = 'Reporting|Sections';
export const pivotHeading2 : ILayout1Page = 'Reporting';
export const pivotHeading3 : ILayout1Page = 'Processes';
export const pivotHeading4 : ILayout1Page = 'Functions';
export const pivotHeading5 : ILayout1Page = 'Topics';
export const pivotHeadingAcc : ILayoutAPage = 'Accounts';

export const pivotHeadingSourcesearch : ILayoutQPage = 'Search';
export const pivotHeadingHelp : ILayoutHPage = 'Help';
export const pivotHeadingHist : ILayoutHistPage = 'History';
export const pivotHeadingLinks : ILayoutLPage = 'Links';
export const pivotHeadingEntities : ILayoutEPage = 'Entities';

export const pivotHeadingSources : ILayoutSourcesPage = 'Sources';

export const pivotHeadingManual: ILayoutStdPage = 'Standards';
export const pivotHeadingSupporting: ILayoutSupPage = 'SupportDocs';

export const pivotHeadingCatgorized : ILayoutCategorizedPage = 'Categorized';

export type IDefMainPage = ILayoutNPage | ILayoutGPage | ILayoutQPage | ILayoutHPage ;
export type IAltMainPage = ILayoutSourcesPage | ILayoutCategorizedPage | ILayoutHistPage;
export type IMainPage = IDefMainPage | IAltMainPage;

export type ISourcePage = '' | ILayoutLPage | ILayoutAPage | ILayoutStdPage | ILayoutSupPage | ILayoutEPage | ILayoutSupPage  | ILayoutLPage;
export type ICategoryPage = ILayout1Page | ILayoutSPage;

export type IDefaultPage = IDefMainPage | ISourcePage | ICategoryPage;


export type IAppFormat = 'accounts' | 'manual' | 'sups' | 'appLinks' | 'news' | 'help' | 'entities' | 'acronyms' ;

export const mainDefPivots: IDefMainPage[] = [ pivotHeading0, pivotHeadingNews, pivotHeadingSourcesearch, pivotHeadingHelp, ];
export const mainAltPivots: IAltMainPage[] = [ pivotHeadingSources, pivotHeadingCatgorized, pivotHeadingHist ];
export const sourcePivots: ISourcePage[] = [ pivotHeadingAcc, pivotHeadingLinks, pivotHeadingManual, pivotHeadingSupporting, pivotHeadingEntities ];

export const categorizedPivots: ICategoryPage[] = [ pivotHeading1, pivotHeading2, pivotHeading3, pivotHeading4, pivotHeading5,  ];

export const defaultPivots: IDefaultPage[] = [ ...mainDefPivots, ...sourcePivots, ...categorizedPivots ];
export const allMainPivots: IMainPage[] = [ ...mainDefPivots, ...mainAltPivots, ];



// leftSearchFixed: boolean; //Locks the search options
// leftSearchStr: string; // Primary/Fixed search for left side of search page
// leftSearch: string[]; //For easy display of casing
// leftSearchLC: string[]; //For easy string compare

// topSearchFixed: boolean; //Locks the search options
// topSearchStr: string;
// topSearch: string[]; //For easy display of casing
// topSearchLC: string[]; //For easy string compare


export interface IAnyContent extends Partial<any> {
  format: IAppFormat; //This represents the key of the SourceType
  searchText: string;
  searchTextLC: string;
  leftSearch: string[]; //For easy display of casing
  leftSearchLC: string[]; //For easy string compare
  topSearch: string[]; //For easy display of casing
  topSearchLC: string[]; //For easy string compare
  searchSource: string; //For easy display of casing
  searchSourceLC: string; //For easy string compare
  type: string;
  typeIdx: number;
  fileDisplayName: string;

  searchTitle: any;
  searchDesc: any;
  searchHref: string;

  descIsHTML: boolean;
  meta: string[];

  modifiedMS: number;
  createdMS: number;
  publishedMS?: number;

  modifiedLoc: string;
  createdLoc: string;
  publishedLoc?: string;

}

export interface IPagesContent extends Partial<IAnyContent> {
  ID: string;
  Title: string;
  Description: string;
  'File/ServerRelativeUrl': string;
  'BannerImageUrl.Url': string;
  FirstPublishedDate: any;
  PromotedState: any;
  BannerImageUrl: {
    Url: string;
  };
  File: {
    ServerRelativeUrl: string;
  };

}

export interface IDeepLink {
  main: IMainPage;
  second: ISourcePage | ICategoryPage;
  deep1: string;
  deep2: string;
  deep3: string;
  deep4: string;
  timeMs: number;
  time: Date;
  timeLabel: string;
  deltaMs: number;
  processTime: number;

}

export interface IAlvFinManState {
  // description: string;

  showDevHeader: boolean;
  lastStateChange: string;
  showPropsHelp: boolean;

  refreshId: string;

  search: IFinManSearch ;

  appLinks: IAnyContent[];

  entities: IAnyContent[];

  acronyms: IAnyContent[];

  manual: IAnyContent[];
  // stds: IAnyContent[]; //This is currently not used.... Originally considered it as Standards since the library was 'Standard Docs'.  Maybe could be list of relavant standards in the future?
  sups: IAnyContent[];
  accounts: IAnyContent[];

  news: IPagesContent[];
  help: IPagesContent[];

  fetchedAccounts: boolean;
  fetchedDocs: boolean;
  fetchedNews: boolean;
  fetchedHelp: boolean;
  fetchedEntities: boolean;
  fetchedAcronyms: boolean;

  buckets: IFMBuckets;
  standards: IFMBucketItems;
  supporting: IFMBucketItems;

  mainPivotKey: IMainPage;
  sourcePivotKey: ISourcePage;
  categorizedPivotKey: ICategoryPage;
  deepestPivot: IDefaultPage | IAltMainPage;

  deepLinks: IDeepLink[];

  // bucketClickKey: string;
  docItemKey: string;
  supItemKey: string;

  showItemPanel: boolean;
  showPanelItem: any;

  debugMode: boolean; //Option to display visual ques in app like special color coding and text  DeviceBug

}
