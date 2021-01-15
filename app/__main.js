
"use strict"; //This// catches accidental global declarations

// FOR DEBUG PURPOSES
const DEBUG = true;
function LOG(msg){
    if(DEBUG) console.log(msg);
}

// CONFIG
const dataDirectory = './data/COVID-19/';

const urls = {
    mainBubbleMap : dataDirectory + 'mainMap.json',
    subBubbleMaps : dataDirectory + 'subMaps.json',
    mainTopicModel : dataDirectory + 'mainModel.json',
    subTopicModel : dataDirectory + 'subModel.json',
    topicTrends : dataDirectory + 'date_distribution.json',
    // distributions : dataDirectory + 'mainTopicsDistributions.json',
    labelsIndex : dataDirectory + 'labelIndex.json'
}

const selectors = {
    mainBubbleMap : '#mainMap',
    subBubbleMap : '#subMap',
    wordcloud : '#wordcloud',
    table : '#table',
    trend : '#trend',
    searchBox : '#searchBox'
}

let mainBubbleMap,
    subBubbleMap,
    wordcloud,
    table,
    trend,
    searchBox;

let selectedSuperTopic = null,
    selectedSubTopic = null;
let customMapURLDomain = 'research.scot',
    customMapURLContainer = '#customURL';

// APPLICATION
const dataManager = BubbleMapDataManager();
const pageManager = BubbleMapPageManager('div#app', 'A');

// trends date set up
let sumByMonth = d=>d3.timeFormat('%Y-%m')(d3.timeParse('%Y-%m-%d')(d)),
    trendsRange = ['%Y-%m-%d', '2020-01-01', '2020-05-01'];


function StartBubbleMapApplication(){
    // parse url to check if selected topics are given as parameters
    parseURL()
    updateCustomMapURL()

    // Have page manager create the divs for the elements and return their sizes
    let areaSizes = pageManager.buildPage(selectors);
    LOG(areaSizes)

    // Instantiate main bubble map, sets the click callback
    mainBubbleMap = BubbleMap(selectors.mainBubbleMap, areaSizes.mainBubbleMap.width, areaSizes.mainBubbleMap.height)
        .setClickCB(function(d){
            selectedSubTopic = null;
            selectMainMapTopic(d);
        })
        .setTooltipText('publications')
        .addDefaultText('Loading...', 2, true);
    
    // Instantiate sub bubble map
    subBubbleMap = BubbleMap(selectors.subBubbleMap, areaSizes.subBubbleMap.width, areaSizes.subBubbleMap.height)
        .setClickCB(selectSubMapTopic)
        .setTooltipText('publications')
        .addDefaultText('Click on a bubble to see more details.');

    // Instantiate word cloud
    wordcloud = Wordcloud(selectors.wordcloud, areaSizes.wordcloud.width, areaSizes.wordcloud.height);

    // Instantiate table
    table = Table(selectors.table, areaSizes.table.width, areaSizes.table.height)
        .setColumnsInfo([
            {
                title: 'Top Documents',
                accessor: d=>d.docData.title,
                click: d=>{window.open(d.docData.url, '_blank', "height=800,width=1000");},
                tooltip: d=>{
                    let fields = [];
                    if(typeof(d.docData.source) === 'string' && d.docData.source !== ''){
                        fields.push(`Source: ${d.docData.source}`);
                    }
                    if(typeof(d.docData.date) === 'string' && d.docData.date !== ''){
                        fields.push(`Date: ${d.docData.date}`);
                    }
                    fields.push(`Relevance: ${Math.floor(d.weight*100)}%`);
                    return fields.join(' - ');
                    // return `Source: ${d.docData.source} - Date: ${d.docData.date} - Relevance: ${Math.floor(d.weight*100)}%`
                },
                decoration: 'underline',
                cursor: 'pointer'
            }
        ]);

    trend = TrendBars(selectors.trend, areaSizes.trend.width, areaSizes.trend.height)
        .setParseTime('%Y-%m')
        .setTickFormat('%b.')
        .setTooltipText('publications')
        .setTransition(500);

    // Instantiate button filters
    // distribButtons = ButtonFilters(selectors.distribButtons, areaSizes.distribButtons.width, areaSizes.distribButtons.height)
    //     .setClickCB(selectOrganisation);

    // Instantiate search box
    searchBox = SearchBox(selectors.searchBox, areaSizes.searchBox.width, areaSizes.searchBox.height)
        .setSearchCB(searchTerm);

    // Have data manager load data and attached it to itself eg. DataManager.dummy1
    dataManager.loadAndProcessDataFromUrls(urls).then(()=>{
        dataManager.setLabelsKeys();
        LOG(dataManager)

        // Render main bubble map
        mainBubbleMap.render(dataManager.mainBubbleMap);

        trend.setMaxValue(dataManager.getMaxTrend(false, sumByMonth));

        // // Get distribution labels and render the buttons
        // let distribValues = dataManager.getDistributionsValues(d=>{
        //     if(d.startsWith('University of the')){
        //         return d.substring(18)+' (University of)'
        //     }
        //     if(d.startsWith('University of')){
        //         return d.substring(14)+' (University of)'
        //     }
        //     return d;
        // });
        // distribValues.unshift({value:'All', text:'All'});
        // distribButtons.render(distribValues).setSelected('All');

        // render search box
        searchBox.render();

        // if selected super topic was set by url
        if(selectedSuperTopic !== null){
            selectMainMapTopic(dataManager.getMainMapTopicData(selectedSuperTopic));
        }
        // if selected sub topic was set by url
        if(selectedSuperTopic !== null && selectedSubTopic !== null){
            selectSubMapTopic(dataManager.getCurrentSubMapTopicData(selectedSubTopic));
        }
    })
}

