import { ILoadPerformanceALVFM } from "./Performance/IPerformance";

  export interface IFetchInfo {

    selectedKey: string;
    errorHTML: string;
    performance: ILoadPerformanceALVFM;

  }
  
export function baseFetchInfo( warning: string, performance: ILoadPerformanceALVFM ) {
  let base: IFetchInfo = {

      selectedKey: 'raw',
      errorHTML: warning,

      performance: performance,

  };

  return base;

}