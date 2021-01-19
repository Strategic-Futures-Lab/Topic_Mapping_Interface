import has from 'lodash-es/has';

export default function(Data){

    /**
     * Return the distributions labels
     * Can provide a custom function to transform the text
     * Returns [{value, text}]
     * Will throw error if distribution was not loaded
     */
    Data.getDistributionLabels = function(textFunction = d=>d){
        if(!has(Data.data, 'distribution')){
            throw new Error('Data Error: distribution was not loaded');
        }
        let entry = Data.data.distribution.mainTopics[0].distribution;
        return entry.map(d=>d.id).map(v=>{
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
                topicId: d.topicId,
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
                topicId: d.topicId,
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
                    topicId: d.topicId,
                    value: v
                };
            });
        let fieldTotal = fieldDistribution.reduce((acc, cur)=>{return acc+cur.value;}, 0);
        return fieldDistribution.map(d=>{return {topicId:d.topicId,value:d.value/fieldTotal};});
    }

    /**
     * Returns the topic distribution from the main topics given a distribution fieldName 
     * Will throw error if distribution no loaded or if distribution doesn't have main topics
     */
    Data.getMainTopicsDistrib = function(fieldName){
        if(!has(Data.data, 'distribution')){
            throw new Error('Data Error: distribution was not loaded');
        }
        if(!has(Data.data.distribution, 'mainTopics')){
            throw new Error('Data Error: no distribution for main topics');
        }
        return getTopicsDistribution(Data.data.distribution.mainTopics, fieldName);
    };

    /**
     * Returns the topic distribution from the sub topics given a distribution fieldName 
     * Will throw error if distribution no loaded or if distribution doesn't have sub topics
     */
    Data.getSubTopicsDistrib = function(fieldName){
        if(!has(Data.data, 'distribution')){
            throw new Error('Data Error: distribution was not loaded');
        }
        if(!has(Data.data.distribution, 'subTopics')){
            throw new Error('Data Error: no distribution for sub topics');
        }
        return getTopicsDistribution(Data.data.distribution.subTopics, fieldName);
    };

    /**
     * Returns the topic distribution from the main topics given a distribution fieldName 
     * Normalised across other fields
     * Will throw error if distribution no loaded or if distribution doesn't have main topics
     */
    Data.getMainTopicsDistribNormPerTopic = function(fieldName){
        if(!has(Data.data, 'distribution')){
            throw new Error('Data Error: distribution was not loaded');
        }
        if(!has(Data.data.distribution, 'mainTopics')){
            throw new Error('Data Error: no distribution for main topics');
        }
        return getTopicsDistributionNormalisedPerTopic(Data.data.distribution.mainTopics, fieldName);
    };

    /**
     * Returns the normalised topic distribution from the sub topics given a distribution fieldName 
     * Normalised across other fields
     * Will throw error if distribution no loaded or if distribution doesn't have sub topics
     */
    Data.getSubTopicsDistribNormPerTopic = function(fieldName){
        if(!has(Data.data, 'distribution')){
            throw new Error('Data Error: distribution was not loaded');
        }
        if(!has(Data.data.distribution, 'subTopics')){
            throw new Error('Data Error: no distribution for sub topics');
        }
        return getTopicsDistributionNormalisedPerTopic(Data.data.distribution.subTopics, fieldName);
    };

    /**
     * Returns the topic distribution from the main topics given a distribution fieldName 
     * Normalised across all topics
     * Will throw error if distribution no loaded or if distribution doesn't have main topics
     */
    Data.getMainTopicsDistribNormPerField = function(fieldName){
        if(!has(Data.data, 'distribution')){
            throw new Error('Data Error: distribution was not loaded');
        }
        if(!has(Data.data.distribution, 'mainTopics')){
            throw new Error('Data Error: no distribution for main topics');
        }
        return getTopicsDistributionNormalisedPerField(Data.data.distribution.mainTopics, fieldName);
    };

    /**
     * Returns the normalised topic distribution from the sub topics given a distribution fieldName 
     * Normalised across all topics
     * Will throw error if distribution no loaded or if distribution doesn't have sub topics
     */
    Data.getSubTopicsDistribNormPerField = function(fieldName){
        if(!has(Data.data, 'distribution')){
            throw new Error('Data Error: distribution was not loaded');
        }
        if(!has(Data.data.distribution, 'subTopics')){
            throw new Error('Data Error: no distribution for sub topics');
        }
        return getTopicsDistributionNormalisedPerField(Data.data.distribution.subTopics, fieldName);
    };

    /**
     * Returns the distribution entry for a specific main topic  
     */
    Data.getMainTopicDistribEntry = function(topicId){
        if(!has(Data.data, 'distribution')){
            throw new Error('Data Error: distribution was not loaded');
        }
        if(!has(Data.data.distribution, 'mainTopics')){
            throw new Error('Data Error: no distribution for main topics');
        }
        let t = Data.data.distribution.mainTopics.filter(d=>{
            return d.topicId === topicId;
        }).map(d=>d.distribution.map(d2=>{return {key:d2.id,value:d2.weight};}));
        if(t.length === 0){
            throw new Error('Data Error: no distribution entry for main topic '+topicId);
        }
        return t[0];
    };

    /**
     * Returns the distribution entry for a specific sub topic  
     */
    Data.getSubTopicDistribEntry = function(topicId){
        if(!has(Data.data, 'distribution')){
            throw new Error('Data Error: distribution was not loaded');
        }
        if(!has(Data.data.distribution, 'subTopics')){
            throw new Error('Data Error: no distribution for sub topics');
        }
        let t = Data.data.distribution.subTopics.filter(d=>{
            return d.topicId === topicId;
        }).map(d=>d.distribution.map(d2=>{return {key:d2.id,value:d2.weight};}));
        if(t.length === 0){
            throw new Error('Data Error: no distribution entry for sub topic '+topicId);
        }
        return t[0];
    };

    /**
     * Returns the distribution entry for a specific main topic  
     */
    Data.getMainTopicDistribEntryNorm = function(topicId){
        if(!has(Data.data, 'distribution')){
            throw new Error('Data Error: distribution was not loaded');
        }
        if(!has(Data.data.distribution, 'mainTopics')){
            throw new Error('Data Error: no distribution for main topics');
        }
        let t = Data.data.distribution.mainTopics.filter(d=>{
            return d.topicId === topicId;
        }).map(d=>d.distribution.map(d2=>{return {key:d2.id,value:d2.weight/d.total};}));
        if(t.length === 0){
            throw new Error('Data Error: no distribution entry for main topic '+topicId);
        }
        return t[0];
    };

    /**
     * Returns the distribution entry for a specific sub topic  
     */
    Data.getSubTopicDistribEntryNorm = function(topicId){
        if(!has(Data.data, 'distribution')){
            throw new Error('Data Error: distribution was not loaded');
        }
        if(!has(Data.data.distribution, 'subTopics')){
            throw new Error('Data Error: no distribution for sub topics');
        }
        let t = Data.data.distribution.subTopics.filter(d=>{
            return d.topicId === topicId;
        }).map(d=>d.distribution.map(d2=>{return {key:d2.id,value:d2.weight/d.total};}));
        if(t.length === 0){
            throw new Error('Data Error: no distribution entry for sub topic '+topicId);
        }
        return t[0];
    };




}