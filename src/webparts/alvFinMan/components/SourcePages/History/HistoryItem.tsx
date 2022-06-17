

import * as React from 'react';

import styles from './History.module.scss';
import stylesP from '../SourcePages.module.scss';

import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { IFMSearchType, SearchTypes } from '../../DataInterface';
import { IAnyContent, IDeepLink, ISearchObject } from '../../IAlvFinManProps';
import { getHighlightedText } from '../../Elements/HighlightedText';

const novalue = 'novalue';

export function createHistoryRow( item: IDeepLink , searchText: string, onClick: any, jumpToDeepLink: any ) {

    const row = <tr className={ styles.historyItem }>
        <td onClick={ () => jumpToDeepLink( item )} className={ stylesP.itemIcon } style={{ cursor: 'pointer' }}><Icon iconName='History'></Icon></td>

        <td title="Time">{ item.timeLabel }</td>
        <td title="Main" style={{ fontWeight: 600, color: 'darkred' }}>{ getHighlightedText( `${ item.main }`, searchText )  }</td>
        <td title="Secondary"  style={{ fontWeight: 600, color: 'darkgreen' }}>{  getHighlightedText( `${ item.second }`, searchText )  }</td>
        <td style={{ display: 'flex' }}>
            <div style={{paddingRight: '20px' }}>Filtering:</div>
            <div title="Search Text" className={styles.marginRight15} style={{ fontWeight: 600, color: 'darkblue' }}>{  !item.deep1 ? 'No text' : getHighlightedText( `${ item.deep1 }`, searchText )  }</div>
            <div title="Buttons" className={ '' } style={{ fontWeight: 600, color: 'darkviolet' }}>{  !item.deep2 ? 'No buttons' : getHighlightedText( `${ decodeURIComponent(item.deep2) }`, searchText )  }</div>
        </td>

    </tr>;

    return row;

}