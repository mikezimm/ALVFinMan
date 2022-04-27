import * as React from 'react';

import styles from './AlvFinMan.module.scss';

import * as devLinks from '@mikezimm/npmfunctions/dist/Links/LinksDevDocs';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

export function MainHelpPage( repoLinks: IRepoLinks ) {

    let messageRows = [];

    let thisPage = <div className={ styles.row }>
        <h2 style={{ marginTop: '0px' }}>Helpful tips to navigate this app</h2>

        <h3>General, Statements, Links tabs</h3>
        <li>CTRL-Click most bulleted list items ( first table ) to open that item in a new tab (if there is a link for it)</li>

        <h3>Reporting, Processes, Functions, Topics</h3>
        <li>CTRL-Click on Standards or Supporting Documents Titles (at the top) to go to those full libraries</li>
        <li>CTRL-Click on an item in the Standards column to go directly to the full page (not the side panel)</li>
        <li>CTRL-Click on an item in the Supporting Documents column to open the file as a full page in the browser (not the side panel)</li>
        <li>If you get access denied due to a policy (possibly due to your liscening or are using a unregistered device (personal device), normal click on the item and see a preview in the panel.</li>

        <h3>Search</h3>
        <ul>
            <li>The <b>Buttons along the left</b> are meant to be <b>financial disciplines</b></li>
            <li>The <b>Buttons along the top</b> are meant to be <b>general keywords</b> that might apply in many places</li>
            <li>The <b>Buttons along the right</b> are file types</li>
            <li>You can <b>CTRL-Click</b> on buttons <b>to multi-select</b></li>
            <li><b>Multi-selecting</b> buttons <b>in a group (Left, Top, or Right side)</b> mean the items <b>have at least one</b> of those properties in common.</li>
            <li>BUT, all filtered items will have at least one property from each group that you select.</li>
            <li><b>Example #1:</b>  You select <b>'Payable'</b> on the left, <b>'Policy'</b> on the top, and <b>'Page'</b> on the right, You will find items that have Paylbe, Policy AND are a Page.</li>
            <li><b>Example #2:</b>  You select <b>Assets' and 'Tax'</b>' on the left, <b>'Policy' and 'Capex'</b> on the top, You will find all items related to either Tax OR Assets AND also are related to either Policy OR Capex</li>

        </ul>

        <h3>Make the app work for you!</h3>
        <ul>
            <li>The ALV Financial Manual can be customized to better fit your needs!</li>
            <li>Bring it into any Modern SharePoint site right now
                <ul>
                    <li>It's always current and up to date with the same information from the official site</li>
                    <li>In your own site, you can add it as a web part to any page or a Single Page app</li>
                    <li>In your site, you can also customize the app to work better for you
                        <ul>
                            <li>Change the web part title - as in change the languages</li>
                            <li>Customize which tab opens first</li>
                            <li>Customize Search tab's Top and Left filter buttons</li>
                        </ul>
                    </li>

                </ul>
            </li>
            <li>Bring it into any Team as a Tab
                <ol>
                    <li>Go to your Team's SharePoint site</li>
                    <li>'Add an app' and add the Financial Manual to your site</li>
                    <li>Edit any page and add the Finanacial Manaul as a web part</li>
                    <li>OR Create a new page from your site's Home Page and create a Single Page App instead (just a full page with one web part)</li>
                    <li>After you have the ALV Financial Manual on a page, copy the site page url to your clipboard</li>
                    <li>Then create a new Tab in any Teams channel, add 'SharePoint' app</li>
                    <li>Select 'Add from any SharePoint Url' and paste your link to the box</li>
                    <li>Press Ok and you should have the same app in Teams that you have on your site :)</li>
                </ol>

            </li>
        </ul>

    </div>;


    return thisPage;

}
  

