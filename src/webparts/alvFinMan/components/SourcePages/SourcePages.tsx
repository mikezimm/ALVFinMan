import * as React from 'react';
import stylesA from '../AlvFinMan.module.scss';
import styles from './SourcePages.module.scss';
import stylesM from './Modern/Modern.module.scss';
import stylesP from './SourcePages.module.scss';

import { ISourcePagesProps, ISourcePagesState, } from './ISourcePagesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { Spinner, SpinnerSize, } from 'office-ui-fabric-react/lib/Spinner';

import { Web, ISite } from '@pnp/sp/presets/all';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { DefaultButton, PrimaryButton, CompoundButton, Stack, IStackTokens, elementContains, divProperties } from 'office-ui-fabric-react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

import { Panel, IPanelProps, IPanelStyleProps, IPanelStyles, PanelType } from 'office-ui-fabric-react/lib/Panel';

import * as strings from 'AlvFinManWebPartStrings';

import { IFMSearchType, SearchTypes } from '../DataInterface';

import ReactJson from "react-json-view";

import { createEntityRow } from './Entities/EntityItem';
import { createAcronymRow } from './Acronyms/AcronymItem';
import { createAccountRow } from './Accounts/AccountItem';
import { createHistoryRow } from './History/HistoryItem';
import { createModernRow } from './Modern/ModernItem';

import { IAnyContent, IDeepLink, IPagesContent } from '../IAlvFinManProps';
import SingleModernPage from '../ModernPages/SinglePage/SingleModernPage';
import { getDocWiki } from '../ModernPages/SinglePage/getModernContent';
import { getHighlightedText } from '../Elements/HighlightedText';
import { createFileRow } from './Files/FileItem';

const pivotStyles = {
  root: {
    whiteSpace: "normal",
    marginTop: '30px',
    color: 'white',
  //   textAlign: "center"
  }};

export default class SourcePages extends React.Component<ISourcePagesProps, ISourcePagesState> {

