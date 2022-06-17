import * as React from 'react';
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
  private imageStyle = '';

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
    if ( this.props.showCanvasContent1 === true ) {
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
    } else if ( JSON.stringify( this.props.canvasOptions) !== JSON.stringify( prevProps.canvasOptions ) ) {
      console.log('SingleModernPage style update: ', this.imageStyle );
      this.setState({ showThisItem: this.props.page, });
    }
  }

  public render(): React.ReactElement<ISingleModernPageProps> {

    if ( !this.props.page ) {
      return ( null );

    } else {

      const { showCanvasContent1, page } = this.props;
      const { showThisItem, } = this.state;

      const articleTitle = showThisItem ? showThisItem.Title : 'Select pages to show...';
      let articleDesc: any  = showThisItem ? showThisItem.Description : '';

      const imageUrl = showThisItem ? showThisItem.BannerImageUrl : null;


      const CanvasContent1 = !showThisItem || !showThisItem.CanvasContent1Str ? null : 
      <div className={ ['', this.cke_editable].join(' ') }>
        <h2>CanvasContent1</h2>
        <div dangerouslySetInnerHTML={{ __html: showThisItem.CanvasContent1Str }} />
      </div>;


      if ( CanvasContent1 ) { articleDesc = null ; } //Remove Description because full article is shown below

      let ClickInstructions = showCanvasContent1 === true ? null : 
      <div style={{ paddingTop: '15px'}}>
        <div>To go to article: <span style={{ cursor: 'pointer', color: 'darkblue' }}onClick={ this.openArticleNewTab.bind( this, showThisItem )}>click here</span></div>
        <div>To open article in NEW full-size tab: <b>CTRL-Click the Title</b> </div>
        <div>To show it right here: <b>CTRL-ALT-Click the Title</b></div>
        <div>To show it in a side panel: <b>ALT-Click the Title</b></div>
      </div>;

      //Add warning to link outside of our system.
      if ( showThisItem && showThisItem['OData__OriginalSourceUrl'] && showThisItem['OData__OriginalSourceUrl'].indexOf( window.location.origin ) < 0 ) {
        //Link is external...  Use different instructions
        ClickInstructions =
        <div style={{ paddingTop: '15px'}}>
          <div style={{ paddingBottom: '10px', fontWeight: 600 }}>To go to article: <span style={{ cursor: 'pointer', color: 'darkblue' }}onClick={ this.openThisLink.bind( this, showThisItem['OData__OriginalSourceUrl'] )}>click here</span></div>
          <div style={{ color: 'red', }}>Security check :)  This is the full link you will be clicking on</div>
          <div>{ showThisItem['OData__OriginalSourceUrl'] } </div>
        </div>;
      }

      const image = !showThisItem || !imageUrl ? null : 
        <img src={ imageUrl.Url } height="100px" width="100%" style={{ objectFit: "cover" }} title={ imageUrl.Url }></img>;

      const jsonContent = this.state.showPanelJSON !== true ? null : <div>
        <ReactJson src={ showThisItem } name={ 'Summary' } collapsed={ false } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '20px 0px' }}/>
      </div>;

return (
        // <div className={ styles.alvFinMan }>
        <div className={ null }>
          { image }
          <h3>{ articleTitle }</h3>
          { articleDesc }
          { CanvasContent1 }
          { this.ToggleJSONCmd }
          { jsonContent }
        </div>
      );

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

  private _toggleJSON( ) {
    let newState = this.state.showPanelJSON === true ? false : true;

    let result = this.state.showThisItem;
    result = getModernHumanReadable( result );

    this.setState( { showThisItem: result , showPanelJSON: newState });
  }


}
