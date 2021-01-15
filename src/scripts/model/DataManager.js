import DataManagerBasic from './DataManagerBasic.js';
import {timeParse as D3TimeParse, timeFormat as D3TimeFormat} from 'd3-time-format';
import {nest as D3Nest} from 'd3-collection';
import {ascending as D3Ascending,
    sum as D3Sum,
    max as D3Max} from 'd3-array';

export default function(){

    let Data = DataManagerBasic();

    /**
     * Given a topic id from main topic map, gets the data to the associated sub bubble map
     * and sets it to subBubbleMap data attribute.
     */
    Data.setSubBubbleMap = function(mainTopicId){
        Data.data.subBubbleMap = Data.data.subBubbleMaps.filter(d=>{return d.mainTopicId === mainTopicId;})[0].subMap;
        return Data;
    };

    /**
     * given data structure containing an array of topics (map or model)
     * returns the topic with specified topicId, or null
     */
    function getTopic(data, topicId){
        let t = data.topics.filter(t=>{return t.topicId === topicId;});
        return t.length === 0 ? null : t[0];
    }

    /**
     * Given a topic id return the associated topic data from main bubble map
     */
    Data.getMainTopic = function(topicId){
        return getTopic(Data.data.mainBubbleMap, topicId);
    };

    /**
     * Given a topic id return the associated topic data from current sub bubble map
     */
    Data.getSubTopic = function(topicId){
        return getTopic(Data.data.subBubbleMap, topicId);
    };

    /**
     * Given a document id, returns the associated document fomr the current table rows 
     */
    Data.getDocument = function(docId){
        let d = Data.data.tableRows.filter(d=>d.docId==docId);
        if(d.length > 0){
            return d[0];
        }
        return null;
    };

    /**
     * Given a topic id will save the rows data for the table in tableRows.
     * Can specify which map to use: the main map (mapType = 'main') or the current sub map (mapType = 'sub')
     */
    Data.setTableRows = function(topicId, mapType='main'){
        let fromSubMap = mapType === 'sub';
        let t = fromSubMap ? getTopic(Data.data.subTopicModel, topicId) :
            getTopic(Data.data.mainTopicModel, topicId);
        Data.data.tableRows = t === null ? [] : t.topDocs;
        return Data;
    };

    /**
     * Returns the rows data for the table.
     * Can specify a number of rows (def 10), and filter function (def return true)
     */
    Data.getTableRows = function(number = 10, filter = ()=>true){
        return Data.data.tableRows.filter(filter).slice(0, number);
    };

    /**
     * Return the distributions labels
     */
    Data.getDistributionsValues = function(textFunction = d=>d){
        let entry = Data.data.distributions.mainTopics[0].distribution;
        return entry.map(d=>d.id).map(v=>{
            return {value:v, text:textFunction(v)};
        }).sort((a,b)=>{
            return (a.text < b.text) ? -1 : (a.text > b.text) ? 1 : 0;
        });
    };

    function getTopicsDistribution(topicDistrib, fieldName){
        return topicDistrib.filter(d=>{
            return d.topicId > -1;
        }).map(d=>{
            let v = d.distribution
                .filter(e=>{return e.id === fieldName;})
                .map(e=>e.weight)[0];
            return {
                topicId: d.topicId,
                value: v
            };
        });
    }

    function getNormalisedTopicsDistribution(topicDistrib, fieldName){
        return topicDistrib.filter(d=>{
            return d.topicId > -1;
        }).map(d=>{
            let v = d.distribution
                .filter(e=>{return e.id === fieldName;})
                .map(e=>e.weight/d.total)[0];
            return {
                topicId: d.topicId,
                value: v
            };
        });
    }

    function getNormalisedTopicsDistributionPerField(topicDistrib, fieldName){
        let fieldDistribution = topicDistrib.filter(d=>{ return d.topicId > -1; })
            .map(d=>{
                let v = d.distribution
                    .filter(e=>{return e.id === fieldName;})
                    .map(e=>e.weight)[0];
                return {
                    topicId: d.topicId,
                    value: v
                };
            });
        let fieldTotal = fieldDistribution.reduce((acc, cur)=>{return acc+cur.value;}, 0);
        return fieldDistribution.map(d=>{return {topicId:d.topicId,value:d.value/fieldTotal};});
    }

    /**
     * Returns the topic distribution from the main topics given a distribution fieldName 
     */
    Data.getMainTopicsDistribution = function(fieldName){
        return getTopicsDistribution(Data.data.distributions.mainTopics, fieldName);
    };

    /**
     * Returns the topic distribution from the sub topics given a distribution fieldName 
     */
    Data.getSubTopicsDistribution = function(fieldName){
        return getTopicsDistribution(Data.data.distributions.subTopics, fieldName);
    };

    /**
     * Returns the topic distribution from the main topics given a distribution fieldName 
     * Normalised across other fields
     */
    Data.getMainTopicsDistributionNormalised = function(fieldName){
        return getNormalisedTopicsDistribution(Data.data.distributions.mainTopics, fieldName);
    };

    /**
     * Returns the normalised topic distribution from the sub topics given a distribution fieldName 
     * Normalised across other fields
     */
    Data.getSubTopicsDistributionNormalised = function(fieldName){
        return getNormalisedTopicsDistribution(Data.data.distributions.subTopics, fieldName);
    };

    /**
     * Returns the topic distribution from the main topics given a distribution fieldName 
     * Normalised across all topics
     */
    Data.getMainTopicsDistributionNormalisedPerField = function(fieldName){
        return getNormalisedTopicsDistributionPerField(Data.data.distributions.mainTopics, fieldName);
    };

    /**
     * Returns the normalised topic distribution from the sub topics given a distribution fieldName 
     * Normalised across all topics
     */
    Data.getSubTopicsDistributionNormalisedPerField = function(fieldName){
        return getNormalisedTopicsDistributionPerField(Data.data.distributions.subTopics, fieldName);
    };

    /**
     * Returns the distribution entry for a specific main topic  
     */
    Data.getMainTopicDistributionEntry = function(topicId){
        return Data.data.distributions.mainTopics.filter(d=>{
            return d.topicId === topicId;
        }).map(d=>d.distribution.map(d2=>{return {key:d2.id,value:d2.weight};}))[0];
    };

    /**
     * Returns the distribution entry for a specific sub topic  
     */
    Data.getSubTopicDistributionEntry = function(topicId){
        return Data.data.distributions.subTopics.filter(d=>{
            return d.topicId === topicId;
        }).map(d=>d.distribution.map(d2=>{return {key:d2.id,value:d2.weight};}))[0];
    };

    /**
     * Returns the distribution entry for a specific main topic  
     */
    Data.getMainTopicNormalisedDistributionEntry = function(topicId){
        return Data.data.distributions.mainTopics.filter(d=>{
            return d.topicId === topicId;
        }).map(d=>d.distribution.map(d2=>{return {key:d2.id,value:d2.weight/d.total};}))[0];
    };

    /**
     * Returns the distribution entry for a specific sub topic  
     */
    Data.getSubTopicNormalisedDistributionEntry = function(topicId){
        return Data.data.distributions.subTopics.filter(d=>{
            return d.topicId === topicId;
        }).map(d=>d.distribution.map(d2=>{return {key:d2.id,value:d2.weight/d.total};}))[0];
    };

    /**
     * Returns a sum function for date, takes parsing format of input date,
     * and output format
     */
    Data.getTrendSumByFunction = function(inParse, outFormat){
        return d=>D3TimeFormat(outFormat)(D3TimeParse(inParse)(d));
    };
    /* Duplicate of above */
    Data.timeFormatConverter = function(inParse, outFormat){
        return d=>D3TimeFormat(outFormat)(D3TimeParse(inParse)(d));
    };

    /**
     * If date distribution provided, returns a topic date distribution given a topic id
     * returns in format: [{date:string,value:number}]
     */
    Data.getTopicTrend = function(topicId, mapType='main', sumBy=null, timeRange=null){
        let fromSubMap = mapType === 'sub';
        let dateDistribution = fromSubMap ? Data.data.topicTrends.subTopics.filter(d=>{return d.topicId == topicId;})[0]:
            Data.data.topicTrends.mainTopics.filter(d=>{return d.topicId == topicId;})[0];
        let dateData = dateDistribution.distribution.map(d=>{return {date:d.id,value:d.weight};});
        if(timeRange !== null){
            let parseDate = D3TimeParse(timeRange[0]);
            dateData = dateData.filter(d=>{return parseDate(d.date) >= parseDate(timeRange[1]) && parseDate(d.date) < parseDate(timeRange[2]);});
        }
        if(sumBy == null){
            return dateData;
        } else {
            return D3Nest().key(d=>sumBy(d.date))
                .sortKeys(D3Ascending)
                .rollup(d=>D3Sum(d, d2=>d2.value))
                .entries(dateData)
                .map(d=>{return {date:d.key,value:d.value};});
        }
    };

    /**
     * If date distribution provided, returns the maximum trend in the set of topics
     * cumulated or not
     */
    Data.getMaxTrend = function(cumul = false, sumBy=null){
        let max = -1;
        let reduceWeights = d=>d.distribution.reduce((acc,val)=>{return acc+val.weight;},0);
        let maxWeights = d=>D3Max(d.distribution, d2=>d2.weight);
        let maxWeightsSumBy = d=>D3Max(D3Nest().key(d2=>sumBy(d2.id))
            .rollup(d2=>D3Sum(d2, d3=>d3.weight))
            .entries(d.distribution)
            .map(d2 => d2.value));
        if(cumul){
            max = Math.max(max, D3Max(Data.data.topicTrends.mainTopics, reduceWeights));
            max = Math.max(max, D3Max(Data.data.topicTrends.subTopics, reduceWeights));
        } else {
            if(sumBy === null){
                max = Math.max(max, D3Max(Data.data.topicTrends.mainTopics, maxWeights));
                max = Math.max(max, D3Max(Data.data.topicTrends.subTopics, maxWeights));
            } else {
                max = Math.max(max, D3Max(Data.data.topicTrends.mainTopics, maxWeightsSumBy));
                max = Math.max(max, D3Max(Data.data.topicTrends.subTopics, maxWeightsSumBy));
            }
        }
        return max;
    };

    /**
     * Builds an list of labeles to search for keys in labelsIndex
     */
    Data.setLabelsKeys = function(){
        Data.data.labelsKeys = Object.keys(Data.data.labelsIndex);
        return Data;
    };

    /**
     * Sets the currently searched term
     */
    Data.setSearchTerm = function(searchTerm){
        Data.data.searchTerm = searchTerm === '' ? null : searchTerm.toLowerCase();
        return Data;
    };

    /**
     * Separate search terms from a query
     * "A and B or C and D or E" => [[A,B], [C,D], [E]]
     */
    function getSearchTerms(){
        // split strings for 'or' and 'and' queries
        let orSplits = [';', ' or ', '*'];
        let andSplits = [' and ', '+', ' ']; // ' ' needs to be last!!
        // search query
        let search = [];
        // building the search query from a string
        if(typeof(Data.data.searchTerm) !== 'undefined' && Data.data.searchTerm !== null && Data.data.searchTerm.length > 0){
            search = [Data.data.searchTerm];
            // separate 'or' queries
            orSplits.forEach(o=>{
                let parts = [];
                search.forEach(s=>s.split(o).forEach(p=>parts.push(p)));
                search = parts;
            });
            // separate 'and' queries within 'or's
            search = search.map(s=>[s]);
            andSplits.forEach(a=>{
                search = search.map(s=>{
                    let parts = [];
                    s.forEach(t=>t.split(a).forEach(p=>parts.push(p)));
                    return parts;
                });
            });
        }
        return search;
    }

    /**
     * Fills provided set ids with docIds of documents containing all provided terms
     */
    function searchAllTermsInDocuments(terms, docsIds){
        // get all doc ids with occurrence of terms
        let docs = terms.map(t=>{
            let l = Data.data.labelsIndex[t];
            return typeof(l)=='undefined'?[]:l.documents;
        });
        // filter topic ids with occurrence of all terms
        let ids = docs.reduce((acc,cur,idx)=>{
            return idx==0 ? cur : acc.filter(i=>cur.includes(i));
        }, []);
        // fill sets
        ids.forEach(i=>docsIds.add(i));
    }

    /**
     * Returns doc ids from a search term
     */
    Data.getDocIdsFromTerm = function(){
        let search = getSearchTerms();
        let docIds = new Set();
        // evaluating query and populating the sets of ids
        if(search.length == 1){ // no 'or'
            let last = search[0].pop(); // extract last term
            let terms = search[0].filter(t=>t.length > 0); // remove all empty terms
            terms.push(last); // re-add last term
            if(terms.length == 1 && terms[0].length > 0){ // if only one non-empty term
                // partial search
                Data.data.labelsKeys.filter(l=>l.toLowerCase().includes(terms[0]))
                    .forEach(l=>{
                        Data.data.labelsIndex[l].documents.forEach(t=>docIds.add(t));
                    });
            } else if(terms.length == 2 && terms[1].length == 0) { // if exactly two terms and second one is empty
                // exact search
                searchAllTermsInDocuments([terms[0]],docIds);
            } else if(terms.length >=2){ // if two or more terms
                terms = terms.filter(t=>{return t.length > 0;}); // remove potential empty term re-added
                searchAllTermsInDocuments(terms,docIds);
            }
        } else if(search.length >= 2){ // one or more 'or'
            search.forEach(s=>{
                let terms = s.filter(t=>t.length > 0); // remove all empty terms
                searchAllTermsInDocuments(terms,docIds);
            });
        }
        
        return Array.from(docIds);

    };

    /** 
     * Returns a subset of labels from a search term
     */
    Data.getLabelsFromTerm = function(){
        let search = getSearchTerms();
        let labels = [];
        // evaluating query and populating the sets of labels
        if(search.length == 1){ // no 'or'
            let last = search[0].pop(); // extract last term
            let terms = search[0].filter(t=>t.length > 0); // remove all empty terms
            terms.push(last); // re-add last term
            if(terms.length == 1 && terms[0].length > 0){ // if only one non-empty term
                // partial search
                Data.data.labelsKeys.filter(l=>l.toLowerCase().includes(terms[0])).forEach(l=>{labels.push(l);});
            } else if(terms.length == 2 && terms[1].length == 0) { // if exactly two terms and second one is empty
                // exact search
                Data.data.labelsKeys.filter(l=>l.toLowerCase() == terms[0]).forEach(l=>{labels.push(l);});
            } else if(terms.length >=2){ // if two or more terms
                terms = terms.filter(t=>{return t.length > 0;}); // remove potential empty term re-added
                Data.data.labelsKeys.filter(l=>terms.includes(l.toLowerCase())).forEach(l=>{labels.push(l);});
            }
        } else if(search.length >= 2){ // one or more 'or'
            search.forEach(s=>{
                let terms = s.filter(t=>t.length > 0); // remove all empty terms
                Data.data.labelsKeys.filter(l=>terms.includes(l.toLowerCase())).forEach(l=>{labels.push(l);});
            });
        }
        return labels;
    };

    /**
     * Fills provided sets of ids with topicIds of topics containing all provided terms
     */
    function searchAllTermsInTopics(terms, mainTopicIds, subTopicIds){
        // get all topic ids with occurrence of terms
        let mains = terms.map(t=>{
            let l = Data.data.labelsIndex[t];
            return typeof(l)=='undefined'?[]:l.mainTopics;
        });
        let subs = terms.map(t=>{
            let l = Data.data.labelsIndex[t];
            return typeof(l)=='undefined'?[]:typeof(l.subTopics)=='undefined'?[]:l.subTopics;
        });
        // filter topic ids with occurrence of all terms
        let mainIds = mains.reduce((acc,cur,idx)=>{
            return idx==0 ? cur : acc.filter(i=>cur.includes(i));
        }, []);
        let subIds = subs.reduce((acc,cur,idx)=>{
            return idx==0 ? cur : acc.filter(i=>cur.map(c=>c[0]).includes(i[0]));
        }, []);
        // fill sets
        mainIds.forEach(i=>mainTopicIds.add(i));
        subIds.forEach(i=>{
            subTopicIds.add(i[0]);
            i[1].forEach(i2=>mainTopicIds.add(i2));
        });
    }

    /**
     * Return the ids of topics that includes certain labels
     */
    Data.getBubblesIdFromTerm = function(){
        let search = getSearchTerms();

        // sets of ids to be returned
        let mainTopicIds = new Set();
        let subTopicIds = new Set();

        // evaluating query and populating the sets of ids
        if(search.length == 1){ // no 'or'
            let last = search[0].pop(); // extract last term
            let terms = search[0].filter(t=>t.length > 0); // remove all empty terms
            terms.push(last); // re-add last term
            if(terms.length == 1 && terms[0].length > 0){ // if only one non-empty term
                // partial search
                Data.data.labelsKeys.filter(l=>l.toLowerCase().includes(terms[0]))
                    .forEach(l=>{
                        Data.data.labelsIndex[l].mainTopics.forEach(t=>mainTopicIds.add(t));
                        if(typeof(Data.data.labelsIndex[l].subTopics)!=='undefined') {
                            Data.data.labelsIndex[l].subTopics.forEach(t=>{
                                subTopicIds.add(t[0]);
                                t[1].forEach(t2=>mainTopicIds.add(t2));
                            });
                        }
                    });
            } else if(terms.length == 2 && terms[1].length == 0) { // if exactly two terms and second one is empty
                // exact search
                searchAllTermsInTopics([terms[0]],mainTopicIds,subTopicIds);
            } else if(terms.length >=2){ // if two or more terms
                terms = terms.filter(t=>{return t.length > 0;}); // remove potential empty term re-added
                searchAllTermsInTopics(terms,mainTopicIds,subTopicIds);
            }
        } else if(search.length >= 2){ // one or more 'or'
            search.forEach(s=>{
                let terms = s.filter(t=>t.length > 0); // remove all empty terms
                searchAllTermsInTopics(terms,mainTopicIds,subTopicIds);
            });
        }
        // switch from sets to arrays
        mainTopicIds = Array.from(mainTopicIds);
        subTopicIds = Array.from(subTopicIds);
        return {mainTopicIds, subTopicIds};
    };

    return Data;

}