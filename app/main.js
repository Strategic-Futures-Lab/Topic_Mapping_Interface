
const dataDirectory = './data/test/';
const urls = {
    mainMap : dataDirectory + 'mainMap.json',
    subMaps : dataDirectory + 'subMaps.json',
    mainModel : dataDirectory + 'mainModel.json',
    subModel : dataDirectory + 'subModel.json',
    trend : dataDirectory + 'distributionDate.json',
    distribution : dataDirectory + 'distributionUni.json',
    labelsIndex : dataDirectory + 'labelIndex.json',
    mainLL : dataDirectory + 'mainLL.json',
    subLL : dataDirectory + 'subLL.json'
}

let PM = tMap.PageManager('div#app', 'E', '4-5-1-5-1-b', 'div#header', 'div#footer', 700, 700);

let DM = tMap.DataManager();

let SM = tMap.StateManager();

let mainMap = tMap.BubbleMap(PM.panel1.c, PM.panel1.w, PM.panel1.h)
    .setTooltip(d=>d.size)
    .setTooltipChart((t,d)=>{
        tMap.HorizontalBarChart(t, 200, 100)
            .setTicks(3)
            .render(DM.getMainTopicDistribEntryNorm(d.topicId))
    })
    .setBubbleClick(selectMainTopic)
    .addDefaultText('Loading...', 2, true)
    .setMargin([40,10,10,10])
    .toggleButton('TR', 'Test', ()=>{console.log('button test')})
    .toggleTitle('Topic Map').setMinimumTextSize(2);
let wordcloud = tMap.WordCloud(PM.panel3.c, PM.panel3.w, PM.panel3.h)
    .addDefaultText('Click on a bubble to see more labels.', 1, true)
    .setMargin([40,10,10,10])
    .toggleTitle('Topic Labels')
    .setWordClick((e,d)=>{
        let s = DM.processWordInSearch(d.t, SM.state('search'));
        search.setValue(s);
        searchLabels(s.toLowerCase());
    });
let subMap = tMap.BubbleMap(PM.panel2.c, PM.panel2.w, PM.panel2.h)
    .setTooltip(d=>d.size)
    .setTooltipChart((t,d)=>{
        tMap.VerticalBarChart(t, 200, 100)
            .setTicks(3, '.0%')
            .render(DM.getSubTopicDistribEntryNorm(d.topicId))
    })
    .setBubbleClick(selectSubTopic)
    .addDefaultText('Click on a bubble to see more topics.')
    .setMargin([40,10,10,10])
    .toggleButton('TR', 'Test', ()=>{console.log('button test')})
    .toggleTitle('Topic Map');

let sumByMonth = tMap.dateConverter('%d/%m/%y', '%Y-%m'),
    sumByQuarter = tMap.dateConverter('%d/%m/%y', '%Y-%q'),
    sumByYear = tMap.dateConverter('%d/%m/%y', '%Y'),
    trendsRange = ['%d/%m/%y', '01/01/11', '01/01/20'];
let trend = tMap.TrendChart(PM.panel4.c, PM.panel4.w, PM.panel4.h)
    .setDateTicks('%Y')
    .setValueTicks(10, '.0f')
    .setTooltip(d=>`${tMap.formatNumber(d.value, ',d')} publications`)
    .setTransition(500, 100)
    .addDefaultText('Click on a bubble to see the topic trends.')
    .setMargin([40,20,30,10])
    .toggleButton('TR', 'Test', ()=>{console.log('button test')})
    .toggleTitle('Topic Trend');

let tableTooltip = d => {
    let fields = [];
    fields.push(`Word Count: ${d.docData.wordCount}`);
    fields.push(`Relevance: ${Math.floor(d.weight*100)}%`);
    return fields.join(' - ');
}
let tableTooltipChart = (t,d)=>{
    let v = parseFloat(d.docData.money)
    tMap.VerticalBarChart(t, 200, 100)
        .setTicks(3, '.0%')
        .render([{key:'A',value:v}])
}
let table = tMap.DocTable(PM.panel5.c, PM.panel5.w, PM.panel5.h)
    .addDefaultText('Click on a bubble to see the topic top documents.',1,true)
    .toggleTitle('Top Documents')
    .setColumnsInfo([
        {title:'Title',accessor:d=>d.docData.title,tooltip:tableTooltip,click:selectDoc},
        {title:'Authors',accessor:d=>d.docData.authors,tooltip:tableTooltip,click:selectDoc},
        {title:'Date',accessor:d=>d.docData.date,tooltip:tableTooltip,click:selectDoc},
        {title:'Money',accessor:d=>d.docData.money,tooltip:tableTooltip,tooltipChart:tableTooltipChart,click:selectDoc},
    ])
    .rowsFilter([0,20,60,90],(e,d)=>{table.render(DM.getTableRows(50, d2=>Math.floor(d2.weight*100)>=d),d)},'Min Relevance')
    // .rowsFilter([10,20,50],(e,d)=>{table.render(DM.getTableRows(d),d)},'N Docs');

