

import * as React from 'react';

import styles from './Form.module.scss';
import stylesP from '../SourcePages.module.scss';

import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { IFMSearchType, SearchTypes } from '../../DataInterface';
import { IFormContent, IAnyContent, ISearchObject } from '../../IAlvFinManProps';
import { getHighlightedText } from '../../Elements/HighlightedText';

export function createFormRow( item: IFormContent , searchText: string, onClick: any ) {

    const row = <div className={ styles.formItem }>
        <div className={ stylesP.itemIcon }><Icon iconName={ SearchTypes.objs[item.typeIdx].icon }></Icon></div>

        <div className={ styles.formDetails}>
            <div className={ styles.formRow1 } style={{cursor: item.searchHref ? 'pointer' : null }} onClick = { onClick }>
                <div title='Item ID'>{ item.ID }</div>
                <div title="Form">{  getHighlightedText( `${ item.Title }`, searchText )  }</div>
                <div title="Short Description">{ !item.Description ? '---' : getHighlightedText( `${ item.Description }`, searchText )  }</div>
            </div>
            <div className={ styles.formRow2}>
                <div title="Related to">Related Forms:&nbsp;&nbsp;{  !item.RelatedForms ? '---' : getHighlightedText( `${ item.RelatedForms.map( form => { return form.Title ; }).join('; ') }`, searchText )  }</div>
            </div>
        </div>
    </div>;

    return row;

}