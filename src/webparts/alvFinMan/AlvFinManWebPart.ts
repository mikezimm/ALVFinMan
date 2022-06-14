import * as React from 'react';
import * as ReactDom from 'react-dom';
import { DisplayMode, Version } from '@microsoft/sp-core-library';

import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  IPropertyPaneDropdownProps,
  PropertyPaneToggle,
  PropertyPaneLabel,
  PropertyPaneSlider,
  IPropertyPaneSliderProps,

} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import { PropertyFieldPeoplePicker, PrincipalType } from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';


import { sp, Views, IViews, ISite } from "@pnp/sp/presets/all";

import { setPageFormatting, } from '@mikezimm/npmfunctions/dist/Services/DOM/FPSFormatFunctions';

import { IFPSPage, } from '@mikezimm/npmfunctions/dist/Services/DOM/FPSInterfaces';
import { createFPSWindowProps, initializeFPSSection, initializeFPSPage, webpartInstance, initializeMinimalStyle } from '@mikezimm/npmfunctions/dist/Services/DOM/FPSDocument';
import { IFPSWindowProps, IFPSSection, IFPSSectionStyle } from '@mikezimm/npmfunctions/dist/Services/DOM/FPSInterfaces';
import { setSectionStyles } from '@mikezimm/npmfunctions/dist/Services/DOM/setAllSectionStyles';
import { minimizeHeader } from '@mikezimm/npmfunctions/dist/Services/DOM/minimzeHeader';
import { minimizeToolbar } from '@mikezimm/npmfunctions/dist/Services/DOM/minimzeToolbar';
import { minimizeQuickLaunch } from '@mikezimm/npmfunctions/dist/Services/DOM/quickLaunch';

// import { FPSOptionsGroupBasic, FPSBanner2Group, FPSOptionsGroupAdvanced } from '@mikezimm/npmfunctions/dist/Services/PropPane/FPSOptionsGroup2';
import { FPSOptionsGroupBasic, FPSBanner3Group, FPSOptionsGroupAdvanced } from '@mikezimm/npmfunctions/dist/Services/PropPane/FPSOptionsGroup3';
import { FPSBanner3BasicGroup,FPSBanner3NavGroup, FPSBanner3ThemeGroup } from '@mikezimm/npmfunctions/dist/Services/PropPane/FPSOptionsGroup3';

import { FPSOptionsExpando, expandAudienceChoicesAll } from '@mikezimm/npmfunctions/dist/Services/PropPane/FPSOptionsExpando'; //expandAudienceChoicesAll

import { WebPartInfoGroup, JSON_Edit_Link } from '@mikezimm/npmfunctions/dist/Services/PropPane/zReusablePropPane';


import { _LinkIsValid } from '@mikezimm/npmfunctions/dist/Links/AllLinks';
import * as links from '@mikezimm/npmfunctions/dist/Links/LinksRepos';

import { importProps, } from '@mikezimm/npmfunctions/dist/Services/PropPane/ImportFunctions';

import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey 
} from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';

import { IBuildBannerSettings , buildBannerProps, IMinWPBannerProps } from '@mikezimm/npmfunctions/dist/HelpPanelOnNPM/onNpm/BannerSetup';

import { buildExportProps, buildFPSAnalyticsProps } from './BuildExportProps';

import { setExpandoRamicMode } from '@mikezimm/npmfunctions/dist/Services/DOM/FPSExpandoramic';
import { getUrlVars } from '@mikezimm/npmfunctions/dist/Services/Logging/LogFunctions';

//encodeDecodeString(this.props.libraryPicker, 'decode')
import { encodeDecodeString, } from "@mikezimm/npmfunctions/dist/Services/Strings/urlServices";

import { verifyAudienceVsUser } from '@mikezimm/npmfunctions/dist/Services/Users/CheckPermissions';

import { bannerThemes, bannerThemeKeys, makeCSSPropPaneString, createBannerStyleStr, createBannerStyleObj } from '@mikezimm/npmfunctions/dist/HelpPanelOnNPM/onNpm/defaults';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';
import { visitorPanelInfo } from './components/VisitorPanel/ALVFMVisitorPanel';
import { allALVFM } from '@mikezimm/npmfunctions/dist/HelpPanelOnNPM/onNpm/constants';

import { IWebpartHistory, IWebpartHistoryItem2 } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryInterface';
import { createWebpartHistory, ITrimThis, updateWebpartHistory, upgradeV1History } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryFunctions';

import { saveAnalytics3 } from '@mikezimm/npmfunctions/dist/Services/Analytics/analytics2';
import { IZLoadAnalytics, IZSentAnalytics, } from '@mikezimm/npmfunctions/dist/Services/Analytics/interfaces';
import { getSiteInfo, getWebInfoIncludingUnique } from '@mikezimm/npmfunctions/dist/Services/Sites/getSiteInfo';
import { IFPSUser } from '@mikezimm/npmfunctions/dist/Services/Users/IUserInterfaces';
import { getFPSUser } from '@mikezimm/npmfunctions/dist/Services/Users/FPSUser';

import { startPerformInit, startPerformOp, updatePerformanceEnd } from './components/Performance/functions';
import { IPerformanceOp, ILoadPerformanceALVFM, IHistoryPerformance } from './components/Performance/IPerformance';
import { IWebpartBannerProps } from '@mikezimm/npmfunctions/dist/HelpPanelOnNPM/onNpm/bannerProps';

import { PreConfiguredProps } from './PreConfiguredSettings';
import { getThisSitesPreConfigProps, IConfigurationProp, ISitePreConfigProps, IPreConfigSettings, IAllPreConfigSettings } from '@mikezimm/npmfunctions/dist/PropPaneHelp/PreConfigFunctions';

require('@mikezimm/npmfunctions/dist/Services/PropPane/GrayPropPaneAccordions.css');
require('@mikezimm/npmfunctions/dist/PropPaneHelp/PropPanelHelp.css');

export const repoLink: IRepoLinks = links.gitRepoALVFinManSmall;

