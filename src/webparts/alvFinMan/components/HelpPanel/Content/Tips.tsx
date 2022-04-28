import * as React from 'react';

import * as fpsAppIcons from '@mikezimm/npmfunctions/dist/Icons/standardExStorage';

import { Icon  } from 'office-ui-fabric-react/lib/Icon';

import { buildAppWarnIcon, buildClickableIcon } from '@mikezimm/npmfunctions/dist/Icons/stdIconsBuildersV02';

import * as StdIcons from '@mikezimm/npmfunctions/dist/Icons/iconNames';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';


const iconStyles: any = { root: {
  fontSize: 'x-large',
  fontWeight: 600,
  paddingRight: '10px',
  paddingLeft: '10px',
}};

const gridIcon = <Icon iconName={"GridViewSmall"}  style={ iconStyles } />; 
const tilesIcon = <Icon iconName={"Tiles"}  style={ iconStyles } />; 
const filterIcon = <Icon iconName={"ClearFilter"}  style={ iconStyles } />;
const dashIcon = <Icon iconName={"ChromeMinimize"}  style={ iconStyles } />;

const tipCellStyle: React.CSSProperties = {paddingRight: '20px' };

export const webParTips : any[] = [
  // <tr><td style={tipCellStyle}>Alt-Click</td>
  //     <td style={tipCellStyle}>HTML File Link</td>
  //     <td>Open the html file <b>in Edit Mode</b></td></tr>,

//   <tr><td style={tipCellStyle}>CTRL-ALT-SHFT-Click <b>Tile</b></td>
//       <td style={tipCellStyle}>Tile</td>
//       <td>Go directly to that Tile item's properties</td></tr>,

//   <tr><td style={tipCellStyle}>CTRL-Click <b>Category</b></td>
//       <td style={tipCellStyle}>Top Left</td>
//       <td>Set that Category as the "Hero" Category</td></tr>,

//   <tr><td style={tipCellStyle}>Click on &nbsp; <b>Grid Icon { gridIcon } { tilesIcon } </b></td>
//       <td style={tipCellStyle}>Upper Right</td>
//       <td>Change format of tiles to Cards, List, Tiles</td></tr>,

//   <tr><td style={tipCellStyle}>Click on &nbsp;<b>Filter X Icon  { filterIcon } </b></td>
//       <td style={tipCellStyle}>Upper Right</td>
//       <td>Show All Tiles</td></tr>,

//   <tr><td style={tipCellStyle}>Click on &nbsp;<b>-- Icon { dashIcon }</b></td>
//       <td style={tipCellStyle}>Upper Right</td>
//       <td>Hide All Tiles</td></tr>,

];


export function getRandomTip( repoLinks: IRepoLinks ) {

  return webParTips[Math.floor(Math.random() * webParTips.length)];

}