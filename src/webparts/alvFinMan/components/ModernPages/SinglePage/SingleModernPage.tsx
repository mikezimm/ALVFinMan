import * as React from 'react';

import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { Spinner, SpinnerSize, } from 'office-ui-fabric-react/lib/Spinner';


import styles from '../../AlvFinMan.module.scss';
import stylesM from '../ModernPages.module.scss';
import { ILayoutGPage, ILayoutSPage, ILayoutAPage, IFMBuckets, IPagesContent,   } from '../../IAlvFinManProps';
import { ISingleModernPageProps, ISingleModernPageState, } from './ISingleModernPageProps';

import * as strings from 'AlvFinManWebPartStrings';

import ReactJson from "react-json-view";

import { replaceHTMLEntities } from '@mikezimm/npmfunctions/dist/Services/Strings/html';
import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';
import { ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, IChartSeries, ICharNote, } 
    from '@mikezimm/npmfunctions/dist/CSSCharts/ICSSCharts';

import { getExpandColumns, getKeysLike, getSelectColumns } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';

import { LookupColumns, SourceInfo } from '../../DataInterface';
import { divide, stubFalse } from 'lodash';
import { makeToggleJSONCmd } from '../../Elements/CmdButton';
import { getDocWiki } from './getModernContent';
import { getModernHumanReadable } from './processModernContent';

const consoleLineItemBuild: boolean = false;

export default class SingleModernPage extends React.Component<ISingleModernPageProps, ISingleModernPageState> {

  private cke_editable = this.props.canvasOptions.addCkeEditToDiv !== false ? 'cke_editable' : '';

  private ToggleJSONCmd = makeToggleJSONCmd( this._toggleJSON.bind( this ) );


  public constructor(props:ISingleModernPageProps){
    super(props);
    console.log('constructor:',   );
    this.state = {
      showPanelJSON: false,
      showThisItem: this.props.page,
    };
  }

  public componentDidMount() {
    console.log('componentDidMount:',   );
    this.updateWebInfo( '', false );
  }