import * as strings from 'AlvFinManWebPartStrings';
import AlvFinMan from './components/AlvFinMan';
import { defaultPivots, IDefaultPage } from './components/IAlvFinManProps';
import { IAlvFinManProps, ICanvasContentOptions, IFinManSearch, ImageFitPrefs, IModernImageSettings, ISearchBucket, PageLoadPefs } from './components/IAlvFinManProps';
import { IAlvFinManWebPartProps, exportIgnoreProps, importBlockProps, } from './IAlvFinManWebPartProps';
import { baseFetchInfo, IFetchInfo } from './components/IFetchInfo';
import { createEmptySearchBucket, } from './components/DataFetch';

const leftSearchDefault = 'Assets;Inventory;Payable;Payroll;Receivable;Tax;Treasury;';
const topSearchDefault = 'Capex;Inventory;Template;Policy;Weekly;Monthly;Quarterly;';

export default class AlvFinManWebPart extends BaseClientSideWebPart<IAlvFinManWebPartProps> {

   private DefaultPivotChoices =  defaultPivots.map( ( pivot, idx ) => {
     return { index: idx, key: pivot, text: pivot };
   });

   private PageLoadPrefsChoices =  PageLoadPefs.map( ( choice, idx ) => {
    return { index: idx, key: choice.key, text: choice.text };
  });
  
   private ImageFitPrefsChoices =  ImageFitPrefs.map( ( choice, idx ) => {
    return { index: idx, key: choice.key, text: choice.text };
  });
  

  //Added in v1.14
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

   private imageStyle: string = '';

  //Common FPS variables

  private sitePresets : ISitePreConfigProps = null;

  private analyticsWasExecuted: boolean = false;
  private sessionTabs: string[] = [];

  //Common FPS variables
  private _unqiueId;
  private validDocsContacts: string = '';

  private trickyApp = 'ALVFM';
  private wpInstanceID: any = webpartInstance( this.trickyApp );

  private FPSUser: IFPSUser = null;

  private urlParameters: any = {};

  //For FPS options
  private fpsPageDone: boolean = false;
  private fpsPageArray: any[] = null;
  private minQuickLaunch: boolean = false;
  private minHideToolbar: boolean = false;

  //For FPS Banner
  private forceBanner = true ;
  private modifyBannerTitle = true ;
  private modifyBannerStyle = true ;

  private  expandoDefault = false;
  private filesList: any = [];

  private exitPropPaneChanged = false;

  private expandoErrorObj = {

  };

  //ADDED FOR WEBPART HISTORY:  
  private thisHistoryInstance: IWebpartHistoryItem2 = null;

  private fetchInfo: IFetchInfo = null;

  private importErrorMessage = '';
    
  private performance : ILoadPerformanceALVFM = null;
  private bannerProps: IWebpartBannerProps = null;

  private beAReader: boolean = false; //2022-04-07:  Intent of this is a one-time per instance to 'become a reader' level user.  aka, hide banner buttons that reader won't see


