import * as React from 'react';
import styles from '../AlvFinMan.module.scss';
import { IAlvAccountsProps, IAlvAccountsState, } from './IAlvAccountsProps';
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


import { createAccountRow } from './AccountItem';

export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //

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

// const allPivots: IAllPages[] = [ pivotHeading0, pivotHeading1, pivotHeading2, pivotHeading3, pivotHeading4, pivotHeading5 ];
// const layout1Pivots : ILayout1Page[] = [ pivotHeading2, pivotHeading3, pivotHeading4, pivotHeading5 ];

// const pivotTitles = allPivots.map( pivot => { return pivot.split('|')[0] ; } );
// const pivotKeys = allPivots.map( pivot => { return pivot.split('|')[1] ? pivot.split('|')[1] : pivot.split('|')[0] ; } );
// const pivotItems = pivotKeys.map( ( key, idx ) => {
//   return <PivotItem headerText={ pivotTitles[idx] } ariaLabel={pivotTitles[idx]} title={pivotTitles[idx]} itemKey={ key } ></PivotItem>;
// });

// const sourcePivotKey = 'Function';

export default class AlvAccounts extends React.Component<IAlvAccountsProps, IAlvAccountsState> {


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


public constructor(props:IAlvAccountsProps){
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

  public render(): React.ReactElement<IAlvAccountsProps> {


    // let componentPivot = 
    // <Pivot
    //     styles={ pivotStyles }
    //     linkFormat={PivotLinkFormat.links}
    //     linkSize={PivotLinkSize.normal}
    //     // onLinkClick={this.pivotMainClick.bind(this)}
    //     onLinkClick={ this.pivotMainClick.bind(this) }
    // > 
    //   { pivotItems }

    //   {/* <PivotItem headerText={ pivotHeading0 } ariaLabel={pivotHeading0} title={pivotHeading0} itemKey={ pivotHeading0 } keytipProps={ { content: 'Hello', keySequences: ['a','b','c'] } }></PivotItem>

    //   <PivotItem headerText={ pivotHeading1 } ariaLabel={pivotHeading1} title={pivotHeading1} itemKey={ pivotHeading1 } keytipProps={ { content: 'Hello', keySequences: ['a','b','c'] } }></PivotItem>

    //   <PivotItem headerText={ pivotHeading2 } ariaLabel={pivotHeading2} title={pivotHeading2} itemKey={ pivotHeading2 } keytipProps={ { content: 'Hello', keySequences: ['a','b','c'] } }></PivotItem>

    //   <PivotItem headerText={ pivotHeading3 } ariaLabel={pivotHeading3} title={pivotHeading3} itemKey={ pivotHeading3 } keytipProps={ { content: 'Hello', keySequences: ['a','b','c'] } }></PivotItem>

    //   <PivotItem headerText={ pivotHeading4 } ariaLabel={pivotHeading4} title={pivotHeading4} itemKey={ pivotHeading4 } keytipProps={ { content: 'Hello', keySequences: ['a','b','c'] } }></PivotItem>
      
    //   <PivotItem headerText={ pivotHeading5 } ariaLabel={pivotHeading5} title={pivotHeading5} itemKey={ pivotHeading5 } keytipProps={ { content: 'Hello', keySequences: ['a','b','c'] } }></PivotItem>

    //   <PivotItem headerText={ sourcePivotKey } ariaLabel={sourcePivotKey} title={sourcePivotKey} itemKey={ sourcePivotKey } keytipProps={ { content: 'Hello', keySequences: ['a','b','c'] } }></PivotItem> */}
    // </Pivot>;

    // const layout1 = layout1Pivots.indexOf( this.state.mainPivotKey as any) > 0 ? this.state.mainPivotKey :layout1Pivots[0];
    // const showPage = 
    // <div> { this.buildLay1Page( layout1 , this.state.bucketClickKey, this.state.buckets, this.state.docs , this.state.sups ) } </div>; 

    // if ( this.state.showPanelItem && this.state.showPanelItem.WikiField ) {
    //   // const replaceString = '<a onClick=\"console.log(\'Going to\',this.href);window.open(this.href,\'_blank\')\" style="pointer-events:none" href=';
    //   const replaceString = '<a onClick=\"window.open(this.href,\'_blank\')\" href=';
    //   this.state.showPanelItem.WikiField = this.state.showPanelItem.WikiField.replace(linkNoLeadingTarget,replaceString);
    // }
    
    // const docsPage = !this.state.showPanelItem || !this.state.showPanelItem.WikiField ? null : <div dangerouslySetInnerHTML={{ __html: this.state.showPanelItem.WikiField }} />;
    // const panelContent = <div>
    //   <ReactJson src={ this.state.showPanelItem } name={ 'Summary' } collapsed={ false } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '20px 0px' }}/>
    // </div>;

    // const userPanel = <div><Panel
    //   isOpen={ this.state.showItemPanel === true ? true : false }
    //   // this prop makes the panel non-modal
    //   isBlocking={true}
    //   onDismiss={ this._onClosePanel.bind(this) }
    //   closeButtonAriaLabel="Close"
    //   type = { PanelType.large }
    //   isLightDismiss = { true }
    //   >
    //     { docsPage }
    //     { panelContent }
    // </Panel></div>;
    let filtered = [];
    this.state.filtered.map( account => {
      if ( filtered.length < this.state.slideCount ) {
        // filtered.push( <div>
        //   <li>{ getHighlightedText( `${ account.Title } - ${ account.Name1 } - ${ account.Description }`, this.state.searchText )  }</li>
        // </div>);

        filtered.push( createAccountRow( account, this.state.searchText, null ));

      }
    });

    /*https://developer.microsoft.com/en-us/fabric#/controls/web/searchbox*/
    let searchBox =  
    <div className={[styles.searchContainer ].join(' ')} >
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

      const debugContent = this.props.debugMode !== true ? null : <div>
        App in debugMode - Change in Web Part Properties - Page Preferences.  <b><em>Currently in AccountsPage</em></b>
      </div>;

    return (
      <div className={ styles.alvFinMan }>
        {/* <div className={ styles.container }> */}
          <div className={ styles.row }>
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

  private _onSearchChange ( NewSearch ){
  
    const SearchValue = NewSearch.target.value;
    
    if ( !SearchValue ) {
      this.setState({ filtered: this.props.accounts, searchText: '', searchTime: null });
    } else {

      let startTime = new Date();
      let filtered: any[] = [];
      let NewSearchLC = SearchValue.toLowerCase();
      this.props.accounts.map( account => {
        if ( account.searchTextLC.indexOf( NewSearchLC ) > -1 ) {
          filtered.push( account );
        }
      });
  
      
      let endTime = new Date();

      let totalTime = endTime.getTime() - startTime.getTime();

      this.setState({ filtered: filtered, searchText: SearchValue, searchTime: totalTime });
    }

  }

}
