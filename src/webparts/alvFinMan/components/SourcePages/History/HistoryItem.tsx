

import * as React from 'react';

import styles from './History.module.scss';

import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { IFMSearchType, SearchTypes } from '../../DataInterface';
import { IAnyContent, IDeepLink, ISearchObject } from '../../IAlvFinManProps';
import { getHighlightedText } from '../../Elements/HighlightedText';

const novalue = 'novalue';

export function createHistoryRow( item: IDeepLink , searchText: string, onClick: any ) {

    const row = <tr className={ styles.historyItem }>
        <td><Icon iconName='History'></Icon></td>

        <td title="Time">{ item.timeLabel }</td>
        <td title="Main">{ getHighlightedText( `${ item.main }`, searchText )  }</td>
        <td title="Secondary" style={ null }>{  getHighlightedText( `${ item.second }`, searchText )  }</td>
        <td style={{ display: 'flex' }}>
            <div style={{paddingRight: '20px' }}>Searched:</div>
            <div title="Search" className={styles.marginRight15}>{  !item.deep1 ? 'No text' : getHighlightedText( `${ item.deep1 }`, searchText )  }</div>
            <div title="Button" className={ '' }>{  !item.deep2 ? 'No buttons' : getHighlightedText( `${ decodeURIComponent(item.deep2) }`, searchText )  }</div>
        </td>

    </tr>;

    return row;

}