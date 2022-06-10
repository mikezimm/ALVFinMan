import * as React from 'react';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '@mikezimm/npmfunctions/dist/HelpPanelOnNPM/banner/SinglePage/ISinglePageProps';

export function gettingStartedContent( repoLinks: IRepoLinks ) {

    return null;
    
    let html1 = <div>
        {/* Set to light yellow */}
        <div style={{ background: '#FEF9E7', padding: '10px' }}> 

            <h2 style={{textDecoration: 'underline'}}>Before you start!</h2>
            <p><h3>If you plan to build a full page app (hide SharePoint UI)</h3>
                Be sure to follow these steps to minimize any styling issues:
                <ul>
                    <li>Start with a <b>Communication Site</b></li>
                    <ul>
                        <li>This is the only site that allows true 'Full Width webparts'</li>
                    </ul>
                    <li>Clear the home page completely (do not have any other webparts)</li>
                    <ul>
                        <li>Remove all site navigation links</li>
                        <li>Replace site icon with transparent color box (to get rid of site logo.)</li>
                    </ul>
                    <li>Add SecureScript in the first Full Width section</li>
                </ul>
            </p>

            <h2 style={{textDecoration: 'underline'}}>Script Editor Properties</h2>
            <ul>
                <li>Paste web url in the web url property - must be valid</li>
                <li>Select Library in dropdown</li>
                <li>Select File in dropdown</li>
                <li>
                    <div>Show Code Audience</div>
                    <p>Show Code Audience will determine what level permissions will see the Show-Code icon. <b>NOTE:</b>  Site Admins and Site Owners will ALWAYS see this button.</p>
                </li>
            </ul>
            <h2>NOTE:  Javascript does not load while editing the page, only while viewing.</h2>
        </div>
 

    </div>;

    return { html1: html1 };

}
  

