import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';
import { ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, IChartSeries, ICharNote, } 
    from '@mikezimm/npmfunctions/dist/CSSCharts/ICSSCharts';

import { IFMBuckets, IFMBucketItems, IAnyContent, IPagesContent, ILayoutAll } from "../IAlvFinManProps";
import { ISourceProps } from "../DataInterface";

export interface IModernImageSettings {
  height: number | string;
  width: number | string;
  objectFit: string; //cover, contain, etc...
  style: string; //gets embedded directly into all image tags as:  <img style="Your style string here" - height: 150px; object-fit: "cover"; width: 100%;
  autoFix?: boolean; //Maybe eventually I could try to auto-fix but have this optional.

}

export interface IModernPagesProps {

  pages: IPagesContent[];

  sort: {
    prop: string;
    order: ISeriesSort;
  };

  source: ISourceProps;

  // buckets: IFMBuckets;

  mainPivotKey: ILayoutAll;

  refreshId: string;

  addCkeEditToDiv?: boolean;  //Will add class="cke_editable" to the styles.article div so that Tables have some formatting when shown in app.
  imageOptions?: IModernImageSettings;

  h1Styles?: string; //Use similar to FPSPageOptions styling 
  h2Styles?: string; //Use similar to FPSPageOptions styling 
  h3Styles?: string; //Use similar to FPSPageOptions styling 

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
