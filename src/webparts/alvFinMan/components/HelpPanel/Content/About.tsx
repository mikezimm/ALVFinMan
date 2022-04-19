import * as React from 'react';

//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../banner/SinglePage/ISinglePageProps';

import * as devLinks from '@mikezimm/npmfunctions/dist/Links/LinksDevDocs';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

export const panelVersionNumber = '2022-04-13 -  1.0.1.21'; //Added to show in panel

export function aboutTable( repoLinks: IRepoLinks, showRepoLinks: boolean ) {

    let table : IHelpTable  = {
        heading: 'Version History',
        headers: ['Date','Version','Focus'],
        rows: [],
    };

    /**
     * Security update log 
     * 
     * converting all links and cdns to lower case so casing does miss a flag
     * standardizing all cdn links to start with /sites/ if on tenant
     * standardinzing all tag lings to start with /sites/ if on tenant
     * removing any extra // from both cdns and file links so you cant add extra slash in a url and slip by
     * 
     * Does NOT find files without extensions (like images and also script files.)
     * 
     * WARNING:  DO NOT add any CDNs to Global Warn or Approve unless you want it to apply to JS as well.
     */


    table.rows.push( createAboutRow('2022-04-13',"1.0.1.21","#101, #103, #104, #105, #106 - Improvements to Code Pane, defaults and Debugging", showRepoLinks === true ? repoLinks : null ) );

    table.rows.push( createAboutRow('2022-04-12',"1.0.1.20","#100 - Add Sandbox mode", showRepoLinks === true ? repoLinks : null ) );

    table.rows.push( createAboutRow('2022-04-08',"1.0.1.19","#92, #93 - Info Panel, #96 - Single Page App styling", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('2022-04-08',"","#97, #94 - html cache option", showRepoLinks === true ? repoLinks : null ) );

    table.rows.push( createAboutRow('2022-04-08',"1.0.1.18","#79, #80, #88 - Be a visitor mode, #89 - More Info button", showRepoLinks === true ? repoLinks : null ) );

    table.rows.push( createAboutRow('2022-04-05',"1.0.1.17","#82 - why, #66, #84, #85, #86 Banner Styles and History", showRepoLinks === true ? repoLinks : null ) );

    table.rows.push( createAboutRow('2022-04-04',"1.0.1.16","#9, #39, #74, #75 - styling, #76 - install error, #77 import fix", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('',"","#4,  #8 - File Picker updates", showRepoLinks === true ? repoLinks : null ) );

    table.rows.push( createAboutRow('2022-04-04',"1.0.1.15","#69, #70, - Property Pane Help and updates. #71 - context, #73 - load analytics, start #72", showRepoLinks === true ? repoLinks : null ) );

    table.rows.push( createAboutRow('2022-03-15',"1.0.1.14","#55, #56, #59, #60, #61, #63 - ", showRepoLinks === true ? repoLinks : null ) );

    table.rows.push( createAboutRow('2022-03-15',"1.0.1.12","#48, #50, #51, #52, #53 - Add Tag search", showRepoLinks === true ? repoLinks : null ) );

    table.rows.push( createAboutRow('2022-03-14',"1.0.1.11","#29 - Adv security model, #40, #41 - Security Profile table", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('\"',"\"","#31, #37, #42, #43, #44, #46, #45 - Add Re-analyize live page, #13 - view analytics", showRepoLinks === true ? repoLinks : null ) );


    table.rows.push( createAboutRow('2022-03-09',"1.0.1.07","#28, #32, #33, #34, #35, #36, Add webpartHistory, Add Visitor Panel,", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('2022-03-08',"1.0.1.06","#27, #21 - Add File Type security", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('2022-03-05',"1.0.1.05","Close #3, #22, #10 - add importProps functionality", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('"',"\"","#15 - whitelist CDNs, #19 - quick peek tags", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('"',"\"","#24 - Add Terms of Use", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('2022-03-03',"1.0.1.04","Close #16, #17, Advanced Help Docs, styling", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('2022-03-01',"1.0.1.03","Close #5, #6, #7, #11 (file picker)", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('2022-02-25',"1.0.1.01","Initial test build:  Banner, ShowCode, does not execute js unless in iframe", showRepoLinks === true ? repoLinks : null ) );

    return { table: table };

}

export function createAboutRow( date: string, version: string, focus: any, repoLinks: IRepoLinks | null ) {

    let fullFocus = convertIssuesMarkdownStringToSpan( focus, repoLinks );

    let tds = [<span style={{whiteSpace: 'nowrap'}} >{ date }</span>, 
        <span style={{whiteSpace: 'nowrap'}} >{ version }</span>, 
        <span>{ fullFocus }</span>,] ;

    return tds;
}