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

      <PivotItem headerText={ 'Financial Manual' } > 
        <div className={ 'fps-pph-content' }>

          <div className={ 'fps-pph-topic' }>TBD To fill out</div>
          <div>Bla bla bla.</div>
          <div>Bla bla bla must be like this:  <b>/sites/SecureCDN/<span style={{ color: 'red', fontWeight: 600 }}>YourCodeStorageSite</span>/</b></div>
          <div><mark><b>NOTE:</b></mark> {RequestStorageHere}</div>
          
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