import * as React from 'react';
import stylesA from '../AlvFinMan.module.scss';
import styles from './Acronym.module.scss';

import { IAlvAcronymsProps, IAlvAcronymsState, } from './IAlvAcronymProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Web, ISite } from '@pnp/sp/presets/all';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { DefaultButton, PrimaryButton, CompoundButton, Stack, IStackTokens, elementContains, divProperties } from 'office-ui-fabric-react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

import { Panel, IPanelProps, IPanelStyleProps, IPanelStyles, PanelType } from 'office-ui-fabric-react/lib/Panel';

import * as strings from 'AlvFinManWebPartStrings';

import ReactJson from "react-json-view";


import { createAcronymRow } from './AcronymItem';

export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //

const pivotStyles = {
  root: {
    whiteSpace: "normal",
    marginTop: '30px',
    color: 'white',
  //   textAlign: "center"
  }};

export default class AlvAcronyms extends React.Component<IAlvAcronymsProps, IAlvAcronymsState> {


  private LastSearch = '';

/***
 *          .o88b.  .d88b.  d8b   db .d8888. d888888b d8888b. db    db  .o88b. d888888b  .d88b.  d8888b. 
 *         d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~' 88  `8D 88    88 d8P  Y8 `~~88~~' .8P  Y8. 88  `8D 
 *         8P      88    88 88V8o 88 `8bo.      88    88oobY' 88    88 8P         88    88    88 88oobY' 
 *         8b      88    88 88 V8o88   `Y8b.    88    88`8b   88    88 8b         88    88    88 88`8b   
 *         Y8b  d8 `8b  d8' 88  V888 db   8D    88    88 `88. 88b  d88 Y8b  d8    88    `8b  d8' 88 `88. 
 *          `Y88P'  `Y88P'  VP   V8P `8888Y'    YP    88   YD ~Y8888P'  `Y88P'    YP     `Y88P'  88   YD 
 *                                                                                                       
 *                                                                                                       
 */


 //Standards are really site pages, supporting docs are files


public constructor(props:IAlvAcronymsProps){
  super(props);

  this.state = {
    refreshId: this.props.refreshId,
    filtered: this.props.items,
    topSearch: [],
    slideCount: 20,
    sortNum: 'asc',
    sortName: '-',
    sortGroup: '-',
    searchTime: null,
    searchText: '',
  };
}

public componentDidMount() {
  this.updateWebInfo(  );
}


public componentDidUpdate(prevProps){
    //Just rebuild the component
    if ( this.props.refreshId !== prevProps.refreshId ) {
      this.setState({ refreshId: this.props.refreshId });
    }
}


public async updateWebInfo (   ) {

}

//        
  /***
 *         d8888b. d888888b d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b 
 *         88  `8D   `88'   88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     
 *         88   88    88    88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo 
 *         88   88    88    88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~ 
 *         88  .8D   .88.   88  .8D      88b  d88 88      88  .8D 88   88    88    88.     
 *         Y8888D' Y888888P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P 
 *                                                                                         
 *                                                                                         
 */

  public render(): React.ReactElement<IAlvAcronymsProps> {

    let filtered = [];
    this.state.filtered.map( item => {
      if ( filtered.length < this.state.slideCount ) {
       filtered.push( createAcronymRow( item, this.state.searchText, null ));

      }
    });

    /*https://developer.microsoft.com/en-us/fabric#/controls/web/searchbox*/
    let searchBox =  
    <div className={[stylesA.searchContainer ].join(' ')} >
      <SearchBox
        className={stylesA.searchBox}
        styles={{ root: { maxWidth:250 } }}
        placeholder="Search"
        onSearch={ this._onSearchChange.bind(this) }
        onFocus={ () => console.log('this.state',  this.state) }
        onBlur={ () => console.log('onBlur called') }
        onChange={ this._onSearchChange.bind(this) }
        onClear={ this._onSearchChange.bind(this) }
      />
      <div className={stylesA.searchStatus}>
        { 'Searching ' + this.state.filtered.length + ' accounts' }
        { this.state.searchTime === null ? '' : ' ~ Time ' + this.state.searchTime + ' ms' }
        { /* 'Searching ' + (this.state.searchType !== 'all' ? this.state.filteredTiles.length : ' all' ) + ' items' */ }
      </div>
    </div>;

      const debugContent = this.props.debugMode !== true ? null : <div>
        App in debugMode - Change in Web Part Properties - Page Preferences.  <b><em>Currently in AcronymsPage</em></b>
      </div>;

    return (
      <div className={ stylesA.alvFinMan }>
        {/* <div className={ styles.container }> */}
          <div className={ stylesA.row }>
            {/* <div className={ styles.column }> */}
              { debugContent }
              { this.props.fetchTime }
              { searchBox }
              { filtered }
              {/* { componentPivot }
              { showPage }
              { userPanel } */}
            {/* </div> */}
          </div>
        {/* </div> */}
      </div>
    );
  }

  /**
   * Source:  https://github.com/pnp/sp-dev-fx-webparts/issues/1944
   * 
   * @param NewValue 
   *   
  private sentWebUrl: string = '';
  private lastWebUrl : string = '';
  private typeGetTime: number[] = [];
  private typeDelay: number[] = [];
   */
  private delayOnSearch(NewSearch: string): void {
    //Track the url change and also record timings for testing.
    this.LastSearch = NewSearch;

    setTimeout(() => {
      if (this.LastSearch === NewSearch ) {
        this._onSearchChange( NewSearch );
      } else {

      }
    }, 1000);
  }

  // private _onWebUrlChange( newValue?: string, webURLStatus: string = null){
  //   // debounce(250, this._onWebUrlChange( newValue, webURLStatus ) );
  //   this._onWebUrlChange( newValue, webURLStatus );
  // }

  private _onSearchChange ( NewSearch ){
  
    const SearchValue = NewSearch.target.value;
    
    if ( !SearchValue ) {
      this.setState({ filtered: this.props.items, searchText: '', searchTime: null });
    } else {

      let startTime = new Date();
      let filtered: any[] = [];
      let NewSearchLC = SearchValue.toLowerCase();
      this.props.items.map( item => {
        if ( item.searchTextLC.indexOf( NewSearchLC ) > -1 ) {
          filtered.push( item );
        }
      });
  
      
      let endTime = new Date();

      let totalTime = endTime.getTime() - startTime.getTime();

      this.setState({ filtered: filtered, searchText: SearchValue, searchTime: totalTime });
    }

  }

}
