
import * as React from 'react';
import { IFMSearchType } from '../DataInterface';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

  /**
 * Copied from ECStorage
 * Super cool solution based on:  https://stackoverflow.com/a/43235785
 * @param text 
 * @param highlight 
 */
   export function getSearchTypeIcon( SearchType: IFMSearchType) {

    return <div title={ SearchType.title }><Icon iconName={ SearchType.icon }></Icon></div>;
  
  }
