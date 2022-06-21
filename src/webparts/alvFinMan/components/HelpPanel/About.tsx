import * as React from 'react';

//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '@mikezimm/npmfunctions/dist/HelpPanelOnNPM/banner/SinglePage/ISinglePageProps';

import * as devLinks from '@mikezimm/npmfunctions/dist/Links/LinksDevDocs';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

export const panelVersionNumber = '2022-06-21 -  1.0.0.06'; //Added to show in panel

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

     table.rows.push( createAboutRow('2022-06-21',"1.0.0.06","Add Standards and SupportDocs to Source tab, #98, #104, #105, #107 - Deep Links", showRepoLinks === true ? repoLinks : null ) );
     table.rows.push( createAboutRow('',"","#31, #92, #93, ", showRepoLinks === true ? repoLinks : null ) );

     table.rows.push( createAboutRow('2022-06-17',"1.0.0.05","#93, #94, #95, #96, #97, #99 - Reorg, Start Sources and History-DeepLinks tab", showRepoLinks === true ? repoLinks : null ) );
     table.rows.push( createAboutRow('',"","#8 - Add OS Accounts list, #87 - Add Controllers-Entities list, #101 - Add Acronyms list", showRepoLinks === true ? repoLinks : null ) );

    table.rows.push( createAboutRow('2022-06-11',"1.0.0.04","#57, #62, #66, #67, #68, #69, #70, #73", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('',"","#56, #75, #76, #77, #79, #80, #81, #82, #84, #85, #86, #88, #89, #90", showRepoLinks === true ? repoLinks : null ) );

    table.rows.push( createAboutRow('2022-04-28',"1.0.0.03","#46 - Modern News import to app", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('',"","#29, #39, #40, #42, #43, #45, #48, #49, #50, #52, #53", showRepoLinks === true ? repoLinks : null ) );

    table.rows.push( createAboutRow('2022-04-26',"1.0.0.02","#37 - Help tab", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('',"","Improvements and fixes:  #3, #5, #16, #20, #25, #30, #33, #34, #35, #36", showRepoLinks === true ? repoLinks : null ) );

    table.rows.push( createAboutRow('2022-04-19',"1.0.0.01","", showRepoLinks === true ? repoLinks : null ) );

    return { table: table };

}

export function createAboutRow( date: string, version: string, focus: any, repoLinks: IRepoLinks | null ) {

    let fullFocus = convertIssuesMarkdownStringToSpan( focus, repoLinks );

    let tds = [<span style={{whiteSpace: 'nowrap'}} >{ date }</span>, 
        <span style={{whiteSpace: 'nowrap'}} >{ version }</span>, 
        <span>{ fullFocus }</span>,] ;

    return tds;
}