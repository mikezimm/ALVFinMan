import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';
import { ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, IChartSeries, ICharNote, } 
    from '@mikezimm/npmfunctions/dist/CSSCharts/ICSSCharts';

import { IFMBuckets, IFMBucketItems, IAnyContent, IPagesContent, ICanvasContentOptions } from "../IAlvFinManProps";
import { ISourceProps } from "../DataInterface";

export type IModernPage = 'News' | 'Help' | 'Standards' | '';
export const ModernPageValues: IModernPage[] = [ 'News', 'Help' ,'Standards'  ];

export interface IModernPagesProps {

  pages: IPagesContent[];

  sort: {
    prop: string;
    order: ISeriesSort;
  };

  source: ISourceProps;

  // buckets: IFMBuckets;

  mainPivotKey: IModernPage;

  refreshId: string;

  canvasOptions: ICanvasContentOptions;

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

}

export interface IModernPagesState {
  // description: string;

  showItemPanel: boolean;
  showThisItem: any;
  showCanvasContent1: boolean;
  showPanelJSON: boolean;
  
  sort: {
    prop: string;
    order: ISeriesSort;
  };

  refreshId: string;

}
