import * as React from 'react';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { Pivot, PivotItem, IPivotItemProps, PivotLinkFormat, PivotLinkSize,} from 'office-ui-fabric-react/lib/Pivot';

import { IQuickCommands } from '@mikezimm/npmfunctions/dist/QuickCommands/IQuickCommands';

import { IRefinerRulesStrs, IRefinerRulesInts, IRefinerRulesNums, IRefinerRulesTime, IRefinerRulesUser, IRefinerRulesEXPE, IRefinerRulesNone } from '@mikezimm/npmfunctions/dist/Refiners/IRefiners';
import { RefinerRulesStrs, RefinerRulesInts, RefinerRulesNums, RefinerRulesTime, RefinerRulesUser, RefinerRulesEXPE, RefinerRulesNone } from '@mikezimm/npmfunctions/dist/Refiners/IRefiners';

import { gitRepoDrillDownSmall, gitRepoSecureScript7Small } from '@mikezimm/npmfunctions/dist/Links/LinksRepos';

import { defaultBannerCommandStyles, } from "@mikezimm/npmfunctions/dist/HelpPanel/onNpm/defaults";

import styles from './PropPanelHelp.module.scss';

import ReactJson from "react-json-view";
import { FontWeights } from 'office-ui-fabric-react';

const SampleViewJSON : any = [
  {
    "name": "Author/Title",
    "displayName": "Created by",
    "minWidth": 50
  },
  {
    "name": "FileRef",
    "displayName": "FileLeafRef",
    "maxWidth": 50,
    "linkPropertyName": "goToItemPreview"
  },
];

// const SampleCommands: any = {
//   "label": "Press Me",
//   "primary": false,
//   "confirm": "Are you sure?",
//   "alert": "We made our updates!",
//   "console": "Message to browser console",
//   "panelMessage": "Complete Panel Text",
//   "icon": "User",
//   "updateItem": {
//     "DueDate": "[today+14]",
//     "AssignedToId": "[Me]",
//     "Status": "In Process",
//     "ReviewDays": 99,
//     "Body": "Hi! It's [Today+3] and I'm $MyName$"
//   },
//   "showWhenEvalTrue": "item.AssignedToId !== sourceUserInfo.Id"
// };

const SampleCommands: any = {
  "buttons": [[{
      "label": "Press Me",
      "primary": false,
      "confirm": "Are you sure?",
      "alert": "We made our updates!",
      "console": "Message to browser console",
      "panelMessage": "Complete Panel Text",
      "icon": "User",
      "updateItem": {
        "DueDate": "[today+14]",
        "AssignedToId": "[Me]",
        "Status": "In Process",
        "ReviewDays": 99,
        "Body": "Hi! It's [Today+3] and I'm $MyName$"
      },
      "showWhenEvalTrue": "item.AssignedToId !== sourceUserInfo.Id"
    }
  ]],
  "fields": [],

};
 
const SampleCharts: any = [
  {
    "primaryField": "Id",
    "title": "Count of items",
    "stat": "count",
    "chartTypes": [
      "pareto-dec",
      "stacked-column-labels"
    ]
  }
];

const UserColumnRestPropertiesSPO : string[] = [ 'Title', 'Name', 'EMail', 'FirstName', 'UserName', 'ID', 'SipAddress', 'Office', 'Modified', 'Created', ];
const UserColumnRestPropertiesSPONOTWORK : string[] = [ 'MobilePhone', 'Department', 'JobTitle', 'WorkPhone', 'ImnName', 'NameWithPicture', 'NameWithPictureAndDetails', 'ContentTypeDisp', ];

export function putObjectIntoJSON ( obj: any, name: string = null ) {
  // return <ReactJson src={ obj } name={ 'panelItem' } collapsed={ true } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '20px 0px' }}/>;
  return <ReactJson src={ obj } name={ name } collapsed={ false } displayDataTypes={ false } displayObjectSize={ false } enableClipboard={ true } style={{ padding: '20px 0px' }} theme= { 'rjv-default' } indentWidth={ 2}/>;
}

const PleaseSeeWiki = <p>Please see the { gitRepoSecureScript7Small.wiki }  for more information</p>;

const tenantServiceRequestURL = `https://servicenow.${window.location.hostname}.com/`;
const RequestStorageHere = <span>Please request storage <a href={tenantServiceRequestURL} target="_blank">here in Service Now.</a></span>;

const LinkFindInternalName = <a href="https://tomriha.com/what-is-sharepoint-column-internal-name-and-where-to-find-it/" target="_blank">Finding Internal Name of a column</a>;

