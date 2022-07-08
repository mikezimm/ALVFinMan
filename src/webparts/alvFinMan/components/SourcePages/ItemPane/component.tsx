import * as React from 'react';

import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { Spinner, SpinnerSize, } from 'office-ui-fabric-react/lib/Spinner';


import styles from './itemPane.module.scss';
import stylesP from '../SourcePages.module.scss';
import stylesA from '../../AlvFinMan.module.scss';
// import stylesM from '../ModernPages.module.scss';
import { ILayoutGPage, ILayoutSPage, ILayoutAPage, IFMBuckets, IPagesContent, IAnyContent,   } from '../../IAlvFinManProps';
import { IItemPaneProps, IItemPaneState, } from './IItemPaneProps';

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
// import { getDocWiki } from './getModernContent';
// import { getModernHumanReadable } from './processModernContent';

const consoleLineItemBuild: boolean = false;

export default class ItemPane extends React.Component<IItemPaneProps, IItemPaneState> {

  private ToggleJSONCmd = makeToggleJSONCmd( this._toggleJSON.bind( this ) );

  public constructor(props:IItemPaneProps){
    super(props);
    console.log('constructor:',   );
    this.state = {
      showPanelJSON: false,
      showThisItem: this.props.item,
    };
  }

  public componentDidMount() {
    console.log('componentDidMount:',   );
    this.updateWebInfo( '', false );
  }

  public async updateWebInfo ( webUrl: string, listChangeOnly : boolean ) {
    console.log('updateWebInfo:',   );
    if ( this.props.item && this.props.showCanvasContent1 === true ) {
      // getDocWiki( this.props.page , this.props.source, this.props.canvasOptions, this.props.showCanvasContent1, this.updateModernState.bind( this ) );
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
      this.setState({ showThisItem: this.props.item });

    } else if ( this.props.imageStyle !== prevProps.imageStyle ) {
        this.setState({ showThisItem: this.props.item });

    } else if ( JSON.stringify( this.props.canvasOptions) !== JSON.stringify( prevProps.canvasOptions ) ) {
      this.setState({ showThisItem: this.props.item, });

    } else if ( this.props.item === null ) {
      //Do nothing if page is null

    } else if ( this.props.item.ID !== prevProps.item.ID ) {
      this.setState({ showThisItem: this.props.item, });
    }
  }

  public render(): React.ReactElement<IItemPaneProps> {

    const { primarySource , topButtons, debugMode, showCanvasContent1,  } = this.props;
    const { showThisItem ,  } = this.state;

    if ( !showThisItem ) {
      // const FetchingSpinner = <Spinner size={SpinnerSize.large} label={"Fetching Page ..."} style={{ padding: 30 }} />;
      // return ( <div>{ FetchingSpinner }</div> );
      return ( <div></div> );
    } else {

      const gotoListLink = !primarySource.webRelativeLink ? null : <div className={ [ stylesA.searchStatus, stylesP.goToLink ].join(' ')} onClick={ () => { window.open( `${primarySource.webUrl}${primarySource.webRelativeLink}`,'_blank' ) ; } }>
        Go to full list <Icon iconName='OpenInNewTab'></Icon>
      </div>;

      const debugContent = this.props.debugMode !== true ? null : <div>
        App in debugMode - Change in Web Part Properties - Page Preferences.  <b><em>Currently in ItemPane</em></b>
      </div>;


      let panelHeading = null;
      let panelTitle = 'Unknown Title';
      if ( showThisItem.Title ) { panelTitle = showThisItem.Title ; }
      else if ( showThisItem.Title0 ) { panelTitle = showThisItem.Title0 ; }
      else if ( showThisItem.FileLeafRef ) { panelTitle = showThisItem.FileLeafRef ; }

      panelHeading = <div className={ stylesA.supPanelHeader }>
      <h2>{ panelTitle }</h2>
      <div className={ stylesA.dateStamps}>
        <div>Created</div> <div>{ showThisItem.createdLoc }</div> <div>{ showThisItem['Author/Title'] }</div>
      </div>
      <div className={ stylesA.dateStamps}>
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

 
      let headerComponent = <div>
          { debugContent }
          { panelHeading }
      </div>;


      if ( !showThisItem ) {
        return null;

      //Add warning to link outside of our system.
      } else {


        let itemContent = <div>
        <h3 style={{ display: 'flex', justifyContent: 'flex-start', }}>
          { showThisItem.ID }
          { showThisItem.Title }
          <div style={{ cursor: 'pointer', paddingTop: '15px', marginBottom: '0px' }} 
            onClick={ () => { window.open( `${primarySource.viewItemLink.replace('{{item.ID}}', showThisItem.ID ) } `, '_blank' ) ; } }>
            Click here to open item ( in a new tab ) <Icon iconName='OpenInNewTab'></Icon></div>
        </h3>

        <div>
          <h3>Searched Properties</h3>
          { primarySource.searchProps.map( field => { return <div>{ field }: { showThisItem[ field ] }</div> ; }) }
        </div>

        <div>
          <h3>Selected Properties</h3>
          { primarySource.selectThese.map( field => { return <div>{ field }: { showThisItem[ field ] }</div> ; }) }
        </div>

      </div>;

        const jsonContent = this.state.showPanelJSON !== true ? null : <div>
          <ReactJson src={ showThisItem } name={ 'Summary' } collapsed={ false } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '20px 0px' }}/>
        </div>;

        // const fileEmbed = !showThisItem || !showThisItem.ServerRedirectedEmbedUrl ? null : <iframe src={ showThisItem.ServerRedirectedEmbedUrl } height='350px' width='100%' style={{paddingTop: '20px' }}></iframe>;

        return (
          // <div className={ styles.alvFinMan }>
          <div className={ [styles.itemPane, '' ].join(' ') }>
            { headerComponent }
            { itemContent }
            { this.ToggleJSONCmd }
            { jsonContent }
          </div>
        );
      }
    }

  }

  //getDocWiki( item: IPagesContent, source: ISourceProps,  canvasOptions: ICanvasContentOptions, callBack: any )
  private updateModernState( item: IAnyContent, ) {
    this.setState({ 
      showThisItem: item });
  }

  private openItemNewTab( item: IPagesContent ) {
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
    // result = getModernHumanReadable( result );

    this.setState( { showThisItem: result , showPanelJSON: newState });
  }


}
