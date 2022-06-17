import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';
import { ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, IChartSeries, ICharNote, } 
    from '@mikezimm/npmfunctions/dist/CSSCharts/ICSSCharts';

import { IFMBuckets, IFMBucketItems, IAnyContent, IPagesContent, ICanvasContentOptions } from "../../IAlvFinManProps";
import { ISourceProps } from "../../DataInterface";

export interface ISingleModernPageProps {

  page: IPagesContent;

  showCanvasContent1: boolean;

  imageStyle: string;

  source: ISourceProps;

  refreshId: string;

  canvasOptions: ICanvasContentOptions;

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

}

export interface ISingleModernPageState {
  // description: string;
  showPanelJSON: boolean;
  showThisItem: any;

}
