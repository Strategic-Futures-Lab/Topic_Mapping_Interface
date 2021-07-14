import has from 'lodash-es/has';

export default function(Data){

    /**
     * Return the distributions labels
     * Can provide a custom function to transform the text, and custom name of distribution
     * Returns [{value, text}]
     * Will throw error if distribution was not loaded, or no distribution for mainTopics
     * Will go over all topics to get all fields: one topic doesn't guarantee to have all the labels found!
     */
    Data.getDistributionLabels = function(textFunction = d=>d, distributionName = 'distribution'){
        if(!has(Data.data, distributionName)){
            throw new Error(`Data Error: distribution ${distributionName} was not loaded`);
        }
        if(!has(Data.data[distributionName], 'mainTopics')){
            throw new Error('Data Error: no distribution for main topics');
        }
        let entry = new Set();
        for(let t of Data.data[distributionName].mainTopics){
            t.distribution.forEach(d=>entry.add(d.id));
        }
        if(has(Data.data[distributionName], 'subTopics')){
            for(let t of Data.data[distributionName].subTopics){
                t.distribution.forEach(d=>entry.add(d.id));
            }
        }
        return Array.from(entry).map(v=>{
            return {value:v, text:textFunction(v)};
        }).sort((a,b)=>{
            return (a.text < b.text) ? -1 : (a.text > b.text) ? 1 : 0;
        });
    };

    /**
     * Returns the list of topics and weights for a particular fieldName in the distribution topicDistrib
     * Will throw error if fieldName not found in any topic distribution
     */
    function getTopicsDistribution(topicDistrib, fieldName){
        return topicDistrib.filter(d=>{
            return d.topicId > -1;
        }).map(d=>{
            let v = d.distribution
                .filter(e=>{return e.id === fieldName;})
                .map(e=>e.weight);
            if(v.length === 0){
                throw new Error('Data Error: '+fieldName+' not found in distribution');
            }
            v = v[0];
            return {
                key: d.topicId,
                value: v
            };
        });
    }

    /**
     * Returns the list of topics and weights for a particular fieldName in the distribution topicDistrib
     * Normalised across all other fields
     * Will throw error if fieldName not found in any topic distribution
     */
    function getTopicsDistributionNormalisedPerTopic(topicDistrib, fieldName){
        return topicDistrib.filter(d=>{
            return d.topicId > -1;
        }).map(d=>{
            let v = d.distribution
                .filter(e=>{return e.id === fieldName;})
                .map(e=>e.weight/d.total);
            if(v.length === 0){
                throw new Error('Data Error: '+fieldName+' not found in distribution');
            }
            v = v[0];
            return {
                key: d.topicId,
                value: v
            };
        });
    }

    /**
     * Returns the list of topics and weights for a particular fieldName in the distribution topicDistrib
     * Normalised across all topics
     * Will throw error if fieldName not found in any topic distribution
     */
    function getTopicsDistributionNormalisedPerField(topicDistrib, fieldName){
        let fieldDistribution = topicDistrib.filter(d=>{ return d.topicId > -1; })
            .map(d=>{
                let v = d.distribution
                    .filter(e=>{return e.id === fieldName;})
                    .map(e=>e.weight);
                if(v.length === 0){
                    throw new Error('Data Error: '+fieldName+' not found in distribution');
                }
                v = v[0];
                return {
                    key: d.topicId,
                    value: v
                };
            });
        let fieldTotal = fieldDistribution.reduce((acc, cur)=>{return acc+cur.value;}, 0);
        return fieldDistribution.map(d=>{return {key:d.key,value:d.value/fieldTotal};});
    }

    /**
     * Returns the topic distribution from the main topics given a distribution fieldName 
     * Can provide a custom name of distribution
     * Will throw error if distribution no loaded or if distribution doesn't have main topics
     */
    Data.getMainTopicsDistrib = function(fieldName, distributionName = 'distribution'){
        if(!has(Data.data, distributionName)){
            throw new Error(`Data Error: distribution ${distributionName} was not loaded`);
        }
        if(!has(Data.data[distributionName], 'mainTopics')){
            throw new Error('Data Error: no distribution for main topics');
        }
        return getTopicsDistribution(Data.data[distributionName].mainTopics, fieldName);
    };

    /**
     * Returns the topic distribution from the sub topics given a distribution fieldName 
     * Can provide a custom name of distribution
     * Will throw error if distribution no loaded or if distribution doesn't have sub topics
     */
    Data.getSubTopicsDistrib = function(fieldName, distributionName = 'distribution'){
        if(!has(Data.data, distributionName)){
            throw new Error(`Data Error: distribution ${distributionName} was not loaded`);
        }
        if(!has(Data.data[distributionName], 'subTopics')){
            throw new Error('Data Error: no distribution for sub topics');
        }
        return getTopicsDistribution(Data.data[distributionName].subTopics, fieldName);
    };

    /**
     * Returns the topic distribution from the main topics given a distribution fieldName 
     * Normalised across other fields
     * Can provide a custom name of distribution
     * Will throw error if distribution no loaded or if distribution doesn't have main topics
     */
    Data.getMainTopicsDistribNormPerTopic = function(fieldName, distributionName = 'distribution'){
        if(!has(Data.data, distributionName)){
            throw new Error(`Data Error: distribution ${distributionName} was not loaded`);
        }
        if(!has(Data.data[distributionName], 'mainTopics')){
            throw new Error('Data Error: no distribution for main topics');
        }
        return getTopicsDistributionNormalisedPerTopic(Data.data[distributionName].mainTopics, fieldName);
    };

    /**
     * Returns the normalised topic distribution from the sub topics given a distribution fieldName 
     * Normalised across other fields
     * Can provide a custom name of distribution
     * Will throw error if distribution no loaded or if distribution doesn't have sub topics
     */
    Data.getSubTopicsDistribNormPerTopic = function(fieldName, distributionName = 'distribution'){
        if(!has(Data.data, distributionName)){
            throw new Error(`Data Error: distribution ${distributionName} was not loaded`);
        }
        if(!has(Data.data[distributionName], 'subTopics')){
            throw new Error('Data Error: no distribution for sub topics');
        }
        return getTopicsDistributionNormalisedPerTopic(Data.data[distributionName].subTopics, fieldName);
    };

    /**
     * Returns the topic distribution from the main topics given a distribution fieldName 
     * Normalised across all topics
     * Can provide a custom name of distribution
     * Will throw error if distribution no loaded or if distribution doesn't have main topics
     */
    Data.getMainTopicsDistribNormPerField = function(fieldName, distributionName = 'distribution'){
        if(!has(Data.data, distributionName)){
            throw new Error(`Data Error: distribution ${distributionName} was not loaded`);
        }
        if(!has(Data.data[distributionName], 'mainTopics')){
            throw new Error('Data Error: no distribution for main topics');
        }
        return getTopicsDistributionNormalisedPerField(Data.data[distributionName].mainTopics, fieldName);
    };

    /**
     * Returns the normalised topic distribution from the sub topics given a distribution fieldName 
     * Normalised across all topics
     * Can provide a custom name of distribution
     * Will throw error if distribution no loaded or if distribution doesn't have sub topics
     */
    Data.getSubTopicsDistribNormPerField = function(fieldName, distributionName = 'distribution'){
        if(!has(Data.data, distributionName)){
            throw new Error(`Data Error: distribution ${distributionName} was not loaded`);
        }
        if(!has(Data.data[distributionName], 'subTopics')){
            throw new Error('Data Error: no distribution for sub topics');
        }
        return getTopicsDistributionNormalisedPerField(Data.data[distributionName].subTopics, fieldName);
    };

    /**
     * Returns the distribution entry for a specific main topic
     * Can provide a custom name of distribution
     * Will throw error if distribution no loaded, if distribution doesn't have main topics or if topicId is not found
     */
    Data.getMainTopicDistribEntry = function(topicId, distributionName = 'distribution'){
        if(!has(Data.data, distributionName)){
            throw new Error(`Data Error: distribution ${distributionName} was not loaded`);
        }
        if(!has(Data.data[distributionName], 'mainTopics')){
            throw new Error('Data Error: no distribution for main topics');
        }
        let t = Data.data[distributionName].mainTopics.filter(d=>{
            return d.topicId === topicId;
        }).map(d=>d.distribution.map(d2=>{return {key:d2.id,value:d2.weight};}));
        if(t.length === 0){
            throw new Error('Data Error: no distribution entry for main topic '+topicId);
        }
        return t[0];
    };

    /**
     * Returns the distribution entry for a specific sub topic
     * Can provide a custom name of distribution
     * Will throw error if distribution no loaded, if distribution doesn't have sub topics or if topicId is not found
     */
    Data.getSubTopicDistribEntry = function(topicId, distributionName = 'distribution'){
        if(!has(Data.data, distributionName)){
            throw new Error(`Data Error: distribution ${distributionName} was not loaded`);
        }
        if(!has(Data.data[distributionName], 'subTopics')){
            throw new Error('Data Error: no distribution for sub topics');
        }
        let t = Data.data[distributionName].subTopics.filter(d=>{
            return d.topicId === topicId;
        }).map(d=>d.distribution.map(d2=>{return {key:d2.id,value:d2.weight};}));
        if(t.length === 0){
            throw new Error('Data Error: no distribution entry for sub topic '+topicId);
        }
        return t[0];
    };

    /**
     * Returns the distribution entry for a specific main topic
     * Can provide a custom name of distribution
     * Will throw error if distribution no loaded, if distribution doesn't have main topics or if topicId is not found
     */
    Data.getMainTopicDistribEntryNorm = function(topicId, distributionName = 'distribution'){
        if(!has(Data.data, distributionName)){
            throw new Error(`Data Error: distribution ${distributionName} was not loaded`);
        }
        if(!has(Data.data[distributionName], 'mainTopics')){
            throw new Error('Data Error: no distribution for main topics');
        }
        let t = Data.data[distributionName].mainTopics.filter(d=>{
            return d.topicId === topicId;
        }).map(d=>d.distribution.map(d2=>{return {key:d2.id,value:d2.weight/d.total};}));
        if(t.length === 0){
            throw new Error('Data Error: no distribution entry for main topic '+topicId);
        }
        return t[0];
    };

    /**
     * Returns the distribution entry for a specific sub topic
     * Can provide a custom name of distribution
     * Will throw error if distribution no loaded, if distribution doesn't have sub topics or if topicId is not found
     */
    Data.getSubTopicDistribEntryNorm = function(topicId, distributionName = 'distribution'){
        if(!has(Data.data, distributionName)){
            throw new Error(`Data Error: distribution ${distributionName} was not loaded`);
        }
        if(!has(Data.data[distributionName], 'subTopics')){
            throw new Error('Data Error: no distribution for sub topics');
        }
        let t = Data.data[distributionName].subTopics.filter(d=>{
            return d.topicId === topicId;
        }).map(d=>d.distribution.map(d2=>{return {key:d2.id,value:d2.weight/d.total};}));
        if(t.length === 0){
            throw new Error('Data Error: no distribution entry for sub topic '+topicId);
        }
        return t[0];
    };


    /**
     * Returns domain data of distribution
     * Can provide list of field names to filter and custom name of distribution
     * Will throw error if distribution no loaded or if domain data not present
     */
    Data.getDistributionDomainData = function(fieldNames = [], distributionName = 'distribution'){
        if(!has(Data.data, distributionName)){
            throw new Error(`Data Error: distribution ${distributionName} was not loaded`);
        }
        if(!has(Data.data[distributionName], 'domainData')){
            throw new Error(`Data Error: no domainData found for distribution ${distributionName}`);
        }
        if(fieldNames.length == 0){
            return Data.data[distributionName].domainData;
        } else {
            let res = {};
            for(let f of fieldNames){
                if(has(Data.data[distributionName].domainData, f)){
                    res[f] = Data.data[distributionName].domainData[f];
                }
            }
            return res;
        }
    };

}