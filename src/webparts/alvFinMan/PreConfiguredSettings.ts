import { IPropertyFieldGroupOrPerson } from "@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker";

import { IPreConfigSettings, IAllPreConfigSettings } from '@mikezimm/npmfunctions/dist/PropPaneHelp/PreConfigFunctions';
import { encrptMeOriginalTest } from '@mikezimm/npmfunctions/dist/HelpPanelOnNPM/onNpm/logTest';
import { ContALVFMContent, ContALVFMWebP } from '@mikezimm/npmfunctions/dist/HelpPanelOnNPM/onNpm/constants';
import { IObjectFit, IPageLoadPref } from "./components/IAlvFinManProps";

const imgHeight:number = 150; //Converted to px
const imgWidth:number = 100; //Converted to %
const imgObjectFit: IObjectFit = 'cover'; //cover; contain; etc...
const imgStyle: string =  ''; //gets embedded directly into all image tags as:  <img style="Your style string here" - height: 150px; object-fit: "cover"; width: 100%;
const imgAutoFix: boolean = false; //Maybe eventually I could try to auto-fix but have this optional.

const canPagePreference: IPageLoadPref = 'canvasContent1';

const canAddCkeEditToDiv: boolean = true;  //Will add class="cke_editable" to the styles.article div so that Tables have some formatting when shown in app.

const canh1Styles: string = '';  //Use similar to FPSPageOptions styling
const canh2Styles: string = '';  //Use similar to FPSPageOptions styling
const canh3Styles: string = ''; //Use similar to FPSPageOptions styling

const FinancialManualContacts: IPropertyFieldGroupOrPerson = {
    id: '1',
    description: '',
    fullName: 'Financial Manual Support team',
    login: '',
    email: `ae57524a.${window.location.hostname}.onmicrosoft.com@amer.teams.ms`,
    // jobTitle?: string;
    // initials?: string;
    imageUrl: null,
};


export const ForceEverywhere : IPreConfigSettings = {
    location: '*',
    props: {

        canh1Styles: canh1Styles,  //Use similar to FPSPageOptions styling
        canh2Styles: canh2Styles,  //Use similar to FPSPageOptions styling
        canh3Styles: canh3Styles, //Use similar to FPSPageOptions styling

        // Visitor Panel props that are not preset in manifest.json
        fullPanelAudience: 'Page Editors',
        panelMessageDescription1: 'Finance Manual Help and Contact',
        panelMessageSupport: `Contact ${encrptMeOriginalTest( ContALVFMContent )} for Finance Manual content`,
        panelMessageDocumentation: `Contact ${encrptMeOriginalTest( ContALVFMWebP )}  for Web part questions`,
        panelMessageIfYouStill: '',
        documentationLinkDesc: 'Finance Manual Help site',
        documentationLinkUrl: '/sites/FinanceManual/Help',
        documentationIsValid: true,
        supportContacts: [ FinancialManualContacts ],

        // FPS Banner Basics
        infoElementChoice: "IconName=Unknown",
        infoElementText: "Question mark circle",

        feedbackEmail: `ae57524a.${window.location.hostname}.onmicrosoft.com@amer.teams.ms`,

        // FPS Banner Navigation
        showGoToHome: true,
        showGoToParent: true,

        // Banner Theme props that are not preset in manifest.json
        bannerStyleChoice: 'corpDark1',
        bannerStyle: '{\"color\":\"white\",\"backgroundColor\":\"#005495\",\"fontSize\":\"larger\",\"fontWeight\":600,\"fontStyle\":\"normal\",\"padding\":\"0px 10px\",\"height\":\"48px\",\"cursor\":\"pointer\"}',
        bannerCmdStyle: '{\"color\":\"white\",\"backgroundColor\":\"#005495\",\"fontSize\":16,\"fontWeight\":\"normal\",\"fontStyle\":\"normal\",\"padding\":\"7px 4px\",\"marginRight\":\"0px\",\"borderRadius\":\"5px\",\"cursor\":\"pointer\"}',
        lockStyles: true,

    }
};

export const PresetEverywhere : IPreConfigSettings = {
    location: '*',
    props: {

        // FPS Banner Basics
        bannerTitle: 'ALV Financial Manual App',

        homeParentGearAudience: 'Some Test Value',

        imgHeight: imgHeight, //Converted to px
        imgWidth: imgWidth, //Converted to %
        imgObjectFit: imgObjectFit, //cover, contain, etc...
        imgStyle: imgStyle, //gets embedded directly into all image tags as:  <img style="Your style string here" - height: 150px; object-fit: "cover"; width: 100%;
        imgAutoFix: imgAutoFix, //Maybe eventually I could try to auto-fix but have this optional.

        canPagePreference: canPagePreference, //Determines what default page load level

        canAddCkeEditToDiv: canAddCkeEditToDiv,  //Will add class="cke_editable" to the styles.article div so that Tables have some formatting when shown in app.

        allSectionMaxWidthEnable: true,
        allSectionMaxWidth: 2500,

        debugMode: false,

    }
};

export const ForceFinancialManual : IPreConfigSettings = {
    location: '/sites/financemanual/',
    props: {

        // imgHeight: imgHeight, //Converted to px
        // imgWidth: imgWidth, //Converted to %
        imgObjectFit: imgObjectFit, //cover, contain, etc...
        imgStyle: imgStyle, //gets embedded directly into all image tags as:  <img style="Your style string here" - height: 150px; object-fit: "cover"; width: 100%;
        imgAutoFix: imgAutoFix, //Maybe eventually I could try to auto-fix but have this optional.

        canPagePreference: canPagePreference, //Determines what default page load level

        canAddCkeEditToDiv: canAddCkeEditToDiv,  //Will add class="cke_editable" to the styles.article div so that Tables have some formatting when shown in app.

        // FPS Banner Basics
        bannerTitle: 'ALV Financial Manual App',

        homeParentGearAudience: 'Everyone',
    }
};

export const PresetFinancialManual : IPreConfigSettings = {
    location: '/sites/financemanual/',
    props: {


    }
};

export const PreConfiguredProps : IAllPreConfigSettings = {
    forced: [ ForceFinancialManual, ForceEverywhere  ],
    preset: [ PresetFinancialManual, PresetEverywhere ],
};