  public async updateWebInfo ( webUrl: string, listChangeOnly : boolean ) {
    console.log('updateWebInfo:',   );
    if ( this.props.page && this.props.showCanvasContent1 === true ) {
      getDocWiki( this.props.page , this.props.source, this.props.canvasOptions, this.props.showCanvasContent1, this.updateModernState.bind( this ) );
    }
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
      this.setState({ showThisItem: this.props.page });

    } else if ( this.props.page && !prevProps.page ) {
      this.setState({ showThisItem: this.props.page });

    } else if ( this.props.imageStyle !== prevProps.imageStyle ) {
        this.setState({ showThisItem: this.props.page });

    } else if ( JSON.stringify( this.props.canvasOptions) !== JSON.stringify( prevProps.canvasOptions ) ) {
      this.setState({ showThisItem: this.props.page, });

    } else if ( this.props.page === null ) {
      //Do nothing if page is null

    } else if ( this.props.page.ID !== prevProps.page.ID ) {
      this.setState({ showThisItem: this.props.page, });
    }
  }

  public render(): React.ReactElement<ISingleModernPageProps> {

    const { showCanvasContent1, } = this.props;
    const { showThisItem, } = this.state;

    if ( !showThisItem ) {
      // const FetchingSpinner = <Spinner size={SpinnerSize.large} label={"Fetching Page ..."} style={{ padding: 30 }} />;
      // return ( <div>{ FetchingSpinner }</div> );
      return ( <div></div> );
    } else {

      const debugContent = this.props.debugMode !== true ? null : <div>
        App in debugMode - Change in Web Part Properties - Page Preferences.  <b><em>Currently in SinglePage</em></b>
      </div>;


      let panelHeading = null;
      let panelTitle = 'Unknown Title';
      if ( showThisItem.Title ) { panelTitle = showThisItem.Title ; }
      else if ( showThisItem.Title0 ) { panelTitle = showThisItem.Title0 ; }
      else if ( showThisItem.FileLeafRef ) { panelTitle = showThisItem.FileLeafRef ; }

      panelHeading = <div className={ styles.supPanelHeader }>
      <h2>{ panelTitle }</h2>
      <div className={ styles.dateStamps}>
        <div>Created</div> <div>{ showThisItem.createdLoc }</div> <div>{ showThisItem['Author/Title'] }</div>
      </div>
      <div className={ styles.dateStamps}>
        <div>Modified</div> <div>{ showThisItem.modifiedLoc }</div> <div>{ showThisItem['Editor/Title'] }</div>
      </div>

      <div style={{ paddingBottom: '20px'}}>
        <h3 style={{ cursor: 'pointer', paddingTop: '15px', marginBottom: '0px' }} 
          onClick={ this.clickOpenInNewTab.bind( this, showThisItem.FileRef ? showThisItem.FileRef : showThisItem.searchHref ) }>
          Click here to go to full page item ( in a new tab ) <Icon iconName='OpenInNewTab'></Icon></h3>
        <div>File Location: { showThisItem.FileRef ? showThisItem.FileRef : showThisItem.searchHref }</div>
      </div>
      {/* <div className={ styles.dateStamps}>
        <div>Version</div> <div>{ showThisItem.modifiedLoc }</div> <div>{ showThisItem['Editor/Title'] }</div>
      </div> */}
      </div>;

      const articleTitle = showThisItem ? showThisItem.Title : 'No title found';
      let articleDesc: any  = showThisItem ? showThisItem.Description : '';

      const imageUrl = showThisItem ? showThisItem.BannerImageUrl : null;
      const image = !showThisItem || !imageUrl ? null : 
      <img src={ imageUrl.Url } height="100px" width="100%" style={{ objectFit: "cover" }} title={ imageUrl.Url }></img>;

      let headerComponent = <div>
          { debugContent }
          { image }
          { panelHeading }
          { articleDesc ? <h3>Description:</h3> : null }
          { articleDesc }
      </div>;


      if ( !showThisItem ) {
        return null;

      //Add warning to link outside of our system.
      } else if ( showThisItem && showThisItem['OData__OriginalSourceUrl'] && showThisItem['OData__OriginalSourceUrl'].indexOf( window.location.origin ) < 0 ) {
        //Link is external...  Use different instructions
        return (
          <div style={{ paddingTop: '15px'}}>
          { headerComponent }
          <div style={{ paddingBottom: '10px', fontWeight: 600 }}>To go to article: <span style={{ cursor: 'pointer', color: 'darkblue' }}onClick={ this.openThisLink.bind( this, showThisItem['OData__OriginalSourceUrl'] )}>click here</span></div>
          <div style={{ color: 'red', }}>Security check :)  This is the full link you will be clicking on</div>
          <div>{ showThisItem['OData__OriginalSourceUrl'] } </div>
        </div>
        );

      } else if ( showCanvasContent1 !== true ) {
        return (
          <div style={{ paddingTop: '15px'}}>
            { headerComponent }
            <div>To go to article: <span style={{ cursor: 'pointer', color: 'darkblue' }}onClick={ this.openArticleNewTab.bind( this, showThisItem )}>click here</span></div>
            <div>To open article in NEW full-size tab: <b>CTRL-Click the Title</b> </div>
            <div>To show it right here: <b>CTRL-ALT-Click the Title</b></div>
            <div>To show it in a side panel: <b>ALT-Click the Title</b></div>
          </div>);

      } else {

        const CanvasContent1 = !showThisItem || !showThisItem.CanvasContent1Str ? null : 
        <div className={ ['', this.cke_editable].join(' ') }>
          <h2 style={{marginTop: '20px', textDecoration: 'underline' }}>Item Content</h2>
          <div dangerouslySetInnerHTML={{ __html: showThisItem.CanvasContent1Str }} />
        </div>;

        if ( CanvasContent1 ) { articleDesc = null ; } //Remove Description because full article is shown below

        const jsonContent = this.state.showPanelJSON !== true ? null : <div>
          <ReactJson src={ showThisItem } name={ 'Summary' } collapsed={ false } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '20px 0px' }}/>
        </div>;

        const fileEmbed = !showThisItem || !showThisItem.ServerRedirectedEmbedUrl ? null : <iframe src={ showThisItem.ServerRedirectedEmbedUrl } height='350px' width='100%' style={{paddingTop: '20px' }}></iframe>;

        return (
          // <div className={ styles.alvFinMan }>
          <div className={ [stylesM.article, '' ].join(' ') }>
            { headerComponent }
            { CanvasContent1 }
            { fileEmbed }
            { this.ToggleJSONCmd }
            { jsonContent }
          </div>
        );
      }
    }

  }

  //getDocWiki( item: IPagesContent, source: ISourceProps,  canvasOptions: ICanvasContentOptions, callBack: any )
  private updateModernState( item: IPagesContent, ) {
    this.setState({ 
      showThisItem: item });
  }

  private openArticleNewTab( item: IPagesContent ) {
    window.open( item.File.ServerRelativeUrl , '_blank' );
  }

  private openThisLink( link:string ) {
    window.open( link , '_blank' );
  }

  private clickOpenInNewTab( href ) {
    console.log('clickOpenInNewTab:', href );
    window.open( href , '_blank' );
  }

  private _toggleJSON( ) {
    let newState = this.state.showPanelJSON === true ? false : true;

    let result = this.state.showThisItem;
    result = getModernHumanReadable( result );

    this.setState( { showThisItem: result , showPanelJSON: newState });
  }


}
