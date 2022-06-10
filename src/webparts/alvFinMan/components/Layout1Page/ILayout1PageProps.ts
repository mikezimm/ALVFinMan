import { ISourceInfo } from "../DataInterface";
import { IFMBuckets, IFMBucketItems, IAnyContent, ICanvasContentOptions } from "../IAlvFinManProps";

export interface ILayout1PageProps {
  description: string;

  source: ISourceInfo;

  appLinks: IAnyContent[];
  manual: IAnyContent[];
  // stds: IAnyContent[]; //This is currently not used.... Originally considered it as Standards since the library was 'Standard Docs'.  Maybe could be list of relavant standards in the future?
  sups: IAnyContent[];

  buckets: IFMBuckets;
  standards: IFMBucketItems;
  supporting: IFMBucketItems;

  mainPivotKey: ILayout1Page;

  addCkeEditToDiv?: boolean;  //Will add class="cke_editable" to the styles.article div so that Tables have some formatting when shown in app.

  canvasOptions: ICanvasContentOptions;

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

  refreshId: string;

}

export type ILayout1Page = 'Reporting' | 'Processes' | 'Functions' | 'Topics' | '';
export const Layout1PageValues: ILayout1Page[] = [ 'Reporting' ,'Processes' , 'Functions' , 'Topics' ];

export interface ILayout1PageState {
  // description: string;

  bucketClickKey: string;
  docItemKey: string;
  supItemKey: string;

  showItemPanel: boolean;
  showPanelItem: IAnyContent;
  showPanelJSON: boolean;
  
  refreshId: string;

}