// CALLBACKS
function selectMainMapTopic(d){
    selectedSuperTopic = d.topicId;
    dataManager.setCurrentSubBubbleMap(selectedSuperTopic);
    dataManager.setTableRows(selectedSuperTopic);
    mainBubbleMap.selectBubble(selectedSuperTopic);
    updateCustomMapURL();
    subBubbleMap.render(dataManager.currentSubBubbleMap);
    wordcloud.render(d.labels);
    table.render(dataManager.getTableRows(50));
    highlightFromSearch();
    trend.render([dataManager.getTopicTrend(selectedSuperTopic, 'main', sumByMonth, trendsRange)
                        .map(d=>{return{date:d.date,value:d.value,layer:'main'}})]);
}

function selectSubMapTopic(d){
    selectedSubTopic = d.topicId;
    dataManager.setTableRows(d.topicId, 'sub');
    subBubbleMap.selectBubble(selectedSubTopic);
    updateCustomMapURL();
    wordcloud.render(d.labels);
    table.render(dataManager.getTableRows(50));
    highlightFromSearch();
    trend.render([dataManager.getTopicTrend(selectedSuperTopic, 'main', sumByMonth, trendsRange)
                        .map(d=>{return{date:d.date,value:d.value,layer:'main'}}),
                  dataManager.getTopicTrend(selectedSubTopic, 'sub', sumByMonth, trendsRange)
                        .map(d=>{return{date:d.date,value:d.value,layer:'sub'}})]);
}

function selectOrganisation(d){
    distribButtons.setSelected(d.value);
    if(d.value == 'All'){
        mainBubbleMap.setBubblesOpacity([], true);
    } else {
        mainBubbleMap.setBubblesOpacity(dataManager.getTopicsDistribution(d.value));
    }
}

function searchTerm(term){
    searchBox.activate(term!=='');
    dataManager.setSearchTerm(term);
    highlightFromSearch();
}

function highlightFromSearch(){
    let {mainTopicIds, subTopicIds} = dataManager.getBubblesIdFromTerm();
    console.log(mainTopicIds)
    console.log(subTopicIds)
    mainBubbleMap.highlightBubbles(mainTopicIds);
    subBubbleMap.highlightBubbles(subTopicIds);
    let labels = dataManager.getLabelsFromTerm();
    console.log(labels)
    wordcloud.highlightTexts(labels);
}


function updateCustomMapURL(){
    let params = [];
    if(selectedSuperTopic !== null){
        params.push(`t=${selectedSuperTopic}`);
    }
    if(selectedSubTopic !== null){
        params.push(`u=${selectedSubTopic}`);
    }
    let customMapURL = customMapURLDomain
    if(params.length > 0){
        customMapURL = `${customMapURL}/?${params.join('&')}`;
    }
    d3.select(customMapURLContainer).text(customMapURL);
}

function parseURL(){
    let kvp = document.location.search.substr(1).split('&');
    if(kvp.length > 0 && kvp[0]!=''){
        kvp.map(s=>s.split('=')).forEach(kv=>{
            if(kv[0] == 't'){
                selectedSuperTopic = parseInt(kv[1]);
            }
            if(kv[0] == 'u'){
                selectedSubTopic = parseInt(kv[1]);
            }
        })
    }
}