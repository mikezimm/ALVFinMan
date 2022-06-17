
import { replaceHTMLEntities } from '@mikezimm/npmfunctions/dist/Services/Strings/html';


/**
 *
  Need to do special parsing on custom webparts:
*/
const specialWebPartIDs: string[] = [
    '37b649bc-f846-4718-863d-9487d8fffb23', // FPS Page Info - TOC & Props
    '92b4cb98-3aa1-4ece-9149-a591a572aced', // Pivot Tiles-TEAM
    '2762fd19-106f-4fcc-9949-0c58c512be4e', // ALVFinMan
    '44f426eb-86a2-41d0-bf5d-3db469b93ab6', // FPS Easy Contents Webpart
  
  ];

/**
 * Looks for strings like this:  
 * "pageInfoStyle":""paddingBottom":"20px","backgroundColor":"#dcdcdc";"borderLeft":"solid 3px #c4c4c4"","bannerStyleChoice":
 * 
 * and converts to strings like this:
 * "pageInfoStyle":"'paddingBottom':'20px','backgroundColor':'#dcdcdc';'borderLeft':'solid 3px #c4c4c4'","bannerStyleChoice":
 * @param str 
 * @returns 
 */
export function reverseStylesStringQuotes( str: string ) {

    let newString = '';
    // part = part.replace(/:\"\"(?!,)/g, ':\"\''); //Replace instances of :"" that do not have a comma after it
    // part = part.replace(/(?<!:)\"\",/g, '\'\",'); //Replace instances of "", that do not have a colon in front it

    str = str.replace(/:\"{\"/g, ':{\"');
    str = str.replace(/\"}\"/g, '\"}');

    let styleColons = str.split(/:\"\"(?!,)/g); // Split by :"" strings
    let newParts: string[] = [];
    console.log('reversStyle: styleColons', styleColons );
    styleColons.map( ( part, idx1 ) => {   
        if ( idx1 === 0 ) {
        newParts.push( part ); //The first one never has to be fixed.

        } else { //All other items need to be fixed

        //Step 1:  Find where to stop ....  250px"",  --- basically where you find /(?<!:)\"\",/g
        let portions = part.split(/(?<!:)\"\",/g); // Split by "", strings
        console.log(`reversStyle: portions1 /(?<!:)\"\",/g`, portions );
        if ( portions.length > 2 ) alert('Whoa, wasnt expecting this.ToggleJSONCmd.key.toLocaleString.~ 342' );
        if ( portions.length > 1 ) portions[0] = portions[0].replace(/\"/g, "'" ); //Replace all double quotes with single quotes only if there is a second half
        if ( portions.length > 1 ) portions[1] = reverseStylesStringQuotes(portions[1]); //Replace all double quotes with single quotes only if there is a second half
        console.log('reversStyle: portions2', portions );
        newParts.push( portions.join( `'",`) );
        console.log('reversStyle: newParts1', newParts );
        //Step 2:  From start to stop, replace double quotes " with single quotes '

        //Step 3:  Push to newParts
        }

    });
    console.log('reversStyle: newPartsz', newParts );
    newString = newParts.join(':\"\''  );

    // let typeDivs = newString.split('{"type":"div"');

    // let result = typeDivs[0];
    // if ( typeDivs.length > 0 ) {
    //   newString = result + '""';
    // }
    return newString;

}

export function getModernHumanReadable( result: any ) {

    let startParsing = new Date();

    //Added this for debug option to be able to read CanvasContent1 better
    if ( !result.HumanReadable_Canvas1 ) result.HumanReadable_Canvas1 = result.CanvasContent1 ? replaceHTMLEntities( result.CanvasContent1 ) : '';
    const errCanvasWebParts = 'Unable to parse HumanJSON_ContentWebparts';
    if ( result.HumanReadable_Canvas1 ) {  //Look for any web part properties and add to JSON object
        const CanvasWebPartsTag = '<div data-sp-canvascontrol="" data-sp-canvasdataversion="1.0" data-sp-controldata="';
        const WebPartDataTag = 'data-sp-webpartdata="';
        
        let webparts = result.HumanReadable_Canvas1.split(CanvasWebPartsTag);

        if ( webparts.length > 0 ) {
            webparts.map ( ( part: string, idx1: number ) => {
                if ( idx1 > 0 ) {
                    if ( idx1 === 1 ) result.HumanJSON_ContentWebparts = [];

                    let startWebPartData = part.indexOf( WebPartDataTag );
                    let parseThisPart = startWebPartData < 0 ? part : part.substring( startWebPartData ).replace( WebPartDataTag,'');
                    let parseMe = parseThisPart.substring(0, parseThisPart.indexOf( '"><' ) );
                    try {
                        let doubleQuotes = parseMe.split(/(?<!:)\"\"(?!,)/g);
                        if ( doubleQuotes.length > 0 ) {
                        let cleanParseMe = '';
                        let newDoubleQuotes: string[] = [];
                        doubleQuotes.map( ( doubleQt, idx2 ) => {

                            if ( doubleQuotes.length === 0 ) {
                            //Do nothing, there are no elements with double quotes

                            } else if ( idx2 === 0 ) {
                            //Do nothing, this is the first element that does not have quotes
                            // console.log(' doubleQuotes1:' , doubleQt );

                            } else if ( idx2 !== doubleQuotes.length -1 ) {//This is the last item so this should not need to change quotes 
                                doubleQt = `"'${doubleQt.replace(/\"/g, "'" )}'"`;
                                // console.log(' doubleQuotes2:' , doubleQt );
                            }
                            newDoubleQuotes.push( doubleQt );
                        });

                        cleanParseMe = newDoubleQuotes.join('');
                        // console.log('cleanParseMe', cleanParseMe );
                        parseMe = cleanParseMe;
                        let isSpecial: any = false;
                        specialWebPartIDs.map( id => {
                            if ( parseMe.indexOf( id ) > -1 ) {
                            isSpecial = true;
                            }
                        });
                        if ( isSpecial === true ) { //This is a web part with known complex props that need special code
                            parseMe = reverseStylesStringQuotes( parseMe );

                            let typeDivs = parseMe.split('{"type":"div"');
                            parseMe = typeDivs[0];
                            if ( typeDivs.length > 1 ) {
                            parseMe += '""}}';
                            }
                        }
                        }
                        let parseThisObject = JSON.parse( parseMe );
                        let startContent = part.indexOf( '"><' ) + 2;
                        let endContent = part.lastIndexOf('</div>');
                        let thisContent = part.substring(startContent,endContent);
                        if ( thisContent.indexOf('<div data-sp-rte="">') > -1 ) {
                        //This is common Text WebPart
                        parseThisObject.title = 'OOTB Text Web Part';
                        } else {
                        //This is not OOTB Text Web Part so trim props from beginning of string
                        thisContent = thisContent.substring( thisContent.indexOf( '"><' ) + 2) ;
                        }
                        parseThisObject.content = thisContent;
                        result.HumanJSON_ContentWebparts.push( { parseMe:  parseThisObject } ) ;
                    } catch (e) {
                        result.HumanJSON_ContentWebparts.push( { part: part, errorText: errCanvasWebParts, parseMe: parseMe, error: e } );
                    }
                }
            });
        }
    }
    if ( !result.HumanReadable_LayoutWebpartsContent ) result.HumanReadable_LayoutWebpartsContent = result['LayoutWebpartsContent'] ? replaceHTMLEntities( result['LayoutWebpartsContent'] ) : '';
    const LayoutWebpartsTag = '<div><div data-sp-canvascontrol="" data-sp-canvasdataversion="1.4" data-sp-controldata="';
    if ( result.HumanReadable_LayoutWebpartsContent.indexOf( LayoutWebpartsTag ) === 0 ) {
        try {
        result.HumanJSON_LayoutWebpartsContent = JSON.parse(result.HumanReadable_LayoutWebpartsContent.replace(LayoutWebpartsTag,'').replace('"></div></div>',''));
        } catch (e) {
        result.HumanJSON_LayoutWebpartsContent = 'Unable to parse LayoutWebpartsContent' + JSON.stringify(e);
        }
    }

    if ( !result.HumanReadableOData_Author ) result.HumanReadableOData_Author = result['Author'] ? replaceHTMLEntities( result['Author'] ) : '';
    if ( !result.HumanReadableOData_Editor ) result.HumanReadableOData_Editor = result['Editor'] ? replaceHTMLEntities( result['Editor'] ) : '';

    let endParsing = new Date();
    result.parsingTime = ( endParsing.getTime() - startParsing.getTime() ) ;

    console.log('parse time: ', result.parsingTime );


    return result;

}