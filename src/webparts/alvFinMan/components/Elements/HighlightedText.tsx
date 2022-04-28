
import * as React from 'react';

  /**
 * Copied from ECStorage
 * Super cool solution based on:  https://stackoverflow.com/a/43235785
 * @param text 
 * @param highlight 
 */
   export function getHighlightedText(text, highlight) {
    // <div dangerouslySetInnerHTML={{ __html: this.state.showPanelItem.WikiField }} />
    // Split on highlight term and include term into parts, ignore case
    if ( !highlight ) {
      return text;
  
    } else {
      const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
      return <span> { parts.map((part, i) => 
        <span key={i} style={part.toLowerCase() === highlight.toLowerCase() ? { fontWeight: 'bold', backgroundColor: 'yellow' } : {} }>
          { part }
        </span>)
      } </span>;
    }
  
  }
