import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';
import { ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, IChartSeries, ICharNote, } 
    from '@mikezimm/npmfunctions/dist/CSSCharts/ICSSCharts';

import { IFMBuckets, IFMBucketItems, IAnyContent, IPagesContent, ICanvasContentOptions, IFinManSearch } from "../../IAlvFinManProps";
import { ISourceInfo, ISourceProps } from "../../DataInterface";

export interface IItemPaneProps {

  item: IAnyContent;

  showCanvasContent1: boolean;

  imageStyle: string;

  search: IFinManSearch ;

  source: ISourceInfo;
  primarySource: ISourceProps;
  topButtons: string[];

  refreshId: string;

  canvasOptions: ICanvasContentOptions;

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

}

export interface IItemPaneState {
  // description: string;
  showPanelJSON: boolean;
  showThisItem: IAnyContent;  //Item with additional content that may have been fetched

}
