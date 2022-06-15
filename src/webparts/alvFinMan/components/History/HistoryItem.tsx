

import * as React from 'react';
import { IHistoryProps, IHistoryState, } from './IHistoryProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Web, ISite } from '@pnp/sp/presets/all';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";


import { Panel, IPanelProps, IPanelStyleProps, IPanelStyles, PanelType } from 'office-ui-fabric-react/lib/Panel';

import { Pivot, PivotItem, IPivotItemProps, PivotLinkFormat, PivotLinkSize,} from 'office-ui-fabric-react/lib/Pivot';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";

import styles from './History.module.scss';

import { ISearchPageProps, ISearchPageState, } from '../Search/ISearchPageProps';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { DefaultButton, PrimaryButton, CompoundButton, Stack, IStackTokens, elementContains, divProperties } from 'office-ui-fabric-react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { IFMSearchType, SearchTypes } from '../DataInterface';
import { IAnyContent, IDeepLink, ISearchObject } from '../IAlvFinManProps';
import { getHighlightedText } from '../Elements/HighlightedText';

const novalue = 'novalue';

export function createHistoryRow( item: IDeepLink , searchText: string, onClick: any ) {
    // let controller1 = item.Controller1  === null || item.Controller1  === undefined ||  item.Controller1.length === 0 ? 'None assigned' : item.Controller1[0].Title;

    const row = <tr className={ styles.historyItem }>
        <td><Icon iconName='History'></Icon></td>

        {/* <div className={ styles.historyDetails}> */}
        {/* <div className={ styles.historyRow1 } style={{cursor: item.searchHref ? 'pointer' : null }} onClick = { onClick }> */}
        {/* <tr className={ styles.historyRow1 } style={{  }} onClick = { null }> */}
        <td title="Time">{ item.timeLabel }</td>
        <td title="Main">{ getHighlightedText( `${ item.main }`, searchText )  }</td>
        <td title="Secondary" style={ null }>{  getHighlightedText( `${ item.second }`, searchText )  }</td>
        <td style={{ display: 'flex' }}>
            <div style={{paddingRight: '20px' }}>Searched:</div>
            <div title="Search" className={styles.marginRight15}>{  !item.deep1 ? 'No text' : getHighlightedText( `${ item.deep1 }`, searchText )  }</div>
            <div title="Button" className={ '' }>{  !item.deep2 ? 'No buttons' : getHighlightedText( `${ decodeURIComponent(item.deep2) }`, searchText )  }</div>
        </td>

        {/* </tr> */}
        {/* <div className={ styles.historyRow2}>
            <div title="Controller1">Controller:&nbsp;&nbsp;{  !item.Controller1 ? 'None assigned' : getHighlightedText( `${ item.Controller1.Title }`, searchText )  }</div>
            <div title="Controller2">Backups:&nbsp;&nbsp;{  !item.Controller2 ? 'None assigned' : getHighlightedText( `${ item.Controller2.map( controller => { return controller.Title ; }).join('; ')}`, searchText )  }</div>
        </div> */}
        {/* </div> */}
    </tr>;

    return row;

}