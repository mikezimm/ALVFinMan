
import * as React from 'react';
import { IFMSearchType } from '../DataInterface';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';


export const defCommandIconStyles = {
    // root: {padding:'10px !important', height: 32},//color: 'green' works here
    icon: { 
    //   fontSize: 18,
    //   fontWeight: "normal",
    //   margin: '0px 2px',
    //   color: '#00457e', //This will set icon color
   },
  };

export function makeToggleJSONCmd ( onClick: any, cmdStyles?: any ) {

    let useStyles = cmdStyles ? cmdStyles : defCommandIconStyles;

    let divStyles : React.CSSProperties= { 
        marginTop: '40px', fontSize: '18px', cursor: 'pointer', width: '220px',
        display: 'flex', alignItems: 'center', flexWrap: 'nowrap', justifyContent: 'space-between'
    };

    let cmd = <div onClick={ onClick } style={ divStyles }><Icon iconName='Code' styles={ useStyles }></Icon> Toggle for Debug View</div>;

    return cmd;
}
