import * as React from 'react';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import { Pivot, PivotItem, IPivotItemProps, PivotLinkFormat, PivotLinkSize,} from 'office-ui-fabric-react/lib/Pivot';

import { IQuickCommands } from '@mikezimm/npmfunctions/dist/QuickCommands/IQuickCommands';

import { IRefinerRulesStrs, IRefinerRulesInts, IRefinerRulesNums, IRefinerRulesTime, IRefinerRulesUser, IRefinerRulesEXPE, IRefinerRulesNone } from '@mikezimm/npmfunctions/dist/Refiners/IRefiners';
import { RefinerRulesStrs, RefinerRulesInts, RefinerRulesNums, RefinerRulesTime, RefinerRulesUser, RefinerRulesEXPE, RefinerRulesNone } from '@mikezimm/npmfunctions/dist/Refiners/IRefiners';

import { gitRepoALVFinManSmall } from '@mikezimm/npmfunctions/dist/Links/LinksRepos';

import { defaultBannerCommandStyles, } from "@mikezimm/npmfunctions/dist/HelpPanelOnNPM/onNpm/defaults";

import ReactJson from "react-json-view";
import { FontWeights } from 'office-ui-fabric-react';
import { BannerHelp, FPSBasicHelp, FPSExpandHelp, ImportHelp, SinglePageAppHelp, VisitorHelp } from '@mikezimm/npmfunctions/dist/PropPaneHelp/FPSCommonOnNpm';

require('@mikezimm/npmfunctions/dist/PropPaneHelp/PropPanelHelp.css');

import { ISitePreConfigProps, } from '@mikezimm/npmfunctions/dist/PropPaneHelp/PreConfigFunctions';


export function putObjectIntoJSON ( obj: any, name: string = null ) {
  // return <ReactJson src={ obj } name={ 'panelItem' } collapsed={ true } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '20px 0px' }}/>;
  return <ReactJson src={ obj } name={ name } collapsed={ false } displayDataTypes={ false } displayObjectSize={ false } enableClipboard={ true } style={{ padding: '20px 0px' }} theme= { 'rjv-default' } indentWidth={ 2}/>;
}

const PleaseSeeWiki = <p>Please see the { gitRepoALVFinManSmall.wiki }  for more information</p>;

const tenantServiceRequestURL = `https://servicenow.${window.location.hostname}.com/`;
const RequestStorageHere = <span>Please request storage <a href={tenantServiceRequestURL} target="_blank">here in Service Now.</a></span>;

const LinkFindInternalName = <a href="https://tomriha.com/what-is-sharepoint-column-internal-name-and-where-to-find-it/" target="_blank">Finding Internal Name of a column</a>;

const ShowCodeIcon = <Icon iconName={ 'Code' } title='ShowCode icon' style={ defaultBannerCommandStyles }></Icon>;
const CheckReferences = <Icon iconName={ 'PlugDisconnected' } title='Check Files' style={ defaultBannerCommandStyles }></Icon>;
const ShowRawHTML = <Icon iconName={ 'FileCode' } title='Show Raw HTML here' style={ defaultBannerCommandStyles }></Icon>;

const padRight15: React.CSSProperties = { paddingRight: '15px' };
const padRight40: React.CSSProperties = { paddingRight: '40px' };

const ReactCSSPropsNote = <span style={{ color: 'darkred', fontWeight: 500 }}>React.CSSProperties string like (with quotes):</span>;



