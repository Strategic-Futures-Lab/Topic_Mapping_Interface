
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

DM.loadAndProcessDataFromUrls(urls).then(()=>{
    console.log(DM.data);
    console.log(DM.getDistributionLabels(t=>`field ${t}`));
})