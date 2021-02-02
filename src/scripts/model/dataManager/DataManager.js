import DataManagerBasic from './DataManagerBasic';
import mapData from './mapData';
import docData from './docData';
import distribData from './distribData';
import trendData from './trendData';
import searchData from './searchData';
import statData from './statData';

export default function(){

    // urls:
    // {
    //     mainMap, subMaps
    //     mainModel, subModel,
    //     mainLL, subLL,
    //     distribution, trend,
    //     labelsIndex, docCSV
    // }

    // Set the initial data manager
    let Data = DataManagerBasic();
    // Add map features
    mapData(Data);
    // Add document table features
    docData(Data);
    // Add distribution features
    distribData(Data);
    // Add trend features
    trendData(Data);
    // Add search features
    searchData(Data);
    // Add stat features
    statData(Data);

    return Data;

}