  /***
 *     .d88b.  d8b   db      d888888b d8b   db d888888b d888888b 
 *    .8P  Y8. 888o  88        `88'   888o  88   `88'   `~~88~~' 
 *    88    88 88V8o 88         88    88V8o 88    88       88    
 *    88    88 88 V8o88         88    88 V8o88    88       88    
 *    `8b  d8' 88  V888        .88.   88  V888   .88.      88    
 *     `Y88P'  VP   V8P      Y888888P VP   V8P Y888888P    YP    
 *                                                               
 *                                                               
 */

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit().then(_ => {

      // other init code may be present

      let mess = 'onInit - ONINIT: ' + new Date().toLocaleTimeString();
      console.log(mess);

      //https://stackoverflow.com/questions/52010321/sharepoint-online-full-width-page
      if ( window.location.href &&  
        window.location.href.toLowerCase().indexOf("layouts/15/workbench.aspx") > 0 ) {
          
        if (document.getElementById("workbenchPageContent")) {
          document.getElementById("workbenchPageContent").style.maxWidth = "none";
        }
      } 

      //console.log('window.location',window.location);
      sp.setup({
        spfxContext: this.context
      });

      
      /***
     *     .d88b.  d8b   db      d888888b d8b   db d888888b d888888b      d8888b. db   db  .d8b.  .d8888. d88888b      .d888b. 
     *    .8P  Y8. 888o  88        `88'   888o  88   `88'   `~~88~~'      88  `8D 88   88 d8' `8b 88'  YP 88'          VP  `8D 
     *    88    88 88V8o 88         88    88V8o 88    88       88         88oodD' 88ooo88 88ooo88 `8bo.   88ooooo         odD' 
     *    88    88 88 V8o88         88    88 V8o88    88       88         88~~~   88~~~88 88~~~88   `Y8b. 88~~~~~       .88'   
     *    `8b  d8' 88  V888        .88.   88  V888   .88.      88         88      88   88 88   88 db   8D 88.          j88.    
     *     `Y88P'  VP   V8P      Y888888P VP   V8P Y888888P    YP         88      YP   YP YP   YP `8888Y' Y88888P      888888D 
     *                                                                                                                         
     *                                                                                                                         
     */

      //NEED TO APPLY THIS HERE as well as follow-up in render for it to not visibly change
      this.presetCollectionDefaults();

      this.imageStyle = this.updateImageStyleString();
      this.properties.pageLayout =  this.context['_pageLayoutType']?this.context['_pageLayoutType'] : this.context['_pageLayoutType'];
      this.urlParameters = getUrlVars();

      // DEFAULTS SECTION:  Performance   <<< ================================================================
      this.performance = startPerformInit( this.displayMode, false );

      // DEFAULTS SECTION:  FPSUser


      // (property) BaseClientSideWebPart<IAlvFinManWebPartProps>.context: WebPartContext
      // {@inheritDoc @microsoft/sp-component-base#BaseComponent.context}

      // Argument of type 'import("C:/Users/dev/Documents/GitHub/ALVFinMan7/node_modules/@microsoft/sp-webpart-base/dist/index-internal").WebPartContext' is not assignable to parameter of type 'import("C:/Users/dev/Documents/GitHub/ALVFinMan7/node_modules/@mikezimm/npmfunctions/node_modules/@microsoft/sp-webpart-base/dist/index-internal").WebPartContext'.
      //   Types have separate declarations of a private property '_domElement'.ts(2345)
      //Typed this.context as any to remove above error
      this.FPSUser = getFPSUser( this.context as any, allALVFM, this.trickyApp ) ;
      console.log( 'FPSUser: ', this.FPSUser );


      // DEFAULTS SECTION:  Expandoramic   <<< ================================================================
      this.expandoDefault = this.properties.expandoDefault === true && this.properties.enableExpandoramic === true && this.displayMode === DisplayMode.Read ? true : false;
      if ( this.urlParameters.Mode === 'Edit' ) { this.expandoDefault = false; }
      let expandoStyle: any = {};

      //2022-04-07:  Could use the function for parsing JSON for this... check npmFunctions
      try {
        expandoStyle = JSON.parse( this.properties.expandoStyle );

      } catch(e) {
        console.log('Unable to expandoStyle: ', this.properties.expandoStyle);
      }

      let padding = this.properties.expandoPadding ? this.properties.expandoPadding : 20;
      setExpandoRamicMode( this.context.domElement, this.expandoDefault, expandoStyle,  false, false, padding, this.properties.pageLayout  );
      this.properties.showRepoLinks = false;
      this.properties.showExport = false;

      // DEFAULTS SECTION:  Banner   <<< ================================================================
      //This updates unlocks styles only when bannerStyleChoice === custom.  Rest are locked in the ui.
      if ( this.properties.bannerStyleChoice === 'custom' ) { this.properties.lockStyles = false ; } else { this.properties.lockStyles = true; }

      if ( this.properties.bannerHoverEffect === undefined ) { this.properties.bannerHoverEffect = true; }

      if ( this.context.pageContext.site.serverRelativeUrl.toLowerCase().indexOf( '/sites/lifenet') === 0 ) {
        if ( !this.properties.bannerStyle ) { this.properties.bannerStyle = createBannerStyleStr( 'corpDark1', 'banner') ; }
        if ( !this.properties.bannerCmdStyle ) { this.properties.bannerCmdStyle = createBannerStyleStr( 'corpDark1', 'banner') ; }
      }

      // DEFAULTS SECTION:  Panel   <<< ================================================================
      if ( !this.properties.fullPanelAudience || this.properties.fullPanelAudience.length === 0 ) {
        this.properties.fullPanelAudience = 'Everyone';
      }
      if ( !this.properties.documentationLinkDesc || this.properties.documentationLinkDesc.length === 0 ) {
        this.properties.documentationLinkDesc = 'Documentation';
      }


      // DEFAULTS SECTION:  webPartHistory   <<< ================================================================
      //Preset this on existing installations
      // if ( this.properties.forceReloadScripts === undefined || this.properties.forceReloadScripts === null ) {
      //   this.properties.forceReloadScripts = false;
      // }
      //ADDED FOR WEBPART HISTORY:  This sets the webpartHistory
      this.thisHistoryInstance = createWebpartHistory( 'onInit' , 'new', this.context.pageContext.user.displayName );
      let priorHistory : IWebpartHistoryItem2[] = this.properties.webpartHistory ? upgradeV1History( this.properties.webpartHistory ).history : [];
      this.properties.webpartHistory = {
        thisInstance: this.thisHistoryInstance,
        history: priorHistory,
      };

      // DEFAULTS SECTION:  ALVFinMan   <<< ================================================================
      if ( !this.properties.defaultPivotKey ) { this.properties.defaultPivotKey = 'General' ; }
      if ( defaultPivots.indexOf( this.properties.defaultPivotKey ) < 0 ) { this.properties.defaultPivotKey = defaultPivots[0] ; }

      this.renderCustomStyles( false );
      this.resetAllSearch();

    });


  }

  public render(): void {

    //Preset infoElement to question mark circle for this particular web part if it's not specificed - due to pin icon being important and usage in pinned location
    if ( !this.properties.infoElementChoice ) { this.properties.infoElementChoice = 'IconName=Unknown'; }
    if ( !this.properties.infoElementText ) { this.properties.infoElementText = 'Question mark circle'; }
    
    this._unqiueId = this.context.instanceId;

    // quickRefresh is used for SecureScript for when caching html file.  <<< ================================================================
    let renderAsReader = this.displayMode === DisplayMode.Read && this.beAReader === true ? true : false;

    let errMessage = '';
    this.validDocsContacts = '';

    if ( this.properties.documentationIsValid !== true ) { errMessage += ' Invalid Support Doc Link: ' + ( this.properties.documentationLinkUrl ? this.properties.documentationLinkUrl : 'Empty.  ' ) ; this.validDocsContacts += 'DocLink,'; }
    if ( !this.properties.supportContacts || this.properties.supportContacts.length < 1 ) { errMessage += ' Need valid Support Contacts' ; this.validDocsContacts += 'Contacts,'; }

    let errorObjArray :  any[] =[];

    /***
      *    d8888b.  .d8b.  d8b   db d8b   db d88888b d8888b. 
      *    88  `8D d8' `8b 888o  88 888o  88 88'     88  `8D 
      *    88oooY' 88ooo88 88V8o 88 88V8o 88 88ooooo 88oobY' 
      *    88~~~b. 88~~~88 88 V8o88 88 V8o88 88~~~~~ 88`8b   
      *    88   8D 88   88 88  V888 88  V888 88.     88 `88. 
      *    Y8888P' YP   YP VP   V8P VP   V8P Y88888P 88   YD 
      *                                                      
      *                                                      
      */

    let replacePanelWarning = `Anyone with lower permissions than '${this.properties.fullPanelAudience}' will ONLY see this content in panel`;

    console.log('mainWebPart: buildBannerSettings ~ 255',   );

    let buildBannerSettings : IBuildBannerSettings = {

      FPSUser: this.FPSUser,
      //this. related info
      context: this.context as any,
      clientWidth: ( this.domElement.clientWidth - ( this.displayMode === DisplayMode.Edit ? 250 : 0) ),
      exportProps: buildExportProps( this.properties, this.wpInstanceID, this.context.pageContext.web.serverRelativeUrl ),

      //Webpart related info
      panelTitle: 'ALV Financial Manual - Beta App',
      modifyBannerTitle: this.modifyBannerTitle,
      repoLinks: repoLink,

      //Hard-coded Banner settings on webpart itself
      forceBanner: this.forceBanner,
      earyAccess: false,
      wideToggle: true,
      expandAlert: false,
      expandConsole: true,

      replacePanelWarning: replacePanelWarning,
      //Error info
      errMessage: errMessage,
      errorObjArray: errorObjArray, //In the case of Pivot Tiles, this is manualLinks[],
      expandoErrorObj: this.expandoErrorObj,

      beAUser: renderAsReader,
      showBeAUserIcon: null,

    };

    console.log('mainWebPart: showTricks ~ 288',   );
    let showTricks: any = false;
    links.trickyEmails.map( getsTricks => {
      if ( this.context.pageContext.user.loginName && this.context.pageContext.user.loginName.toLowerCase().indexOf( getsTricks ) > -1 ) { 
        showTricks = true ;
        this.properties.showRepoLinks = true; //Always show these users repo links
      }
    } );
    
    // if ( this.context.pageContext.user.loginName.indexOf( 'oger.elm') > -1 ){ showTricks = true ; }
    // if ( this.context.pageContext.user.loginName.indexOf( 'oger.elm') > -1 ){ showTricks = true ; }

    console.log('mainWebPart: verifyAudienceVsUser ~ 297',   );
    this.properties.showBannerGear = verifyAudienceVsUser( this.FPSUser , showTricks, this.properties.homeParentGearAudience, null, renderAsReader );
    // showTricks = false; Setting this causes this issue in some way:  https://github.com/mikezimm/ALVFinMan/issues/90
    // showTricks = false ;
    let bannerSetup = buildBannerProps( this.properties , this.FPSUser, buildBannerSettings, showTricks, renderAsReader, this.displayMode );

    errMessage = bannerSetup.errMessage;
    this.bannerProps = bannerSetup.bannerProps;
    let expandoErrorObj = bannerSetup.errorObjArray;

    this.bannerProps.showBeAUserIcon = true;

    if ( this.bannerProps.showBeAUserIcon === true ) { this.bannerProps.beAUserFunction = this.beAUserFunction.bind(this); }

    console.log('mainWebPart: baseFetchInfo ~ 308',   );
    this.fetchInfo = baseFetchInfo( '', this.performance );

    console.log('mainWebPart: visitorPanelInfo ~ 311',   );
    this.properties.replacePanelHTML = visitorPanelInfo( this.properties, this.fetchInfo.performance ? this.fetchInfo.performance : null );

    this.bannerProps.replacePanelHTML = this.properties.replacePanelHTML;

    console.log('mainWebPart: createElement ~ 316',   );

    // showTricks = false; Setting this causes this issue in some way:  https://github.com/mikezimm/ALVFinMan/issues/90
    // this.bannerProps.showTricks = false;

    const search: IFinManSearch = {
      left: {
        SearchFixed: this.properties.leftSearchFixed,
        SearchStr: this.properties.leftSearchStr,
        Search: this.properties.leftSearch,
        SearchLC: this.properties.leftSearchLC,
        SearchCount:  this.properties.leftSearchLC.map( value => { return 0 ; } ),
        Objects: [],
        
        items: [],
        appLinks: [],
        entities: [],
        acronyms: [],
        accounts: [],
        manual: [],
        sups: [],
        // docs: [],

        news: [],
        help: [],

      },

      top: {
        SearchFixed: this.properties.topSearchFixed,
        SearchStr: this.properties.topSearchStr,
        Search: this.properties.topSearch,
        SearchLC: this.properties.topSearchLC,
        SearchCount:  this.properties.topSearchLC.map( value => { return 0 ; } ),
        Objects: [],

        items: [],
        appLinks: [],
        entities: [],
        acronyms: [],
        accounts: [],
        manual: [],
        sups: [],
        // docs: [],
        
        news: [],
        help: [],

      },
      type: createEmptySearchBucket(),
      searchPlural: this.properties.searchPlural,
      searchType: this.properties.searchType,

      manual: [],
      news: [],
      help: [],
      appLinks: [],
      entities: [],
      acronyms: [],
      sups: [],
      accounts: [],

    };

    let canvasOptions: ICanvasContentOptions = {

      pagePreference: this.properties.canPagePreference,

      addCkeEditToDiv: this.properties.canAddCkeEditToDiv,  //Will add class="cke_editable" to the styles.article div so that Tables have some formatting when shown in app.
      imageOptions: {
        height: this.properties.imgHeight,
        width: this.properties.imgWidth,
        objectFit: this.properties.imgObjectFit,
        style: this.updateImageStyleString(), //gets embedded directly into all image tags as:  <img style="Your style string here" - height: 150px; object-fit: "cover"; width: 100%;
        autoFix: this.properties.imgAutoFix, //Maybe eventually I could try to auto-fix but have this optional.
      },

      h1Styles: this.properties.canh1Styles, //Use similar to FPSPageOptions styling 
      h2Styles: this.properties.canh2Styles, //Use similar to FPSPageOptions styling 
      h3Styles: this.properties.canh3Styles, //Use similar to FPSPageOptions styling 

    };

    const element: React.ReactElement<IAlvFinManProps> = React.createElement(
      AlvFinMan,
      {
        //These were the default props for v1.14
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,

        //Environement props
        // pageContext: this.context.pageContext, //This can be found in the bannerProps now
        context: this.context,
        urlVars: getUrlVars(),
        displayMode: this.displayMode,

        saveLoadAnalytics: this.saveLoadAnalytics.bind(this),

        //Banner related props
        errMessage: 'any',
        bannerProps: this.bannerProps,
        webpartHistory: this.properties.webpartHistory,

        sitePresets: this.sitePresets,

        debugMode: this.properties.debugMode === true ? true : false,

        //ALVFM props
        defaultPivotKey: this.properties.defaultPivotKey,

        canvasOptions: canvasOptions,

        search: search,

        maxDeep: 20, //      maxDeep: 20,


      }
    );
    console.log('mainWebPart: ReactDom ~ 345',   );
    ReactDom.render(element, this.domElement);
  }


  private beAUserFunction() {
    console.log('beAUserFunction:',   );
    if ( this.displayMode === DisplayMode.Edit ) {
      alert("'Be a regular user' mode is only available while viewing the page.  \n\nOnce you are out of Edit mode, please refresh the page (CTRL-F5) to reload the web part.");

    } else {
      this.beAReader = this.beAReader === true ? false : true;
      this.render();
    }

  }


  /***
   *    d888888b db   db d88888b .88b  d88. d88888b 
   *    `~~88~~' 88   88 88'     88'YbdP`88 88'     
   *       88    88ooo88 88ooooo 88  88  88 88ooooo 
   *       88    88~~~88 88~~~~~ 88  88  88 88~~~~~ 
   *       88    88   88 88.     88  88  88 88.     
   *       YP    YP   YP Y88888P YP  YP  YP Y88888P 
   *                                                
   *                                                
   */

  // This will be for when upgrading to v1.14

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  
  /***
 *    d8888b. d8888b.  .d88b.  d8888b.      d8888b.  .d8b.  d8b   db d88888b       .o88b. db   db  .d8b.  d8b   db  d888b  d88888b 
 *    88  `8D 88  `8D .8P  Y8. 88  `8D      88  `8D d8' `8b 888o  88 88'          d8P  Y8 88   88 d8' `8b 888o  88 88' Y8b 88'     
 *    88oodD' 88oobY' 88    88 88oodD'      88oodD' 88ooo88 88V8o 88 88ooooo      8P      88ooo88 88ooo88 88V8o 88 88      88ooooo 
 *    88~~~   88`8b   88    88 88~~~        88~~~   88~~~88 88 V8o88 88~~~~~      8b      88~~~88 88~~~88 88 V8o88 88  ooo 88~~~~~ 
 *    88      88 `88. `8b  d8' 88           88      88   88 88  V888 88.          Y8b  d8 88   88 88   88 88  V888 88. ~8~ 88.     
 *    88      88   YD  `Y88P'  88           88      YP   YP VP   V8P Y88888P       `Y88P' YP   YP YP   YP VP   V8P  Y888P  Y88888P 
 *                                                                                                                                 
 *                                                                                                                                 
 */

  // This API is invoked after updating the new value of the property in the property bag (Reactive mode). 
  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any) {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);


    if ( propertyPath === 'documentationLinkUrl' || propertyPath === 'fpsImportProps' ) {
      this.properties.documentationIsValid = await _LinkIsValid( newValue ) === "" ? true : false;
      console.log( `${ newValue ? newValue : 'Empty' } Docs Link ${ this.properties.documentationIsValid === true ? ' IS ' : ' IS NOT ' } Valid `);
      
    } else {
      if ( !this.properties.documentationIsValid ) { this.properties.documentationIsValid = false; }
    }

    //ADDED FOR WEBPART HISTORY:  This sets the webpartHistory
    let trimThis: ITrimThis = 'end';
    if ( [].indexOf(propertyPath) > -1 ) {
      trimThis = 'none';
    } else if ( [].indexOf(propertyPath) > -1 ) {
      trimThis = 'start';
    }

    this.properties.webpartHistory = updateWebpartHistory( this.properties.webpartHistory , propertyPath , newValue, this.context.pageContext.user.displayName, trimThis );

    // console.log('webpartHistory:', this.thisHistoryInstance, this.properties.webpartHistory );


    if ( propertyPath === 'fpsImportProps' ) {

      if ( this.exitPropPaneChanged === true ) {//Added to prevent re-running this function on import.  Just want re-render. )
        this.exitPropPaneChanged = false;  //Added to prevent re-running this function on import.  Just want re-render.

      } else {
        let result = importProps( this.properties, newValue, [], importBlockProps );

        this.importErrorMessage = result.errMessage;
        if ( result.importError === false ) {
          this.properties.fpsImportProps = '';
          this.context.propertyPane.refresh();
        }
        this.exitPropPaneChanged = true;  //Added to prevent re-running this function on import.  Just want re-render.
        this.onPropertyPaneConfigurationStart();
        // this.render();
      }

    } else if ( propertyPath === 'bannerStyle' || propertyPath === 'bannerCmdStyle' )  {
      this.properties[ propertyPath ] = newValue;
      this.context.propertyPane.refresh();

    } else if (propertyPath === 'bannerStyleChoice')  {
      // bannerThemes, bannerThemeKeys, makeCSSPropPaneString

      if ( newValue === 'custom' ) {
        this.properties.lockStyles = false;

      } else if ( newValue === 'lock') {
        this.properties.lockStyles = true;

      } else {
        this.properties.lockStyles = true;
        this.properties.bannerStyle = createBannerStyleStr( newValue, 'banner' );
        this.properties.bannerCmdStyle = createBannerStyleStr( newValue, 'cmd' );

      }

    } else if ( propertyPath === 'topSearchStr' || propertyPath === 'leftSearchStr' ) {

      this.updateSearchProps( propertyPath, newValue );
    

    } else if ( propertyPath === 'topSearchFixed' || propertyPath === 'leftSearchFixed' ) {
      this.properties[ propertyPath ] = newValue;
      if ( newValue === true ) { //Reset values for that set of filters
        let newSearchString = propertyPath === 'leftSearchFixed' ? leftSearchDefault : topSearchDefault;
        this.updateSearchProps( propertyPath.replace('Fixed','Str' ), newSearchString );

      } else {  
        //Should leave current values, just unlock them
      }
      
    
    } else if ( propertyPath === 'searchDefault' ) {
      //Reset all search props and lock

      if ( newValue === true ) {
        this.resetAllSearch();
      }
    
    }

    this.context.propertyPane.refresh();

    this.render();

  }

  protected resetAllSearch () {

    if ( this.properties.leftSearchFixed !== false ) { this.properties.leftSearchFixed = true ; }
    if ( this.properties.topSearchFixed !== false ) { this.properties.topSearchFixed = true ; }

    if ( this.properties.searchPlural !== true ) { this.properties.searchPlural = false ; }
    if ( this.properties.searchDefault !== false ) { this.properties.searchDefault = true ; }

    if ( this.properties.searchType !== false ) { this.properties.searchType = true ; }

    if ( !this.properties.leftSearchStr ) { this.updateSearchProps( 'leftSearchStr', leftSearchDefault ); }
    if ( !this.properties.topSearchStr ) { this.updateSearchProps( 'topSearchStr', topSearchDefault ); }
  }

  protected updateSearchProps( propertyPath: string , newValue ) {

    let baseKey = propertyPath.replace('Str','');
    this.properties[ propertyPath ] = newValue;
    this.properties[ baseKey ] = [];
    this.properties[ baseKey + 'LC' ] = [];

    if ( !newValue || newValue.length === 0 ) { 
      console.log( "topSearchKeys IS EMPTY - No Categories will be shown!");
      
    } else { 
      let newSearch = newValue.split(';');
      newSearch = !newSearch ? newSearch : newSearch.map(s => s.trim());
      let thisPropertiesBaseKeyLC = JSON.parse(JSON.stringify( newSearch ).toLowerCase()) ;
      let thisPropertiesBaseKey = newSearch ;

      thisPropertiesBaseKeyLC.map( key => { if ( key ) { this.properties[ baseKey + 'LC' ].push( key ) ; } } ) ;
      thisPropertiesBaseKey.map( key => { if ( key ) { this.properties[ baseKey ].push( key ) ; } } ) ;

     }

  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
   return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true, //DONT FORGET THIS IF PROP PANE GROUPS DO NOT EXPAND
          groups: [
            WebPartInfoGroup( links.gitRepoALVFinManSmall, 'Modern ALV Finance Manual' ),
            {
              groupName: 'ALV Financial Manual - Basic',
              groupFields: [
                PropertyPaneDropdown('defaultPivotKey', <IPropertyPaneDropdownProps>{
                  label: 'Default Finance Manual Tab',
                  options: this.DefaultPivotChoices,
                }),

              ]
            }, // this group
            {
              groupName: 'ALV Financial Manual Search',
              isCollapsed: false,
              groupFields: [
                PropertyPaneToggle("leftSearchFixed", {
                  label: "Use Default Left Search categories",
                  onText: "Default",
                  offText: "Custom"
                }),

                PropertyPaneTextField('leftSearchStr', {
                  label: 'Left Search categories',
                  description: 'Single Words semi-colon (;) separated',
                  disabled: this.properties.leftSearchFixed === true ? true : false,
                }),

                PropertyPaneToggle("topSearchFixed", {
                  label: "Use Default Top Search categories",
                  onText: "Default",
                  offText: "Custom"
                }),

                PropertyPaneTextField('topSearchStr', {
                  label: 'Top Search categories',
                  description: 'Single Words semi-colon (;) separated',
                  disabled: this.properties.topSearchFixed === true ? true : false,
                }),

                PropertyPaneToggle("searchPlural", {
                  label: "Search plural categories - Just searchs for your word OR keyword with 's' at end like keyword.  NOTE this does not have ability to check the actual plural spelling of a word :(",
                  onText: "On",
                  offText: "Off",
                  disabled: true,
                }),

              ]
            }, // this group

            // imgHeight: imgHeight, //Converted to px
            // imgWidth: imgWidth, //Converted to %
            // imgObjectFit: imgObjectFit, //cover, contain, etc...
            // imgStyle: imgStyle, //gets embedded directly into all image tags as:  <img style="Your style string here" - height: 150px; object-fit: "cover"; width: 100%;
            // imgAutoFix: imgAutoFix, //Maybe eventually I could try to auto-fix but have this optional.
    
            // canPagePreference: canPagePreference, //Determines what default page load level
            
            // canAddCkeEditToDiv: canAddCkeEditToDiv,  //Will add class="cke_editable" to the styles.article div so that Tables have some formatting when shown in app.
    
            // canh1Styles: canh1Styles,  //Use similar to FPSPageOptions styling
            // canh2Styles: canh2Styles,  //Use similar to FPSPageOptions styling
            // canh3Styles: canh3Styles, //Use similar to FPSPageOptions styling

            {
              groupName: 'Page preferences',
              isCollapsed: true,
              groupFields: [
                PropertyPaneDropdown('canPagePreference', <IPropertyPaneDropdownProps>{
                  label: 'News and Help page load',
                  options: this.PageLoadPrefsChoices,
                }),

                PropertyPaneDropdown('imgObjectFit', <IPropertyPaneDropdownProps>{
                  label: 'News and Help page load',
                  options: this.ImageFitPrefsChoices,
                }),

                PropertyPaneSlider('imgHeight',  <IPropertyPaneSliderProps>{
                  label: 'Image Height (px)',
                  value: 150,
                  min: 50,
                  max: 350,
                  step: 25,
                }),

                PropertyPaneSlider('imgWidth',  <IPropertyPaneSliderProps>{
                  label: 'Image Width (%)',
                  value: 100,
                  min: 50,
                  max: 100,
                  step: 25,
                  disabled: false,
                }),

                PropertyPaneToggle("debugMode", {
                  label: "Debug mode",
                  onText: "On - adds special colors and text in app",
                  offText: "Off"
                }),
                //
              ]
            }, // this group

            {
              groupName: 'Visitor Help Info (required)',
              isCollapsed: true,
              groupFields: [

                PropertyPaneDropdown('fullPanelAudience', <IPropertyPaneDropdownProps>{
                  label: 'Full Help Panel Audience',
                  options: expandAudienceChoicesAll,
                }),

                PropertyPaneTextField('panelMessageDescription1',{
                  label: 'Panel Description',
                  description: 'Optional message displayed at the top of the panel for the end user to see.'
                }),

                PropertyPaneTextField('panelMessageSupport',{
                  label: 'Support Message',
                  description: 'Optional message to the user when looking for support',
                }),

                PropertyPaneTextField('panelMessageDocumentation',{
                  label: 'Documentation message',
                  description: 'Optional message to the user shown directly above the Documentation link',
                }),

                PropertyPaneTextField('documentationLinkUrl',{
                  label: 'PASTE a Documentation Link',
                  description: 'REQUIRED:  A valid link to documentation - DO NOT TYPE in or webpart will lage'
                }),

                PropertyPaneTextField('documentationLinkDesc',{
                  label: 'Documentation Description',
                  description: 'Optional:  Text user sees as the clickable documentation link',
                }),

                PropertyPaneTextField('panelMessageIfYouStill',{
                  label: 'If you still have... message',
                  description: 'If you have more than one contact, explain who to call for what'
                }),

                PropertyFieldPeoplePicker('supportContacts', {
                  label: 'Support Contacts',
                  initialData: this.properties.supportContacts,
                  allowDuplicate: false,
                  principalType: [ PrincipalType.Users, ],
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  //Had to cast  to get it to work
                  //https://github.com/pnp/sp-dev-fx-controls-react/issues/851#issuecomment-978990638
                  context: this.context as any,
                  properties: this.properties,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'peopleFieldId'
                }),



              ]}, // this group

              // FPSBanner3Group( this.forceBanner , this.modifyBannerTitle, this.modifyBannerStyle, this.properties.showBanner, null, true, this.properties.lockStyles, this.properties.infoElementChoice === 'Text' ? true : false ),

              FPSBanner3BasicGroup( this.forceBanner , this.modifyBannerTitle, this.properties.showBanner, this.properties.infoElementChoice === 'Text' ? true : false, true ),
              FPSBanner3NavGroup(), 
              FPSBanner3ThemeGroup( this.modifyBannerStyle, this.properties.showBanner, this.properties.lockStyles, ),

              FPSOptionsGroupBasic( false, true, true, true, this.properties.allSectionMaxWidthEnable, true, this.properties.allSectionMarginEnable, true ), // this group
              FPSOptionsExpando( this.properties.enableExpandoramic, this.properties.enableExpandoramic,null, null ),

            { groupName: 'Import Props',
            isCollapsed: true ,
            groupFields: [
              PropertyPaneTextField('fpsImportProps', {
                label: `Import settings from another ALV Financial Manual webpart`,
                description: 'For complex settings, use the link below to edit as JSON Object',
                multiline: true,
              }),
              JSON_Edit_Link,
            ]}, // this group
          ]
        }
      ]
    };
  }


  private updateImageStyleString() {
    let imageStyle = '';
    if ( this.properties.imgHeight && this.properties.imgHeight > 0 ) {
      imageStyle += ` height: ${this.properties.imgHeight}px;`;
    }
    if ( this.properties.imgWidth && this.properties.imgWidth > 0 ) {
      imageStyle += ` width: ${this.properties.imgWidth}%;`;
    }
    if ( this.properties.imgObjectFit ) {
      imageStyle += ` object-fit: ${this.properties.imgObjectFit};`;
    }
    if ( this.properties.imgStyle ) {
      imageStyle += ` ${this.properties.imgStyle }`;
    }
    imageStyle = ` style="${imageStyle}"`;

    return imageStyle;

  }

  /***
 *    .d8888. d888888b d888888b d88888b      d8888b. d8888b. d88888b .d8888. d88888b d888888b .d8888. 
 *    88'  YP   `88'   `~~88~~' 88'          88  `8D 88  `8D 88'     88'  YP 88'     `~~88~~' 88'  YP 
 *    `8bo.      88       88    88ooooo      88oodD' 88oobY' 88ooooo `8bo.   88ooooo    88    `8bo.   
 *      `Y8b.    88       88    88~~~~~      88~~~   88`8b   88~~~~~   `Y8b. 88~~~~~    88      `Y8b. 
 *    db   8D   .88.      88    88.          88      88 `88. 88.     db   8D 88.        88    db   8D 
 *    `8888Y' Y888888P    YP    Y88888P      88      88   YD Y88888P `8888Y' Y88888P    YP    `8888Y' 
 *                                                                                                    
 *                                                                                                    
 */
  
  private presetCollectionDefaults() {
    
    this.sitePresets = getThisSitesPreConfigProps( PreConfiguredProps, this.properties, this.context.pageContext.web.serverRelativeUrl );

    this.sitePresets.presets.map( setting => {
      if ( this.properties[setting.prop] === setting.value ) { 
        setting.status = 'valid';

      } else if ( !this.properties[setting.prop] ) { 
        this.properties[setting.prop] = setting.value ;
        setting.status = 'preset';

      }
    });

    this.sitePresets.forces.map( setting => {
      if ( this.properties[setting.prop] === setting.value ) { 
        setting.status = 'valid';

      } else if ( !this.properties[setting.prop] ) { 
        this.properties[setting.prop] = setting.value ;
        setting.status = 'preset';

      } else if ( this.properties[setting.prop] !== setting.value ) { 
        this.properties[setting.prop] = setting.value ;
        setting.status = 'changed';

      }

    });

    console.log('Preset props used:', this.sitePresets );

  }

  /***
 *    d88888b d8888b. .d8888.       .d88b.  d8888b. d888888b d888888b  .d88b.  d8b   db .d8888. 
 *    88'     88  `8D 88'  YP      .8P  Y8. 88  `8D `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
 *    88ooo   88oodD' `8bo.        88    88 88oodD'    88       88    88    88 88V8o 88 `8bo.   
 *    88~~~   88~~~     `Y8b.      88    88 88~~~      88       88    88    88 88 V8o88   `Y8b. 
 *    88      88      db   8D      `8b  d8' 88         88      .88.   `8b  d8' 88  V888 db   8D 
 *    YP      88      `8888Y'       `Y88P'  88         YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
 *                                                                                              
 *                                                                                              
 */

   private renderCustomStyles( doHeadings: boolean = true ) {

    //Used with FPS Options Functions
    this.setQuickLaunch( this.properties.quickLaunchHide );
    this.setThisPageFormatting( this.properties.fpsPageStyle );
    this.setToolbar( this.properties.toolBarHide );
    this.updateSectionStyles( );
  }

  /**
   * Used with FPS Options Functions
   * @param quickLaunchHide 
   */
   private setQuickLaunch( quickLaunchHide: boolean ) {
    if ( quickLaunchHide === true && this.minQuickLaunch === false ) {
      minimizeQuickLaunch( document , quickLaunchHide );
      this.minQuickLaunch = true;
    }
  }

  /**
   * Used with FPS Options Functions
   * @param quickLaunchHide 
   */
  private setToolbar( hideToolbar: boolean ) {

      if(this.displayMode == DisplayMode.Read && this.urlParameters.tool !== 'true' ){
        let value = hideToolbar === true ? 'none' : null;
        let toolBarStyle: IFPSSectionStyle = initializeMinimalStyle( 'Miminze Toolbar', this.wpInstanceID, 'display', value );
        minimizeToolbar( document, toolBarStyle, false, true );
        this.minHideToolbar = true;
      }

  }

  /**
   * Used with FPS Options Functions
   * @param fpsPageStyle 
   */
  private setThisPageFormatting( fpsPageStyle: string ) {

    let fpsPage: IFPSPage = initializeFPSPage( this.wpInstanceID, this.fpsPageDone, fpsPageStyle, this.fpsPageArray  );
    fpsPage = setPageFormatting( this.domElement, fpsPage );
    this.fpsPageArray = fpsPage.Array;
    this.fpsPageDone = fpsPage.do;

  }


  private updateSectionStyles( ) {

    let allSectionMaxWidth = this.properties.allSectionMaxWidthEnable !== true ? null : this.properties.allSectionMaxWidth;
    let allSectionMargin = this.properties.allSectionMarginEnable !== true ? null : this.properties.allSectionMargin;
    let sectionStyles = initializeFPSSection( this.wpInstanceID, allSectionMaxWidth, allSectionMargin,  );

    setSectionStyles( document, sectionStyles, true, true );

  }

