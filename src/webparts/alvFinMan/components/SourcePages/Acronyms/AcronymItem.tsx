

import * as React from 'react';

import styles from './Acronym.module.scss';
import stylesP from '../SourcePages.module.scss';

import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { IFMSearchType, SearchTypes } from '../../DataInterface';
import { IAcronymContent, IAnyContent, ISearchObject } from '../../IAlvFinManProps';
import { getHighlightedText } from '../../Elements/HighlightedText';

export function createAcronymRow( item: IAcronymContent , searchText: string, onClick: any ) {

    const row = <div className={ styles.acronymItem }>
        <div className={ stylesP.itemIcon }><Icon iconName={ SearchTypes.objs[item.typeIdx].icon }></Icon></div>

        <div className={ styles.acronymDetails}>
            <div className={ styles.acronymRow1 } style={{cursor: item.searchHref ? 'pointer' : null }} onClick = { onClick }>
                <div title='Item ID'>{ item.ID }</div>
                <div title="Acronym">{  getHighlightedText( `${ item.Title }`, searchText )  }</div>
                <div title="Short Description">Description:&nbsp;&nbsp;{ !item.Description ? '---' : getHighlightedText( `${ item.Description }`, searchText )  }</div>
            </div>
            <div className={ styles.acronymRow2}>
                <div title="LongDefinition">Definition:&nbsp;&nbsp;{  !item.LongDefinition ? '---' : getHighlightedText( `${ item.LongDefinition }`, searchText )  }</div>
                <div title="Related to" style={{paddingLeft: '30px' }}>Related to:&nbsp;&nbsp;{ !item.SearchWords ? '' : getHighlightedText( `${ item.SearchWords }`, searchText )  }</div>
            </div>
        </div>
    </div>;

    return row;

}