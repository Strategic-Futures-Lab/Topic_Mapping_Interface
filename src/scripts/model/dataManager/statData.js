import has from 'lodash-es/has';

export default function(Data){

    function getFinalLL(modelLL){
        if(!has(modelLL, 'nIter')){
            throw new Error('Data Error: model does not have number of iterations');
        }
        if(!has(modelLL, 'LL')){
            throw new Error('Data Error: model does not have final log-likelihood');
        }
        return {nIter:modelLL.nIter, LL:modelLL.LL};
    }

    /**
     * Returns the final log-likelihood information for the main model
     * Will throw an error if log-likelihood file for main model was not loaded
     * and if log-likehodd files does not have total number of iteration or final log-likelihood
     * returns data in the format [{nIter,LL}] total number of iteration and final log-likehood
     */
    Data.getFinalMainLL = function(){
        if(!has(Data.data, 'mainLL')){
            throw new Error('Data Error: main model log-likelihood was not loaded');
        }
        return getFinalLL(Data.data.mainLL);
    };

    /**
     * Returns the final log-likelihood information for the sub model
     * Will throw an error if log-likelihood file for sub model was not loaded
     * and if log-likehodd files does not have total number of iteration or final log-likelihood
     * returns data in the format [{nIter,LL}] total number of iteration and final log-likehood
     */
    Data.getFinalSubLL = function(){
        if(!has(Data.data, 'subLL')){
            throw new Error('Data Error: sub model log-likelihood was not loaded');
        }
        return getFinalLL(Data.data.subLL);
    };

    function getLLData(modelLL){
        if(!has(modelLL, 'entries')){
            throw new Error('Data Error: model does not have entries of log-likelihood history');
        }
        return modelLL.entries;
    }

    /**
     * Returns the log-likelihood history data for the main model
     * Will throw an error if log-likelihood file for main model was not loaded
     * and if log-likehodd files does not have entries
     * returns data in the format [{x,y}] x is iteration and y is log-likelihood
     */
    Data.getMainLLData = function(){
        if(!has(Data.data, 'mainLL')){
            throw new Error('Data Error: main model log-likelihood was not loaded');
        }
        return getLLData(Data.data.mainLL);
    };

    /**
     * Returns the log-likelihood history data for the sub model
     * Will throw an error if log-likelihood file for sub model was not loaded
     * and if log-likehodd files does not have entries
     * returns data in the format [{x,y}] x is iteration and y is log-likelihood
     */
    Data.getSubLLData = function(){
        if(!has(Data.data, 'subLL')){
            throw new Error('Data Error: sub model log-likelihood was not loaded');
        }
        return getLLData(Data.data.subLL);
    };


    /**
     * Returns the main model metadata
     * will throw an error if main model was not loaded,
     * or if main model does not have metadata
     */
    Data.getMainModelMetadata = function(){
        if(!has(Data.data, 'mainModel')){
            throw new Error('Data Error: mainModel was not loaded');
        }
        if(!has(Data.data.mainModel, 'metadata')){
            throw new Error('Data Error: mainModel does not have metadata');
        }
        return Data.data.mainModel.metadata;
    };

    /**
     * Returns the sub model metadata
     * will throw an error if sub model was not loaded,
     * or if sub model does not have metadata
     */
    Data.getSubModelMetadata = function(){
        if(!has(Data.data, 'subModel')){
            throw new Error('Data Error: subModel was not loaded');
        }
        if(!has(Data.data.subModel, 'metadata')){
            throw new Error('Data Error: subModel does not have metadata');
        }
        return Data.data.subModel.metadata;
    };
}