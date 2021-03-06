import { IAnyContent, IFMBuckets,IFMBucketItems, IFinManSearch, ICanvasContentOptions } from "../IAlvFinManProps";
import { ILayout1Page,  } from "../Layout1Page/ILayout1PageProps";
import { IMainPage,  } from "../IAlvFinManProps";
import * as React from "react";

export interface ISearchPageProps {
  refreshId: string;
  showSpinner: boolean;
  
  search: IFinManSearch ;

  appLinks: IAnyContent[];
  mainPivotKey: IMainPage;
  manual: IAnyContent[];
  forms: IAnyContent[];
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

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

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