const ShowCodeIcon = <Icon iconName={ 'Code' } title='ShowCode icon' style={ defaultBannerCommandStyles }></Icon>;
const CheckReferences = <Icon iconName={ 'PlugDisconnected' } title='Check Files' style={ defaultBannerCommandStyles }></Icon>;
const ShowRawHTML = <Icon iconName={ 'FileCode' } title='Show Raw HTML here' style={ defaultBannerCommandStyles }></Icon>;

const padRight15: React.CSSProperties = { paddingRight: '15px' };
const padRight40: React.CSSProperties = { paddingRight: '40px' };

const CSSOverRideWarning = <div style={{fontSize: 'large' }}>
  <div className={ styles.topic} style={{fontSize: 'large' }}><mark>NOTICE</mark></div>
  <div>Any 3rd party app that modifies the page styling (like these) are using undocumented tricks </div>
  <div>  - - <b>WHICH ARE SUBJECT TO BREAK without notice by Microsoft</b>.</div>
  <div>These settings are applied after this web part loads.</div>
  <div><b>Users may briefly see the original styling</b>.  Especially if their connection is slow or your page takes a long time to load.</div>
</div>;

const DeveloperWarning = <div style={{fontSize: 'large' }}>
  <div className={ styles.topic} style={{fontSize: 'large' }}><mark>NOTICE</mark></div>
  <div>ONLY turn these on IF you know what you are doing and need them.</div>
</div>;

