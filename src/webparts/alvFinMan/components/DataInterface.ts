
// //Interfaces
// import { ISourceProps, ISourceInfo, IFMSearchType, IFMSearchTypes } from './DataInterface';

import { IAppFormat } from "./IAlvFinManProps";

// //Constants
// import { SourceInfo, thisSelect, SearchTypes } from './DataInterface';

//Classic Financial manual
export const FinManSitePieces1 = ['/sites','/au','tol','iv','finan','cialmanual/']; //Just so this is not searchable easily 

//Modern Financial Manual
export const FinManSitePieces2 = ['/sites','/finan','cemanual/']; //Just so this is not searchable easily
export const FinManSite: string =`${FinManSitePieces2.join('')}`;

// export const ModernSitePagesColumns: string[] = ['ID','Title','Description','Author/Title','Editor/Title','File/ServerRelativeUrl','BannerImageUrl/Url','FileSystemObjectType','FirstPublishedDate','PromotedState','FileSizeDisplay','OData__UIVersion','OData__UIVersionString','DocIcon'];
export const ModernSitePagesColumns: string[] = ['ID','Title','Description','Author/Title','Editor/Title','File/ServerRelativeUrl','BannerImageUrl', 
    'FileSystemObjectType','Modified','Created','FirstPublishedDate','PromotedState','FileSizeDisplay','OData__UIVersion','OData__UIVersionString','DocIcon',
    'OData__OriginalSourceUrl' ]; //Added this for news links

export const ModernSitePagesSearc: string[] = ['Title','Description','Author/Title','Editor/Title','FirstPublishedDate','PromotedState',];

//sitePagesColumns was used for the classic pages.
// export const sitePagesColumns: string[] = [ "ID", "Title0", "Author/Title", "Editor/Title", "File/ServerRelativeUrl", "FileRef","FileLeafRef", "Created", "Modified" ]; //Do not exist on old SitePages library:   "Descritpion","BannerImageUrl.Url", "ServerRelativeUrl"
export const libraryColumns: string[] = [ 'ID','FileRef','FileLeafRef','ServerRedirectedEmbedUrl','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','CheckoutUserId','HasUniqueRoleAssignments','Title','FileSystemObjectType','FileSizeDisplay','File_x0020_Type','FileLeafRef','LinkFilename','OData__UIVersion','OData__UIVersionString','DocIcon'];
export const LookupColumns: string[] = ['Functions/Title', 'Topics/Title', 'ALGroup/Title', 'ReportingSections/Title','Processes/Title' ]; // removed 'Sections/Title', for now since it should be ReportingSections

//ClassicSitePageColumns was used for the classic pages.
// export const ClassicSitePageColumns: string [] = [ ...sitePagesColumns, ...LookupColumns, ...[ 'DocumentType/Title' ] ];

export const ExtraFetchClassicWiki = ['WikiField'];
export const ExtraFetchModernPage = ['WikiField','CanvasContent1','LayoutsWebpartsContent'];

export type IDefSourceType = 'link' | 'news' | 'help' | 'account' | 'std' | 'manual' | 'SupportDocuments';

export type ISearchSource = 'AppLinks' | 'News' | 'Help' | 'Accounts' | 'SupportDocs' | 'Manual' | 'Standards' | 'Policies' | 'Instructions';

export interface ISourceProps {
    key: IAppFormat;
    defType: IDefSourceType;  //Used in Search Meta function
    webUrl: string;
    listTitle: string;
    webRelativeLink: string;
    columns: string[];
    searchProps: string[];
    selectThese?: string[];
    restFilter?: string;
    searchSource: ISearchSource;
    searchSourceDesc: string;
    itemFetchCol?: string[]; //higher cost columns to fetch on opening panel
    isModern: boolean;
    orderBy?: {
        prop: string;
        asc: boolean;
    };

}
export interface ISourceInfo {
    manual: ISourceProps;
    news: ISourceProps;
    help: ISourceProps;
    appLinks: ISourceProps;
    docs: ISourceProps;
    stds: ISourceProps;
    sups: ISourceProps;
    accounts: ISourceProps;

}

