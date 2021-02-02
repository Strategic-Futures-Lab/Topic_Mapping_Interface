
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

let PM = tMap.PageManager('div#app', 'E', '3-2-2-2-b', 'div#header', 'div#footer', 700, 700);

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
    .toggleTitle('Topic Map').setMinimumTextSize(2);;
let wordcloud = tMap.WordCloud(PM.panel3.c, PM.panel3.w, PM.panel3.h)
    .addDefaultText('Click on a bubble to see more labels.', 1, true)
    .setMargin([40,10,10,10])
    .toggleTitle('Topic Labels');
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

let sumByMonth = DM.timeFormatConverter('%d/%m/%y', '%Y-%m'),
    sumByQuarter = DM.timeFormatConverter('%d/%m/%y', '%Y-%q'),
    sumByYear = DM.timeFormatConverter('%d/%m/%y', '%Y'),
    trendsRange = ['%d/%m/%y', '01/01/11', '01/01/20'];
let trend = tMap.TrendChart(PM.panel4.c, PM.panel4.w, PM.panel4.h)
    .setDateTicks('%Y')
    .setValueTicks(10, '.0f')
    .setTooltip(d=>`${d.value} publications`)
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
    .rowsFilter([20,60,90],(e,d)=>{table.render(DM.getTableRows(50, d2=>Math.floor(d2.weight*100)>=d),d)},'Min Relevance')
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
}

function selectDoc(e,d){
    // docView.render(d.docData);
}

let menu = tMap.Menu(PM.control3.c,PM.control3.h)
    .addShare(()=>{
        return SM.buildURL();
    })
    .addScreenshot('#app')

PM.watch({
    panel1: mainMap,
    panel2: subMap,
    panel3: wordcloud,
    panel4: trend,
    panel5: table
})

DM.loadAndProcessDataFromUrls(urls).then(()=>{
    console.log(DM.data);
    mainMap.render(DM.data.mainMap)
})