  //Copied from ModernPages
  private imageStyle = '';

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


public constructor(props:ISourcePagesProps){
  super(props);

  let searchText = this.props.deepProps && this.props.deepProps.length >=1 && this.props.deepProps[0] ? decodeURIComponent( this.props.deepProps[0] ) : '';
  let topSearchStr = this.props.deepProps && this.props.deepProps.length >=2 && this.props.deepProps[1] ? decodeURIComponent( this.props.deepProps[1] ) : '[]';
  let topSearch = !topSearchStr ? [] : JSON.parse( topSearchStr );

  let filtered: IAnyContent[] = this.getFilteredItems( this.props.items , searchText, topSearch, );

  this.state = {
    refreshId: this.props.refreshId,
    filtered: filtered,
    slideCount: 20,
    topSearch: topSearch,
    sortNum: 'asc',
    sortName: '-',
    sortGroup: '-',
    searchTime: null,
    searchText: searchText,

    showItemPanel: false,
    showCanvasContent1: this.props.canvasOptions.pagePreference === 'canvasContent1' ? true : false,
    showPanelJSON: false,
    showThisItem: filtered.length > 0 ? filtered[ 0 ] : null,

  };
}

public componentDidMount() {
  this.updateWebInfo(  );
}


public componentDidUpdate(prevProps: ISourcePagesProps){
    //Just rebuild the component
    if ( this.props.primarySource !== prevProps.primarySource ) {
      this.setState({ refreshId: this.props.refreshId, filtered: this.props.items });

    } else if ( this.props.items.length !== prevProps.items.length ) {
      this.setState({ refreshId: this.props.refreshId, filtered: this.props.items });

    } else if ( this.props.refreshId !== prevProps.refreshId || this.props.pageWidth !== prevProps.pageWidth || this.props.topButtons.length !== prevProps.topButtons.length ) {
      this.setState({ refreshId: this.props.refreshId, });
      
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

  public render(): React.ReactElement<ISourcePagesProps> {

    const topButtons = this.props.topButtons;
    
    let topSearch: any[] = [];  //All major future to be grid components

    topButtons.map( searchObject => {
      let classNames = [ styles.button ];
      if ( this.state.topSearch.indexOf( searchObject ) > -1 ) { classNames.push( styles.isSelected ) ; }
      topSearch.push( <div className={ classNames.join(' ') } style={ null }  onClick={ this._clickTop.bind( this, searchObject )}>{ searchObject }</div> );
    });

    const topSearchContent = <div className={ styles.topSearch } style={ { background : this.props.debugMode === true ? 'pink' : null }} >{ topSearch }</div>;

    let filtered = [];
    this.state.filtered.map( item => {
      if ( filtered.length < this.state.slideCount ) {
        switch ( this.props.primarySource.key  ) {

          case 'entities':
          filtered.push( createEntityRow( item, this.state.searchText, null )); break;

          case 'acronyms':
          filtered.push( createAcronymRow( item, this.state.searchText, null )); break;

          case 'manual':
          // filtered.push( this.createModernRowHere( item, this.state.searchText, this.clickModernItem.bind(this) )); break;
          filtered.push( createModernRow( item, this.state.searchText, this.clickModernItem.bind(this), null )); break;

          case 'sups':
          // filtered.push( this.createModernRowHere( item, this.state.searchText, this.clickModernItem.bind(this) )); break;
          filtered.push( createFileRow( item, this.state.searchText, this.clickFileItem.bind(this) )); break;

          case 'accounts':
          filtered.push( createAccountRow( item, this.state.searchText, null )); break;

          case 'history':
          filtered.push( createHistoryRow( item, this.state.searchText, null, this.jumpToDeepLink.bind(this) )); break;

        }
      }
    });

    /*https://developer.microsoft.com/en-us/fabric#/controls/web/searchbox*/
    let searchBox =  
    <div className={[stylesA.searchContainer ].join(' ')} >
      <SearchBox
        className={stylesA.searchBox}
        styles={{ root: { maxWidth:250 } }}
        placeholder="Search"
        value={ this.state.searchText }
        onSearch={ this._onSearchChange.bind(this) }
        onFocus={ () => console.log('this.state',  this.state) }
        onBlur={ () => console.log('onBlur called') }
        onChange={ this._onSearchChange.bind(this) }
        onClear={ this._onSearchChange.bind(this) }
      />
      <div className={stylesA.searchStatus}>
        { 'Searching ' + this.state.filtered.length + ' items' }
        { this.state.searchTime === null ? '' : ' ~ Time ' + this.state.searchTime + ' ms' }
        { /* 'Searching ' + (this.state.searchType !== 'all' ? this.state.filteredTiles.length : ' all' ) + ' items' */ }
      </div>
    </div>;


      const gotoListLink = !this.props.primarySource.webRelativeLink ? null : <div className={ [ stylesA.searchStatus, styles.goToLink ].join(' ')} onClick={ () => { window.open( `${this.props.primarySource.webUrl}${this.props.primarySource.webRelativeLink}`,'_blank' ) ; } }>
        Go to full list <Icon iconName='OpenInNewTab'></Icon>
      </div>;

      const debugContent = this.props.debugMode !== true ? null : <div>
        App in debugMode - Change in Web Part Properties - Page Preferences.  <b><em>Currently in {this.props.primarySource.listTitle}</em></b>
      </div>;

      const searchSourceDesc = !this.props.primarySource.searchSourceDesc ? null : <div className={ styles.searchSourceDesc }>
        <div className={ styles.sourceDesc }>{ this.props.primarySource.searchSourceDesc }</div>
        { gotoListLink }
      </div>;

      const deepHistory = this.props.debugMode !== true ? null :  
        <ReactJson src={ this.state.filtered } name={ this.props.primarySource.listTitle } collapsed={ false } displayDataTypes={ false } displayObjectSize={ false } enableClipboard={ true } style={{ padding: '20px 0px' }} theme= { 'rjv-default' } indentWidth={ 2}/>;

      const userPanel = this.state.showItemPanel !== true ? null : <div><Panel
        isOpen={ this.state.showItemPanel === true ? true : false }
        // this prop makes the panel non-modal
        isBlocking={true}
        onDismiss={ this._onClosePanel.bind(this) }
        closeButtonAriaLabel="Close"
        type = { PanelType.large }
        isLightDismiss = { true }
        >
        <SingleModernPage 
          page= { this.state.showThisItem }
          showCanvasContent1= { true }
          source= { this.props.primarySource }
          refreshId= { this.props.refreshId  }
          canvasOptions= { this.props.canvasOptions }
          imageStyle= { this.imageStyle }
          debugMode= { this.props.debugMode }
        ></SingleModernPage>
      </Panel></div>;

    // const FetchingSpinner = this.props.items.length > 0 ? null : <Spinner size={SpinnerSize.large} label={"Fetching Page ..."} style={{ padding: 30 }} />;

    return (
      <div className={ stylesA.alvFinMan }>
        {/* <div className={ styles.container }> */}
          <div className={ styles.storagePage }>
            {/* <div className={ styles.column }> */}
              { debugContent }
              { searchSourceDesc }
              { this.state.searchTime }
              { searchBox }
              { topSearchContent }
              { filtered }
              {/* { FetchingSpinner } */}
              { deepHistory }
              { userPanel }

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

    let startingItems: IAnyContent[] = this.props.items;
    let filtered: IAnyContent[] = this.getFilteredItems( startingItems, this.state.searchText, selected, );

    this.setState({ topSearch: selected , filtered: filtered });

    //https://stackoverflow.com/a/40493291
    this.updateParentDeeplinks( this.state.searchText, selected, filtered.length );

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

  
  private getFilteredItems( startingItems: IAnyContent[], text: string, top: string[]  ) {

    let filteredItems : IAnyContent[] = [];

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

    let filtered: IAnyContent[] = this.getFilteredItems( this.props.items, NewSearch.target.value, this.state.topSearch, );

    // setTimeout(() => {
      this.updateParentDeeplinks( SearchValue, this.state.topSearch, filtered.length );
    // }, 1000);


    let endTime = new Date();
    let totalTime = endTime.getTime() - startTime.getTime();

    if ( !SearchValue ) {

      this.setState({ filtered: filtered, searchText: '', searchTime: totalTime });
    } else {

      this.setState({ filtered: filtered, searchText: SearchValue, searchTime: totalTime });
    }

  }

  private updateParentDeeplinks( searchText: string, topLinks: string[], count: number ) {
    if ( count > 0 ) {
      if ( this.props.bumpDeepLinks ) {
        var deepLink2 = encodeURIComponent(JSON.stringify( topLinks ));
        this.props.bumpDeepLinks( 'Sources', this.props.primarySource.searchSource, [searchText, deepLink2 ], count );
      }
    }

  }

  private jumpToDeepLink( item: IDeepLink ) {
    if ( this.props.jumpToDeepLink ) {

      //jumpToDeepLink( mainPivotKey: IMainPage, sourcePivotKey: ISourcePage, categorizedPivotKey: ICategoryPage, deepProps: string[] = [] )
      this.props.jumpToDeepLink( item.main, item.second, '', [item.deep1, item.deep2 ] );
    }
  }

  private _onClosePanel( ) {
    this.setState({ showItemPanel: false });
  }

  private clickModernItem( ID: number, category: string, item: IPagesContent, e: any ) {  //this, item.ID, 'pages', item
    console.log('clickNewsItem:', ID, item );
    // debugger;

    getDocWiki( item , this.props.primarySource, this.props.canvasOptions, true, this.updateModernState.bind( this ) );

  }

  private clickFileItem( ID: number, category: string, item: IPagesContent, e: any ) {  //this, item.ID, 'files', item
    console.log('clickNewsItem:', ID, item );
    // debugger;

    getDocWiki( item , this.props.primarySource, this.props.canvasOptions, true, this.updateModernState.bind( this ) );

  }

  //getDocWiki( item: IPagesContent, source: ISourceProps,  canvasOptions: ICanvasContentOptions, callBack: any )
  private updateModernState( item: IPagesContent, showCanvasContent1: boolean ) {

    this.setState({ 
      showItemPanel: true, 
      showCanvasContent1: showCanvasContent1, 
      showThisItem: item });

  }

  // private createModernRowHere( item: IPagesContent , searchText: string, onClick: any ) {

  //   const row = <div className={ stylesM.modernItem }>
  //       <div className={ stylesP.itemIcon }><Icon iconName={ SearchTypes.objs[item.typeIdx].icon }></Icon></div>

  //       <div className={ stylesM.modernDetails}>
  //           <div className={ stylesM.modernRow1 } style={{cursor: item.searchHref ? 'pointer' : null }} onClick = { () => onClick( this, item.ID, 'pages', item ) }>
  //               <div>{ item.ID }</div>
  //               <div title="Title">{  getHighlightedText( `${ item.Title }`, searchText )  }</div>

  //           </div>
  //           <div className={ stylesM.modernRow2}>
  //               {/* <div title="Description">Description:&nbsp;&nbsp;{ !item.Description ? '---' : getHighlightedText( `${ item.Description }`, searchText )  }</div> */}
  //               <div title="Description">{ !item.Description ? '---' : getHighlightedText( `${ item.Description }`, searchText )  }</div>
  //               {/* <div title="Related to" style={{paddingLeft: '30px' }}>Related to:&nbsp;&nbsp;{ !item.SearchWords ? '' : getHighlightedText( `${ item.SearchWords }`, searchText )  }</div> */}
  //           </div>
  //       </div>
  //   </div>;

  //   return row;

  // }
}
