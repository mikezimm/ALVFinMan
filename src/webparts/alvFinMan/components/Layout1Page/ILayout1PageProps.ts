import { ISourceInfo } from "../DataInterface";
import { IFMBuckets, IFMBucketItems, IAnyContent } from "../IAlvFinManProps";

export interface ILayout1PageProps {
  description: string;

  source: ISourceInfo;

  appLinks: IAnyContent[];
  docs: IAnyContent[];
  stds: IAnyContent[]; //This is currently not used.... Originally considered it as Standards since the library was 'Standard Docs'.  Maybe could be list of relavant standards in the future?
  sups: IAnyContent[];

  buckets: IFMBuckets;
  standards: IFMBucketItems;
  supporting: IFMBucketItems;

  mainPivotKey: ILayout1Page;

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
  
  refreshId: string;

}
