const dataDirectory = './data/test/';

const urls = {
    mainBubbleMap : dataDirectory + 'mainMap.json',
    subBubbleMaps : dataDirectory + 'subMaps.json',
    mainTopicModel : dataDirectory + 'mainModel.json',
    subTopicModel : dataDirectory + 'subModel.json',
    topicTrends : dataDirectory + 'distributionDate.json',
    distributions : dataDirectory + 'distributionUni.json',
    labelsIndex : dataDirectory + 'labelIndex.json',
    mainLL : dataDirectory + 'mainLL.json',
    subLL : dataDirectory + 'subLL.json'
}

const selectors = {
    panel1: '#panel1',
    panel2: '#panel2',
    panel3: '#panel3',
    panel4: '#panel4',
    panel5: '#panel5',
    control1: '#control1',
    control2: '#control2',
    control3: '#control3'
}

let sizes = BubbleMap.PageManager('#app', 'E', '3-3-2-1-b', selectors, '#header', '#footer');

let dataManager = BubbleMap.DataManager();

let mainTopic,
    subTopic,
    doc,
    filterValue,
    docDate,
    labelSearch;

let mainMap = BubbleMap.BubbleMap(selectors.panel1, sizes.panel1.width, sizes.panel1.height)
    .setClickCB(selectMainMapTopic)
    .setOpacityRange(0.2, 0.2)
    .setTooltip(d=>`${BubbleMap.numberFormat(',d', d.size)} publications`)
    .setTooltipChart((t,d)=>{
        BubbleMap.HorBarChart(t, 200, 100)
            .setTicks(3, '.0%')
            // .setMaxValue(1)
            .render(dataManager.getMainTopicNormalisedDistributionEntry(d.topicId))
        // BubbleMap.WordCloud(t, 300, 300)
        //     .setTextSizeRange([10,30])
        //     .render(d.labels)
    })
    .addDefaultText('Loading...', 2, true);

let subMap = BubbleMap.BubbleMap(selectors.panel2, sizes.panel2.width, sizes.panel2.height)
    .setClickCB(selectSubMapTopic)
    .setTooltip(d=>`${BubbleMap.numberFormat(',d', d.size)} publications`)
    .addDefaultText('Click on a bubble to see more details.');

let wordcloud = BubbleMap.WordCloud(selectors.panel3, sizes.panel3.width, sizes.panel3.height)
    .addDefaultText('Click on a bubble to see more labels.')
    .setWordClick(d=>{
        let s = BubbleMap.processWordSearch(d.t, searchBox.getValue());
        searchBox.setValue(s);
        searchLabels(s.toLowerCase());
    })
    .setWordMouseover(d=>{
        console.log(d.t)
    }, d=>{console.log(d.t, 'out')})
    

let tableTooltip = d => {
    let fields = [];
    fields.push(`Word Count: ${d.docData.wordCount}`);
    fields.push(`Relevance: ${Math.floor(d.weight*100)}%`);
    return fields.join(' - ');
}

let table = BubbleMap.Table(selectors.panel4, sizes.panel4.width, sizes.panel4.height)
    .addDefaultText('Click on a bubble to explore documents.', 1.2)
    .setColumnsInfo([
        {
            title: 'Title',
            accessor: d=>d.docData.title,
            // click: d=>{window.open(d.docData.url, '_blank', "height=800,width=1000");},
            tooltip: tableTooltip
        },{
            title: 'Authors',
            accessor: d=>d.docData.authors,
            tooltip: tableTooltip
        },{
            title: 'Date',
            accessor: d=>d.docData.date,
            tooltip: tableTooltip,
            // click: viewDocument
        },{
            title: 'Money',
            accessor: d=>`£ ${BubbleMap.numberFormat(',d',d.docData.money)}`,
            tooltip: tableTooltip,
            // click: viewDocument
        }
    ]);

let sumByMonth = dataManager.getTrendSumByFunction('%d/%m/%y', '%Y-%m'),
    sumByYear = dataManager.getTrendSumByFunction('%d/%m/%y', '%Y'),
    trendsRange = ['%d/%m/%y', '01/01/11', '01/01/20'];

// let docViewer = BubbleMap.DocumentViewer(selectors.panel5, sizes.panel5.width, sizes.panel5.height);

let trend = BubbleMap.TrendBars(selectors.panel5, sizes.panel5.width, sizes.panel5.height)
    .setParseTime('%Y')
    .setTickFormat('%Y')
    .setTooltip(d=>`${BubbleMap.numberFormat(',d', d.value)} publications`)
    .setClickCB(d=>filterDocDate(d.date))
    .setTransition(500)
    .addDefaultText('Click on a bubble to see the topic trends.');

let searchBox = BubbleMap.SearchBox(selectors.control1, sizes.control1.width, sizes.control1.height)
        .setSearchCB(searchLabels);

let dropdown = BubbleMap.DropdownFilter(selectors.control2, sizes.control2.width, sizes.control2.height)
    .setSelectCB(selectDistribution);

function viewDocument(d){
    doc = d.docId;
    docViewer.render(d.docData);
}

function newDocView(){
    doc = null;
    docViewer.render({})
        .addDefaultText('Click a table row to see the document details.')
}

function selectMainMapTopic(d){
    mainTopic = d.topicId;
    newSubBubbleMap();
    dataManager.setTableRows(mainTopic);
    mainMap.selectBubble(mainTopic);
    wordcloud.render(d.labels)
        .toggleButton('TL', 'help', ()=>{
            console.log('main topic:', mainTopic)
        });
    table.render(dataManager.getTableRows(50));
    // newDocView()
    highlightFromLabelSearch();
    trend.render([dataManager.getTopicTrend(mainTopic, 'main', sumByYear, trendsRange)
                        .map(d=>{return{date:d.date,value:d.value,layer:'main'}})]);
}