export const WebPartHelpElement = <div>
  <Pivot 
          linkFormat={PivotLinkFormat.links}
          linkSize={PivotLinkSize.normal}
      //   style={{ flexGrow: 1, paddingLeft: '10px' }}
      //   styles={ null }
      //   linkSize= { pivotOptionsGroup.getPivSize('normal') }
      //   linkFormat= { pivotOptionsGroup.getPivFormat('links') }
      //   onLinkClick= { null }  //{this.specialClick.bind(this)}
      //   selectedKey={ null }
      >
      <PivotItem headerText={ 'Financial Manual' } > 
        <div className={ styles.helpContent}>

          <div className={ styles.topic}>TBD To fill out</div>
          <div>Bla bla bla.</div>
          <div>Bla bla bla must be like this:  <b>/sites/SecureCDN/<span style={{ color: 'red', fontWeight: 600 }}>YourCodeStorageSite</span>/</b></div>
          <div><mark><b>NOTE:</b></mark> {RequestStorageHere}</div>
          
          
          {/* <div className={ styles.topic}>Approved web url</div>
          <div>Code must be stored in an approved site in our tenant.</div>
          <div>The URL must be like this:  <b>/sites/SecureCDN/<span style={{ color: 'red', fontWeight: 600 }}>YourCodeStorageSite</span>/</b></div>
          <div><mark><b>NOTE:</b></mark> {RequestStorageHere}</div> */}
{/* 
          <div className={ styles.topic}>Pick an approved library</div>
          <div>Only store and use code in the library called <b>'CodeLibrary'</b> that is set up by the SharePoint Team or else people will not be able to use your web part.</div>

          <div className={ styles.topic}>Pick a file</div>
          <div>Store your code in an html file for best results.</div>

          <div className={ styles.topic}>Show Code Audience</div>
          <div>This lets you target which users see the { ShowCodeIcon } icon which lets them see your code.</div>
          <div><mark><b>NOTE:</b></mark> Site Admins and Site Owners will always see this button.</div>

          <div className={ styles.topic}>Force reload scripts</div>
          <div>Feature is still under development.  Do NOT use.</div>
          <div><mark><b>NOTE:</b></mark> Site Admins and Site Owners will always see this button.</div>  

          <div className={ styles.topic}>Cache initial web part file</div>
          <div>If enabled, your html file in the web part properties.</div>
          <div>In the end, this should save the load time of requesting the html file after the web part is loaded. The 'fetch' row of the Performance table in code pane shows how long it takes to do extra call.</div>
          <div>Security checks are still done on every page refresh even with this enabled.</div>
          <div><b><mark>When this is enabled:</mark> Updates to your html file are only reflected</b> in the web part if you Edit the Page and Web Part props.</div> */}


        </div>
      </PivotItem>
    
      <PivotItem headerText={ 'Visitor Help' } > 
        <div className={ styles.helpContent}>
          <div className={ styles.topic}>Full Help Panel Audience</div>
          <div>This gives you control who can see the entire <b>More Information</b> panel in the Help Banner bar.</div>
          <div>People who have less rights than this will only see the content you add via the property pane.</div>

          <div className={ styles.topic}>Panel Description</div>
          <div>Personalized heading message you give you your users.</div>

          <div className={ styles.topic}>Support Message</div>
          <div>Optional message to give users for support.</div>

          <div className={ styles.topic}>Documentation message</div>
          <div>Message you can give users directly above the documentation link</div>

          <div className={ styles.topic}>Paste a Documentation link</div>
          <div>We require a valid SharePoint link where you store further information on using this web part.</div>

          <div className={ styles.topic}>Documentation Description</div>
          <div>Optional text that the user sees as the Documentation Link text</div>

          <div className={ styles.topic}>Support Contacts</div>
          <div>Use of this web part requires a current user to be identified for support issues.</div>

        </div>
      </PivotItem>
{/* 
      <PivotItem headerText={ 'Advanced' } > 
        <div className={ styles.helpContent}>

          { DeveloperWarning }

          <div className={ styles.topic}>Enable Classic Context</div>
          <div>Using Classic context is NOT recommended or supported.  MSFT can and do remove features at any time without notice.</div>
          <div className={ styles.topic}>Enable Classic Context</div>
          <div>Allows you to reference Classic page context using window[_spPageContextInfo].property</div>

          <div className={ styles.topic}>Enable Modern Context</div>
          <div>Allows you to reference Modern page context using window[TBD].property</div>

        </div>
      </PivotItem> */}

      <PivotItem headerText={ 'Banner' } > 
        <div className={ styles.helpContent}>
          <div className={ styles.topic} style={{ textDecoration: 'underline' }}>FPS Banner - Basics</div>
          <div className={ styles.topic}>Show Banner</div>
          <div>May allow you to hide the banner.  If toggle disabled, it is required.</div>

          <div className={ styles.topic}>Optional Web Part Title</div>
          <div>Add Title text to the web part banner.</div>
          <div>Depending on the web part, this may not be editable.</div>

          <div className={ styles.topic}>More Info text-button</div>
          <div>Customize the More Information text/Icon in the right of the banner.</div>

          <div className={ styles.topic} style={{ textDecoration: 'underline' }}>FPS Banner - Navigation</div>
          <div className={ styles.topic}>Show 'Go to Home Page' <Icon iconName='Home'></Icon> Icon</div>
          <div>Displays the <Icon iconName='Home' style={ defaultBannerCommandStyles }></Icon> when you are not on the site's home page.</div>

          <div className={ styles.topic}>Show 'Go to Parent Site' <Icon iconName='Up'></Icon> Icon</div>
          <div>Displays the <Icon iconName='Up' style={ defaultBannerCommandStyles }></Icon> when you are not on the site's home page.</div>

          <div className={ styles.topic}>Gear, Go to Home, Parent audience</div>
          <div>Minimum permissions requied to see the Home and Parent site icons.</div>
          <div>Use this to hide buttons from visitors if your Secure Script Web part is more of a single page app and you want to hide the site from a typical visitor.</div>
          <div>NOTE:  Site Admins will always see the icons.</div>
          <ul>
            <li>Site Owners: have manageWeb permissions</li>
            <li>Page Editors: have addAndCustomizePages permissions</li>
            <li>Item Editors: have addListItems permissions</li>
          </ul>
          
          
          

          <div className={ styles.topic} style={{ textDecoration: 'underline' }}>Theme options</div>
          <div><mark><b>NOTE:</b></mark> May be required depending on our policy for this web part</div>
          <div>Use dropdown to change your theme for the banner (color, buttons, text)</div>

          <div className={ styles.topic}>Banner Hover Effect</div>
          <div>Turns on or off the Mouse Hover effect.  If Toggle is off, the banner does not 'Fade In'.  Turn off if you want a solid color banner all the time.</div>

        </div>
      </PivotItem>


      <PivotItem headerText={ 'FPS Basic' } > 
        <div className={ styles.helpContent}>

          { CSSOverRideWarning }

          <div className={ styles.topic}>Hide Quick Launch</div>
          <div>As of April 2022, MSFT allows you to modify quick launch in Site Gear 'Change the look'</div>
          <div>Only use this option if you want the Quick launch on the site as a whole but not on the page this web part is installed on.</div>
          
          <div className={ styles.topic}>All Sections <b>Max Width</b> Toggle and slider</div>
          <div>Over-rides out of the box max width on page sections.</div>

          <div className={ styles.topic}>All Sections <b>Margin</b> Toggle and slider</div>
          <div>Over-rides out of the box top and bottom section margin.</div>

          <div className={ styles.topic}>Hide Toolbar - while viewing</div>
          <div>Hidden:  Will hide the page toolbar (Edit button) when loading the page.</div>
          <div><b>Only use if you know what you are doing :)</b></div>
          <div><mark>WARNING</mark>.  <b>Add ?tool=true to the Url</b> and reload the page in order to edit the page.  You <b>CAN NOT SEE THESE INSTRUCTIONS</b> unless you add ?tool=true to the page</div>

        </div>
      </PivotItem>

      <PivotItem headerText={ 'FPS Expand' } > 
        <div className={ styles.helpContent}>

          { CSSOverRideWarning }

          <div className={ styles.topic}><b></b>Enable Expandoramic Mode</div>
          <div><b></b>Enables the Expandoramic toggle (diagonal arrow icon in upper left of Header.</div>

          <div className={ styles.topic}><b></b>Page load default</div>
          <div><b></b>Determines the format when loading the page.</div>
          <ul>
            <li>Normal:  Webpart DOES NOT AUTO expand when loading the page</li>
            <li>Expanded:  Page loads with webpart expanded</li>
            <li>Whenever you 'Edit' the page, you may need to manually shrink webpart to see the page and webpart properties.</li>
          </ul>

          <div className={ styles.topic}><b></b>Expandoramic Audience</div>
          <div><b>NOTE:</b> Site Admins will always see all icons regardless of the Toggles or the audience.</div>
          <ul>
            <li>Site Owners: have manageWeb permissions</li>
            <li>Page Editors: have addAndCustomizePages permissions</li>
            <li>Item Editors: have addListItems permissions</li>
          </ul>

          <div className={ styles.topic}><b>Style options and Hover Effect</b> are for SharePoint IT use only.</div>
          <div><b></b></div>

          <div className={ styles.topic}>Padding</div>
          <div>Adjusts the padding around the webpart.  20px minimum.</div>

        </div>
      </PivotItem>

      <PivotItem headerText={ 'Single Page Apps' } > 
        <div className={ styles.helpContent}>

          <div className={ styles.topic}>Before you start!</div>

          <div className={ styles.topic}>If you plan to build a full page app (Full expand web part at load time)</div>
          <div>
            Be sure to follow these steps to improve performance and minimize any styling issues and delays:
            <ol>
              <li>Create a page from 'Apps' Template when you first create a page</li>
              <ul>
                <li>This will remove all navigation from the page, make the web part full page and load faster.</li>
              </ul>

              <li>IF NOT, then Start with a <b>Communication Site</b></li>
              <ul>
                <li>This is the only site that allows true 'Full Width webparts'</li>
              </ul>
            <li><b>Clear the home page completely</b> (do not have any other webparts)</li>
            <li>Minimize what SharePoint loads
              <ol style={{ listStyleType: 'lower-alpha' }}>
                <li>Go to Gear</li>
                <li>Click 'Change the look'</li>
                <li>Click Header
                <ul>
                  <li>Set Layout to minimal</li>
                  <li>Set 'Site title visiblity' to off</li>
                  <li>Remove your site logo</li>
                  <li>Save Header settings</li>
                </ul></li>
                <li>Click Navigation
                <ul>
                  <li>Turn off Site Navigation</li>
                </ul></li>
              </ol></li>
            <li>Add SecureScript in the first Full Width section</li>
            </ol>
          </div>
        </div>
      </PivotItem>

      <PivotItem headerText={ 'Import' } > 
        <div className={ styles.helpContent}>
            <div className={ styles.topic}>If Available in this web part...</div>
            <div>It allows you to paste in values from the same webpart from a different page.</div>
            <div>To Export web part settings</div>
            <ol>
              <li>Click on 'More Information' in the Web Part Banner</li>
              <li>Click the Export tab <Icon iconName='Export' style={ defaultBannerCommandStyles }></Icon> (last tab in the Help Panel)</li>
              <li>Hover over Export Properties row</li>
              <li>Click the blue paper/arrow icon on the right side of the row to 'Export' the properties</li>
              <li>Edit this page and web part</li>
              <li>Paste properties into the Import properties box</li>
            </ol>

        </div>
      </PivotItem>

      {/* <PivotItem headerText={ 'Debugging' } > 
        <div className={ styles.helpContent}>
            <div className={ styles.topic}>Are your js/css references showing 404?</div>
            <div>Make sure any ../SiteAssets/.. type of references are pointing the correct site.</div>
            <div>The code is no longer stored on the same site you may be running the web part on.</div>
            <div>In the Code Pane { ShowCodeIcon }, click { ShowRawHTML } and then check Connections tab { CheckReferences } to do a quick test :)</div>

            <div className={ styles.topic}>Does javascript just not seem to execute?  Especially in Sandbox Mode?</div>
            <div>Try setting <b>Force reload scripts every page refresh</b> = <b>TRUE</b> in Script Editor Properties (below Show Code Audience)</div>
            <div>This does increase load time but may be required due to SharePoint 'Smart Navigation' caching :(</div>

        </div>
      </PivotItem> */}
      {/* <PivotItem headerText={ 'Refiner Rules' } > 
        <div className={ styles.helpContent}>
            <div className={ styles.topic}></div>
            <div></div>
        </div>
      </PivotItem>

      <PivotItem  headerText={ 'Views' } >
        <div className={ styles.topic}></div>
        <div></div>
      </PivotItem> */}
  </Pivot>
</div>;