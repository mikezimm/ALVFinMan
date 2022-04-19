import * as React from 'react';

import styles from '../banner/SinglePage/InfoPane.module.scss';

import * as devLinks from '@mikezimm/npmfunctions/dist/Links/LinksDevDocs';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

import { bannerPropsInfo, expandoPropsInfo, basicPropsInfo, stylePropsInfo } from '../banner/onLocal/FPSHelp';

export function advancedContent( repoLinks: IRepoLinks ) {

    return null;
    
    let thisTable = <div style={{ paddingTop: 15 }}>
        
        { bannerPropsInfo() }
        { stylePropsInfo() }
        { basicPropsInfo() }
        { expandoPropsInfo() }

    </div>;

    return { html1: thisTable };
    
    let messageRows = [];
 
    // messageRows.push( <tr><td></td><td></td><td></td></tr> );
    messageRows.push( <tr></tr> );

    let thisPage = <div>
        <h2></h2>
        <table className={styles.infoTable} style={{ width: '100%' }}>
            <tr><th>Info</th><th>Example</th><th>Details</th></tr>
            { messageRows }
        </table>
    </div>;


    return { html1: thisPage };

}
  

