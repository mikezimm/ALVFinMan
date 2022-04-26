import * as React from 'react';
import styles from '../AlvFinMan.module.scss';
import stylesN from './News.module.scss';
import { ILayoutGPage, ILayoutSPage, ILayoutAll, ILayoutAPage, IFMBuckets, IPagesContent,   } from '../IAlvFinManProps';
import { INewsPageProps, INewsPageState, } from './INewsProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Web, ISite } from '@pnp/sp/presets/all';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { DefaultButton, PrimaryButton, CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

import { Panel, IPanelProps, IPanelStyleProps, IPanelStyles, PanelType } from 'office-ui-fabric-react/lib/Panel';

import { Pivot, PivotItem, IPivotItemProps, PivotLinkFormat, PivotLinkSize,} from 'office-ui-fabric-react/lib/Pivot';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";

import * as strings from 'AlvFinManWebPartStrings';

import ReactJson from "react-json-view";

import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';
import { ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, IChartSeries, ICharNote, } 
    from '@mikezimm/npmfunctions/dist/CSSCharts/ICSSCharts';

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';

import AlvAccounts from '../Accounts/Accounts';
import { FinManSite, LookupColumns, sitePagesColumns, SourceInfo } from '../DataInterface';

export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //

const consoleLineItemBuild: boolean = false;


export default class NewsPage extends React.Component<INewsPageProps, INewsPageState> {

  private buildNewsList( News: IPagesContent[], sortProp: ISeriesSort, order: ISeriesSort, showItem: IPagesContent ) {
    console.log('buildNewsList:', News );

    let newsList : any[] = [];

    // debugger;

    let SortedNews: IPagesContent[] = sortObjectArrayByNumberKey( News, order, sortProp );
    const FUStyle : React.CSSProperties = { whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '100%', overflow: 'hidden' };

    SortedNews.map( item => {
      let classNames = [ stylesN.titleListItem ];
      if ( showItem && ( item.ID === showItem.ID ) ) { classNames.push( stylesN.isSelected ) ; }
      newsList.push( <li className={ classNames.join( ' ' ) } onClick= { this.clickNewsItem.bind( this, item.ID, 'news', item  )} style={ FUStyle }>
        { item.Title } </li>  );
    });

    let showArticle: IPagesContent = showItem ? showItem : null;

    const articleTitle = showArticle ? showArticle.Title : 'Select news to show...';
    const articleDesc = showArticle ? showArticle.Description : '';
    const imageUrl = showArticle ? showArticle.BannerImageUrl : null;

    if ( !showItem && SortedNews.length > 0 ) { showArticle = SortedNews[0]; }
    const image = !showItem || !imageUrl ? null : 
    <img src={ imageUrl.Url } height="100px" width="100%" style={{ objectFit: "cover" }} title={ imageUrl.Url }></img>;

    let page = <div className={ stylesN.newsPage } >
      {/* <div className={ styles.titleList }> <ul>{ newsList }</ul></div> */}
      <div className={ stylesN.titleList }><h3>Financial News</h3> { newsList } </div>
      <div className={ stylesN.article }>
        { image }
        <h3>{ articleTitle }</h3>
         { articleDesc }
      </div>
    </div>;
    return page;

  }

  public constructor(props:INewsPageProps){
    super(props);
    console.log('constructor:',   );
    this.state = {
      showItemPanel: false,
      showThisItem: this.props.news.length > 0 ? this.props.news[ 0 ] : null,
      refreshId: `${this.props.refreshId}`,
      sort: {
        prop: this.props.sort.prop,
        order: this.props.sort.order,
      }
    };
  }

  public componentDidMount() {
    console.log('componentDidMount:',   );
    this.updateWebInfo( '', false );
  }

