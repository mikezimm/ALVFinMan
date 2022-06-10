

import * as React from 'react';
import { IAlvAccountsProps, IAlvAccountsState, } from './IAlvAccountsProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Web, ISite } from '@pnp/sp/presets/all';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";


import { Panel, IPanelProps, IPanelStyleProps, IPanelStyles, PanelType } from 'office-ui-fabric-react/lib/Panel';

import { Pivot, PivotItem, IPivotItemProps, PivotLinkFormat, PivotLinkSize,} from 'office-ui-fabric-react/lib/Pivot';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";

import styles from './Account.module.scss';

import { ISearchPageProps, ISearchPageState, } from '../Search/ISearchPageProps';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { DefaultButton, PrimaryButton, CompoundButton, Stack, IStackTokens, elementContains, divProperties } from 'office-ui-fabric-react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { IFMSearchType, SearchTypes } from '../DataInterface';
import { IAnyContent, ISearchObject } from '../IAlvFinManProps';
import { getHighlightedText } from '../Elements/HighlightedText';

export function createAccountRow( item: IAnyContent , searchText: string, onClick: any ) {

    const row = <div className={ styles.accountItem }>
        <div><Icon iconName={ SearchTypes.objs[item.typeIdx].icon }></Icon></div>

        <div className={ styles.accountDetails}>
        <div className={ styles.accountRow1 } style={{cursor: item.searchHref ? 'pointer' : null }} onClick = { onClick }>
            <div title="OneStream Account / HFM Account">{ getHighlightedText( `${ item.Title } / ${ item.HFMAccount }`, searchText )  }</div>
            <div title="ALGroup">{  getHighlightedText( `${ item.ALGroup }`, searchText )  }</div>
            <div title="SubCategory">{  getHighlightedText( `${ item.SubCategory }`, searchText )  }</div>
            <div title="Name">{  getHighlightedText( `${ item.Name1 }`, searchText )  }</div>
        </div>
        <div className={ styles.accountRow2}>
            <div>{  getHighlightedText( `${ item.Description }`, searchText )  }</div>
            <div>{  getHighlightedText( `${ item['RCM'] }`, searchText )  }</div>
        </div>
        </div>
    </div>;

    return row;

}