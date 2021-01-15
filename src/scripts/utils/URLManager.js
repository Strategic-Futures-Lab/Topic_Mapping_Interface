export default {
    buildURL: function(state){
        let origin = window.location.origin,
            path = window.location.pathname;
        let params = [];

        if(typeof state.mainTopic !== 'undefined' && state.mainTopic !== null){
            params.push(`t=${encodeURIComponent(state.mainTopic)}`);
        }
        if(typeof state.subTopic !== 'undefined' && state.subTopic !== null){
            params.push(`u=${encodeURIComponent(state.subTopic)}`);
        }
        if(typeof state.doc !== 'undefined' && state.doc !== null){
            params.push(`d=${encodeURIComponent(state.doc)}`);
        }
        if(typeof state.labelSearch !== 'undefined'  && state.labelSearch !== null){
            params.push(`s=${encodeURIComponent(state.labelSearch)}`);
        }
        if(typeof state.filterValue !== 'undefined' && state.filterValue !== null){
            params.push(`f=${encodeURIComponent(state.filterValue)}`);
        }
        if(typeof state.docDate !== 'undefined' && state.docDate !== null){
            params.push(`e=${encodeURIComponent(state.docDate)}`);
        }
        let param = params.length > 0 ? `?${params.join('&')}` : '';
        return `${origin}${path}${param}`;
    },
    parseURL: function(){
        let mainTopic = null, subTopic = null, doc = null, labelSearch = null, filterValue = null, docDate = null;
        let kvp = document.location.search.substr(1).split('&');
        if(kvp.length > 0 && kvp[0]!=''){
            kvp.map(s=>s.split('=')).forEach(kv=>{
                if(kv[0] == 't'){
                    mainTopic = decodeURIComponent(kv[1]);
                }
                if(kv[0] == 'u'){
                    subTopic = decodeURIComponent(kv[1]);
                }
                if(kv[0] == 'd'){
                    doc = decodeURIComponent(kv[1]);
                }
                if(kv[0] == 's'){
                    labelSearch = decodeURIComponent(kv[1]);
                }
                if(kv[0] == 'f'){
                    filterValue = decodeURIComponent(kv[1]);
                }
                if(kv[0] == 'e'){
                    docDate = decodeURIComponent(kv[1]);
                }
            });
        }
        return {mainTopic, subTopic, doc, labelSearch, filterValue, docDate};
    }
};