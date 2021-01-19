import has from 'lodash-es/has';

export default function(Data){

    /**
     * Given a topic id from main topic map, gets the data to the associated sub map
     * and sets it to subMap data attribute.
     * Will throw error if subMaps not loaded or if no subMap can be found with mainTopicId
     */
    Data.setSubMap = function(mainTopicId){
        if(!has(Data.data, 'subMaps')){
            throw new Error('Data Error: subMaps were not loaded');
        }
        let s = Data.data.subMaps.filter(d=>{return d.mainTopicId === mainTopicId;});
        if(s.length < 1){
            throw new Error('Data Error: no subMap were found with mainTopicId '+mainTopicId);
        }
        Data.data.subMap = Data.data.subMaps.filter(d=>{return d.mainTopicId === mainTopicId;})[0].subMap;
        return Data;
    };

    /**
     * Given a topic id from main topic map, gets the data to the associated sub map
     * sets it to subMap data attribute, and returns it.
     * 
     * If main topic id is not specified, directly returns the subMap previously set
     * Will throw error if subMap was not set
     */
    Data.getSubMap = function(mainTopicId=null){
        if(mainTopicId == null){
            if(!has(Data.data, 'submap')){
                throw new Error('Data Error: subMap was not set');
            }
            return Data.data.subMap;
        } else {
            Data.setSubMap(mainTopicId);
            return Data.data.subMap;
        }
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
     * Will throw error if mainMap was not loaded and if topicId not found in mainMap
     */
    Data.getTopicMainMap = function(topicId){
        if(!has(Data.data, 'mainMap')){
            throw new Error('Data Error: mainMap was not loaded');
        } 
        let t = getTopic(Data.data.mainMap, topicId);
        if(t == null){
            throw new Error('Data Error: topic '+topicId+' was not found in mainMap');
        } 
        return t;
    };

    /**
     * Given a topic id return the associated topic data from current sub bubble map
     * Will throw error if subMap was not set and if topicId not found in subMap
     */
    Data.getTopicSubMap = function(topicId){
        if(!has(Data.data, 'subMap')){
            throw new Error('Data Error: subMap was not set');
        } 
        let t = getTopic(Data.data.subMap, topicId);
        if(t == null){
            throw new Error('Data Error: topic '+topicId+' was not found in subMap');
        } 
        return t;
    };
}