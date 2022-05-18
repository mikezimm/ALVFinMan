import { IPropertyFieldGroupOrPerson } from "@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker";

import { IPreConfigSettings, IAllPreConfigSettings } from '@mikezimm/npmfunctions/dist/PropPaneHelp/PreConfigFunctions';
import { encrptMeOriginalTest } from '@mikezimm/npmfunctions/dist/HelpPanelOnNPM/onNpm/logTest';
import { ContALVFMContent, ContALVFMWebP } from '@mikezimm/npmfunctions/dist/HelpPanelOnNPM/onNpm/constants';

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

export const ForceFinancialManual : IPreConfigSettings = {
    location: '/sites/financemanual/',
    props: {

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
        bannerTitle: 'ALV Financial Manual App',
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


export const PresetFinancialManual : IPreConfigSettings = {
    location: '/sites/financemanual/',
    props: {
        homeParentGearAudience: 'Everyone',
    }
};

export const PresetSomeRandomSite : IPreConfigSettings = {
    location: '/sites/SomeRandomSite/',
    props: {
        homeParentGearAudience: 'Some Test Value',
    }
};

export const PreConfiguredProps : IAllPreConfigSettings = {
    forced: [ ForceFinancialManual ],
    preset: [ PresetFinancialManual, PresetSomeRandomSite ],
};
