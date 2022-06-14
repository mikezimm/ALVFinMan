import { ISourceInfo, ISourceProps } from "../DataInterface";
import { IAcronymContent } from "../IAlvFinManProps";

export interface IAlvAcronymsProps {

  refreshId: string;

  source: ISourceInfo;
  primarySource: ISourceProps;

  items: IAcronymContent[];
  fetchTime: number;

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

}

export type ISort = 'asc' | 'dec' | '-';

export interface IAlvAcronymsState {
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