export function getWebPartHelpElement ( sitePresets : ISitePreConfigProps ) {

  const usePreSets = sitePresets && ( sitePresets.forces.length > 0 || sitePresets.presets.length > 0 ) ? true : false;

  let preSetsContent = null;
  if ( usePreSets === true ) {
    const forces = sitePresets.forces.length === 0 ? null : <div>
      <div className={ 'fps-pph-topic' }>Forced Properties - may seem editable but are auto-set</div>
      <table className='configured-props'>
        { sitePresets.forces.map ( preset => {
          return <tr className={preset.className}><td>{preset.prop}</td><td title={ `for sites: ${preset.location}`}>{preset.type}</td><td>{preset.status}</td><td>{JSON.stringify(preset.value) } </td></tr>;
        }) }
      </table>
    </div>;
    const presets = sitePresets.presets.length === 0 ? null : <div>
      <div className={ 'fps-pph-topic' }>Preset Properties</div>
      <table className='configured-props'>
        { sitePresets.presets.map ( preset => {
          return <tr className={preset.className}><td>{preset.prop}</td><td title={ `for sites: ${preset.location}`}>{preset.type}</td><td>{preset.status}</td><td>{JSON.stringify(preset.value) } </td></tr>;
        }) }
      </table>

    </div>;

    preSetsContent = <div  className={ 'fps-pph-content' } style={{ display: 'flex' }}>
      <div>
        { forces }
        { presets }
      </div>
    </div>;

  }

  const WebPartHelpElement = <div style={{ overflowX: 'scroll' }}>

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

      <PivotItem headerText={ 'Basic' } > 
        <div className={ 'fps-pph-content' }>

          <div className={ 'fps-pph-topic' }>Basic propeties group</div>
          <div>Select the tab you always want to load first when loading the page.</div>
          <div><mark><b>NOTE:</b></mark> The app may over-ride this in cases where important news or time-sensitive inforamtion is being announced.</div>
          
        </div>
      </PivotItem>

      <PivotItem headerText={ 'Search' } > 
        <div className={ 'fps-pph-content' }>

          <div className={ 'fps-pph-topic' }>ALV Finance Manual Search</div>
          <div>This group applies specifically to setting up preferences on the Search Tab.</div>
          <div>You can configure the buttons on the left and top sides of the search page.</div>
          <div>Set toggle to Default to use default settings for this app.</div>
          <div>Set toggle to Custom and enter semi-colon ; separated words.</div>

          {/* <div>Bla bla bla must be like this:  <b>/sites/SecureCDN/<span style={{ color: 'red', fontWeight: 600 }}>YourCodeStorageSite</span>/</b></div>
          <div><mark><b>NOTE:</b></mark> {RequestStorageHere}</div> */}
          

          <div className={ 'fps-pph-topic' }>Source pages search</div>
          <div>This group applies to all other pages which can configure your own search buttons.</div>
          <div>For each type of page, you can type in semi-colon ; separated words that you commonly use on that page.</div>
          <div>The words turn into Search buttons for those page.</div>

          <div className={ 'fps-pph-topic' }>Benefits of configuring search buttons:</div>
          <ul>
            <li>Easier to find things that are most important to you and your team.</li>
            <li>Search buttons are quicker to use and improve speed of search.</li>
            <li>Eliminates common spelling errors.</li>
            <li>Your entire team can benefit by using the buttons created by the page owner.</li>
          </ul>

          <div className={ 'fps-pph-topic' }><mark>Search button Suggestions:</mark></div>
          <ul>
            <li>Use single words:  less cluttery, easier to find what is most important</li>
            <li>Do not use phrases if possible - long buttons will start wrapping on the page</li>
            <li>Do not over-do it.  Try to limit buttons to the top 7 or less buttons you use most often</li>
            <li>Always test your filters to make sure they are finding the items you expect</li>
            <li>Upper and Lower case do not matter.  Searching 'AHO', will find all items with 'AHO', 'Aho', 'aho', 'AhO'.</li>
            <li>You can filter on any text including acronyms, names, partial words</li>
            <li>Search looks for any instance of the word.  If you have a button called 'Count', it will also find any items that have 'account'.</li>
            <li>To reset search, either re-install the web part on the page, add to another page and copy settings</li>
            <li>You can also click on the 'Sheild' tab in this page to see all of the preset values</li>
          </ul>

        </div>
      </PivotItem>

      <PivotItem headerText={ 'Page Prefs' } > 
        <div className={ 'fps-pph-content' }>

          <div className={ 'fps-pph-topic' }>This group applies to some tabs that load Site Pages</div>
          <div>Includes:  <b>General, News, Help</b> and some places where you see <b>Standards</b>.</div>

          <div className={ 'fps-pph-topic' }>On click behavior</div>
          <div>When you see a list of pages on the left side, this determines what happens when you click on the item title.</div>

          <div className={ 'fps-pph-topic' }>How to fit images on the page</div>
          <div>Determines how you want to see images found on the page.</div>
          <div><mark><b>NOTE:</b></mark> site pages shown in this app may not show all web parts so this gives you control of how to display images in the same shape and size.</div>

          <div className={ 'fps-pph-topic' }>Image Height</div>
          <div>How tall you want images to be in the app.  This gives you control to make them shorter if you use smaller devices.</div>

          <div className={ 'fps-pph-topic' }>Image Width</div>
          <div>How wide you want the image to be.  Recommended 100%.</div>

          <div className={ 'fps-pph-topic' }>Debug Mode</div>
          <div>Maybe be used by tech Support.</div>
        </div>
      </PivotItem>

        <PivotItem headerText={ 'Web part styles' } > 
          <div className={ 'fps-pph-content' }>

            <div className={ 'fps-pph-topic' }>Heading 1, Heading 2, Heading 3, Styles</div>
            <div>Apply classes and styles to respective Heading elements on the page.   You can combine both classes and styles as shown below</div>
            <div>.dottedTopBotBorder;color:'red' %lt;== this will add dotted top and bottom border class and add font-color: red style to the heading.</div>

            <div className={ 'fps-pph-topic' }>Page Info Style options</div>
            <div>Applies to the container below the banner that contains both the TOC and Props components</div>
            <div>{ ReactCSSPropsNote } "fontSize":"larger","color":"red"</div>

            <div className={ 'fps-pph-topic' }>Table of Contents Style options</div>
            <div>Applies to the Table of Contents container</div>
            <div>{ ReactCSSPropsNote } "fontWeight":600,"color":"yellow"</div>

            <div className={ 'fps-pph-topic' }>Properties Style options</div>
            <div>Applies to the Properties container</div>
            <div>{ ReactCSSPropsNote } "fontWeight":600,"color":"yellow"</div>
          </div>
        </PivotItem>

        { VisitorHelp }
        { BannerHelp }
        { FPSBasicHelp }
        { FPSExpandHelp }
        { SinglePageAppHelp }
        { ImportHelp }
        { !preSetsContent ? null : 
          <PivotItem headerText={ null } itemIcon='Badge'>
            { preSetsContent }
          </PivotItem>
        }
    </Pivot>
  </div>;

return WebPartHelpElement;

}