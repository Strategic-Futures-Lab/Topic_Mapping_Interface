// "use strict"; //This catches acidental global declarations

function DataManager(){
    let public = {};

     /**
     * Loads data from urls object with following structure:
     * {name: url, ...}
     * Returns promise with loaded data as parameter
     */
    public.loadDataFromUrls = function(urls){
        return Promise.all(Object.entries(urls).map(([name, url])=>{
            if(url.endsWith('.json') || url.includes('application/json')){
                return d3.json(url).then(data=>{return {name, data}})
            } else if(url.endsWith('.csv') || url.includes('text/csv')){
                return d3.csv(url).then(data=>{return {name, data}})
            } else {
                return d3.text(url).then(data=>{return {name, data}})
            }
        }))
    }

    /**
     * Gets a set of  data in the format:
     * [{name, data}, ...]
     * And attaches it to the public object for access
     */
    public.processData = function(dataArray){
        for(let {name, data} of dataArray){
            public[name] = data;
        }
        return public;
    }

    /**
     * Combines loadDataFromUrls and processData in to one function.
     * Takes urls object as input:
     * {name: url, ...}
     * Return a promise
     */
    public.loadAndProcessDataFromUrls = function(urls){
        return public.loadDataFromUrls(urls).then(d=>{
            public.processData(d);
        })
    }

    return public;
}


