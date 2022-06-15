import { ISourceInfo, ISourceProps } from "../DataInterface";
import { IDeepLink, IFinManSearch } from "../IAlvFinManProps";

export interface IHistoryProps {

  refreshId: string;

  search: IFinManSearch ;

  items: IDeepLink[];
  fetchTime: number;

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

}

export type ISort = 'asc' | 'dec' | '-';

export interface IHistoryState {
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
