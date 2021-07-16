const dataDirectory = './data/test/';

const urls = {
    documents : dataDirectory + 'model.csv'
}

let PM = tMap.PageManager('div#app', 'A', '3-6-5-1-b', 'div#header', 'div#footer', 700, 700);

let DM = tMap.DataManager();

let SM = tMap.StateManager();

let docTable = tMap.DocTable(PM.panel1.c, PM.panel1.w, PM.panel1.h)
    .doClusterize(true)
    .setColumnsInfo([
        {title:'id',accessor:d=>d.docId},
        {title:'Title',accessor:d=>d.title},
        {title:'Authors',accessor:d=>d.authors},
        {title:'University',accessor:d=>d.university},
        {title:'Abstract',accessor:d=>d.shortAbstract,tooltip:d=>d.abstract},
        {title:'Date',accessor:d=>d.date},
        {title:'Money',accessor:d=>d.money},
    ])

let search = tMap.Search(PM.control1.c,PM.control1.w,PM.control1.h)
    .setSearchCB(searchDocs);

function searchDocs(query){
    SM.state('search', query.length > 0 ? query : null);
    DM.documents.setSearchTerm(SM.state('search'));
    docTable.render(DM.documents.getDocumentsToRender());
}

let menu = tMap.Menu(PM.control3.c,PM.control3.h)

PM.watch({
    panel1: docTable,
    control1: search,
    control3: menu
});

DM.loadAndProcessDataFromUrls(urls).then(()=>{

    DM.documents.processDocumentTopics();
    DM.documents.setSearchFields(['authors', 'title', 'abstract', 'university']);
    DM.documents.shortenTexts([['abstract','shortAbstract']],297);
    docTable.render(DM.documents.getDocumentsToRender());

    SM.parseURL();
    if(SM.state('search')!=null){
        search.setValue(SM.state('search'));
    }
})