function newSubBubbleMap(){
    subTopic = null;
    dataManager.setSubBubbleMap(mainTopic);
    subMap.render(dataManager.data.subBubbleMap);
    if(filterValue == 'All'){
        subMap.setBubblesOpacity([], true);
    } else {
        subMap.setBubblesOpacity(dataManager.getSubTopicsDistribution(filterValue));
    }
}

function selectSubMapTopic(d){
    subTopic = d.topicId;
    dataManager.setTableRows(d.topicId, 'sub');
    subMap.selectBubble(subTopic);
    wordcloud
        .setMargin([35, 10, 10, 10])
        .render(d.labels)
        .toggleButton('TL')
        .toggleButton('BR','help', ()=>{
            console.log('sub topic:', subTopic)
        })
        .toggleTitle('Title', 't');
    table.render(dataManager.getTableRows(50));
    // newDocView()
    highlightFromLabelSearch();
    trend.render([dataManager.getTopicTrend(mainTopic, 'main', sumByYear, trendsRange)
                        .map(d=>{return{date:d.date,value:d.value,layer:'main'}}),
                  dataManager.getTopicTrend(subTopic, 'sub', sumByYear, trendsRange)
                        .map(d=>{return{date:d.date,value:d.value,layer:'sub'}})]);
}

function filterDocDate(date){
    if(date == docDate){
        table.fadeDocs([])
        trend.selectBar(null)
        docDate = null
    } else {
        docDate = date;
        trend.selectBar(docDate)
        let dateConverter = dataManager.timeFormatConverter('%d/%m/%y', '%Y')
        let filter = d =>{
            return dateConverter(d.docData.date) !== docDate
        }
        let ids = dataManager.getTableRows(50, filter).map(d=>d.docId)
        table.fadeDocs(ids)
    }
}

function searchLabels(query){
    labelSearch = query.length > 0 ? query : null;
    searchBox.activate(query!=='');
    dataManager.setSearchTerm(query);
    highlightFromLabelSearch();
}

function highlightFromLabelSearch(){
    let {mainTopicIds, subTopicIds} = dataManager.getBubblesIdFromTerm();
    mainMap.highlightBubbles(mainTopicIds);
    subMap.highlightBubbles(subTopicIds);
    let labels = dataManager.getLabelsFromTerm();
    wordcloud.highlightTexts(labels);
    let docIds = dataManager.getDocIdsFromTerm();
    table.highlightDocs(docIds);
}

function selectDistribution(value){
    filterValue = value;
    dropdown.setSelected(filterValue);
    if(filterValue == 'All'){
        mainMap.setBubblesOpacity([], true);
        subMap.setBubblesOpacity([], true);
    } else {
        mainMap.setBubblesOpacity(dataManager.getMainTopicsDistributionNormalisedPerField(filterValue));
        subMap.setBubblesOpacity(dataManager.getSubTopicsDistributionNormalisedPerField(filterValue));
    }
}

let menu = BubbleMap.FloatingMenu(selectors.control3, sizes.control3.height)
    .addShareView(()=>{
       return BubbleMap.URLManager.buildURL({ mainTopic, subTopic, labelSearch, filterValue, doc, docDate })
    })
    .addTakeScreenshot('#app')
    .addDownloadData([{name:'Main Model', url:`${dataDirectory}mainModel.csv`},
                     {name:'Sub Model', url:`${dataDirectory}subModel.csv`}])
    .addModal('Modal Title', '<p>Test here, <b>bold text</b></p><p style="text-align:center"><i>test</i></p>');

function parseURL(){
    let {mainTopic, subTopic, labelSearch, filterValue, doc, docDate} = BubbleMap.URLManager.parseURL();
    if(mainTopic != null){
        selectMainMapTopic(dataManager.getMainTopic(mainTopic));
        if(subTopic != null){
            selectSubMapTopic(dataManager.getSubTopic(subTopic));
        }
        if(doc != null){
            let docEntry = dataManager.getDocument(doc);
            if(docEntry !== null ) viewDocument(docEntry)
        }
    }
    if(labelSearch != null){
        searchBox.setValue(labelSearch);
        searchLabels(labelSearch);
    }
    if(filterValue != null){
        selectDistribution(filterValue);
    }
    if(docDate != null){
        filterDocDate(docDate)
    }
}

sizes.watch({
    panel1: mainMap,
    panel2: subMap,
    panel3: wordcloud,
    panel4: table,
    panel5: trend,
    control1: searchBox,
    control2: dropdown,
    control3: menu
})

// should be last to execute
// load data and render viz
dataManager.loadAndProcessDataFromUrls(urls).then(()=>{
    // set labels search
    dataManager.setLabelsKeys();
    // render main map
    mainMap.render(dataManager.data.mainBubbleMap);
    // set max value for trends
    // trend.setMaxValue(dataManager.getMaxTrend(false, sumByYear));

    // Get distribution labels 
    let distribValues = dataManager.getDistributionsValues(d=>`University ${d}`);
    distribValues.unshift({value:'All', text:'All'});
    dropdown.addOptions(distribValues).setSelected('All');

    // Add LL charts to menu options
    menu.addLLChart(dataManager.data.mainLL, dataManager.data.subLL)
        .addModelInfo(dataManager.data.mainTopicModel.metadata, dataManager.data.subTopicModel.metadata, {showDocs:true, showWords:true, stopWordsReason:'they were over-represented and too generic in the context of this document set', stopPhrasesReason:'they were frequently repeated in the documents, which would have skewd the model'});

    // parse URL to set default topic ids and search
    parseURL();
})

