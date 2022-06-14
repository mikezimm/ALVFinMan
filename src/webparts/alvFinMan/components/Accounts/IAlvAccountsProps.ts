import { ISourceInfo, ISourceProps } from "../DataInterface";
import { IAnyContent, IFinManSearch } from "../IAlvFinManProps";

export interface IAlvAccountsProps {

  refreshId: string;

  search: IFinManSearch ;

  source: ISourceInfo;
  primarySource: ISourceProps;

  items: IAnyContent[];
  fetchTime: number;

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

}

export type ISort = 'asc' | 'dec' | '-';

export interface IAlvAccountsState {
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