export const SourceInfo: ISourceInfo = {

    manual: {
        key: 'manual',
        defType: 'manual',
        webUrl: `${FinManSite}Manual/`,
        listTitle: "Site Pages",
        webRelativeLink: "SitePages",
        searchSource: 'Manual',
        searchSourceDesc:  'Site Pages library in Manual Subsite',
        columns: ModernSitePagesColumns,
        searchProps: ModernSitePagesSearc,
        itemFetchCol: ExtraFetchModernPage,
        isModern: true,
        restFilter: "Id ne 'X' and ContentTypeId ne '0x012000F6C75276DBE501468CA3CC575AD8E159' and Title ne 'Home'",
    },

    news: {
        key: 'news',
        defType: 'news',
        webUrl: `${FinManSite}News/`,
        listTitle: "Site Pages",
        webRelativeLink: "SitePages",
        searchSource: 'News',
        searchSourceDesc:  'Site Pages library in News Subsite',
        columns: ModernSitePagesColumns,
        searchProps: ModernSitePagesSearc,
        itemFetchCol: ExtraFetchModernPage,
        isModern: true,
        restFilter: "Id ne 'X' and ContentTypeId ne '0x012000F6C75276DBE501468CA3CC575AD8E159' and Title ne 'Home'",
    },

    help: {
        key: 'help',
        defType: 'help',
        webUrl: `${FinManSite}Help/`,
        listTitle: "Site Pages",
        webRelativeLink: "SitePages",
        searchSource: 'Help',
        searchSourceDesc:  'Site Pages library in Help Subsite',
        columns: ModernSitePagesColumns,
        searchProps: ModernSitePagesSearc,
        itemFetchCol: ExtraFetchModernPage,
        isModern: true,
        restFilter: "Id ne 'X' and ContentTypeId ne '0x012000F6C75276DBE501468CA3CC575AD8E159' and Title ne 'Home'",
    },

    appLinks: {
        key: 'appLinks',
        defType: 'link',
        webUrl: `${FinManSite}Manual/`,
        webRelativeLink: "lists/ALVFMAppLinks",
        searchSource: 'AppLinks',
        searchSourceDesc:  'ALVFMAppLinks list in Manual Subsite',
        listTitle: "ALVFMAppLinks",
        columns: [ '*','ID','Title','Tab', 'SortOrder', 'LinkColumn', 'Active', 'SearchWords','RichTextPanel','Author/Title','Editor/Title','Author/Name','Editor/Name','StandardDocuments/ID','StandardDocuments/Title','Modified','Created','HasUniqueRoleAssignments','OData__UIVersion','OData__UIVersionString'], //,'StandardDocuments/Title'
        searchProps: [ 'Title', 'LinkColumn','RichTextPanel', 'SearchWords','StandardDocuments/Title' ], //'StandardDocuments/Title'
        orderBy: { prop: 'Title', asc: false },
        isModern: true,
    },

    accounts: {
        key: 'accounts',
        defType: 'account',
        webUrl: `${FinManSite}Manual/`,
        webRelativeLink: "lists/HFMAccounts",
        searchSource: 'Accounts',
        searchSourceDesc:  'Accounts list in Manual Subsite',
        listTitle: "HFMAccounts",
        columns: [ 'ID','ALGroup','Description','Name1','RCM','SubCategory'],
        searchProps: [ 'Title', 'Description', 'ALGroup', 'Name1','RCM','SubCategory' ],
        selectThese: [ '*', 'ID','ALGroup','Description','Name1','RCM','SubCategory' ],
        isModern: true,
    },

    //Do not get * columns when using standards so you don't pull WikiFields
    // let selectThese = library === StandardsLib ? [ ...columns, ...selColumns].join(",") : '*,' + [ ...columns, ...selColumns].join(",");

    stds: {
        key: 'stds',
        defType: 'std',
        webUrl: `${FinManSite}Manual/`,
        webRelativeLink: "SitePages",
        searchSource: 'Manual',
        searchSourceDesc:  'Site Pages library in Manual Subsite',
        listTitle: "Site Pages",
        columns: [ ...ModernSitePagesColumns, ...LookupColumns ],
        itemFetchCol: ExtraFetchModernPage,
        searchProps: [ ...ModernSitePagesColumns, ...LookupColumns ],
        selectThese: [ ...['*'], ...ModernSitePagesColumns, ...LookupColumns ],
        isModern: true,

    },

    //Do not get * columns when using standards so you don't pull WikiFields
    // let selectThese = library === StandardsLib ? [ ...columns, ...selColumns].join(",") : '*,' + [ ...columns, ...selColumns].join(",");

    docs: {
        key: 'docs',
        defType: 'std',
        webUrl: `${FinManSite}Manual/`,
        webRelativeLink: "SitePages",
        searchSource: 'Manual',
        searchSourceDesc:  'Site Pages library in Manual Subsite',
        listTitle: "Site Pages",
        columns: [ ...ModernSitePagesColumns, ...LookupColumns ],
        itemFetchCol: ExtraFetchModernPage,
        searchProps: [ ...ModernSitePagesColumns, ...LookupColumns ],
        selectThese: [ ...['*'], ...ModernSitePagesColumns, ...LookupColumns ],
        isModern: true,

    },

    //Do not get * columns when using standards so you don't pull WikiFields
    // let selectThese = library === StandardsLib ? [ ...columns, ...selColumns].join(",") : '*,' + [ ...columns, ...selColumns].join(",");

    sups: {
        key: 'sups',
        defType: 'SupportDocuments',
        webUrl: `${FinManSite}Manual/`,
        webRelativeLink: "SupportDocuments",
        searchSource: 'SupportDocs',
        searchSourceDesc:  'SupportDocuments library in Manual Subsite',
        listTitle: "SupportDocuments",
        columns: [ ...libraryColumns, ...LookupColumns ],
        searchProps: [ ...libraryColumns, ...LookupColumns ],
        selectThese: [ ...['*'], ...libraryColumns, ...LookupColumns ],
        isModern: true,
    },
};


