import has from 'lodash-es/has';
import findKey from 'lodash-es/findKey';

export default function(){

    let StateManager = {};

    StateManager.states = {
        mainTopic: {value:null, short:'t'},    // topic selected on main map
        subTopic: {value:null, short:'u'},     // topic selected on sub map
        doc: {value:null, short:'d'},          // doc selected in doc table
        distrib: {value:null, short:'f'},      // distrib field selected in dropdown
        date: {value:null, short:'e'},         // date filter (for docs) selected on trend
        search: {value:null, short:'s'}        // value in search box
    };

    StateManager.state = function(state, value){
        if(!has(StateManager.states, state)){
            throw new Error('State error: '+state+' is not a valid state property');
        }
        if(typeof value === 'undefined'){
            return StateManager.states[state].value;
        } else {
            StateManager.states[state].value = value;
            return StateManager;
        }
    };

    StateManager.reset = function(){
        for(let k of Object.keys(StateManager.states)){
            StateManager.states[k].value = null;
        }
    };

    StateManager.buildURL = function(customBase = null){
        let origin = window.location.origin,
            path = window.location.pathname;
        let base = customBase == null ? `${origin}${path}` : customBase;
        let params = [];

        for(let k of Object.keys(StateManager.states)){
            if(StateManager.states[k].value !== null){
                params.push(`${StateManager.states[k].short}=${encodeURIComponent(StateManager.states[k].value)}`);
            }
            StateManager.states[k].value = null;
        }

        let param = params.length > 0 ? `?${params.join('&')}` : '';
        return `${base}${param}`;
    };

    StateManager.parseURL = function(){
        // get the URL query string, e.g. '?t=...&d=...', minus the starting '?', and split with '&' 
        let kvp = document.location.search.substr(1).split('&');
        // if non-empty
        if(kvp.length > 0 && kvp[0]!=''){
            // for each key,value pair, split with '='
            kvp.map(s=>s.split('=')).forEach(kv=>{
                // get the key from StateManager.states
                let key = findKey(StateManager.states, s=>s.short==kv[0]);
                // if key was found
                if(typeof key !== 'undefined'){
                    // set the value
                    StateManager.states[key].value = decodeURIComponent(kv[1]);
                }
            });
        }
    };

    return StateManager;
}