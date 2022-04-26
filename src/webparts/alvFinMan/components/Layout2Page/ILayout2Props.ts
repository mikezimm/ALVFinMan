import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';
import { ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, IChartSeries, ICharNote, } 
    from '@mikezimm/npmfunctions/dist/CSSCharts/ICSSCharts';

import { IFMBuckets, IFMBucketItems, IAnyContent, IPagesContent, ILayoutAll } from "../IAlvFinManProps";
import { ISourceProps } from "../DataInterface";

export interface ILayout2PageProps {

  appLinks: IAnyContent[];

  source: ISourceProps;

  // buckets: IFMBuckets;

  mainPivotKey: ILayoutAll;

  refreshId: string;

}

export interface ILayout2PageState {
  // description: string;

  showItemPanel: boolean;
  selectedItem: IAnyContent;
  filteredItems: IAnyContent[];
  sort: {
    prop: string;
    order: ISeriesSort;
  };

  refreshId: string;

}
