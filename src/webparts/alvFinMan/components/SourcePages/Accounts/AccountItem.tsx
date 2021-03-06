

import * as React from 'react';

import styles from './Account.module.scss';
import stylesSP from '../SourcePages.module.scss';

import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { IFMSearchType, SearchTypes } from '../../DataInterface';
import { IAnyContent, ISearchObject } from '../../IAlvFinManProps';
import { getHighlightedText } from '../../Elements/HighlightedText';

export function createAccountRow( item: IAnyContent , searchText: string, onClick: any ) {

    const row = <div className={ styles.accountItem }>
        <div className={ stylesSP.itemIcon }><Icon iconName={ SearchTypes.objs[item.typeIdx].icon }></Icon></div>

        <div className={ styles.accountDetails}>
        <div className={ styles.accountRow1 } style={{cursor: item.searchHref ? 'pointer' : null }} onClick = { onClick }>
            <div title="OneStream Account / HFM Account">{ getHighlightedText( `${ item.Title } / ${ item.HFMAccount }`, searchText )  }</div>
            <div title="ALGroup">{  getHighlightedText( `${ item.ALGroup }`, searchText )  }</div>
            <div title="SubCategory">{  getHighlightedText( `${ item.SubCategory }`, searchText )  }</div>
            <div title="Name">{  getHighlightedText( `${ item.Name1 }`, searchText )  }</div>
        </div>
        <div className={ styles.accountRow2}>
            <div>{  getHighlightedText( `${ item.Description }`, searchText )  }</div>
            <div>{  item['RCM'] ? getHighlightedText( `${ item['RCM'] }`, searchText ) : '' }</div>
        </div>
        </div>
    </div>;

    return row;

}