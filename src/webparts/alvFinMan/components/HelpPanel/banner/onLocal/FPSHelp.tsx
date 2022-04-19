import * as React from 'react';

import styles from './FPSHelp.module.scss';

export function bannerPropsInfo() {

    // Set to light gray
    return <div className={styles.fpsHelpAccordion } style={{ background: '#F8F9F9', padding: '0 20px' }}> 
        <h2 style={{textDecoration: 'underline'}}>Banner</h2>
        <div className={ [styles.fpsHelpContent, styles.fpsHelpContent400].join(' ')}>
            <h3>Show Go to Home Page Icon</h3>
            <p>Shows Home Page Icon IF you have at least the same level permission as the <b>Gear, Home, Parent audience</b>.</p>

            <h3>Show Go to Parent Site Icon</h3>
            <p>Shows Parent Site Icon IF you have at least the same level permission as the <b>Gear, Home, Parent audience</b>.</p>

            <h3>Gear, Home, Parent audience</h3>
            <p>
                <b>NOTE:</b> Site Admins will always see all icons regardless of the Toggles or the audience.
            </p>
            <ul>
                <li>Site Owners:  must have manageWeb permissions</li>
                <li>Page Editors: must have has addAndCustomizePages permissions</li>
                <li>Item Editors: must have has addListItems permissions</li>
            </ul>
            <p>Style options and Hover Effect are for IT use only.</p>
        </div>
 
    </div>;
} 


export const CSSOverRideWarning = <p><span style={{fontSize: 'larger', fontWeight: 'bolder'}}>
<mark>WARNING</mark></span> ALL 3rd party solutions that modify SharePoint styles could stop working without notice if MSFT makes a change.  If this happens, please contact your SharePoint team.</p>;

export function stylePropsInfo() {

    // Set to light red
    return <div className={styles.fpsHelpAccordion } style={{ background: '#FDEDEC ', padding: '0 20px'  }}> 
        <h2 style={{textDecoration: 'underline'}}>General comments about FPS style settings</h2>
        <div className={ [styles.fpsHelpContent, styles.fpsHelpContent250].join(' ')}>
            <p>Settings in <b>FPS options</b> are applied after the webpart first loads.  This means on slower connections, you may temporarily see original styling including elements you are trying to hide.  If this poses a risk, be sure to have minimal SharePoint content on the page.</p>

            <ul>
                <li>Do not have any other webparts or content on the page.</li>
                <li>Do not have any site navigation links.</li>
                <li>Disable the quick launch through site settings.</li>
                <li>Do not have a Site Icon (unless it is restricted to site owners or above).</li>
                <li>Minimize Banner/Header including with Powershell if neccessary</li>
            </ul>

            { CSSOverRideWarning }
        </div>

    </div>;
} 


export function basicPropsInfo() {

    // Set to light green
    return <div className={styles.fpsHelpAccordion } style={{ background: '#EAFAF1', padding: '0 20px' }}> 
        <h2 style={{textDecoration: 'underline'}}>Basic options</h2>
        <div className={ [styles.fpsHelpContent, styles.fpsHelpContent400].join(' ')}>
            { CSSOverRideWarning }
            <h3>Hide quick launch, Hide Page Header</h3>
            <p>Hides these elements when toggle shows 'Hidden'</p>

            <h3>All Sections <b>Max Width</b> Toggle and slider</h3>
            <p>Over-rides out of the box max width on page sections.</p>

            <h3>All Sections <b>Margin</b> Toggle and slider</h3>
            <p>Over-rides out of the box top and bottom section margin.</p>

            <h3>Hide Toolbar - while viewing</h3>
            <p>Hidden:  Will hide the page toolbar (Edit button) when loading the page.  Add ?tool=true to the Url to be able to edit the page.</p>
        </div>

    </div>;
} 

export function expandoPropsInfo() {
    
    // Set to light purple
    return <div className={styles.fpsHelpAccordion } style={{ background: '#F5EEF8', padding: '0 20px' }}> 
        <h2 style={{textDecoration: 'underline'}}>Expandoramic</h2>
        <div className={ [styles.fpsHelpContent, styles.fpsHelpContent550].join(' ')}>
            { CSSOverRideWarning }
            <h3>Enable Expandoramic Mode</h3>
            <p>Enables the Expandoramic toggle (diagonal arrow icon in upper left of Header.</p>

            <h3>Page load default</h3>
            <p>Determines the format when loading the page.</p>
            <ul>
                <li>Normal:  Webpart DOES NOT AUTO expand when loading the page</li>
                <li>Expanded:  Page loads with webpart expanded</li>
                <li>Whenever you 'Edit' the page, you will need to manually shrink webpart to see the page and webpart properties.</li>
            </ul>

            <h3>Expandoramic Audience</h3>
            <p>
                <b>NOTE:</b> Site Admins will always see all icons regardless of the Toggles or the audience.
            </p>
            <ul>
                <li>Site Owners:  must have manageWeb permissions</li>
                <li>Page Editors: must have has addAndCustomizePages permissions</li>
                <li>Item Editors: must have has addListItems permissions</li>
            </ul>
            <p>Style options and Hover Effect are for IT use only.</p>
            <p>Padding adjusts the padding around the webpart.  20px minimum.</p>
        </div>

    </div>;
} 
