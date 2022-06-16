

import * as React from 'react';

import styles from '../SourcePages.module.scss';

import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { IFMSearchType, SearchTypes } from '../../DataInterface';
import { IAnyContent, IEntityContent, ISearchObject } from '../../IAlvFinManProps';
import { getHighlightedText } from '../../Elements/HighlightedText';

const novalue = 'novalue';

export function createEntityRow( item: IEntityContent , searchText: string, onClick: any ) {
    // let controller1 = item.Controller1  === null || item.Controller1  === undefined ||  item.Controller1.length === 0 ? 'None assigned' : item.Controller1[0].Title;

    const row = <div className={ styles.entityItem }>
        <div><Icon iconName={ SearchTypes.objs[item.typeIdx].icon }></Icon></div>

        <div className={ styles.entityDetails}>
        <div className={ styles.entityRow1 } style={{cursor: item.searchHref ? 'pointer' : null }} onClick = { onClick }>
            <div>{ item.ID }</div>
            <div title="Parent">Parent: &nbsp;&nbsp;{ getHighlightedText( `${ item.Parent }`, searchText )  }</div>
            <div title="OSCode / HFMCode" style={{ width: '350px' }}>Code:&nbsp;&nbsp;{  getHighlightedText( `${ item.OSCode + ' / ' + item.HFMCode }`, searchText )  }</div>
            {/* <div title="HFMCode">{  getHighlightedText( `${ item.HFMCode }`, searchText )  }</div> */}
            <div title="Entity">{  getHighlightedText( `${ item.Title }`, searchText )  }</div>
        </div>
        <div className={ styles.entityRow2}>
            <div title="Controller1">Controller:&nbsp;&nbsp;{  !item.Controller1 ? 'None assigned' : getHighlightedText( `${ item.Controller1.Title }`, searchText )  }</div>
            <div title="Controller2">Backups:&nbsp;&nbsp;{  !item.Controller2 ? 'None assigned' : getHighlightedText( `${ item.Controller2.map( controller => { return controller.Title ; }).join('; ')}`, searchText )  }</div>
        </div>
        </div>
    </div>;

    return row;

}