import * as React from 'react';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

// import { ICacheInfo } from '../Security20/interface';

import { IPerformanceOp, ILoadPerformanceALVFM, IHistoryPerformance } from './IPerformance';

import styles from './performance.module.scss';

export function createPerformanceRows( performance: ILoadPerformanceALVFM ) {

    const { fetch, analyze } = performance;

    const loadRows = [
      <tr>
        <th>Process</th>
        <th>Mode</th>
        <th>Time</th>
        <th>ms</th>
      </tr>
    ];
    [ 'fetch', 'analyze', ].map( part => {
      const thisPart : IPerformanceOp = performance[part];
      if ( thisPart ) {
        let time = thisPart.startStr;
        loadRows.push( <tr>
          <td>{ thisPart.label }</td>
          <td>{ thisPart.mode === 1 ? 'View' : 'Edit' }</td>
          <td>{ time }</td>
          <td>{ thisPart.ms }</td>
        </tr>);
      }
    });

     return loadRows;

}

// export function createCacheRows( cacheInfo: ICacheInfo ) {
export function createCacheRows( cacheInfo: any ) {

  const loadRows = [
    <tr>
      <th style={{ minWidth: '150px' }}>Property</th>
      <th style={{ minWidth: '150px' }}>Value</th>
      {/* <th>Time</th>
      <th>ms</th> */}
    </tr>
  ];

  const skipProps: string[] = [ 'wasCached', 'enableHTMLCache', 'EditorName', 'FileRef', 'size' ];
  Object.keys( cacheInfo ).map( part => {

    if ( skipProps.indexOf( part ) < 0 && cacheInfo[ part ] ) {
      loadRows.push( <tr>
        <td>{ part }</td>
        <td>{ cacheInfo[ part ] }</td>
      </tr>);
    }

  });

   return loadRows;

}

const headingStyles : React.CSSProperties = {fontSize: 'larger', paddingTop: '25px', fontWeight: 'bold'};

/**
 * This is used for the visitor panel, not code pane
 * @param performance 
 * @returns 
 */
export function createPerformanceTableVisitor( performance: ILoadPerformanceALVFM ) {

    const loadSummary = <div className={ styles.performance } style={{ paddingLeft: '15px', paddingTop: '30px'}}>
      <div style={ headingStyles }>Load Performance:</div>
      {/* <div style={{paddingBottom: '8px'}}>forceReloadScripts: { JSON.stringify( performance.forceReloadScripts )}</div> */}
      <table>
         {/* { buildPerformanceTableRows( fetchInfo.performance ) } */}
         { createPerformanceRows( performance ) }
      </table>
    </div>;

    return loadSummary;

}

/**
 * This is used in the code pane and includes cache info
 * @param performance 
 * @param cache 
 * @returns 
 */
export function createPerformanceTableSmall( performance: ILoadPerformanceALVFM, cacheOnClick: any ) {
  const loadSummary = <div className={ styles.performance } style={{ paddingLeft: '15px'}}>
    <div className={ styles.tableheading } >Performance Details</div>
    <table>
      {/* { buildPerformanceTableRows( fetchInfo.performance ) } */}
      { createPerformanceRows( performance ) }
      {/* { rows } */}
    </table>
  </div>;

  return loadSummary;

}

/**
 * This is used in the code pane and includes cache info
 * @param performance 
 * @param cache 
 * @returns 
 */
//  export function createCacheTableSmall( cache: ICacheInfo, cacheOnClick: any ) {
 export function createCacheTableSmall( cache: any, cacheOnClick: any ) {

  const loadSummary = <div className={ styles.performance } style={{ paddingLeft: '15px'}}>
    <div  className={ styles.tableheading }>Cache Details</div>
    <table>
      {/* { buildPerformanceTableRows( fetchInfo.performance ) } */}
      { createCacheRows( cache ) }
      {/* { rows } */}
    </table>
  </div>;

  return loadSummary;

}