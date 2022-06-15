import * as React from 'react';
import stylesA from '../AlvFinMan.module.scss';
import styles from './Entity.module.scss';

import { IEntitysProps, IEntitysState, } from './IEntityProps';
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


import { createEntityRow } from './EntityItem';
import { IEntityContent } from '../IAlvFinManProps';

export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //

const pivotStyles = {
  root: {
    whiteSpace: "normal",
    marginTop: '30px',
    color: 'white',
  //   textAlign: "center"
  }};

export default class AlvEntitys extends React.Component<IEntitysProps, IEntitysState> {


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


public constructor(props:IEntitysProps){
  super(props);

  this.state = {
    refreshId: this.props.refreshId,
    filtered: this.props.items,
    slideCount: 20,
    topSearch: [],
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

  public render(): React.ReactElement<IEntitysProps> {

    const search = this.props.search;
    
    let topSearch: any[] = [];  //All major future to be grid components

    search.entities.map( searchObject => {
      let classNames = [ styles.button ];
      if ( this.state.topSearch.indexOf( searchObject ) > -1 ) { classNames.push( styles.isSelected ) ; }
      topSearch.push( <div className={ classNames.join(' ') } style={ null }  onClick={ this._clickTop.bind( this, searchObject )}>{ searchObject }</div> );
    });

    const topSearchContent = <div className={ styles.topSearch } style={ { background : this.props.debugMode === true ? 'pink' : null }} >{ topSearch }</div>;

    let filtered = [];
    this.state.filtered.map( entity => {
      if ( filtered.length < this.state.slideCount ) {
        filtered.push( createEntityRow( entity, this.state.searchText, null ));

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
        { 'Searching ' + this.state.filtered.length + ' entities' }
        { this.state.searchTime === null ? '' : ' ~ Time ' + this.state.searchTime + ' ms' }
        { /* 'Searching ' + (this.state.searchType !== 'all' ? this.state.filteredTiles.length : ' all' ) + ' items' */ }
      </div>
      
      <div className={ [ stylesA.searchStatus, styles.goToLink ].join(' ')} onClick={ () => { window.open( `${this.props.primarySource.webUrl}${this.props.primarySource.webRelativeLink}`,'_blank' ) ; } }>
        Go to full list
      </div>

    </div>;

      const debugContent = this.props.debugMode !== true ? null : <div>
        App in debugMode - Change in Web Part Properties - Page Preferences.  <b><em>Currently in EntitysPage</em></b>
      </div>;

    return (
      <div className={ stylesA.alvFinMan }>
        {/* <div className={ styles.container }> */}
          <div className={ stylesA.row }>
            {/* <div className={ styles.column }> */}
              { debugContent }
              { this.state.searchTime }
              { searchBox }
              { topSearchContent }
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
  
  private _clickTop( item: string, event ) {

    let selected: string[] = this.toggleSearchInArray( this.state.topSearch, item , event.ctrlKey === true ? 'multi' : 'single' );
    console.log('_clickTop:', item, selected );

    let startingItems: IEntityContent[] = this.props.items;
    let filtered: IEntityContent[] = this.getFilteredItems( startingItems, this.state.searchText, selected, );

    this.setState({ topSearch: selected , filtered: filtered });

    //https://stackoverflow.com/a/40493291
    this.updateParentDeeplinks( this.state.searchText, selected );

  }

  private toggleSearchInArray( searchArray: string[], value: string, doThis: 'multi' | 'single' ) {

    let selected: string[] = JSON.parse(JSON.stringify( searchArray ));
    const idx = selected.indexOf( value );
    if ( doThis === 'multi' ) {
      if ( idx < 0 ) { selected.push( value ) ; } else { delete selected[ idx ] ; }
    } else if ( doThis === 'single' ) {
      if ( selected.length > 1 ) {
        selected = [ value ] ;  }
      else if ( idx < 0 ) { selected = [ value ] ; }
      else if ( idx > -1 ) { selected = [ ] ; }
      else { alert( 'toggleSearchInArrayError'); console.log('toggleSearchInArray Not triggered:', value, doThis, searchArray, ) ; }
    }
  
    return selected;
  
  }

  
  private getFilteredItems( startingItems: IEntityContent[], text: string, top: string[]  ) {

    let filteredItems : IEntityContent[] = [];

    startingItems.map( item => {

      let passMe = true;

      //Hiding this if I only go with simple text search
      // if ( top.length > 0 && passMe === true ) { 
      //   let passThis: boolean = false;
      //   item.topSearch.map( test => {
      //     if ( top.indexOf( test ) > -1 ) { passThis = true ; }
      //   });
      //   if ( passThis === false ) { passMe = false; }
      // }

      //Separate logic from SearchPage.tsx search... this looks at the searchTextLC for simpler execution
      if ( top.length > 0 && passMe === true ) { 
        let passThis: any = false;
        top.map( topTest => {
          if ( item.searchTextLC.indexOf( topTest.toLowerCase() ) > -1 ) { passThis = true ; }
        });
        if ( passThis === false ) { passMe = false; }
      }

      if ( passMe === true && text && text.length > 0 ) { 
        if ( item.searchTextLC.indexOf( text.toLowerCase() ) < 0 ) { passMe = false; }

      }

      if ( passMe === true ) { filteredItems.push ( item ) ; }
    });

    console.log(' filteredItems: ', filteredItems );
    return filteredItems;
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

  private _onSearchChange ( NewSearch ){


    let startTime = new Date();
    const SearchValue = NewSearch.target.value;

    //https://stackoverflow.com/a/40493291

    // setTimeout(() => {
      this.updateParentDeeplinks( SearchValue, this.state.topSearch );
    // }, 1000);

    let filtered: IEntityContent[] = this.getFilteredItems( this.props.items, NewSearch.target.value, this.state.topSearch, );

    let endTime = new Date();
    let totalTime = endTime.getTime() - startTime.getTime();

    if ( !SearchValue ) {

      this.setState({ filtered: filtered, searchText: '', searchTime: totalTime });
    } else {

      this.setState({ filtered: filtered, searchText: SearchValue, searchTime: totalTime });
    }

  }

  private updateParentDeeplinks( searchText: string, topLinks: string[]) {
    var deepLink2 = encodeURIComponent(JSON.stringify( topLinks ));
    this.props.bumpDeepLinks( 'copyLast', 'copyLast', [searchText, deepLink2 ] );
  }

}
