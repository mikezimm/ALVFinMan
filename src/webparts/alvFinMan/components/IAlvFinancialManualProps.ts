import { ILayout1Page } from './ILayout1PageProps';

export interface IAlvFinancialManualProps {
  description: string;
  defaultPivotKey: ILayoutAll;
  customSearch: string[];
  customSearchLC: string[];

  // FinManSite: string;
  // StandardsLib: string;
  // SupportingLib: string;

}

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

export interface IAlvFinancialManualState {
  // description: string;

  refreshId: string;
  lastStateChange: string;
  
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
