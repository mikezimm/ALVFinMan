import { ISourceInfo, ISourceProps } from "../DataInterface";
import { IAnyContent, IFinManSearch } from "../IAlvFinManProps";

export interface ISourcePagesProps {

  refreshId: string;

  search: IFinManSearch ;

  source: ISourceInfo;
  primarySource: ISourceProps;
  topButtons: string[];

  bumpDeepLinks: any;

  items: IAnyContent[];
  fetchTime: number;

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

}

export type ISort = 'asc' | 'dec' | '-';

export interface ISourcePagesState {
  // description: string;

  filtered: any[];
  topSearch: string[];
  
  slideCount: number;
  sortNum: ISort;
  sortName: ISort;
  sortGroup: ISort;

  searchText: string;
  searchTime: number;
  refreshId: string;


}