/***
 *     .d8b.  d8b   db  .d8b.  db      db    db d888888b d888888b  .o88b. .d8888. 
 *    d8' `8b 888o  88 d8' `8b 88      `8b  d8' `~~88~~'   `88'   d8P  Y8 88'  YP 
 *    88ooo88 88V8o 88 88ooo88 88       `8bd8'     88       88    8P      `8bo.   
 *    88~~~88 88 V8o88 88~~~88 88         88       88       88    8b        `Y8b. 
 *    88   88 88  V888 88   88 88booo.    88       88      .88.   Y8b  d8 db   8D 
 *    YP   YP VP   V8P YP   YP Y88888P    YP       YP    Y888888P  `Y88P' `8888Y' 
 *                                                                                
 *                                                                                
 */
  
  private async saveLoadAnalytics( Title: string, Result: string, location: IDefaultPage ) {

    if ( this.sessionTabs.indexOf( location ) > -1 ) {
      //Tab was visited, determine action

    } else {
      this.sessionTabs.push( location );
      
    }


    if ( this.analyticsWasExecuted === true ) {
      console.log('saved view info already');

    } else {

      // Do not save anlytics while in Edit Mode... only after save and page reloads
      if ( this.displayMode === DisplayMode.Edit ) { return; }

      let loadProperties: IZLoadAnalytics = {
        SiteID: this.context.pageContext.site.id['_guid'] as any,  //Current site collection ID for easy filtering in large list
        WebID:  this.context.pageContext.web.id['_guid'] as any,  //Current web ID for easy filtering in large list
        SiteTitle:  this.context.pageContext.web.title as any, //Web Title
        TargetSite:  this.context.pageContext.web.serverRelativeUrl,  //Saved as link column.  Displayed as Relative Url
        ListID:  `${this.context.pageContext.list.id}`,  //Current list ID for easy filtering in large list
        ListTitle:  this.context.pageContext.list.title,
        TargetList: `${this.context.pageContext.web.serverRelativeUrl}`,  //Saved as link column.  Displayed as Relative Url

      };

      let zzzRichText1Obj = null;
      let zzzRichText2Obj = null;
      let zzzRichText3Obj = null;

      console.log( 'zzzRichText1Obj:', zzzRichText1Obj);
      console.log( 'zzzRichText2Obj:', zzzRichText2Obj);
      console.log( 'zzzRichText3Obj:', zzzRichText3Obj);

      let zzzRichText1 = null;
      let zzzRichText2 = null;
      let zzzRichText3 = null;

      //This will get rid of all the escaped characters in the summary (since it's all numbers)
      // let zzzRichText3 = ''; //JSON.stringify( fetchInfo.summary ).replace('\\','');
      //This will get rid of the leading and trailing quotes which have to be removed to make it real json object
      // zzzRichText3 = zzzRichText3.slice(1, zzzRichText3.length - 1);

      if ( zzzRichText1Obj ) { zzzRichText1 = JSON.stringify( zzzRichText1Obj ); }
      if ( zzzRichText2Obj ) { zzzRichText2 = JSON.stringify( zzzRichText2Obj ); }
      if ( zzzRichText3Obj ) { zzzRichText3 = JSON.stringify( zzzRichText3Obj ); }

      console.log('zzzRichText1 length:', zzzRichText1 ? zzzRichText1.length : 0 );
      console.log('zzzRichText2 length:', zzzRichText2 ? zzzRichText2.length : 0 );
      console.log('zzzRichText3 length:', zzzRichText3 ? zzzRichText3.length : 0 );

      let FPSProps = null;
      let FPSPropsObj = buildFPSAnalyticsProps( this.properties, this.wpInstanceID, this.context.pageContext.web.serverRelativeUrl );
      FPSProps = JSON.stringify( FPSPropsObj );

      let saveObject: IZSentAnalytics = {
        loadProperties: loadProperties,

        Title: Title,  //General Label used to identify what analytics you are saving:  such as Web Permissions or List Permissions.

        Result: Result,  //Success or Error

        // zzzText1: `${ this.properties.defPinState } - ${ this.properties.forcePinState ===  true ? 'forced' : '' }`,

        // zzzText2: `${ this.properties.showTOC } - ${  ( this.properties.tocExpanded  ===  true ? 'expanded' : '' ) } - ${  !this.properties.TOCTitleField ? 'Empty Title' : this.properties.TOCTitleField }`,
        // zzzText3: `${ this.properties.minHeadingToShow }`,

        // zzzText4: `${ this.properties.showSomeProps } - ${ this.properties.propsExpanded  ===  true ? 'expanded' : 'collapsed' } -${ !this.properties.propsTitleField ? 'Empty Title' : this.properties.propsTitleField }`,
        // zzzText5: `${ this.properties.showOOTBProps } - ${ this.properties.showCustomProps } - ${ this.properties.showApprovalProps }}`,

        // //Info1 in some webparts.  Simple category defining results.   Like Unique / Inherited / Collection
        // zzzText6: `${   this.properties.selectedProperties.join('; ') }`, //Info2 in some webparts.  Phrase describing important details such as "Time to check old Permissions: 86 snaps / 353ms"

        // zzzNumber1: fetchInfo.fetchTime,
        // zzzNumber2: fetchInfo.regexTime,
        // zzzNumber3: fetchInfo.Block.length,
        // zzzNumber4: fetchInfo.Warn.length,
        // zzzNumber5: fetchInfo.Verify.length,
        // zzzNumber6: fetchInfo.Secure.length,
        // zzzNumber7: fetchInfo.js.length,

        zzzRichText1: zzzRichText1,  //Used to store JSON objects for later use, will be stringified
        zzzRichText2: zzzRichText2,
        zzzRichText3: zzzRichText3,

        FPSProps: FPSProps,

      };

      saveAnalytics3( strings.analyticsWeb , `${strings.analyticsViewsList}` , saveObject, true );

      this.analyticsWasExecuted = true;
      console.log('saved view info');

    }

  }

}
