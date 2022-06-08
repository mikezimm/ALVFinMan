import { IAnyContent, IFMBuckets,IFMBucketItems, IFinManSearch, ICanvasContentOptions } from "../IAlvFinManProps";
import { ILayout1Page,  } from "../Layout1Page/ILayout1PageProps";
import { ILayoutAll,  } from "../IAlvFinManProps";
import * as React from "react";

export interface ISearchPageProps {
  refreshId: string;

  search: IFinManSearch ;

  appLinks: IAnyContent[];
  mainPivotKey: ILayoutAll;
  manual: IAnyContent[];
  // stds: IAnyContent[]; //This is currently not used.... Originally considered it as Standards since the library was 'Standard Docs'.  Maybe could be list of relavant standards in the future?
  sups: IAnyContent[];
  accounts: IAnyContent[];

  // fetchedAccounts: boolean;
  // fetchedDocs: boolean;
  buckets: IFMBuckets;
  standards: IFMBucketItems;
  supporting: IFMBucketItems;

  cmdButtonCSS: React.CSSProperties;

  canvasOptions: ICanvasContentOptions;

}

export type ISort = 'asc' | 'dec' | '-';

export interface ISearchPageState {
  // description: string;

  topSearch: string[];
  leftSearch: string[];
  typeSearch: string[];

  filtered: any[];
  slideCount: number;
  sortNum: ISort;
  sortName: ISort;
  sortGroup: ISort;

  searchText: string;
  searchTime: number;
  refreshId: string;

}
