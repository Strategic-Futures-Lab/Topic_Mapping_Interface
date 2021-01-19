import {timeParse as D3TimeParse,
    timeFormat as D3TimeFormat} from 'd3-time-format';
import {sort as D3Sort,
    sum as D3Sum,
    max as D3Max,
    rollup as D3Rollup} from 'd3-array';

import has from 'lodash-es/has';

export default function(Data){

    /**
     * Returns a sum function for date, takes parsing format of input date,
     * and output format
     */
    Data.getTrendSumByFunction = function(inParse, outFormat){
        return d=>D3TimeFormat(outFormat)(D3TimeParse(inParse)(d));
    };
    /* Duplicate of above */
    Data.timeFormatConverter = function(inParse, outFormat){
        return d=>D3TimeFormat(outFormat)(D3TimeParse(inParse)(d));
    };

    /**
     * Returns the topic entry from a trend distribution
     * will throw error if topic not found
     */
    function getTopicTrendEntry(distrib, topicId){
        let t = distrib.filter(d=>{return d.topicId == topicId;});
        if(t.length === 0){
            throw new Error('Data error: topic '+topicId+' not found in trend');
        }
        return t[0];
    }

    /**
     * Filters out the date outside of the time range from the distribution and returns the distribution
     * dateDistrib: [{date,value}]
     * timeRange: [format, minDate, maxDate]
     * will throw error in timeRange is not complete
     */
    function filterTimeRange(dateDistrib, timeRange){
        if(timeRange.length !== 3){
            throw new Error('Data Error: time range incomplete: [format, minDate (inc.), maxDate (exc.)]');
        }
        let parse = D3TimeParse(timeRange[0]);
        return dateDistrib.filter(d=>{return parse(d.date) >= parse(timeRange[1]) && parse(d.date) < parse(timeRange[2]);});
    }

    /**
     * Groups and sums the entries in the date distribution according to the sumBy function
     * dateDistrib: [{date,value}]
     * sumBy: date=>dateInNewFormat
     */
    function sumDates(dateDistrib, sumBy){
        return D3Sort(Array.from(D3Rollup(dateDistrib, d=>D3Sum(d, d2=>d2.value), d=>sumBy(d.date))), d=>d.key)
            .map(d=>{return {date:d.key,value:d.value};});
    }

    /**
     * Returns a main topic date distribution given topic id
     * returns in format: [{date:string,value:number}]
     * sumBy: date converter function
     * timeRange: [format, minDate (inc.), maxDate (exc.)]
     * will throw error if trend data not loaded or if trend data doesn't have main topics
     */
    Data.getMainTopicTrend = function(topicId, sumBy=null, timeRange=null){
        if(!has(Data.data, 'trend')){
            throw new Error('Data Error: trend was not loaded');
        }
        if(!has(Data.data.trend, 'mainTopics')){
            throw new Error('Data Error: no trend for main topics');
        }
        let dateDistrib = getTopicTrendEntry(Data.data.trend.mainTopics, topicId).distribution
            .map(d=>{return {date:d.id,value:d.weight};});
        if(timeRange !== null){
            dateDistrib = filterTimeRange(dateDistrib, timeRange);
        }
        if(sumBy !== null){
            dateDistrib = sumDates(dateDistrib, sumBy);
        }
        return dateDistrib;
    };

    /**
     * Returns a sub topic date distribution given topic id
     * returns in format: [{date:string,value:number}]
     * sumBy: date converter function
     * timeRange: [format, minDate (inc.), maxDate (exc.)]
     * will throw error if trend data not loaded or if trend data doesn't have sub topics
     */
    Data.getSubTopicTrend = function(topicId, sumBy=null, timeRange=null){
        if(!has(Data.data, 'trend')){
            throw new Error('Data Error: trend was not loaded');
        }
        if(!has(Data.data.trend, 'subTopics')){
            throw new Error('Data Error: no trend for sub topics');
        }
        let dateDistrib = getTopicTrendEntry(Data.data.trend.subTopics, topicId).distribution
            .map(d=>{return {date:d.id,value:d.weight};});
        if(timeRange !== null){
            dateDistrib = filterTimeRange(dateDistrib, timeRange);
        }
        if(sumBy !== null){
            dateDistrib = sumDates(dateDistrib, sumBy);
        }
        return dateDistrib;
    };

    /**
     * Finds the maximum value in the trend distribution
     * sumBy: date converter function to aggregate values
     * Will throw error in trned was not loaded or if trend has neither main or sub topics
     */
    Data.getMaxTrend = function(sumBy=null){
        let max = -1;
        // let reduceWeights = d=>d.distribution.reduce((acc,val)=>{return acc+val.weight;},0);
        let maxWeights = d=>D3Max(d.distribution, d2=>d2.weight);
        let maxWeightsSumBy = d=>sumDates(d.distribution, sumBy);
        let fun = sumBy === null ? maxWeights : maxWeightsSumBy;
        if(!has(Data.data, 'trend')){
            throw new Error('Data Error: trend was not loaded');
        }
        if(has(Data.data.trend, 'subTopics')){
            max = Math.max(max, D3Max(Data.data.trend.subTopics, fun));
        }
        if(has(Data.data.trend, 'mainTopics')){
            max = Math.max(max, D3Max(Data.data.trend.mainTopics, fun));
        }
        if(!has(Data.data.trend, 'subTopics') && !has(Data.data.trend, 'mainSubtopics')){
            throw new Error('Data Error: no trend data for topics');
        }
        return max;
    };

}