// let docView = tMap.DocViewer(PM.panel5.c,PM.panel5.w,PM.panel5.h)
//     .addDefaultText('Click on a row to see the documents.',1,true)
//     .toggleTitle('Document')
//     .setFields(['title','authors',['university','institution',d=>`uni of ${d}`],'abstract','money'])

function selectMainTopic(e,d){
    SM.state('mainTopic', d.topicId);
    mainMap.selectBubble(SM.state('mainTopic'));
    wordcloud.render(d.labels);
    newSubMap();
    trend.render([DM.getMainTopicTrend(SM.state('mainTopic'), sumByYear, trendsRange)]);
    DM.setTableRowsMainTopic(SM.state('mainTopic'));
    table.render(DM.getTableRows(50));

    highlightFromLabelSearch();
}

function newSubMap(){
    SM.state('subTopic', null);
    subMap.render(DM.getSubMap(SM.state('mainTopic')));
}

function selectSubTopic(e,d){
    SM.state('subTopic', d.topicId);
    subMap.selectBubble(SM.state('subTopic'));
    wordcloud.render(d.labels);
    trend.render([DM.getMainTopicTrend(SM.state('mainTopic'), sumByYear, trendsRange),
                  DM.getSubTopicTrend(SM.state('subTopic'), sumByYear, trendsRange)]);
    DM.setTableRowsSubTopic(SM.state('subTopic'));
    table.render(DM.getTableRows(50));

    highlightFromLabelSearch();
}

function selectDoc(e,d){
    // docView.render(d.docData);
}

let dropdown = tMap.Dropdown(PM.control3.c,PM.control3.w,PM.control3.h)
    .setSelectCB(selectDistribution);

function selectDistribution(value){
    SM.state('distrib', value);
    if(SM.state('distrib') == 'All'){
        mainMap.setBubblesOpacity([], true);
        subMap.setBubblesOpacity([], true);
    } else {
        mainMap.setBubblesOpacity(DM.getMainTopicsDistribNormPerTopic(SM.state('distrib')));
        subMap.setBubblesOpacity(DM.getSubTopicsDistribNormPerTopic(SM.state('distrib')));
    }
}

let search = tMap.Search(PM.control1.c,PM.control1.w,PM.control1.h)
    .setSearchCB(searchLabels);

function searchLabels(query){
    SM.state('search', query.length > 0 ? query : null);
    DM.setSearchTerm(SM.state('search'));
    highlightFromLabelSearch();
}

function highlightFromLabelSearch(){
    let {mainTopicIds, subTopicIds} = DM.getTopicIdsFromSearch();
    mainMap.highlightBubbles(mainTopicIds);
    subMap.highlightBubbles(subTopicIds);
    let labels = DM.getLabelsFromSearch();
    wordcloud.highlightTexts(labels);
    let docIds = DM.getDocIdsFromSearch();
    table.highlightDocs(docIds);
}

let menu = tMap.Menu(PM.control4.c,PM.control4.h)
    .addShare(()=>{
        return SM.buildURL();
    })
    .addScreenshot('#app')
    .addDownload([{name:'Model data',url:dataDirectory+'model.csv'}])
    .addModal('About', tMap.aboutTopicMapping())

PM.watch({
    panel1: mainMap,
    panel2: subMap,
    panel3: wordcloud,
    panel4: trend,
    panel5: table,
    control1: search,
    control3: dropdown,
    control4: menu
})

function parseURL(){
    SM.parseURL();
    // ...
}

DM.loadAndProcessDataFromUrls(urls).then(()=>{
    console.log(DM.data);
    mainMap.render(DM.data.mainMap)
    let distribValues = DM.getDistributionLabels();
    distribValues.unshift({value:'All',text:'All'});
    dropdown.setOptions(distribValues);

    menu.addModelInfo(DM.getMainModelMetadata(), DM.getSubModelMetadata())
        .addCharts('Models Log-Likelihood', [
            (m,w,h)=>{
                tMap.LineChart(m,w,h)
                    .toggleTitle('Main Model')
                    .toggleBorder(false)
                    .setMargin([20,20,60,20])
                    .setAxesNames('Iterations', 'Log-Likelihood')
                    .render(DM.getMainLLData().map(d=>{return {x:d.iter,y:d.LL}}))
            },
            (m,w,h)=>{
                tMap.LineChart(m,w,h)
                    .toggleTitle('Sub Model')
                    .toggleBorder(false)
                    .setMargin([20,20,60,20])
                    .setAxesNames('Iterations', 'Log-Likelihood')
                    .render(DM.getSubLLData().map(d=>{return {x:d.iter,y:d.LL}}))
            }
        ])
    
    parseURL();
})