import { ISourceInfo, ISourceProps } from "../DataInterface";
import { IEntityContent, IFinManSearch } from "../IAlvFinManProps";

export interface IEntitysProps {

  refreshId: string;

  search: IFinManSearch ;

  source: ISourceInfo;
  primarySource: ISourceProps;

  bumpDeepLinks: any;

  items: IEntityContent[];
  fetchTime: number;

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

}

export type ISort = 'asc' | 'dec' | '-';

export interface IEntitysState {
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
