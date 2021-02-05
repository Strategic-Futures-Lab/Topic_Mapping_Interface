import has from 'lodash-es/has';

export default function(Data){

    /**
     * Returns the list of labels in the index
     * Will save the list if not accessed before
     * Will trhow error if labels index was not loaded
     */
    function getLabels(){
        if(!has(Data.data, 'labelsIndex')){
            throw new Error('Data error: labelsIndex was not loaded');
        }
        if(!has(Data.data, 'labels')){
            Data.data.labels = Object.keys(Data.data.labelsIndex);
        }
        return Data.data.labels;
    }

    /**
     * Separates search terms from a query
     * e.g. "A and B or C and D or E" => [[A,B], [C,D], [E]]
     */
    function getSearchTerms(){
        // split strings for 'or' and 'and' queries
        let orSplits = [';', ' or ', '*'];
        let andSplits = [' and ', '+', ' ']; // ' ' needs to be last!!
        // search query
        let search = [];
        // building the search query from a string
        if(typeof(Data.data.searchTerm) !== 'undefined'
            && Data.data.searchTerm !== null
            && Data.data.searchTerm.length > 0){
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
     * Sets the search string
     */
    Data.setSearchTerm = function(searchTerm){
        Data.data.searchTerm = searchTerm === '' || searchTerm === null ? null : searchTerm.toLowerCase();
        return Data;
    };

    /**
     * Adds word to a search, or removes it if the word is already in a search
     * if searchValue if not set (or null), will use and update searchTerm
     * returns the process searchValue.
     */
    Data.processWordInSearch = function(word, searchValue=null, append=';'){
        // test if word already in search
        let w = word.toLowerCase();
        let s = searchValue == null ? Data.data.searchTerm : searchValue.toLowerCase();
        if(typeof s == 'undefined' || s == null){
            s = '';
        }
        let r = new RegExp(`;?\\s*${w}(\\s|;|$)`, 'gi');
        let inSearch = r.test(s);
        let n = '';
        if(!inSearch){ // if word not in search, append it using specified method
            let a = append.endsWith(' ')?append:append+' ';
            n = s==''?w:s+a+w;
        } else { // if word already in search, remove it
            n = s.replace(w,'')
                .replace(' ;', ';')
                .replace('  ', ' ')
                .replace(';;', ';');
            while(n.startsWith(';') || n.startsWith(' ')){
                n = n.substring(1, n.length);
            }
        }
        if(searchValue == null){
            Data.setSearchTerm(n);
        }
        return n;
    };

    /**
     * Fills provided set ids with docIds of documents containing all provided terms
     * Will throw error if labels index was not loaded
     */
    function searchAllTermsInDocuments(terms, docsIds){
        if(!has(Data.data, 'labelsIndex')){
            throw new Error('Data error: labelsIndex was not loaded');
        }
        // get all doc ids with occurrence of terms
        let docs = terms.map(t=>{
            let l = Data.data.labelsIndex[t];
            return typeof(l)=='undefined'?[]:l.documents;
        });
        // filter doc ids with occurrence of all terms
        let ids = docs.reduce((acc,cur,idx)=>{
            return idx==0 ? cur : acc.filter(i=>cur.includes(i));
        }, []);
        // fill sets
        ids.forEach(i=>docsIds.add(i));
    }

    /**
     * Returns doc ids from a search
     * Will throw error if labels index not loaded
     */
    Data.getDocIdsFromSearch = function(){
        if(!has(Data.data, 'labelsIndex')){
            throw new Error('Data error: labelsIndex was not loaded');
        }
        let search = getSearchTerms();
        let docIds = new Set();
        // evaluating query and populating the sets of ids
        if(search.length == 1){ // no 'or'
            let last = search[0].pop(); // extract last term
            let terms = search[0].filter(t=>t.length > 0); // remove all empty terms
            terms.push(last); // re-add last term
            if(terms.length == 1 && terms[0].length > 0){ // if only one non-empty term
                // partial search
                getLabels().filter(l=>l.toLowerCase().includes(terms[0]))
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
     * Fills provided sets of ids with topicIds of topics containing all provided terms
     * Will throw error if labels index was not loaded
     */
    function searchAllTermsInTopics(terms, mainTopicIds, subTopicIds){
        if(!has(Data.data, 'labelsIndex')){
            throw new Error('Data error: labelsIndex was not loaded');
        }
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
     * Return the ids of topics from a search
     * Will throw error if labels index was not loaded
     */
    Data.getTopicIdsFromSearch = function(){
        if(!has(Data.data, 'labelsIndex')){
            throw new Error('Data error: labelsIndex was not loaded');
        }
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
                getLabels().filter(l=>l.toLowerCase().includes(terms[0]))
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

    /** 
     * Returns a subset of labels from a search
     * Will throw error if labels index not loaded (by proxy)
     */
    Data.getLabelsFromSearch = function(){
        let search = getSearchTerms();
        let labels = [];
        // evaluating query and populating the sets of labels
        if(search.length == 1){ // no 'or'
            let last = search[0].pop(); // extract last term
            let terms = search[0].filter(t=>t.length > 0); // remove all empty terms
            terms.push(last); // re-add last term
            if(terms.length == 1 && terms[0].length > 0){ // if only one non-empty term
                // partial search
                getLabels().filter(l=>l.toLowerCase().includes(terms[0])).forEach(l=>{labels.push(l);});
            } else if(terms.length == 2 && terms[1].length == 0) { // if exactly two terms and second one is empty
                // exact search
                getLabels().filter(l=>l.toLowerCase() == terms[0]).forEach(l=>{labels.push(l);});
            } else if(terms.length >=2){ // if two or more terms
                terms = terms.filter(t=>{return t.length > 0;}); // remove potential empty term re-added
                getLabels().filter(l=>terms.includes(l.toLowerCase())).forEach(l=>{labels.push(l);});
            }
        } else if(search.length >= 2){ // one or more 'or'
            search.forEach(s=>{
                let terms = s.filter(t=>t.length > 0); // remove all empty terms
                getLabels().filter(l=>terms.includes(l.toLowerCase())).forEach(l=>{labels.push(l);});
            });
        }
        return labels;
    };

    /**
     *  Combines getLabelsFromSearch, getTopicIdsFromSearch, and getDocIdsFromSearch
     */
    Data.getFromSearch = function(){
        return {labels:Data.getLabelsFromSearch(),
            topics:Data.getTopicIdsFromSearch(),
            docs:Data.getDocIdsFromSearch()};
    };
}