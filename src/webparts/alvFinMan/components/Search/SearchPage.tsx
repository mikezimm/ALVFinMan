import * as React from 'react';
import styles from '../AlvFinMan.module.scss';
import stylesS from './Search.module.scss';

import { ISearchPageProps, ISearchPageState, } from './ISearchPageProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Web, ISite } from '@pnp/sp/presets/all';


import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { DefaultButton, PrimaryButton, CompoundButton, Stack, IStackTokens, elementContains, divProperties } from 'office-ui-fabric-react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { Panel, IPanelProps, IPanelStyleProps, IPanelStyles, PanelType } from 'office-ui-fabric-react/lib/Panel';

import { Pivot, PivotItem, IPivotItemProps, PivotLinkFormat, PivotLinkSize,} from 'office-ui-fabric-react/lib/Pivot';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";

import * as strings from 'AlvFinManWebPartStrings';

import ReactJson from "react-json-view";

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';
import { getAccounts, IFMSearchType, SearchTypes } from '../DataFetch';
import { IAnyContent, ISearchObject } from '../IAlvFinManProps';
import { NoItems } from '@mikezimm/npmfunctions/dist/Icons/iconNames';

export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //

const consoleLineItemBuild: boolean = false;

const thisSelect = ['*','ID','FileRef','FileLeafRef','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','CheckoutUserId','HasUniqueRoleAssignments','Title','FileSystemObjectType','FileSizeDisplay','FileLeafRef','LinkFilename','OData__UIVersion','OData__UIVersionString','DocIcon'];



const LookupColumns: string[] = ['Functions/Title', 'Topics/Title', 'ALGroup/Title', 'Sections/Title','Processes/Title' ];

const pivotStyles = {
  root: {
    whiteSpace: "normal",
    marginTop: '30px',
    color: 'white',
  //   textAlign: "center"
  }};

// const pivotHeading0 : ILayoutMPage = 'Main';
// const pivotHeading1 : ILayoutSPage = 'Statements';
// const pivotHeading2 : ILayout1Page = 'Reporting|Sections';
// const pivotHeading3 : ILayout1Page = 'Processes';
// const pivotHeading4 : ILayout1Page = 'Functions';
// const pivotHeading5 : ILayout1Page = 'Topics';

// const allPivots: ILayoutAll[] = [ pivotHeading0, pivotHeading1, pivotHeading2, pivotHeading3, pivotHeading4, pivotHeading5 ];
// const layout1Pivots : ILayout1Page[] = [ pivotHeading2, pivotHeading3, pivotHeading4, pivotHeading5 ];

// const pivotTitles = allPivots.map( pivot => { return pivot.split('|')[0] ; } );
// const pivotKeys = allPivots.map( pivot => { return pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ; } );
// const pivotItems = pivotKeys.map( ( key, idx ) => {
//   return <PivotItem headerText={ pivotTitles[idx] } ariaLabel={pivotTitles[idx]} title={pivotTitles[idx]} itemKey={ key } ></PivotItem>;
// });

// const pivotHeading6 = 'Function';

export default class SearchPage extends React.Component<ISearchPageProps, ISearchPageState> {

