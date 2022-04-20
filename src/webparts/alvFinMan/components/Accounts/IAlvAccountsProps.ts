import { IAnyContent } from "../IAlvFinManProps";

export interface IAlvAccountsProps {
  webUrl: string;
  refreshId: string;
  accountsList: string;
  searchProps: string[];

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
