import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';
import { ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, IChartSeries, ICharNote, } 
    from '@mikezimm/npmfunctions/dist/CSSCharts/ICSSCharts';

import { IFMBuckets, IFMBucketItems, IAnyContent, IPagesContent, IMainPage, ICanvasContentOptions } from "../IAlvFinManProps";
import { ISourceProps } from "../DataInterface";

export type ILayout2Page = 'General' | 'Statements' | 'Links' | '';
export const Layout2PageValues: ILayout2Page[] = [ 'General', 'Statements' ,'Links'  ];

export interface ILayout2PageProps {

  appLinks: IAnyContent[];

  source: ISourceProps;

  // buckets: IFMBuckets;

  mainPivotKey: ILayout2Page;

  refreshId: string;

  canvasOptions: ICanvasContentOptions;

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

}

export interface ILayout2PageState {
  // description: string;

  showItemPanel: boolean;
  selectedItem: IAnyContent;
  showPanelJSON: boolean;
  
  filteredItems: IAnyContent[];
  sort: {
    prop: string;
    order: ISeriesSort;
  };

  refreshId: string;

}
