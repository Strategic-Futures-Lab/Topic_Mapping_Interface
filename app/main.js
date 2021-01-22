
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

let PM = tMap.PageManager('div#app', 'E', '4-1-1-1-1-a', 'div#header', 'div#footer', 700, 700);

let DM = tMap.DataManager();

let mainMap = tMap.BubbleMap(PM.panel1.c, PM.panel1.w, PM.panel1.h)
    .setTooltip(d=>d.size)
    .setTooltipChart((t,d)=>{
        tMap.HorizontalBarChart(t, 200, 100)
            .setTicks(3, '.0%')
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

function selectMainTopic(e,d){
    let mainTopic = d.topicId;
    mainMap.selectBubble(mainTopic);
    wordcloud.render(d.labels);
    newSubMap(mainTopic);
}

function newSubMap(mainTopic){
    let subTopic = null;
    subMap.render(DM.getSubMap(mainTopic));
}

function selectSubTopic(e,d){
    let subTopic = d.topicId;
    subMap.selectBubble(subTopic);
    wordcloud.render(d.labels);
}

PM.watch({
    panel1: mainMap,
    panel2: subMap,
    panel3: wordcloud
})

DM.loadAndProcessDataFromUrls(urls).then(()=>{
    console.log(DM.data);
    mainMap.render(DM.data.mainMap)
})