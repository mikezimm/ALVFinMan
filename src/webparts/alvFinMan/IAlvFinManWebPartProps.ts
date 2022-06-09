
// changes = changeScript, changeExpando, changeBanner, changefpsOptions1, changefpsOptions2, 

import { IExpandAudiences } from "@mikezimm/npmfunctions/dist/Services/PropPane/FPSOptionsExpando";

import { IWebpartHistory, IWebpartHistoryItem2, } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryInterface';
import { createWebpartHistory, updateWebpartHistory } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryFunctions';
import { ISupportedHost } from "@mikezimm/npmfunctions/dist/Services/PropPane/FPSInterfaces";

import { IPropertyFieldGroupOrPerson } from "@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker";

import { IPerformanceOp, ILoadPerformanceALVFM, IHistoryPerformance } from './components/Performance/IPerformance';
import { ILayoutAll, IPageLoadPref } from "./components/IAlvFinManProps";

  // // export interface IModernImageSettings {
  //   imgHeight: number | string;
  //   imgWidth: number | string;
  //   imgObjectFit: string; //cover, contain, etc...
  //   imgStyle: string; //gets embedded directly into all image tags as:  <img style="Your style string here" - height: 150px; object-fit: "cover"; width: 100%;
  //   imgAutoFix?: boolean; //Maybe eventually I could try to auto-fix but have this optional.
  
  // //}
  
  // // export interface ICanvasContentOptions {
    
  //   canAddCkeEditToDiv?: boolean;  //Will add class="cke_editable" to the styles.article div so that Tables have some formatting when shown in app.
  //   // imageOptions?: IModernImageSettings;
  
  //   canh1Styles?: string; //Use similar to FPSPageOptions styling 
  //   canh2Styles?: string; //Use similar to FPSPageOptions styling 
  //   canh3Styles?: string; //Use similar to FPSPageOptions styling 

export const changeCanvasImages = [ 'imgHeight', 'imgWidth', 'imgObjectFit', 'imgAutoFix', ];
export const changeCanvasNoAnalytics = [ 'imgStyle',  ];
export const changeCanvasOptions = [ 'canPagePreference', 'canAddCkeEditToDiv', 'canh1Styles', 'canh2Styles', 'canh3Styles', ];

export const changeExpando = [ 
  'enableExpandoramic','expandoDefault','expandoStyle', 'expandoPadding', 'expandoAudience',
  ];

export const changeVisitor = [ 'panelMessageDescription1', 'panelMessageSupport', 'panelMessageDocumentation', 'documentationLinkDesc', 'documentationLinkUrl', 'documentationIsValid', 'supportContacts' ];

export const changeBannerBasics = [ 'showBanner', 'bannerTitle', ];
export const changeBannerNav = [ 'showGoToHome', 'showGoToParent', 'homeParentGearAudience', ];
export const changeBannerTheme = [ 'bannerStyleChoice', 'bannerStyle', 'bannerCmdStyle', 'bannerHoverEffect',  ];
export const changeBannerOther = [ 'showRepoLinks', 'showExport', 'lockStyles',   ];

export const changeBanner = [ ...changeBannerBasics, ...changeBannerNav, ...changeBannerTheme, ...changeBannerOther  ];

export const changefpsOptions1 = [  'searchShow', 'quickLaunchHide', 'pageHeaderHide', 'allSectionMaxWidthEnable', 'allSectionMaxWidth', 'allSectionMarginEnable', 'allSectionMargin', 'toolBarHide', ];

 export const changefpsOptions2 = [  'fpsPageStyle', 'fpsContainerMaxWidth' ];


//, exportIgnoreProps, importBlockProps, importBlockPropsDev
//These props will not be exported even if they are in one of the change arrays above (fail-safe)
//This was done to always insure these values are not exported to the user

//Common props to Ignore export
export const exportIgnorePropsFPS = [ 'analyticsList', 'analyticsWeb',  ];

//Specific for this web part
export const exportIgnorePropsThis = [ ];

export const exportIgnoreProps = [ ...exportIgnorePropsFPS, ...exportIgnorePropsThis  ];

//These props will not be imported even if they are in one of the change arrays above (fail-safe)
//This was done so user could not manually insert specific props to over-right fail-safes built in to the webpart

//Common props to block import
export const importBlockPropsFPS = [ 'scenario', 'analyticsList', 'analyticsWeb', 'lastPropDetailChange', 'showBanner' , 'showTricks', 'showRepoLinks', 'showExport', 'fpsImportProps', 'fullPanelAudience', 'documentationIsValid', 'currentWeb', 'loadPerformance', 'webpartHistory', ];

