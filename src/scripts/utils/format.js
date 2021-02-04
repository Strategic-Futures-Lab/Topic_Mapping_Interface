import {format as D3Format} from 'd3-format';
import {timeParse as D3TimeParse,
    timeFormat as D3TimeFormat} from 'd3-time-format';

function formatNumber(n, f){
    return D3Format(f)(n);
}

function formatDate(d, f){
    return D3TimeFormat(f)(d);
}

function parseDate(d, f){
    return D3TimeParse(f)(d);
}

function convertDate(d, inF, outF){
    return formatDate(parseDate(d, inF), outF);
}

function dateConverter(inF, outF){
    return d=>formatDate(parseDate(d, inF), outF);
}

export {formatNumber, formatDate, parseDate, convertDate, dateConverter};
