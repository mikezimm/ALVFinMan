import { PageContext } from '@microsoft/sp-page-context';
import { WebPartContext } from "@microsoft/sp-webpart-base";

import { IWebpartBannerProps, } from '@mikezimm/npmfunctions/dist/HelpPanel/onNpm/bannerProps';

import { DisplayMode, Version } from '@microsoft/sp-core-library';

import { IWebpartHistory, IWebpartHistoryItem2, } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryInterface';


export interface IAlvFinManProps {
  //OOTB Props
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;

  //FPS Banner and Options props
  displayMode: DisplayMode;

  //Environement props
  // pageContext: PageContext;
  context: WebPartContext;
  urlVars: {};

  //Banner related props
  errMessage: any;
  bannerProps: IWebpartBannerProps;

  //ADDED FOR WEBPART HISTORY:  
  webpartHistory: IWebpartHistory;

  defaultPivotKey: ILayoutAll;

  search: IFinManSearch ;

}

export interface ISearchObject {
  Search: string;
  SearchLC: string;
  SearchCount: number;
}

export interface ISearchBucket {
  SearchFixed: boolean;
  SearchStr: string;
  Search: string[];
  SearchLC: string[];
  SearchCount: number[];

  Objects: ISearchObject[];

  items: IAnyContent[];
  appLinks: IAnyContent[];
  docs: IAnyContent[];
  stds: IAnyContent[]; //This is currently not used.... Originally considered it as Standards since the library was 'Standard Docs'.  Maybe could be list of relavant standards in the future?
  sups: IAnyContent[];
  accounts: IAnyContent[];

}

export interface IFinManSearch {
  
  left: ISearchBucket;
  top: ISearchBucket;

  searchPlural: boolean; //Future use, basically search for the keywords specified in props but also look for ones with an s after it.
  searchType:  boolean; //Choose to also filter on type of content:

}


import { ILayout1Page } from './Layout1Page/ILayout1PageProps';

export interface IFMBuckets {
  Functions: string[];
  Topics: string[];
  ALGroup: string[];
  Sections: string[];
  Processes: string[];
  DocumentType: string[];
}

export interface IFMBucketItems {
  Functions: IAnyContent[];
  Topics: IAnyContent[];
  ALGroup: IAnyContent[];
  Sections: IAnyContent[];
  Processes: IAnyContent[];
  DocumentType: IAnyContent[];
}


export type ILayoutMPage = 'Main';
export type ILayoutSPage = 'Statements';
export type ILayoutAPage = 'Accounts';
export type ILayoutQPage = 'Search';
export type ILayoutAll = ILayout1Page | ILayoutSPage | ILayoutMPage | ILayoutAPage | ILayoutQPage;

export type IAppFormat = 'accounts' | 'docs' | 'stds' | 'sups' | 'appLinks';


// leftSearchFixed: boolean; //Locks the search options
// leftSearchStr: string; // Primary/Fixed search for left side of search page
// leftSearch: string[]; //For easy display of casing
// leftSearchLC: string[]; //For easy string compare

// topSearchFixed: boolean; //Locks the search options
// topSearchStr: string;
// topSearch: string[]; //For easy display of casing
// topSearchLC: string[]; //For easy string compare


export interface IAnyContent extends Partial<any> {
  format: IAppFormat;
  searchText: string;
  searchTextLC: string;
  leftSearch: string[]; //For easy display of casing
  leftSearchLC: string[]; //For easy string compare
  topSearch: string[]; //For easy display of casing
  topSearchLC: string[]; //For easy string compare

  meta: string[];
}

export interface IAlvFinManState {
  // description: string;

  showDevHeader: boolean;
  lastStateChange: string;
  showPropsHelp: boolean;

  refreshId: string;

  search: IFinManSearch ;

  appLinks: IAnyContent[];
  docs: IAnyContent[];
  stds: IAnyContent[]; //This is currently not used.... Originally considered it as Standards since the library was 'Standard Docs'.  Maybe could be list of relavant standards in the future?
  sups: IAnyContent[];
  accounts: IAnyContent[];

  fetchedAccounts: boolean;
  fetchedDocs: boolean;
  buckets: IFMBuckets;
  standards: IFMBucketItems;
  supporting: IFMBucketItems;

  mainPivotKey: ILayoutAll;
  bucketClickKey: string;
  docItemKey: string;
  supItemKey: string;

  showItemPanel: boolean;
  showPanelItem: any;

}
