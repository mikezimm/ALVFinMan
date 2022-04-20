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

} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import { PropertyFieldPeoplePicker, PrincipalType } from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';


import { sp, Views, IViews, ISite } from "@pnp/sp/presets/all";

import { createFPSWindowProps, initializeFPSSection, initializeFPSPage, webpartInstance, initializeMinimalStyle } from '@mikezimm/npmfunctions/dist/Services/DOM/FPSDocument';

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

import { IBuildBannerSettings , buildBannerProps, IMinWPBannerProps } from '@mikezimm/npmfunctions/dist/HelpPanel/onNpm/BannerSetup';

import { buildExportProps } from './BuildExportProps';

import { setExpandoRamicMode } from '@mikezimm/npmfunctions/dist/Services/DOM/FPSExpandoramic';
import { getUrlVars } from '@mikezimm/npmfunctions/dist/Services/Logging/LogFunctions';

//encodeDecodeString(this.props.libraryPicker, 'decode')
import { encodeDecodeString, } from "@mikezimm/npmfunctions/dist/Services/Strings/urlServices";

import { verifyAudienceVsUser } from '@mikezimm/npmfunctions/dist/Services/Users/CheckPermissions';

import { bannerThemes, bannerThemeKeys, makeCSSPropPaneString, createBannerStyleStr, createBannerStyleObj } from '@mikezimm/npmfunctions/dist/HelpPanel/onNpm/defaults';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';
import { visitorPanelInfo } from './components/VisitorPanel/ALVFMVisitorPanel';

import { IWebpartHistory, IWebpartHistoryItem2 } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryInterface';
import { createWebpartHistory, ITrimThis, updateWebpartHistory, upgradeV1History } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryFunctions';

import { saveAnalytics3 } from '@mikezimm/npmfunctions/dist/Services/Analytics/analytics2';
import { IZLoadAnalytics, IZSentAnalytics, } from '@mikezimm/npmfunctions/dist/Services/Analytics/interfaces';
import { getSiteInfo, getWebInfoIncludingUnique } from '@mikezimm/npmfunctions/dist/Services/Sites/getSiteInfo';
import { IFPSUser } from '@mikezimm/npmfunctions/dist/Services/Users/IUserInterfaces';
import { getFPSUser } from '@mikezimm/npmfunctions/dist/Services/Users/FPSUser';

import { startPerformInit, startPerformOp, updatePerformanceEnd } from './components/Performance/functions';
import { IPerformanceOp, ILoadPerformanceALVFM, IHistoryPerformance } from './components/Performance/IPerformance';
import { IWebpartBannerProps } from '@mikezimm/npmfunctions/dist/HelpPanel/onNpm/bannerProps';

require('../../services/propPane/GrayPropPaneAccordions.css');

export const repoLink: IRepoLinks = links.gitRepoALVFinManSmall;

import * as strings from 'AlvFinManWebPartStrings';
import AlvFinMan from './components/AlvFinMan';
import { IAlvFinManProps, ILayoutAll } from './components/IAlvFinManProps';
import { IAlvFinManWebPartProps, exportIgnoreProps, importBlockProps, } from './IAlvFinManWebPartProps';
import { baseFetchInfo, IFetchInfo } from './components/IFetchInfo';

export default class AlvFinManWebPart extends BaseClientSideWebPart<IAlvFinManWebPartProps> {

  //Added in v1.14
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  //Common FPS variables
  private _unqiueId;
  private validDocsContacts: string = '';

  private trickyApp = 'ALVFM';
  private wpInstanceID: any = webpartInstance( this.trickyApp );

  private FPSUser: IFPSUser = null;

  private urlParameters: any = {};

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
      this.FPSUser = getFPSUser( this.context as any, links.trickyEmails, this.trickyApp ) ;
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
      if ( !this.properties.defaultPivotKey ) { this.properties.defaultPivotKey = 'Main' ; }
    });


  }

  public render(): void {

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
    let buildBannerSettings : IBuildBannerSettings = {

      FPSUser: this.FPSUser,
      //this. related info
      context: this.context as any,
      clientWidth: ( this.domElement.clientWidth - ( this.displayMode === DisplayMode.Edit ? 250 : 0) ),
      exportProps: buildExportProps( this.properties, this.wpInstanceID, this.context.pageContext.web.serverRelativeUrl ),

      //Webpart related info
      panelTitle: 'ALV Financial Manual',
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

    let showTricks: any = false;
    links.trickyEmails.map( getsTricks => {
      if ( this.context.pageContext.user.loginName && this.context.pageContext.user.loginName.toLowerCase().indexOf( getsTricks ) > -1 ) { 
        showTricks = true ;
        this.properties.showRepoLinks = true; //Always show these users repo links
      }
      } );

    this.properties.showBannerGear = verifyAudienceVsUser( this.FPSUser , showTricks, this.properties.homeParentGearAudience, null, renderAsReader );
    let bannerSetup = buildBannerProps( this.properties , this.FPSUser, buildBannerSettings, showTricks, renderAsReader );
    errMessage = bannerSetup.errMessage;
    this.bannerProps = bannerSetup.bannerProps;
    let expandoErrorObj = bannerSetup.errorObjArray;

    this.bannerProps.showBeAUserIcon = true;

    if ( this.bannerProps.showBeAUserIcon === true ) { this.bannerProps.beAUserFunction = this.beAUserFunction.bind(this); }

    this.fetchInfo = baseFetchInfo( '', this.performance );

    this.properties.replacePanelHTML = visitorPanelInfo( this.properties, this.fetchInfo.performance ? this.fetchInfo.performance : null );

    this.bannerProps.replacePanelHTML = this.properties.replacePanelHTML;


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

        defaultPivotKey: this.properties.defaultPivotKey,

        customSearch: this.properties.customSearch,
        customSearchLC: this.properties.customSearchLC,

        //Banner related props
        errMessage: 'any',
        bannerProps: this.bannerProps,
        webpartHistory: this.properties.webpartHistory,

      }
    );

    ReactDom.render(element, this.domElement);
  }


  private beAUserFunction() {
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

    } else if ( propertyPath === 'customSearchStr' ) {

      if ( !newValue || newValue.length === 0 ) { 
        console.log( "customSearchKeys IS EMPTY - No Categories will be shown!");
        this.properties.customSearch = [];
        this.properties.customSearchLC = [];
        
      }
      else { 
        this.properties.customSearch = newValue.split(';');
        this.properties.customSearch = this.properties.customSearch.map(s => s.trim());
        this.properties.customSearchLC = JSON.parse(JSON.stringify(this.properties.customSearch).toLowerCase()) ;
       }
    
    }
    this.context.propertyPane.refresh();

    this.render();
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
            {
              groupName: 'ALV Financial Manual Options',
              groupFields: [
                PropertyPaneTextField('defaultPivotKey', {
                  label: 'Default Tab',
                  description: 'Recent News always loads first though',
                }),
                PropertyPaneTextField('customSearchStr', {
                  label: 'Custom search keywords',
                  description: 'Semi-colon separated words, no special charaters or spaces',
                }),
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

              FPSBanner3BasicGroup( this.forceBanner , this.modifyBannerTitle, this.properties.showBanner, this.properties.infoElementChoice === 'Text' ? true : false ),
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
}
