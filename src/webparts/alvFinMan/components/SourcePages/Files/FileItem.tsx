

import * as React from 'react';

import stylesF from './File.module.scss';
import stylesP from '../SourcePages.module.scss';

import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { IFMSearchType, SearchTypes } from '../../DataInterface';
import { IPagesContent, IAnyContent, ISearchObject } from '../../IAlvFinManProps';
import { getHighlightedText } from '../../Elements/HighlightedText';

export function createFileRow( item: IPagesContent , searchText: string, onClick: any ) {

    const row = <div className={ stylesF.fileItem }>
        <div className={ stylesP.itemIcon }><Icon iconName={ SearchTypes.objs[item.typeIdx].icon } onClick = { () => onClick( item.ID, 'files', item ) }></Icon></div>

        <div className={ stylesF.fileDetails}>
            <div className={ stylesF.fileRow1 } style={{cursor: item.searchHref ? 'pointer' : null }} onClick = { () => onClick( item.ID, 'files', item ) }>
                <div title='Item ID'>{ item.ID }</div>
                <div title="FileName">{  getHighlightedText( `${ item.fileDisplayName }`, searchText )  }</div>
            </div>
            <div className={ stylesF.fileRow2}>
                {/* <div title="Description">Description:&nbsp;&nbsp;{ !item.Description ? '---' : getHighlightedText( `${ item.Description }`, searchText )  }</div> */}
                <div title="Description">{ !item.Description ? '---' : getHighlightedText( `${ item.Description }`, searchText )  }</div>
                {/* <div title="Related to" style={{paddingLeft: '30px' }}>Related to:&nbsp;&nbsp;{ !item.SearchWords ? '' : getHighlightedText( `${ item.SearchWords }`, searchText )  }</div> */}
            </div>
        </div>
    </div>;

    return row;

}