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
  customSearch: string[];
  customSearchLC: string[];

}

import { ILayout1Page } from './ILayout1PageProps';

export interface IFMBuckets {
  Functions: string[];
  Topics: string[];
  ALGroup: string[];
  Sections: string[];
  Processes: string[];
  DocumentType: string[];
}

export interface IFMBucketItems {
  Functions: any[];
  Topics: any[];
  ALGroup: any[];
  Sections: any[];
  Processes: any[];
  DocumentType: any[];
}


export type ILayoutMPage = 'Main';
export type ILayoutSPage = 'Statements';
export type ILayoutAPage = 'Accounts';
export type ILayoutQPage = 'Search';
export type ILayoutAll = ILayout1Page | ILayoutSPage | ILayoutMPage | ILayoutAPage | ILayoutQPage;

export type IAppFormat = 'docs' | 'stds' | 'sups' | 'appLinks';

export interface IAnyContent extends Partial<any> {
  format: IAppFormat;
  searchText: string;
  searchTextLC: string;
  meta: string[];
}

export interface IAlvFinManState {
  // description: string;

  showDevHeader: boolean;
  lastStateChange: string;
  showPropsHelp: boolean;

  refreshId: string;

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