function BubbleMapDataManager(){

    let public = DataManager();

    /* SPECIFIC TO BUBBLE MAP APPLICATION */

    /**
     * Given a topic id from super topic map, gets the data to the associated sub bubble map
     * and sets it to curretnSubBubbleMap attribute.
     */
    public.setCurrentSubBubbleMap = function(superTopicId){
        public.currentSubBubbleMap = public.subBubbleMaps.filter(d=>{return d.mainTopicId === superTopicId})[0].subMap;
        return public;
    }

    /**
     * Given a topic id return the associated topic data from main bubble map
     */
    public.getMainMapTopicData = function(topicId){
        return public.mainBubbleMap.topics.filter(t=>{return t.topicId == topicId})[0];
    }

    /**
     * Given a topic id return the associated topic data from current sub bubble map
     */
    public.getCurrentSubMapTopicData = function(topicId){
        return public.currentSubBubbleMap.topics.filter(t=>{return t.topicId == topicId})[0];
    }

    /**
     * Given a topic id will save the rows data for the table in tableRows.
     * Can specify which map to use: the main map (mapType = 'main') or the current sub map (mapType = 'sub')
     */
    public.setTableRows = function(topicId, mapType = 'main'){
        let fromSubMap = mapType === 'sub';
        public.tableRows = fromSubMap ? public.subTopicModel.topics.filter(t=>{return t.topicId == topicId})[0].topDocs
                                      : public.mainTopicModel.topics.filter(t=>{return t.topicId == topicId})[0].topDocs;
        return public;
    }

    /**
     * Returns the rows data for the table.
     * Can specify a number of rows (def 10), and filter function (def return true)
     */
    public.getTableRows = function(number = 10, filter = ()=>true){
        return public.tableRows.filter(filter).slice(0,number);
    }

    /**
     * Return the distributions labels
     */
    public.getDistributionsValues = function(textFunction = d=>d){
        return public.distributions[0].topicData.map(d=>d.label).map(v=>{
            return {value:v, text:textFunction(v)}
        }).sort((a,b)=>{
            return (a.text < b.text) ? -1 : (a.text > b.text) ? 1 : 0;
        });
    }

    /**
     * Returns the topic distribution given a topic id
     */
    public.getTopicsDistribution = function(value){
        return public.distributions.filter(d=>{
            return d.conceptId > -1;
        }).map(d=>{
            return {topicId: d.conceptId,
                    distributionValue: d.topicData.filter(e=>{return e.label === value})
                                                  .map(e=>e.numberOfDocuments)[0]
            }
        })
    }

    /**
     * If date distribution provided, returns a topic date distribution given a topic id
     * returns in format: [{date:string,value:number}]
     */
    public.getTopicTrend = function(topicId, mapType='main', sumBy=null, timeRange=null){
        let fromSubMap = mapType === 'sub';
        let dateDistribution = fromSubMap ? public.topicTrends.subTopics.filter(d=>{return d.topicId == topicId})[0]:
                                             public.topicTrends.mainTopics.filter(d=>{return d.topicId == topicId})[0];
        let dateData = dateDistribution.distribution.map(d=>{return {date:d.id,value:d.weight}});
        if(timeRange !== null){
            parseDate = d3.timeParse(timeRange[0])
            dateData = dateData.filter(d=>{return parseDate(d.date) >= parseDate(timeRange[1]) && parseDate(d.date) < parseDate(timeRange[2])});
        }
        if(sumBy == null){
            return dateData;
        } else {
            return d3.nest().key(d=>sumBy(d.date))
                .sortKeys(d3.ascending)
                .rollup(d=>d3.sum(d, d2=>d2.value))
                .entries(dateData)
                .map(d=>{return {date:d.key,value:d.value}})
        }
    }

    /**
     * If date distribution provided, returns the maximum trend in the set of topics
     * cumulated or not
     */
    public.getMaxTrend = function(cumul = false, sumBy=null){
        let max = -1;
        let reduceWeights = d=>d.distribution.reduce((acc,val)=>{return acc+val.weight},0);
        let maxWeights = d=>d3.max(d.distribution, d2=>d2.weight);
        let maxWeightsSumBy = d=>d3.max(d3.nest().key(d2=>sumBy(d2.id))
                                    .rollup(d2=>d3.sum(d2, d3=>d3.weight))
                                    .entries(d.distribution)
                                    .map(d2 => d2.value));
        if(cumul){
            max = Math.max(max, d3.max(public.topicTrends.mainTopics, reduceWeights));
            max = Math.max(max, d3.max(public.topicTrends.subTopics, reduceWeights));
        } else {
            if(sumBy === null){
                max = Math.max(max, d3.max(public.topicTrends.mainTopics, maxWeights));
                max = Math.max(max, d3.max(public.topicTrends.subTopics, maxWeights));
            } else {
                max = Math.max(max, d3.max(public.topicTrends.mainTopics, maxWeightsSumBy))
                max = Math.max(max, d3.max(public.topicTrends.mainTopics, maxWeightsSumBy))
            }
        }
        return max;
    }

    /**
     * Builds an list of labeles to search for keys in labelsIndex
     */
    public.setLabelsKeys = function(){
        public.labelsKeys = Object.keys(public.labelsIndex);
        return public;
    }

    /**
     * Sets the currently searched term
     */
    public.setSearchTerm = function(setSearchTerm){
        public.searchTerm = setSearchTerm === '' ? null : setSearchTerm.toLowerCase();
        return public;
    }

    /** 
     * Returns a subset of labels from a search term
     */
    public.getLabelsFromTerm = function(){
        let search = getSearchTerms();
        let labels = [];
        search.forEach(s=>{
            s.forEach(t=>{
                if(t.length > 0) labels.push(t);
            })
        })
        return labels;
    }

    /**
     * Return the ids of topics that includes certain labels
     */
    public.getBubblesIdFromTerm = function(){
        let search = getSearchTerms();

        // sets of ids to be returned
        let mainTopicIds = new Set();
        let subTopicIds = new Set();

        // evaluating query and populating the sets of ids
        if(search.length == 1){ // no 'or'
            let last = search[0].pop(); // extract last term
            let terms = search[0].filter(t=>t.length > 0); // remove all empty terms
            terms.push(last) // re-add last term
            if(terms.length == 1 && terms[0].length > 0){ // if only one non-empty term
                // partial search
                public.labelsKeys.filter(l=>l.toLowerCase().includes(terms[0]))
                    .forEach(l=>{
                        public.labelsIndex[l].mainTopics.forEach(t=>mainTopicIds.add(t))
                        if(typeof(public.labelsIndex[l].subTopics)!=='undefined') public.labelsIndex[l].subTopics.forEach(t=>subTopicIds.add(t))
                    });
            } else if(terms.length == 2 && terms[1].length == 0) { // if exactly two terms and second one is empty
                // exact search
                searchAllTermsInTopics([terms[0]],mainTopicIds,subTopicIds);
            } else if(terms.length >=2){ // if two or more terms
                terms = terms.filter(t=>{return t.length > 0}) // remove potential empty term re-added
                searchAllTermsInTopics(terms,mainTopicIds,subTopicIds);
            }
        } else if(search.length >= 2){ // one or more 'or'
            search.forEach(s=>{
                let terms = s.filter(t=>t.length > 0); // remove all empty terms
                searchAllTermsInTopics(terms,mainTopicIds,subTopicIds);
            })
        }
        // switch from sets to arrays
        mainTopicIds = Array.from(mainTopicIds);
        subTopicIds = Array.from(subTopicIds);
        return {mainTopicIds, subTopicIds}
    }

    function getSearchTerms(){
        // split strings for 'or' and 'and' queries
        let orSplits = [';', ' or ', '*'];
        let andSplits = [' and ', '+', ' ']; // ' ' needs to be last!!
        // search query
        let search = [];
        // building the search query from a string
        if(typeof(public.searchTerm) !== 'undefined' && public.searchTerm !== null && public.searchTerm.length > 0){
            search = [public.searchTerm];
            // separate 'or' queries
            orSplits.forEach(o=>{
                let parts = [];
                search.forEach(s=>s.split(o).forEach(p=>parts.push(p)));
                search = parts;
            })
            // separate 'and' queries within 'or's
            search = search.map(s=>[s]);
            andSplits.forEach(a=>{
                search = search.map(s=>{
                    let parts = [];
                    s.forEach(t=>t.split(a).forEach(p=>parts.push(p)));
                    return parts;
                })
            })
        }
        return search;
    }

    function searchAllTermsInTopics(terms, mainTopicIds, subTopicIds){
        let mains = terms.map(t=>{
            let l = public.labelsIndex[t]
            return typeof(l)=='undefined'?[]:l.mainTopics;
        });
        let mainIds = mains.reduce((acc,cur,idx)=>{
            return idx==0 ? cur : acc.filter(i=>cur.includes(i));
        }, [])
        mainIds.forEach(i=>mainTopicIds.add(i));
        let subs = terms.map(t=>{
            let l = public.labelsIndex[t]
            return typeof(l)=='undefined'?[]:typeof(l.subTopics)=='undefined'?[]:l.subTopics;
        });
        let subIds = subs.reduce((acc,cur,idx)=>{
            return idx==0 ? cur : acc.filter(i=>cur.includes(i));
        }, [])
        subIds.forEach(i=>subTopicIds.add(i));
    }

    return public;

}