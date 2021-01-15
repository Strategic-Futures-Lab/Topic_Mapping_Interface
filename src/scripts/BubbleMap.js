import PageManager from './model/PageManager.js';
import DataManager from './model/DataManager.js';
import BubbleMap from './views/BubbleMap.js';
import WordCloud from './views/WordCloud.js';
import Table from './views/Table.js';
import DocumentViewer from './views/DocumentViewer.js';
import TrendBars from './views/TrendBars.js';
import LineChart from './views/LineChart.js';
import HorBarChart from './views/HorBarChart.js';
import SearchBox from './utils/SearchBox.js';
import DropdownFilter from './utils/DropdownFilter.js';
import FloatingMenu from './utils/FloatingMenu.js';
import URLManager from './utils/URLManager.js';
import {format as D3Format} from 'd3-format';
import '../styles/Page.less';


let numberFormat = function(format, number){
    return D3Format(format)(number);
};

let processWordSearch = function(word, searchValue, append=';'){
    // test if word already in search
    let w = word.toLowerCase();
    let s = searchValue.toLowerCase();
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
    return n;
};

export default{
    PageManager, DataManager, 
    SearchBox, DropdownFilter,
    BubbleMap, WordCloud, Table, DocumentViewer, TrendBars, LineChart, HorBarChart,
    FloatingMenu, URLManager,
    numberFormat, processWordSearch
};