import { DisplayMode, Version } from '@microsoft/sp-core-library';

//import { IPerformanceOp, ILoadPerformance, IHistoryPerformance } from '';

export interface IPerformanceOp {
    label: string;
    start:  Date;
    end?:  Date;
    startStr:  string;
    endStr?:  string;
    ms?: number;
    mode?: DisplayMode;
    details?: IPerformanceOp[]; //Could be used to trace individual file loads
}

/**
 * ILoadPerformance is Baseline common performance informance detail
 * For logging load times - for analytics
 */
export interface ILoadPerformance {

    onInit:  Date ;
    constructor:  Date ;

    fetch?:  IPerformanceOp  ;
    monitor: boolean; // set to true to save session performance (for people who can see it)
    history?: IHistoryPerformance[]; 
}


/**
 * ILoadPerformanceSS7 has specific indicators relavant to SecureScript7
 * For logging load times - for analytics
 */

export interface ILoadPerformanceALVFM extends ILoadPerformance {

    analyze:  IPerformanceOp  ;

}

//For logging events while running the web part
export interface IHistoryPerformance {
    times: IPerformanceOp [];
}