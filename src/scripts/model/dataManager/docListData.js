import has from 'lodash-es/has';
import {format as D3Format} from 'd3-format';
import * as JSSearch from 'js-search';

export default function(Data){

    Data.documents = {};

    /**
     * Separates documents removed from model into different list
     * Throws error if documents not loaded
     */
    Data.documents.filterRemovedDocs = function(){
        if(!has(Data.data, 'documents')){
            throw new Error('Data Error: documents was not loaded');
        }
        Data.data.removedDocuments = Data.data.documents.filter(d=>d._inModel=='false');
        Data.data.documents = Data.data.documents.filter(d=>d._inModel=='true');
        return Data;
    };

    /**
     * Puts main and sub topics in nested object for each document
     * Throws error if documents not loaded
     */
    function aggregateTopics(){
        if(!has(Data.data, 'documents')){
            throw new Error('Data Error: documents was not loaded');
        }
        Data.data.documents.forEach(d=>{
            let mainTopicKeys = Object.keys(d).filter(k=>k.startsWith('_mainTopic_'));
            let subTopicKeys = Object.keys(d).filter(k=>k.startsWith('_subTopic_'));
            let mainTopicWeights = {};
            for(let k of mainTopicKeys){
                let labels = k.replace('_mainTopic_', '');
                mainTopicWeights[labels] = d[k];
                delete d[k];
            }
            let subTopicWeights = {};
            for(let k of subTopicKeys){
                let labels = k.replace('_subTopic_', '');
                subTopicWeights[labels] = d[k];
                delete d[k];
            }
            d._mainTopics = mainTopicWeights;
            d._subTopics = subTopicWeights;
        });
    }

    /**
     * Adds string of top main and sub topics to each documents
     * Number of top topics is given percentage of topics
     * Allows for minimum threshold weight
     * Throws error if documents not loaded
     */
    function getTopTopics(percentage, threshold = 0){
        if(!has(Data.data, 'documents')){
            throw new Error('Data Error: documents was not loaded');
        }
        if(!has(Data.data.documents[0], '_mainTopics')){
            aggregateTopics();
        }
        let nMainTopics = Object.keys(Data.data.documents[0]._mainTopics).length,
            nSubTopics = Object.keys(Data.data.documents[0]._subTopics).length;
        let topNMain = Math.floor(nMainTopics*percentage),
            topNSub = Math.floor(nSubTopics*percentage);
        Data.data.documents.forEach(d=>{
            d.topMainTopics = Object.entries(d._mainTopics)
                .sort((a,b)=>b[1]-a[1])
                .slice(0, topNMain)
                .filter(e=>e[1]>=threshold)
                .map(e=>`${e[0]} (${D3Format('.0~%')(e[1])})`)
                .join('\n');
            d.topSubTopics = Object.entries(d._subTopics)
                .sort((a,b)=>b[1]-a[1])
                .slice(0, topNSub)
                .filter(e=>e[1]>=threshold)
                .map(e=>`${e[0]} (${D3Format('.0~%')(e[1])})`)
                .join('\n');
        });
    }

    /**
     * Processes list of documents to get concise topics info
     * Throws error if documents not loaded
     */
    Data.documents.processDocumentTopics = function(percentage = 0.2, threshold = 0.1){
        if(!has(Data.data, 'documents')){
            throw new Error('Data Error: documents was not loaded');
        }
        aggregateTopics();
        getTopTopics(percentage, threshold);
        Data.data.documents.forEach(d=>{
            d.docId = d._docId;
            delete d['_docId'];
        });
        return Data;
    };

    /**
     * Shorten the text of given fields to be no longer than charLimit
     * Throws error if documents not loaded
     */
    Data.documents.shortenTexts = function(fields, charLimit = 200){
        if(!has(Data.data, 'documents')){
            throw new Error('Data Error: documents was not loaded');
        }
        Data.data.documents.forEach(d=>{
            for(let f of fields){
                d[f[1]] = d[f[0]].length>charLimit ? d[f[0]].slice(0, charLimit)+'...' : d[f[0]];
            }
        });
        return Data;
    };

    function filterDocFromSearch(){
        if(Data.data.documentsSearchTerm != null
            && typeof(Data.data.documentsSearchTerm) != 'undefined'
            && typeof(Data.data.documentsSearchFields) != 'undefined'){
            Data.data.documents.forEach(d=>{d._renderInTable = false;});
            let search = new JSSearch.Search('_docId');
            Data.data.documentsSearchFields.forEach(f=>search.addIndex(f));
            search.addDocuments(Data.data.documents);
            search.search(Data.data.documentsSearchTerm).forEach(d=>{d._renderInTable = true;});
        }
    }

    function filterDocs(){
        Data.data.documents.forEach(d=>{
            d._renderInTable = true;
        });
        filterDocFromSearch();
    }

    /**
     * Returns list of documents after filter by search
     * Throws error if documents not loaded
     */
    Data.documents.getDocumentsToRender = function(){
        if(!has(Data.data, 'documents')){
            throw new Error('Data Error: documents was not loaded');
        }
        filterDocs();
        return Data.data.documents.filter(d=>d._renderInTable);
    };

    /**
     * Sets the fields to index during search 
     */
    Data.documents.setSearchFields = function(fields){
        Data.data.documentsSearchFields = fields;
        return Data;
    };

    /**
     * Sets search term
     */
    Data.documents.setSearchTerm = function(searchTerm = ''){
        Data.data.documentsSearchTerm = searchTerm == '' ? null : searchTerm;
        return Data;
    };

}