//Specific for this web part
export const importBlockPropsThis = [ ];

export const importBlockProps = [ ...importBlockPropsFPS, ...importBlockPropsThis ];

export interface IAlvFinManWebPartProps {
  description: string;

  uniqueId: string;
  showBannerGear: boolean; // Not in Prop Pane

  pageLayout: ISupportedHost ;// like SinglePageApp etc... this.context[_pageLayout];

  //2022-02-17:  Added these for expandoramic mode
  enableExpandoramic: boolean;
  expandoDefault: boolean;
  expandoStyle: any;
  expandoPadding: number;
  expandoAudience: IExpandAudiences;

    // expandAlert: boolean;
    // expandConsole: boolean;
    //2022-02-17:  END additions for expandoramic mode

  // Section 15
  //General settings for Banner Options group
  // export interface IWebpartBannerProps {

  //[ 'showBanner', 'bannerTitle', 'showGoToHome', 'showGoToParent', 'homeParentGearAudience', 'bannerStyleChoice', 'bannerStyle', 'bannerCmdStyle', 'bannerHoverEffect', 'showRepoLinks', 'showExport' ];
    showBanner: boolean;
    bannerTitle: string;

    infoElementChoice: string;
    infoElementText: string;
    feedbackEmail: string;

    showGoToHome: boolean;  //defaults to true
    showGoToParent: boolean;  //defaults to true
    homeParentGearAudience: IExpandAudiences;

    bannerStyleChoice: string;
    bannerStyle: string;
    bannerCmdStyle: string;
    lockStyles: boolean;

    bannerHoverEffect: boolean;
    showRepoLinks: boolean;
    showExport: boolean;

    fullPanelAudience : IExpandAudiences;
    replacePanelHTML : any;  //This is the jsx sent to panel for User controled information (aka what reader will see when clicking 'info' button)

    //These are added for the minimum User Panel component ( which turns into the replacePanelHTML component )
    panelMessageDescription1: string; //
    panelMessageSupport: string;
    panelMessageDocumentation: string;
    panelMessageIfYouStill: string;
    documentationLinkDesc: string;
    documentationLinkUrl: string;
    documentationIsValid: boolean;
    supportContacts: IPropertyFieldGroupOrPerson[];

    //ADDED FOR WEBPART HISTORY:  
    webpartHistory: IWebpartHistory;


    showTricks: boolean;

    
  fpsImportProps: string;

  // }

  //Section 16 - FPS Options group
  searchShow: boolean;
  fpsPageStyle: string;
  fpsContainerMaxWidth: string;
  quickLaunchHide: boolean;

  //FPS Options part II
  pageHeaderHide: boolean;
  allSectionMaxWidthEnable: boolean;
  allSectionMaxWidth: number;
  allSectionMarginEnable: boolean;
  allSectionMargin: number;
  toolBarHide: boolean;


  //For ALVFinancialManual
  defaultPivotKey: ILayoutAll;

  leftSearchFixed: boolean; //Locks the search options
  leftSearchStr: string; // Primary/Fixed search for left side of search page
  leftSearch: string[]; //For easy display of casing
  leftSearchLC: string[]; //For easy string compare

  topSearchFixed: boolean; //Locks the search options
  topSearchStr: string;
  topSearch: string[]; //For easy display of casing
  topSearchLC: string[]; //For easy string compare

  searchPlural: boolean; //Future use, basically search for the keywords specified in props but also look for ones with an s after it.
  searchType:  boolean; //Choose to also filter on type of content:
  searchDefault:  boolean; //Resets all values to default and locks them.  Turning on and off resets all values

  loadPerformance: ILoadPerformanceALVFM;



  // export interface IModernImageSettings {
    imgHeight: number | string;
    imgWidth: number | string;
    imgObjectFit: string; //cover, contain, etc...
    imgStyle: string; //gets embedded directly into all image tags as:  <img style="Your style string here" - height: 150px; object-fit: "cover"; width: 100%;
    imgAutoFix?: boolean; //Maybe eventually I could try to auto-fix but have this optional.
  
  //}
  
  // export interface ICanvasContentOptions {
    canPagePreference: IPageLoadPref;
    canAddCkeEditToDiv?: boolean;  //Will add class="cke_editable" to the styles.article div so that Tables have some formatting when shown in app.
    // imageOptions?: IModernImageSettings;
  
    canh1Styles?: string; //Use similar to FPSPageOptions styling 
    canh2Styles?: string; //Use similar to FPSPageOptions styling 
    canh3Styles?: string; //Use similar to FPSPageOptions styling 
    
  // }


}
