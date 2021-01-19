import {json as D3Json,
    csv as D3Csv,
    text as D3Text} from 'd3-fetch';

export default function(){
    let Data = {};

    /**
     * Loads data from urls object with following structure:
     * {name: url, ...}
     * Returns promise with loaded data as parameter
     */
    Data.loadDataFromUrls = function(urls){
        return Promise.all(Object.entries(urls).map(([name, url])=>{
            if(url.endsWith('.json') || url.includes('application/json')){
                return D3Json(url).then(data=>{return {name, data};});
            } else if(url.endsWith('.csv') || url.includes('text/csv')){
                return D3Csv(url).then(data=>{return {name, data};});
            } else {
                return D3Text(url).then(data=>{return {name, data};});
            }
        }));
    };

    /**
     * Gets a set of  data in the format:
     * [{name, data}, ...]
     * And attaches it to the public object for access
     */
    Data.processData = function(dataArray){
        Data.data = {};
        for(let {name, data} of dataArray){
            Data.data[name] = data;
        }
        return Data;
    };

    /**
     * Combines loadDataFromUrls and processData in to one function.
     * Takes urls object as input:
     * {name: url, ...}
     * Return a promise
     */
    Data.loadAndProcessDataFromUrls = function(urls){
        return Data.loadDataFromUrls(urls).then(d=>{
            Data.processData(d);
        });
    };

    return Data;
}