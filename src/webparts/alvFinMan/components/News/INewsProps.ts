import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';
import { ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, IChartSeries, ICharNote, } 
    from '@mikezimm/npmfunctions/dist/CSSCharts/ICSSCharts';

import { IFMBuckets, IFMBucketItems, IAnyContent, IPagesContent, ILayoutAll } from "../IAlvFinManProps";
import { ISourceProps } from "../DataInterface";

export interface INewsPageProps {

  news: IPagesContent[];

  sort: {
    prop: string;
    order: ISeriesSort;
  };

  source: ISourceProps;

  // buckets: IFMBuckets;

  mainPivotKey: ILayoutAll;

  refreshId: string;

}

export interface INewsPageState {
  // description: string;

  showItemPanel: boolean;
  showThisItem: any;
  
  sort: {
    prop: string;
    order: ISeriesSort;
  };

  refreshId: string;

}
