import { ISourceInfo, ISourceProps } from "../DataInterface";
import { IAnyContent, ICanvasContentOptions, IFinManSearch } from "../IAlvFinManProps";

export interface ISourcePagesProps {

  refreshId: string;

  search: IFinManSearch ;

  source: ISourceInfo;
  primarySource: ISourceProps;
  topButtons: string[];

  pageWidth: number;

  deepProps: string[];

  bumpDeepLinks: any;
  jumpToDeepLink?: any;

  items: IAnyContent[];
  fetchTime: number;

  canvasOptions: ICanvasContentOptions;

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

}

export type ISort = 'asc' | 'dec' | '-';

export interface ISourcePagesState {
  // description: string;

  filtered: any[];
  topSearch: string[];
  
  showItemPanel: boolean;
  showThisItem: any;
  showCanvasContent1: boolean;
  showPanelJSON: boolean;

  slideCount: number;
  sortNum: ISort;
  sortName: ISort;
  sortGroup: ISort;

  searchText: string;
  searchTime: number;
  refreshId: string;


}
