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

import { Panel, IPanelProps, IPanelStyleProps, IPanelStyles, PanelType } from 'office-ui-fabric-react/lib/Panel';

import { Pivot, PivotItem, IPivotItemProps, PivotLinkFormat, PivotLinkSize,} from 'office-ui-fabric-react/lib/Pivot';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";

import * as strings from 'AlvFinManWebPartStrings';

import ReactJson from "react-json-view";

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';
import { getAccounts } from '../DataFetch';

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

  this.state = {
    refreshId: this.props.refreshId,
    filtered: this.props.accounts,
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
        leftSearch.push( <div className={ stylesS.button } style={ null } >{ searchObject.Search }</div> );
      });

      const leftSearchContent = <div className={ null } style={ null } >{ leftSearch }</div>;

      let filtered = [];
      this.state.filtered.map( account => {
        if ( filtered.length < this.state.slideCount ) {
          filtered.push( <div>
            <li>{ this.getHighlightedText( `${ account.Title } - ${ account.Name1 } - ${ account.Description }`, this.state.searchText )  }</li>
          </div>);
        }
      });


      search.top.Objects.map( searchObject => {
        topSearch.push( <div className={ stylesS.button } style={ null } >{ searchObject.Search }</div> );
      });

      const topSearchContent = <div className={ stylesS } style={ null } >{ topSearch }</div>;
  
  
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
  
      return (
        <div className={ styles.alvFinMan }>
          <div className={ styles.container }>
            <div className={ styles.row }>
              <div className={ styles.column }>
                {/* { this.props.fetchTime } */}
                { searchBox }
                { filtered }
                { topSearchContent }
                { leftSearchContent }
                {/* { componentPivot }
                { showPage }
                { userPanel } */}
              </div>
            </div>
          </div>
        </div>
      );

    }

  }

  // private pivotMainClick( temp ) {
  //   console.log('pivotMainClick:', temp.props.itemKey );

  //   this.setState({ 
  //     mainPivotKey: temp.props.itemKey, 
  //     bucketClickKey: '', //Clear bucketItemClick for new page
  //   });
  // }

  // private clickBucketItem( pivot, leftMenu, ex ) {
  //   console.log('clickBucketItem:', pivot, leftMenu );
  //   this.setState({ bucketClickKey: leftMenu });
  // }

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

  private _onSearchChange ( NewSearch: string ){
  
    if ( !NewSearch ) {
      this.setState({ filtered: this.props.accounts, searchText: '', searchTime: null });
    } else {

      let startTime = new Date();
      let filtered: any[] = [];
      let NewSearchLC = NewSearch.toLowerCase();
      this.props.accounts.map( account => {
        if ( account.searchTextLC.indexOf( NewSearchLC ) > -1 ) {
          filtered.push( account );
        }
      });
  
      
      let endTime = new Date();

      let totalTime = endTime.getTime() - startTime.getTime();

      this.setState({ filtered: filtered, searchText: NewSearch, searchTime: totalTime });
    }

  }

}
