import * as React from 'react';
import styles from '../AlvFinMan.module.scss';
import stylesM from './ModernPages.module.scss';
import { ILayoutGPage, ILayoutSPage, ILayoutAll, ILayoutAPage, IFMBuckets, IPagesContent,   } from '../IAlvFinManProps';
import { IModernPagesProps, IModernPagesState, } from './IModernPagesProps';
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

import { replaceHTMLEntities } from '@mikezimm/npmfunctions/dist/Services/Strings/html';
import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';
import { ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, IChartSeries, ICharNote, } 
    from '@mikezimm/npmfunctions/dist/CSSCharts/ICSSCharts';

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';

import AlvAccounts from '../Accounts/Accounts';
import { LookupColumns, SourceInfo } from '../DataInterface';
import { divide, stubFalse } from 'lodash';
import { makeToggleJSONCmd } from '../Elements/CmdButton';

export const linkNoLeadingTarget = /<a[\s\S]*?href=/gim;   //

const consoleLineItemBuild: boolean = false;

/**
 *
  Need to do special parsing on custom webparts:
*/
const specialWebPartIDs: string[] = [
  '37b649bc-f846-4718-863d-9487d8fffb23', // FPS Page Info - TOC & Props
  '92b4cb98-3aa1-4ece-9149-a591a572aced', // Pivot Tiles-TEAM
  '2762fd19-106f-4fcc-9949-0c58c512be4e', // ALVFinMan
  '44f426eb-86a2-41d0-bf5d-3db469b93ab6', // FPS Easy Contents Webpart

];

/**
 *
  Never list these page titles in the list of pages:
*/
const ignoreThesePages: string[] = [
  'Easy Contnets', // 
  'EasyContents', // 
];

export default class ModernPages extends React.Component<IModernPagesProps, IModernPagesState> {

  private cke_editable = this.props.canvasOptions.addCkeEditToDiv !== false ? 'cke_editable' : '';
  private imageStyle = '';

  private ToggleJSONCmd = makeToggleJSONCmd( this._toggleJSON.bind( this ) );

  private buildPagesList( News: IPagesContent[], sortProp: ISeriesSort, order: ISeriesSort, showItem: IPagesContent, showCanvasContent1: boolean ) {
    console.log('buildPagesList:', News );

    let pagesList : any[] = [];

    // debugger;

    let SortedPages: IPagesContent[] = sortObjectArrayByNumberKey( News, order, sortProp );

    SortedPages.map( item => {
      let classNames = [ stylesM.titleListItem, styles.leftFilter ];
      if ( showItem && ( item.ID == showItem.ID ) ) { classNames.push( stylesM.isSelected ) ; }
      //Make sure page has Title and is not a dud, also check it's not a common page that does not belong in this component
      if ( item.Title && ignoreThesePages.indexOf( item.Title ) < 0 ) {
        pagesList.push( <li className={ classNames.join( ' ' ) } onClick= { this.clickNewsItem.bind( this, item.ID, 'pages', item  )} style={ null }>
        { item.Title } </li>  );
      }
    });

    let showArticle: IPagesContent = showItem ? showItem : null;

    const articleTitle = showArticle ? showArticle.Title : 'Select pages to show...';
    let articleDesc: any  = showArticle ? showArticle.Description : '';

    const imageUrl = showArticle ? showArticle.BannerImageUrl : null;

    const CanvasContent1 = showCanvasContent1 !== true ? null :
      <div className={ ['', this.cke_editable].join(' ') }>
        {/* <h2>CanvasContent1</h2> */}
        <div dangerouslySetInnerHTML={{ __html: showArticle.CanvasContent1Str }} />
      </div>;

    if ( CanvasContent1 ) { articleDesc = null ; } //Remove Description because full article is shown below

    let ClickInstructions = showCanvasContent1 === true ? null : 
    <div style={{ paddingTop: '15px'}}>
      <div>To go to article: <span style={{ cursor: 'pointer', color: 'darkblue' }}onClick={ this.openArticleNewTab.bind( this, showArticle )}>click here</span></div>
      <div>To open article in NEW full-size tab: <b>CTRL-Click the Title</b> </div>
      <div>To show it right here: <b>CTRL-ALT-Click the Title</b></div>
      <div>To show it in a side panel: <b>ALT-Click the Title</b></div>
    </div>;

    if ( showArticle && showArticle['OData__OriginalSourceUrl'] && showArticle['OData__OriginalSourceUrl'].indexOf( window.location.origin ) < 0 ) {
      //Link is external...  Use different instructions
      ClickInstructions =
      <div style={{ paddingTop: '15px'}}>
        <div style={{ paddingBottom: '10px', fontWeight: 600 }}>To go to article: <span style={{ cursor: 'pointer', color: 'darkblue' }}onClick={ this.openThisLink.bind( this, showArticle['OData__OriginalSourceUrl'] )}>click here</span></div>
        <div style={{ color: 'red', }}>Security check :)  This is the full link you will be clicking on</div>
        <div>{ showArticle['OData__OriginalSourceUrl'] } </div>
      </div>;
    }

