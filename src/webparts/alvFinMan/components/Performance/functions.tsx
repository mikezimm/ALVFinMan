import * as React from 'react';

import { IPerformanceOp, ILoadPerformanceALVFM, IHistoryPerformance } from './IPerformance';


export function startPerformInit( editMode, monitor ){

    let result: ILoadPerformanceALVFM = {

        onInit:  new Date(),
        constructor:  null,

        fetch:  null, // startPerformOp('fetch', editMode ),
        analyze:  null, // startPerformOp('analyze', editMode ),

        monitor: monitor,

        history: [], // set to true to save session performance (for people who can see it)
    };

    return result;

}

export function startPerformOp ( label, editMode ) {
    let start = new Date();
    let result: IPerformanceOp = {
        label: label,
        start: start,
        startStr: start.toLocaleTimeString(),
        mode: editMode,
        details: [],//Could be used to trace individual file loads
    };

    return result;
}

export function updatePerformanceEnd( op: IPerformanceOp, updateMiliseconds:  boolean, ) {
    op.end = new Date();
    op.endStr = op.end.toLocaleTimeString();
    if ( updateMiliseconds === true ) op.ms = op.end.getTime() - op.start.getTime();
    return op;
}

export function updatePerformOpSimple ( ops: IPerformanceOp[] ) {
    
    if ( ops.length > 0 ) {
        let last = ops.length -1;
        ops[last] = updatePerformanceEnd( ops[last], true );
    }
    return ops;
}

export function startPerformOpDetail ( ops: IPerformanceOp[], label: string, editMode: boolean, update: boolean = true ) {
    let last = ops.length -1;

    if ( update === true && ops.length > 0 ) {
        ops[last] = updatePerformanceEnd( ops[last], update );
    }

    if ( label ) {
        ops[ last ].details.push( startPerformOp( label, editMode ) );
    }
    return ops;
}