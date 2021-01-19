import has from 'lodash-es/has';

export default function(Data){

    /**
     * given data structure containing an array of topics (map or model)
     * returns the topic with specified topicId, or null
     */
    function getTopic(data, topicId){
        let t = data.topics.filter(t=>{return t.topicId === topicId;});
        return t.length === 0 ? null : t[0];
    }

    /**
     * Given a topicId from the main model, will set the table rows to the topics's top documents
     * if the topic isn't found sets it to empty
     * Will throw error if mainModel isn't loaded
     */
    Data.setTableRowsMainTopic = function(topicId){
        if(!has(Data.data, 'mainModel')){
            throw new Error('Data Error: mainModel was not loaded');
        }
        let t = getTopic(Data.data.mainModel, topicId);
        Data.data.tableRows = t===null ? [] : t.topDocs;
        return Data;
    };

    /**
     * Given a topicId from the sub model, will set the table rows to the topics's top documents
     * if the topic isn't found sets it to empty
     * Will throw error if subModel isn't loaded
     */
    Data.setTableRowsSubTopic = function(topicId){
        if(!has(Data.data, 'subModel')){
            throw new Error('Data Error: subModel was not loaded');
        }
        let t = getTopic(Data.data.subTopicModel, topicId);
        Data.data.tableRows = t===null ? [] : t.topDocs;
        return Data;
    };

    /**
     * Returns the rows data for the table.
     * Can specify a number of rows (def 10), and filter function (def return true)
     * Will throw error if table hasn't been set yet
     */
    Data.getTableRows = function(number = 10, filter = ()=>true){
        if(!has(Data.data, 'tableRows')){
            throw new Error('Data Error: tableROws were not set');
        }
        return Data.data.tableRows.filter(filter).slice(0, number);
    };

    /**
     * Given a document id, returns the associated document fomr the current table rows 
     * Will throw error if table is not set or empty or if document not found in table
     */
    Data.getDocument = function(docId){
        if(!has(Data.data, 'tableRows') || Data.data.tableRows.length == 0){
            throw new Error('Data Error: tableROws were not set or are empty');
        }
        let d = Data.data.tableRows.filter(d=>d.docId==docId);
        if(d.length < 0){
            throw new Error('Data Error: could not find document '+docId);
        }
        return d[0];
    };
}