    if ( !showItem && SortedPages.length > 0 ) { showArticle = SortedPages[0]; }
    const image = !showItem || !imageUrl ? null : 
    <img src={ imageUrl.Url } height="100px" width="100%" style={{ objectFit: "cover" }} title={ imageUrl.Url }></img>;

    let page = <div className={ stylesM.modernPage } style={{ }} >
      {/* <div className={ styles.titleList }> <ul>{ pagesList }</ul></div> */}
      <div className={ stylesM.titleList }>
        <h3>{this.props.source.searchSource}</h3>
        <div className= { stylesM.pageDescription }>{this.props.source.searchSourceDesc}</div>
         { pagesList } </div>
      <div className={ [stylesM.article, '' ].join(' ') }>
        { image }
        <h3>{ articleTitle }</h3>
         { articleDesc }
         { ClickInstructions }
         { CanvasContent1 }
      </div>
    </div>;
    return page;

  }

  public constructor(props:IModernPagesProps){
    super(props);
    console.log('constructor:',   );
    this.state = {
      showItemPanel: false,
      showCanvasContent1: this.props.canvasOptions.pagePreference === 'canvasContent1' ? true : false,
      showPanelJSON: false,
      showThisItem: this.props.pages.length > 0 ? this.props.pages[ 0 ] : null,
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
    if ( this.state.showCanvasContent1 === true ) {
      this.getDocWiki( this.state.showThisItem , this.state.showCanvasContent1 );
    }

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
      if ( !showThisItem && this.props.pages.length > 0 ) showThisItem = this.props.pages[0];
      this.setState({ refreshId: this.props.refreshId, showThisItem: showThisItem });
    } else if ( JSON.stringify( this.props.canvasOptions) !== JSON.stringify( prevProps.canvasOptions ) ) {
      console.log('ModernPages style update: ', this.imageStyle );
      this.setState({ refreshId: this.props.refreshId, });
    }
  }

  public render(): React.ReactElement<IModernPagesProps> {

    if ( this.props.mainPivotKey !== 'News' && this.props.mainPivotKey !== 'Help' ) {
      return ( null );

    } else {
      console.log('ModernPages: ReactElement', this.props.refreshId  );

      const showPage = <div> { this.buildPagesList( this.props.pages, this.state.sort.prop, this.state.sort.order, this.state.showThisItem, this.state.showCanvasContent1 ) } </div>; 
  
      if ( this.state.showThisItem && this.state.showThisItem.WikiField ) {
        // const replaceString = '<a onClick=\"console.log(\'Going to\',this.href);window.open(this.href,\'_blank\')\" style="pointer-events:none" href=';
        const replaceString = '<a onClick=\"window.open(this.href,\'_blank\')\" href=';
        this.state.showThisItem.WikiField = this.state.showThisItem.WikiField.replace(linkNoLeadingTarget,replaceString);
      }

      //CanvasContent1,LayoutsWebpartsContent'
      const CanvasContent1 = !this.state.showThisItem || !this.state.showThisItem.CanvasContent1Str ? null : 
      <div className={ ['', this.cke_editable].join(' ') }>
        <h2>CanvasContent1</h2>
        <div dangerouslySetInnerHTML={{ __html: this.state.showThisItem.CanvasContent1Str }} />
      </div>;

      const LayoutsWebpartsContent = !this.state.showThisItem || !this.state.showThisItem.LayoutsWebpartsContent ? null : 
      <div>
        <h2>LayoutsWebpartsContent</h2>
        <div dangerouslySetInnerHTML={{ __html: this.state.showThisItem.LayoutsWebpartsContent }} />
      </div>;

      const panelContent = this.state.showPanelJSON !== true ? null : <div>
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
          { CanvasContent1 }
          { LayoutsWebpartsContent }
          { this.ToggleJSONCmd }
          { panelContent }
      </Panel></div>;

  
      return (
        // <div className={ styles.alvFinMan }>
        <div className={ null }>
          {/* <div className={ stylesM.pagesPage }> */}
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

  private openArticleNewTab( item: IPagesContent ) {
    window.open( item.File.ServerRelativeUrl , '_blank' );
  }

  private openThisLink( link:string ) {
    window.open( link , '_blank' );
  }

  private clickNewsItem( ID: number, category: string, item: IPagesContent, e: any ) {  //this, item.ID, 'pages', item
    console.log('clickNewsItem:', ID, item );
    // debugger;

    let newState = this.state.showItemPanel;

    if ( e.altKey === true ) {
      // newState = this.state.showItemPanel === true ? false : true;
      let showCanvasContent1 = e.ctrlKey === true ? true : false;
      this.getDocWiki( item , showCanvasContent1 );

    } else if ( e.ctrlKey === true && item.File ) {
      window.open( item.File.ServerRelativeUrl , '_blank' );
      this.setState({ showThisItem: item, showItemPanel: newState });

    } else if ( this.state.showCanvasContent1 === true ) {
      this.getDocWiki( item , this.state.showCanvasContent1 );

    } else if ( this.props.canvasOptions.pagePreference === 'tab' && item.File ) {
      window.open( item.File.ServerRelativeUrl , '_blank' );
        this.setState({ showThisItem: item, showItemPanel: newState });

    }


  }

  
  //Standards are really site pages, supporting docs are files
  private async getDocWiki( item: IPagesContent, showCanvasContent1: boolean ) {

    let web = await Web( `${window.location.origin}${this.props.source.webUrl}` );
    
    const columns = this.props.source.columns;

    let expColumns = getExpandColumns( columns );
    let selColumns = getSelectColumns( columns );
    
    const expandThese = expColumns.join(",");
    let selectThese = '*,WikiField,CanvasContent1,LayoutsWebpartsContent,BannerImageUrl' + selColumns.join(",");

    // Why an await does not work here is beyond me.  It should work :(
    // let fullItem = await web.lists.getByTitle( StandardsLib ).items.select(selectThese).expand(expandThese).getById( item.ID );
    web.lists.getByTitle( this.props.source.listTitle ).items.select(selectThese).expand(expandThese).getById( parseInt( item.ID ) ).fieldValuesAsHTML().then( result => {
      console.log( 'ALVFinManDocs', result );

    //Added this to fit images into the current width or else the image is full size
    if ( result.CanvasContent1 ) { result.CanvasContent1Str = result.CanvasContent1.replace( /<img\s*/ig , `<img ${this.props.canvasOptions.imageOptions.style} ` ) ; }
    
      //Need to manually update the BannerImageUrl property from original item because it comes across as an attribute link as text
      result.BannerImageUrl = item.BannerImageUrl;

      this.setState({ 
        showItemPanel: showCanvasContent1 === false ? true : false, 
        showCanvasContent1: showCanvasContent1, 
        showThisItem: result });

    }).catch( e => {
      console.log('Error getting item wiki');
    });

  }


  /**
   * Looks for strings like this:  
   * "pageInfoStyle":""paddingBottom":"20px","backgroundColor":"#dcdcdc";"borderLeft":"solid 3px #c4c4c4"","bannerStyleChoice":
   * 
   * and converts to strings like this:
   * "pageInfoStyle":"'paddingBottom':'20px','backgroundColor':'#dcdcdc';'borderLeft':'solid 3px #c4c4c4'","bannerStyleChoice":
   * @param str 
   * @returns 
   */
  private reverseStylesStringQuotes( str: string ) {

    let newString = '';
    // part = part.replace(/:\"\"(?!,)/g, ':\"\''); //Replace instances of :"" that do not have a comma after it
    // part = part.replace(/(?<!:)\"\",/g, '\'\",'); //Replace instances of "", that do not have a colon in front it

    str = str.replace(/:\"{\"/g, ':{\"');
    str = str.replace(/\"}\"/g, '\"}');

    let styleColons = str.split(/:\"\"(?!,)/g); // Split by :"" strings
    let newParts: string[] = [];
    console.log('reversStyle: styleColons', styleColons );
    styleColons.map( ( part, idx1 ) => {   
      if ( idx1 === 0 ) {
        newParts.push( part ); //The first one never has to be fixed.

      } else { //All other items need to be fixed

        //Step 1:  Find where to stop ....  250px"",  --- basically where you find /(?<!:)\"\",/g
        let portions = part.split(/(?<!:)\"\",/g); // Split by "", strings
        console.log(`reversStyle: portions1 /(?<!:)\"\",/g`, portions );
        if ( portions.length > 2 ) alert('Whoa, wasnt expecting this.ToggleJSONCmd.key.toLocaleString.~ 342' );
        if ( portions.length > 1 ) portions[0] = portions[0].replace(/\"/g, "'" ); //Replace all double quotes with single quotes only if there is a second half
        if ( portions.length > 1 ) portions[1] = this.reverseStylesStringQuotes(portions[1]); //Replace all double quotes with single quotes only if there is a second half
        console.log('reversStyle: portions2', portions );
        newParts.push( portions.join( `'",`) );
        console.log('reversStyle: newParts1', newParts );
        //Step 2:  From start to stop, replace double quotes " with single quotes '

        //Step 3:  Push to newParts
      }

    });
    console.log('reversStyle: newPartsz', newParts );
    newString = newParts.join(':\"\''  );

    // let typeDivs = newString.split('{"type":"div"');

    // let result = typeDivs[0];
    // if ( typeDivs.length > 0 ) {
    //   newString = result + '""';
    // }
    return newString;

  }

  private _toggleJSON( ) {
    let newState = this.state.showPanelJSON === true ? false : true;
    
    let result = this.state.showThisItem;

    let startParsing = new Date();
    
    //Added this for debug option to be able to read CanvasContent1 better
    if ( !result.HumanReadable_Canvas1 ) result.HumanReadable_Canvas1 = result.CanvasContent1 ? replaceHTMLEntities( result.CanvasContent1 ) : '';
    const errCanvasWebParts = 'Unable to parse HumanJSON_ContentWebparts';
    if ( result.HumanReadable_Canvas1 ) {  //Look for any web part properties and add to JSON object
      const CanvasWebPartsTag = '<div data-sp-canvascontrol="" data-sp-canvasdataversion="1.0" data-sp-controldata="';
      const WebPartDataTag = 'data-sp-webpartdata="';
      
      let webparts = result.HumanReadable_Canvas1.split(CanvasWebPartsTag);

      if ( webparts.length > 0 ) {
        webparts.map ( ( part: string, idx1: number ) => {
          if ( idx1 > 0 ) {
            if ( idx1 === 1 ) result.HumanJSON_ContentWebparts = [];

            let startWebPartData = part.indexOf( WebPartDataTag );
            let parseThisPart = startWebPartData < 0 ? part : part.substring( startWebPartData ).replace( WebPartDataTag,'');
            let parseMe = parseThisPart.substring(0, parseThisPart.indexOf( '"><' ) );
            try {
              let doubleQuotes = parseMe.split(/(?<!:)\"\"(?!,)/g);
              if ( doubleQuotes.length > 0 ) {
                let cleanParseMe = '';
                let newDoubleQuotes: string[] = [];
                doubleQuotes.map( ( doubleQt, idx2 ) => {

                  if ( doubleQuotes.length === 0 ) {
                    //Do nothing, there are no elements with double quotes

                  } else if ( idx2 === 0 ) {
                    //Do nothing, this is the first element that does not have quotes
                    // console.log(' doubleQuotes1:' , doubleQt );

                  } else if ( idx2 !== doubleQuotes.length -1 ) {//This is the last item so this should not need to change quotes 
                      doubleQt = `"'${doubleQt.replace(/\"/g, "'" )}'"`;
                      // console.log(' doubleQuotes2:' , doubleQt );
                  }
                  newDoubleQuotes.push( doubleQt );
                });

                cleanParseMe = newDoubleQuotes.join('');
                // console.log('cleanParseMe', cleanParseMe );
                parseMe = cleanParseMe;
                let isSpecial: any = false;
                specialWebPartIDs.map( id => {
                  if ( parseMe.indexOf( id ) > -1 ) {
                    isSpecial = true;
                  }
                });
                if ( isSpecial === true ) { //This is a web part with known complex props that need special code
                  parseMe = this.reverseStylesStringQuotes( parseMe );

                  let typeDivs = parseMe.split('{"type":"div"');
                  parseMe = typeDivs[0];
                  if ( typeDivs.length > 1 ) {
                    parseMe += '""}}';
                  }
                }
              }
              let parseThisObject = JSON.parse( parseMe );
              let startContent = part.indexOf( '"><' ) + 2;
              let endContent = part.lastIndexOf('</div>');
              let thisContent = part.substring(startContent,endContent);
              if ( thisContent.indexOf('<div data-sp-rte="">') > -1 ) {
                //This is common Text WebPart
                parseThisObject.title = 'OOTB Text Web Part';
              } else {
                //This is not OOTB Text Web Part so trim props from beginning of string
                thisContent = thisContent.substring( thisContent.indexOf( '"><' ) + 2) ;
              }
              parseThisObject.content = thisContent;
              result.HumanJSON_ContentWebparts.push( { parseMe:  parseThisObject } ) ;
            } catch (e) {
              result.HumanJSON_ContentWebparts.push( { part: part, errorText: errCanvasWebParts, parseMe: parseMe, error: e } );
            }
          }
        });
      }
    }
    if ( !result.HumanReadable_LayoutWebpartsContent ) result.HumanReadable_LayoutWebpartsContent = result['LayoutWebpartsContent'] ? replaceHTMLEntities( result['LayoutWebpartsContent'] ) : '';
    const LayoutWebpartsTag = '<div><div data-sp-canvascontrol="" data-sp-canvasdataversion="1.4" data-sp-controldata="';
    if ( result.HumanReadable_LayoutWebpartsContent.indexOf( LayoutWebpartsTag ) === 0 ) {
      try {
        result.HumanJSON_LayoutWebpartsContent = JSON.parse(result.HumanReadable_LayoutWebpartsContent.replace(LayoutWebpartsTag,'').replace('"></div></div>',''));
      } catch (e) {
        result.HumanJSON_LayoutWebpartsContent = 'Unable to parse LayoutWebpartsContent' + JSON.stringify(e);
      }
    }

    if ( !result.HumanReadableOData_Author ) result.HumanReadableOData_Author = result['Author'] ? replaceHTMLEntities( result['Author'] ) : '';
    if ( !result.HumanReadableOData_Editor ) result.HumanReadableOData_Editor = result['Editor'] ? replaceHTMLEntities( result['Editor'] ) : '';

    let endParsing = new Date();

    console.log('parse time: ', ( endParsing.getTime() - startParsing.getTime() ) );

    this.setState( { showThisItem: result , showPanelJSON: newState });
  }

  private _onClosePanel( ) {
    this.setState({ showItemPanel: false });
  }

}
