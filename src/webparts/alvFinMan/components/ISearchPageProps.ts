import { IAnyContent, IFMBuckets,IFMBucketItems } from "./IAlvFinancialManualProps";
import { ILayout1Page,  } from "./ILayout1PageProps";
import { ILayoutAll,  } from "./IAlvFinancialManualProps";

export interface ISearchPageProps {
  refreshId: string;

  appLinks: IAnyContent[];
  mainPivotKey: ILayoutAll;
  docs: IAnyContent[];
  stds: IAnyContent[]; //This is currently not used.... Originally considered it as Standards since the library was 'Standard Docs'.  Maybe could be list of relavant standards in the future?
  sups: IAnyContent[];
  accounts: IAnyContent[];

  // fetchedAccounts: boolean;
  // fetchedDocs: boolean;
  buckets: IFMBuckets;
  standards: IFMBucketItems;
  supporting: IFMBucketItems;
}

export type ISort = 'asc' | 'dec' | '-';

export interface ISearchPageState {
  // description: string;

  filtered: any[];
  slideCount: number;
  sortNum: ISort;
  sortName: ISort;
  sortGroup: ISort;

  searchText: string;
  searchTime: number;
  refreshId: string;


}