  public async updateWebInfo ( webUrl: string, listChangeOnly : boolean ) {
    console.log('updateWebInfo:',   );
    // this.setState({ docs: docs, buckets: buckets, sups: sups });

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

  public componentDidUpdate(prevProps){
    //Just rebuild the component
    if ( this.props.refreshId !== prevProps.refreshId ) {
      console.log('componentDidUpdate: refreshId', prevProps.refreshId, this.props.refreshId  );
      let showThisItem: IPagesContent = this.state.showThisItem;
      if ( !showThisItem && this.props.news.length > 0 ) showThisItem = this.props.news[0];
      this.setState({ refreshId: this.props.refreshId, showThisItem: showThisItem });
    }
  }

  public render(): React.ReactElement<INewsPageProps> {

    if ( this.props.mainPivotKey !== 'News' ) {
      return ( null );

    } else {
      console.log('NewsPage: ReactElement', this.props.refreshId  );

      const showPage = <div> { this.buildNewsList( this.props.news, this.state.sort.prop, this.state.sort.order, this.state.showThisItem ) } </div>; 
  
      if ( this.state.showThisItem && this.state.showThisItem.WikiField ) {
        // const replaceString = '<a onClick=\"console.log(\'Going to\',this.href);window.open(this.href,\'_blank\')\" style="pointer-events:none" href=';
        const replaceString = '<a onClick=\"window.open(this.href,\'_blank\')\" href=';
        this.state.showThisItem.WikiField = this.state.showThisItem.WikiField.replace(linkNoLeadingTarget,replaceString);
      }
      
      const docsPage = !this.state.showThisItem || !this.state.showThisItem.WikiField ? null : <div dangerouslySetInnerHTML={{ __html: this.state.showThisItem.WikiField }} />;
      const panelContent = <div>
        <ReactJson src={ this.state.showThisItem } name={ 'Summary' } collapsed={ false } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '20px 0px' }}/>
      </div>;
  
      const userPanel = <div><Panel
        isOpen={ this.state.showItemPanel === true ? true : false }
        // this prop makes the panel non-modal
        isBlocking={true}
        onDismiss={ this._onClosePanel.bind(this) }
        closeButtonAriaLabel="Close"
        type = { PanelType.large }
        isLightDismiss = { true }
        >
          { docsPage }
          { panelContent }
      </Panel></div>;

  
      return (
        // <div className={ styles.alvFinMan }>
        <div className={ null }>
          {/* <div className={ stylesN.newsPage }> */}
          <div className={ null }>
            {/* <div className={ styles.row }> */}
              {/* <div className={ styles.column }> */}
                { showPage }
                { userPanel }
              {/* </div> */}
            {/* </div> */}
          </div>
        </div>
      );

    }

  }

  private clickNewsItem( ID: number, category: string, item: IPagesContent, e: any ) {  //this, item.ID, 'news', item
    console.log('clickNewsItem:', ID, item );
    // debugger;

    let newState = this.state.showItemPanel;
    if ( e.altKey === true ) {
      newState = this.state.showItemPanel === true ? false : true;

    } else if ( e.ctrlKey === true && item.File ) {
      window.open( item.File.ServerRelativeUrl , '_blank' );

    }

    this.setState({ showThisItem: item, showItemPanel: newState });
  }

  
  private async clickDocumentItem( pivot, supDoc, item, title ) {
    console.log('clickDocumentItem:', pivot, supDoc, item );
    if ( supDoc === 'docs' ) {
      await this.getDocWiki( item );
    } else {
      this.setState({ showItemPanel: true, showThisItem: item });
    }

  }

   //Standards are really site pages, supporting docs are files
  private async getDocWiki( item: any, ) {

    let web = await Web( `${window.location.origin}${FinManSite}` );
    
    const columns = [ ...sitePagesColumns, ...LookupColumns, ...[ 'DocumentType/Title' ] ];

    let expColumns = getExpandColumns( columns );
    let selColumns = getSelectColumns( columns );
    
    const expandThese = expColumns.join(",");
    let selectThese = '*,WikiField' + selColumns.join(",");

    // Why an await does not work here is beyond me.  It should work :(
    // let fullItem = await web.lists.getByTitle( StandardsLib ).items.select(selectThese).expand(expandThese).getById( item.ID );
    web.lists.getByTitle( SourceInfo.stds.listTitle ).items.select(selectThese).expand(expandThese).getById( item.ID )().then( result => {
      console.log( 'ALVFinManDocs', result );
      this.setState({ showItemPanel: true, showThisItem: result });
    }).catch( e => {
      console.log('Error getting item wiki');
    });

  }



  private _onClosePanel( ) {
    this.setState({ showItemPanel: false, showThisItem: null });
  }

}
