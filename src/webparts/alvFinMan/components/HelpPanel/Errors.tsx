import * as React from 'react';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '@mikezimm/npmfunctions/dist/HelpPanelOnNPM/banner/SinglePage/ISinglePageProps';

export function errorsContent( repoLinks: IRepoLinks ) {

    return null;
    
    let messageRows = [];

    //let underScoreIssue = JSON.parse( JSON.stringify(links.gitRepoPivotTiles.issuesLink).replace(/issueNumber/g, '30') );
    let underScoreIssue = <a href="https://github.com/mikezimm/Pivot-Tiles/issues/29" target="_blank">Issue #29</a>;

    messageRows.push( <tr><td>Do not add _UnderScore to Default Tab</td><td> { underScoreIssue } </td><td>Webpart does not display correctly with Microsoft Forms or Pictures below it</td></tr> );
    messageRows.push( <tr><td>Tiles show up in only 1 Category</td><td></td><td>Check if Custom Categories property pane Toggle on</td></tr> );
    messageRows.push( <tr><td>Custom <b>JSON Logic</b> does not work</td><td></td><td><b>Test your JSON Object in JSON Beautifier</b> first</td></tr> );
    messageRows.push( <tr><td><b>Common</b> errors</td><td></td><td><b>Missing comma</b> after an attribute</td></tr> );
    messageRows.push( <tr><td><b>Regex</b> errors</td><td></td><td>Be sure to <b>escape characters</b>.... ie "regex": "\\bTMT\\b"</td></tr> );
    messageRows.push( <tr><td><b>eval</b> errors</td><td></td><td>eval is not <b>correct syntax</b>.  Only object references at that point in code work.</td></tr> );

    messageRows.push( <tr><td><b>Title/Desc contains</b> filter not working</td><td></td><td>This is case sensitive filter.  If you use both Title and Desc, both filters must be true to be visible.</td></tr> );
    messageRows.push( <tr><td><b>Gap in Pivots</b></td><td></td><td>If you are using semicolon separated categories but have not custom logic, you may see a blank tab.</td></tr> );
    messageRows.push( <tr><td><b>Gap in Pivots</b></td><td></td><td>In order to add a blank tile for a wider gap inbetween tiles, you need to add an extra semicolon inbetween your custom categories. Example of no blank tile categories: word;word2;word3.  Example of blank tile categories: word;;word2;word3. Between "word" and "word2" tiles there will be a blank tile due to the extra semicolon added.</td></tr> );

    let thisTable = <div style={{ paddingTop: 15 }}>
    <h2>Easter Eggs</h2>
    <table className={ 'single-page-info-table' } style={{ width: '100%' }}>
        <tr><th style={{ minWidth: '70px' }}>Do this...</th><th>Where</th><th>What it does</th></tr>
        { messageRows }
    </table>
    </div>;


    let thisPage = null;
    thisPage = <div className={ null }>

    { thisTable }
    </div>;


    /***
    *              d8888b. d88888b d888888b db    db d8888b. d8b   db 
    *              88  `8D 88'     `~~88~~' 88    88 88  `8D 888o  88 
    *              88oobY' 88ooooo    88    88    88 88oobY' 88V8o 88 
    *              88`8b   88~~~~~    88    88    88 88`8b   88 V8o88 
    *              88 `88. 88.        88    88b  d88 88 `88. 88  V888 
    *              88   YD Y88888P    YP    ~Y8888P' 88   YD VP   V8P 
    *                                                                 
    *                                                                 
    */

    let html1 =
    <div className={ 'single-page-info-pane' }>
        { thisPage }
    </div>;

    return { html1: html1 };
}
  