export const thisSelect = ['*','ID','FileRef','FileLeafRef','Author/Title','Editor/Title','Author/Name','Editor/Name','Modified','Created','CheckoutUserId','HasUniqueRoleAssignments','Title','FileSystemObjectType','FileSizeDisplay','FileLeafRef','LinkFilename','OData__UIVersion','OData__UIVersionString','DocIcon'];

export interface IFMSearchType {
    key: string;
    title: string;
    icon: string;
    style: string;
    count: number;
    adjust?: number; //Use to adjust the index to get a common one like all Excel files;
}

export interface IFMSearchTypes {
    keys: string[];
    objs: IFMSearchType[];
}

export const SearchTypes:IFMSearchTypes  = {
    keys: [ "account", "doc", "docx",
        "link",    "msg",
        "page",
        "pdf",    "ppt",    "pptx",
        "rtf",
        "std",
        "xls", "xlsm",  "xlsx",
        "news", "help",
        "unknown" ],
    objs:
        [
        //NOTE:  key must be exact match to strings in keys array above.
        { key: "account", title: "account", icon: "Bank", style: "", count: 0 }, 
        { key: "doc", title: "doc", icon: "WordDocument", style: "", count: 0 }, 
        { key: "docx", title: "doc", icon: "WordDocument", style: "", count: 0, adjust: -1 }, 

        { key: "link", title: "Link", icon: "Link12", style: "", count: 0 }, 
        { key: "msg", title: "msg", icon: "Read", style: "", count: 0 }, 

        { key: "page", title: "page", icon: "KnowledgeArticle", style: "", count: 0 }, 

        { key: "pdf", title: "pdf", icon: "PDF", style: "", count: 0 }, 
        { key: "ppt", title: "ppt", icon: "PowerPointDocument", style: "", count: 0 }, 
        { key: "pptx", title: "ppt", icon: "PowerPointDocument", style: "", count: 0, adjust: -1 }, 

        { key: "rtf", title: "rtf", icon: "AlignLeft", style: "", count: 0 }, 
        { key: "std", title: "std", icon: "Info", style: "", count: 0 }, 

        { key: "xls", title: "xls", icon: "ExcelDocument", style: "", count: 0 }, 
        { key: "xlsm", title: "xls", icon: "ExcelDocument", style: "", count: 0, adjust: -1 }, 
        { key: "xlsx", title: "xls", icon: "ExcelDocument", style: "", count: 0, adjust: -2 }, 

        { key: "news", title: "news", icon: "News", style: "", count: 0 }, 
        { key: "help", title: "help", icon: "Help", style: "", count: 0 }, 
        { key: "unknown", title: "unkown", icon: "Help", style: "", count: 0 }, 
    ]
};