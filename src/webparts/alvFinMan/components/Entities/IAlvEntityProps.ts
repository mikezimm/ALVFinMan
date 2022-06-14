import { ISourceInfo, ISourceProps } from "../DataInterface";
import { IEntityContent } from "../IAlvFinManProps";

export interface IAlvEntitysProps {

  refreshId: string;

  source: ISourceInfo;
  primarySource: ISourceProps;

  items: IEntityContent[];
  fetchTime: number;

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

}

export type ISort = 'asc' | 'dec' | '-';

export interface IAlvEntitysState {
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