  /**
 * Copied from ECStorage
 * Super cool solution based on:  https://stackoverflow.com/a/43235785
 * @param text 
 * @param highlight 
 */
  private getHighlightedText(text, highlight) {
  // <div dangerouslySetInnerHTML={{ __html: this.state.showPanelItem.WikiField }} />
  // Split on highlight term and include term into parts, ignore case
  if ( !highlight ) {
    return text;

  } else {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return <span> { parts.map((part, i) => 
      <span key={i} style={part.toLowerCase() === highlight.toLowerCase() ? { fontWeight: 'bold', backgroundColor: 'yellow' } : {} }>
        { part }
      </span>)
    } </span>;
  }

}

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


public constructor(props:ISearchPageProps){
  super(props);
  // console.log('pivotTitles', pivotTitles );
  // console.log('pivotKeys', pivotKeys );

  let filtered = [ ...this.props.appLinks, ...this.props.docs, ...this.props.stds, ...this.props.sups, ...this.props.accounts, ];

  this.state = {
    refreshId: this.props.refreshId,
    filtered: filtered,
    slideCount: 20,
    sortNum: 'asc',
    sortName: '-',
    sortGroup: '-',
    searchTime: null,
    searchText: '',

    topSearch: [],
    leftSearch: [],
    typeSearch: [],

  };
}

public componentDidMount() {
  this.updateWebInfo(  );
}


public componentDidUpdate(prevProps){
    //Just rebuild the component
    if ( this.props.refreshId !== prevProps.refreshId ) {
      let filtered = [ ...this.props.appLinks, ...this.props.docs, ...this.props.stds, ...this.props.sups, ...this.props.accounts, ];
      this.setState({ refreshId: this.props.refreshId, filtered: filtered });
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

  public render(): React.ReactElement<ISearchPageProps> {

    if ( this.props.mainPivotKey !== 'Search' ) {
      return null;

    } else {

      // debugger;

      const search = this.props.search;

      console.log('Rendering Search Page');

      let content: any[] = [];  //All major future to be grid components
      let leftSearch: any[] = [];  //All major future to be grid components
      let topSearch: any[] = [];  //All major future to be grid components
      let typeSearch: any[] = [];  //All major future to be grid components
    
      search.left.Objects.map( searchObject => {
        let classNames = [ stylesS.button ];
        if ( this.state.leftSearch.indexOf( searchObject.Search ) > -1 ) { classNames.push( stylesS.isSelected ) ; }
        leftSearch.push( <div className={ classNames.join(' ') } style={ null } onClick={ this._clickLeft.bind( this, searchObject )}>{ searchObject.Search }</div> );
      });

      const leftSearchContent = <div className={ stylesS.leftSearch } style={ null } >{ leftSearch }</div>;

      search.top.Objects.map( searchObject => {
        let classNames = [ stylesS.button ];
        if ( this.state.topSearch.indexOf( searchObject.Search ) > -1 ) { classNames.push( stylesS.isSelected ) ; }
        topSearch.push( <div className={ classNames.join(' ') } style={ null }  onClick={ this._clickTop.bind( this, searchObject )}>{ searchObject.Search }</div> );
      });

      const topSearchContent = <div className={ stylesS.topSearch } style={ null } >{ topSearch }</div>;

      let cmdButtonCSS = JSON.parse(JSON.stringify( this.props.cmdButtonCSS ));

      search.type.SearchCount.map( ( count, idx ) => {
        if ( count > 0 ) {
          let typeObj = SearchTypes.objs[idx];
          let classNames = [ stylesS.cmdButton ];
          if ( this.state.typeSearch.indexOf( typeObj.key ) > -1 ) { classNames.push( stylesS.isSelected ) ; }

          typeSearch.push( <div className={ classNames.join(' ') } style={ null }  onClick={ this._clickType.bind( this, typeObj )} title={ typeObj.title }>
            <Icon iconName={ typeObj.icon }></Icon>
            </div> );
        }

      });

      const typeSearchContent = <div className={ stylesS.typeSearch } style={ null } >{ typeSearch }</div>;

      /*https://developer.microsoft.com/en-us/fabric#/controls/web/searchbox*/
      let searchBox =  
      <div className={[styles.searchContainer, styles.padLeft20 ].join(' ')} >
        <SearchBox
          className={styles.searchBox}
          styles={{ root: { maxWidth:250 } }}
          placeholder="Search"
          onSearch={ this._onSearchChange.bind(this) }
          onFocus={ () => console.log('this.state',  this.state) }
          onBlur={ () => console.log('onBlur called') }
          onChange={ this._onSearchChange.bind(this) }
        />
        <div className={styles.searchStatus}>
          { 'Searching ' + this.state.filtered.length + ' accounts' }
          { this.state.searchTime === null ? '' : ' ~ Time ' + this.state.searchTime + ' ms' }
          { /* 'Searching ' + (this.state.searchType !== 'all' ? this.state.filteredTiles.length : ' all' ) + ' items' */ }
        </div>
      </div>;

      let filtered = [];
      this.state.filtered.map( ( item: IAnyContent ) => {
        if ( filtered.length < this.state.slideCount ) {
          if ( item.type === 'account' ) {
            filtered.push( <div className={ stylesS.listItem }>
              <div><Icon iconName={ SearchTypes.objs[item.typeIdx].icon }></Icon></div>

              <div className={ stylesS.accountDetails}>
                <div className={ stylesS.accountRow1 } style={{cursor: item.searchHref ? 'pointer' : null }} onClick = { this._onClickItem.bind( this, item ) }>
                  <div title="Account Number">{ this.getHighlightedText( `${ item.Title }`, this.state.searchText )  }</div>
                  <div title="ALGroup">{ this.getHighlightedText( `${ item.ALGroup }`, this.state.searchText )  }</div>
                  <div title="SubCategory">{ this.getHighlightedText( `${ item.SubCategory }`, this.state.searchText )  }</div>
                  <div title="Name">{ this.getHighlightedText( `${ item.Name1 }`, this.state.searchText )  }</div>
                </div>
                <div className={ stylesS.accountRow2}>
                  <div>{ this.getHighlightedText( `${ item.Description }`, this.state.searchText )  }</div>
                  <div>{ this.getHighlightedText( `${ item['RCM'] }`, this.state.searchText )  }</div>
                </div>
              </div>
            </div>);
          } else {
            filtered.push( <div className={ stylesS.listItem }>
              <div><Icon iconName={ SearchTypes.objs[item.typeIdx].icon }></Icon></div>
              <div style={{cursor: 'pointer'}} onClick = { this._onClickItem.bind( this, item ) }>
                { this.getHighlightedText( `${ item.searchTitle } - ${ item.searchDesc }`, this.state.searchText )  }</div>
            </div>);
          }

        }
      });

      let filteredContent = <div className={ stylesS.listItems }>
          { filtered }
        </div>;
  
      return (
        <div className={ stylesS.searchPage }>
          {/* <div className={ styles.container }>
            <div className={ styles.row }>
              <div className={ styles.column }> */}
                {/* { this.props.fetchTime } */}
                { searchBox }

                { topSearchContent }
                <div className={ stylesS.itemsRow }>
                  { leftSearchContent }
                  { filteredContent }
                  { typeSearchContent }

                </div>



                {/* { componentPivot }
                { showPage }
                { userPanel } */}
              {/* </div>
            </div>
          </div> */}
        </div>
      );

    }

  }

  private getFilteredItems( startingItems: IAnyContent[], text: string, top: string[], left: string[], type: string[],  ) {

    let filteredItems : IAnyContent[] = [];

    startingItems.map( item => {

      let passMe = true;
      let passLeft: boolean = true;
      let passTop: boolean = true;
      let passType: boolean = true;
      let passText: boolean = true;

      if ( left.length > 0 ) { 
        let passThis: boolean = false;
        item.leftSearch.map( test => {
          if ( left.indexOf( test ) > -1 ) { passThis = true ; }
        });
        if ( passThis === false ) { passMe = false; }
      }

      if ( top.length > 0 && passMe === true ) { 
        let passThis: boolean = false;
        item.topSearch.map( test => {
          if ( top.indexOf( test ) > -1 ) { passThis = true ; }
        });
        if ( passThis === false ) { passMe = false; }
      }

      if ( type.length > 0 && passMe === true ) { 
        if ( type.indexOf( item.type ) < 0 ) { passMe = false; }

      }

      if ( passMe === true && text && text.length > 0 ) { 
        if ( item.searchTextLC.indexOf( text.toLowerCase() ) < 0 ) { passMe = false; }

      }

      if ( passMe === true ) { filteredItems.push ( item ) ; }
    });

    console.log(' filteredItems: ', filteredItems );
    return filteredItems;
  }
  // private pivotMainClick( temp ) {
  //   console.log('pivotMainClick:', temp.props.itemKey );

  //   this.setState({ 
  //     mainPivotKey: temp.props.itemKey, 
  //     bucketClickKey: '', //Clear bucketItemClick for new page
  //   });
  // }

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



  //onClick = { this._onClickItem.bind( this, key, title ) }
  // private clickBucketItem( pivot, leftMenu, ex ) {
  //   console.log('clickBucketItem:', pivot, leftMenu );
  //   this.updateWebInfo( this.state.mainPivotKey, leftMenu );
  //   // this.setState({ bucketClickKey: leftMenu });
  // }
  private _onClickItem( item: IAnyContent, event ) {
    if ( item.searchHref ) {
      window.open( item.searchHref, '_blank' );
    } else {
      console.log('No link to click:', item );
    }
  }

  private _clickLeft( item: ISearchObject, event ) {

    let selected: string[] = this.toggleSearchInArray( this.state.leftSearch, item.Search , event.ctrlKey === true ? 'multi' : 'single' );
    console.log('_clickLeft: selected', selected );

    let startingItems: IAnyContent[] = [ ...this.props.appLinks, ...this.props.docs, ...this.props.stds, ...this.props.sups, ...this.props.accounts, ];
    let filtered: IAnyContent[] = this.getFilteredItems( startingItems, this.state.searchText, this.state.topSearch, selected, this.state.typeSearch );
    this.setState({ leftSearch: selected , filtered: filtered });
  }

  private _clickTop( item: ISearchObject, event ) {

    console.log('clickBucketItem:', item );
    let selected: string[] = this.toggleSearchInArray( this.state.topSearch, item.Search , event.ctrlKey === true ? 'multi' : 'single' );

    let startingItems: IAnyContent[] = [ ...this.props.appLinks, ...this.props.docs, ...this.props.stds, ...this.props.sups, ...this.props.accounts, ];
    let filtered: IAnyContent[] = this.getFilteredItems( startingItems, this.state.searchText, selected, this.state.leftSearch, this.state.typeSearch );

    this.setState({ topSearch: selected , filtered: filtered });
  }

  private _clickType( item: IFMSearchType, event ) {

    console.log('clickBucketItem:', item );
    let selected: string[] = this.toggleSearchInArray( this.state.typeSearch, item.key , event.ctrlKey === true ? 'multi' : 'single' );

    let startingItems: IAnyContent[] = [ ...this.props.appLinks, ...this.props.docs, ...this.props.stds, ...this.props.sups, ...this.props.accounts, ];
    let filtered: IAnyContent[] = this.getFilteredItems( startingItems, this.state.searchText, this.state.topSearch, this.state.leftSearch, selected );

    this.setState({ typeSearch: selected , filtered: filtered });
  }

  // private clickDocumentItem( pivot, leftMenu, item, title ) {
  //   console.log('clickDocumentItem:', pivot, leftMenu, item );
  //   this.setState({ showItemPanel: true, showPanelItem: item });
  // }

  // private _onClosePanel( ) {
  //   this.setState({ showItemPanel: false, showPanelItem: null });
  // }

  // private linkClick( this ) {

  //   console.log('linkClick', this);
  //   console.log('linkClick href', this, this.href);
  // }

  
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
  
    let startingItems: IAnyContent[] = [ ...this.props.appLinks, ...this.props.docs, ...this.props.stds, ...this.props.sups, ...this.props.accounts, ];
    let filtered: IAnyContent[] = [];
    let totalTime: number = 0;

    let searchText = NewSearch && NewSearch.target && NewSearch.target.value ? NewSearch.target.value : '';
    if ( !searchText ) {
      searchText = '';
      filtered = this.getFilteredItems( startingItems, '', this.state.topSearch, this.state.leftSearch, this.state.typeSearch );

    } else {

      let startTime = new Date();
      let NewSearchLC = searchText.toLowerCase();
      filtered = this.getFilteredItems( startingItems, NewSearchLC, this.state.topSearch, this.state.leftSearch, this.state.typeSearch );

      let endTime = new Date();

      totalTime = endTime.getTime() - startTime.getTime();
      console.log('Search Time:', totalTime );

    }

    this.setState({ searchText: searchText , filtered: filtered, searchTime: totalTime });

  }

}
