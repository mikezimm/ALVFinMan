import { ISourceInfo, ISourceProps } from "../DataInterface";
import { IAnyContent } from "../IAlvFinManProps";

export interface IAlvAccountsProps {

  refreshId: string;

  source: ISourceInfo;
  primarySource: ISourceProps;

  accounts: IAnyContent[];
  fetchTime: number;

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
