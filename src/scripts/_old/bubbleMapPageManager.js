function BubbleMapPageManager(container='body', layoutType='basic', header='#header', footer='#footer'){

    // console.log(layoutType)
    /** TYPES --- LEGACY
     *  full: including buttons, search, sub map
     *  simple: map, wordcloud, table
     *  simpleSearch: simple + search bar
     *  basic: just map
     *  A: search + map + submap + wordcloud + table + trend
     */

    function getTotalHeight(baseH){
        let headH = d3.select(header).node().getBoundingClientRect().height,
            footH = d3.select(footer).node().getBoundingClientRect().height;
        let margin = baseH > 1000 ? 40 : 30;
        return baseH - headH - footH - margin; // -50 to accound for margins etc.
    }

    function getTotaltWidth(baseW){
        let margin = baseW > 1500 ? 150 : 80;
        return baseW - margin;
    }
    let public = {};
    /**
     * From the container, create the areas for the different parts of the application.
     * Will fit the area within the available widht and height of the window
     * Takes the selector values for each area, listed below:
     * const selectors = {
     *   mainBubbleMap : '#mainMap',
     *   subBubbleMap : '#subMap',
     *   wordcloud : '#wordcloud',
     *   table : '#table',
     *   distribButtons : '#distribButtons',
     *   searchBox : '#searchBox'
     * }
     * Returns the computed size of the areas.
     */
    public.buildPage = function(selectors){

        // gets available size on page
        const baseH = window.innerHeight,
            baseW = window.innerWidth;
        let totalHeight = getTotalHeight(baseH),
            totalWidth = getTotaltWidth(baseW);

        if(baseH <= 750 || totalWidth < totalHeight){
            // column scoll layout
            totalHeight = baseH <= 750 ? totalHeight*4 : totalHeight*2 ;
            return layoutType == 'A' ? buildColumnA(totalWidth, totalHeight, selectors) :
                   layoutType == 'B' ? buildColumnB(totalWidth, totalHeight, selectors) :
                   layoutType == 'C' ? buildColumnC(totalWidth, totalHeight, selectors) :
                   layoutType == 'layoutA' ? buildLayoutA(totalWidth, totalHeight, selectors) :
                   layoutType == 'layoutBa' ? buildColumnLayoutBa(totalWidth, totalHeight, selectors) :
                   layoutType == 'layoutBb' ? buildColumnLayoutBb(totalWidth, totalHeight, selectors) :
                   layoutType == 'layoutC' ? buildColumnLayoutC(totalWidth, totalHeight, selectors) :
                   layoutType == 'layoutC_controlA' ? buildColumnLayoutC_ControlA(totalWidth, totalHeight, selectors) :
                   layoutType == 'full' ?  buildFullColumn(totalWidth, totalHeight, selectors) :
                   layoutType == 'simpleSearch' ? buildSimpleSearchColumn(totalWidth, totalHeight, selectors) :
                   layoutType == 'simple' ? buildSimpleColumn(totalWidth, totalHeight, selectors) :
                   buildBasicLayout(totalWidth, totalHeight, selectors);
        } else {
            // grid dashboard layout
            return layoutType == 'A' ? buildDashboardA(totalWidth, totalHeight, selectors) :
                   layoutType == 'B' ? buildDashboardB(totalWidth, totalHeight, selectors) :
                   layoutType == 'C' ? buildDashboardC(totalWidth, totalHeight, selectors) :
                   layoutType == 'layoutA' ? buildLayoutA(totalWidth, totalHeight, selectors) :
                   layoutType == 'layoutBa' ? buildDashboardLayoutBa(totalWidth, totalHeight, selectors) :
                   layoutType == 'layoutBb' ? buildDashboardLayoutBb(totalWidth, totalHeight, selectors) :
                   layoutType == 'layoutC' ? buildDashboardLayoutC(totalWidth, totalHeight, selectors) :
                   layoutType == 'layoutC_controlA' ? buildDashboardLayoutC_ControlA(totalWidth, totalHeight, selectors) :
                   layoutType == 'full' ?  buildFullDashboard(totalWidth, totalHeight, selectors) :
                   layoutType == 'simpleSearch' ? buildSimpleSearchDashboard(totalWidth, totalHeight, selectors) :
                   layoutType == 'simple' ? buildSimpleDashboard(totalWidth, totalHeight, selectors) :
                   buildBasicLayout(totalWidth, totalHeight, selectors);
        }
    }

    function buildLayoutA(totalWidth, totalHeight, selectors){

        // sets grid spaces
        const margin = 5, // space between elements
            topMargin = 0; // space between controls and visualisation

        // sets number of columns and rows per area
        // include total number of columns and rows
        const areas = {
            area1 : [1, 1],
            total : [1, 1]
        }

        // builds area template strings
        const area1 = 'area1 '.repeat(areas.area1[0]);
        
        // generate grid and assign template
        let grid = getGrid(totalWidth, totalHeight, container)
            .style('grid-template-areas', `"${area1}"`)

        // generate and assign areas in grid, returns area computed sizes
        return getSizes(totalWidth, totalHeight, selectors, areas, grid, margin, topMargin);        
    }

    function buildDashboardLayoutBa(totalWidth, totalHeight, selectors){

        // sets grid spaces
        const margin = 5, // space between elements
            topMargin = 0; // space between controls and visualisation

        // sets number of columns and rows per area
        // include total number of columns and rows
        const areas = {
            area1 : [2, 1],
            area2 : [1, 1],
            total : [3, 1]
        }

        // builds area template strings
        const area1 = 'area1 '.repeat(areas.area1[0]),
            area2 = 'area2 '.repeat(areas.area2[0]);
        
        // generate grid and assign template
        let grid = getGrid(totalWidth, totalHeight, container)
            .style('grid-template-areas', `"${area1}${area2}"`)

        // generate and assign areas in grid, returns area computed sizes
        return getSizes(totalWidth, totalHeight, selectors, areas, grid, margin, topMargin);        
    }

    function buildColumnLayoutBa(totalWidth, totalHeight, selectors){

        // sets grid spaces
        const margin = 5, // space between elements
            topMargin = 0; // space between controls and visualisation

        // sets number of columns and rows per area
        // include total number of columns and rows
        const areas = {
            area1 : [1, 2],
            area2 : [1, 1],
            total : [1, 3]
        }

        // builds area template strings
        const area1 = 'area1 '.repeat(areas.area1[0]),
            area2 = 'area2 '.repeat(areas.area2[0]);
        
        // generate grid and assign template
        let grid = getGrid(totalWidth, totalHeight, container)
            .style('grid-template-areas', `"${area1}""${area2}"`)

        // generate and assign areas in grid, returns area computed sizes
        return getSizes(totalWidth, totalHeight, selectors, areas, grid, margin, topMargin);        
    }

    function buildDashboardLayoutBb(totalWidth, totalHeight, selectors){

        // sets grid spaces
        const margin = 5, // space between elements
            topMargin = 0; // space between controls and visualisation

        // sets number of columns and rows per area
        // include total number of columns and rows
        const areas = {
            area1 : [1, 1],
            area2 : [1, 1],
            total : [2, 1]
        }

        // builds area template strings
        const area1 = 'area1 '.repeat(areas.area1[0]),
            area2 = 'area2 '.repeat(areas.area2[0]);
        
        // generate grid and assign template
        let grid = getGrid(totalWidth, totalHeight, container)
            .style('grid-template-areas', `"${area1}${area2}"`)

        // generate and assign areas in grid, returns area computed sizes
        return getSizes(totalWidth, totalHeight, selectors, areas, grid, margin, topMargin);        
    }

    function buildColumnLayoutBb(totalWidth, totalHeight, selectors){

        // sets grid spaces
        const margin = 5, // space between elements
            topMargin = 0; // space between controls and visualisation

        // sets number of columns and rows per area
        // include total number of columns and rows
        const areas = {
            area1 : [1, 1],
            area2 : [1, 1],
            total : [1, 2]
        }

        // builds area template strings
        const area1 = 'area1 '.repeat(areas.area1[0]),
            area2 = 'area2 '.repeat(areas.area2[0]);
        
        // generate grid and assign template
        let grid = getGrid(totalWidth, totalHeight, container)
            .style('grid-template-areas', `"${area1}""${area2}"`)

        // generate and assign areas in grid, returns area computed sizes
        return getSizes(totalWidth, totalHeight, selectors, areas, grid, margin, topMargin);        
    }

    function buildDashboardLayoutC(totalWidth, totalHeight, selectors){

        // sets grid spaces
        const margin = 5, // space between elements
            topMargin = 0; // space between controls and visualisation

        // sets number of columns and rows per area
        // include total number of columns and rows
        const areas = {
            area1 : [1, 2],
            area2 : [1, 1],
            area3 : [1, 1],
            total : [2, 2]
        }

        // builds area template strings
        const area1 = 'area1 '.repeat(areas.area1[0]),
            area2 = 'area2 '.repeat(areas.area2[0]),
            area3 = 'area3 '.repeat(areas.area3[0]);
        
        // generate grid and assign template
        let grid = getGrid(totalWidth, totalHeight, container)
            .style('grid-template-areas', `"${area1}${area2}""${area1}${area3}"`)

        // generate and assign areas in grid, returns area computed sizes
        return getSizes(totalWidth, totalHeight, selectors, areas, grid, margin, topMargin);        
    }

    function buildColumnLayoutC(totalWidth, totalHeight, selectors){

        // sets grid spaces
        const margin = 5, // space between elements
            topMargin = 0; // space between controls and visualisation

        // sets number of columns and rows per area
        // include total number of columns and rows
        const areas = {
            area1 : [1, 2],
            area2 : [1, 1],
            area3 : [1, 1],
            total : [1, 4]
        }

        // builds area template strings
        const area1 = 'area1 '.repeat(areas.area1[0]),
            area2 = 'area2 '.repeat(areas.area2[0]),
            area3 = 'area3 '.repeat(areas.area3[0]);
        
        // generate grid and assign template
        let grid = getGrid(totalWidth, totalHeight, container)
            .style('grid-template-areas', `"${area1}""${area2}""${area3}"`)

        // generate and assign areas in grid, returns area computed sizes
        return getSizes(totalWidth, totalHeight, selectors, areas, grid, margin, topMargin);        
    }

    function buildDashboardLayoutC_ControlA(totalWidth, totalHeight, selectors){

        // sets grid spaces
        const margin = 5, // space between elements
            topMargin = 10; // space between controls and visualisation

        // sets number of columns and rows per area
        // include total number of columns and rows
        const areas = {
            area1 : [2, 14],
            area2 : [2, 7],
            area3 : [2, 7],
            control1: [1, 1],
            total : [4, 15]
        }

        // builds area template strings
        const area1 = 'area1 '.repeat(areas.area1[0]),
            area2 = 'area2 '.repeat(areas.area2[0]),
            area3 = 'area3 '.repeat(areas.area3[0]),
            control1 = 'control1 '.repeat(areas.control1[0]),
            controlSpace = '. '.repeat(areas.total[0]-areas.control1[0]);
        
        // generate grid and assign template
        let grid = getGrid(totalWidth, totalHeight, container)
            .style('grid-template-areas', `"${control1}${controlSpace}""${area1}${area2}""${area1}${area3}"`)

        // generate and assign areas in grid, returns area computed sizes
        return getSizes(totalWidth, totalHeight, selectors, areas, grid, margin, topMargin);        
    }

    function buildColumnLayoutC_ControlA(totalWidth, totalHeight, selectors){

        // sets grid spaces
        const margin = 5, // space between elements
            topMargin = 0; // space between controls and visualisation

        // sets number of columns and rows per area
        // include total number of columns and rows
        const areas = {
            area1 : [4, 16],
            area2 : [4, 8],
            area3 : [4, 8],
            control1 : [2, 1],
            total : [4, 33]
        }

        // builds area template strings
        const area1 = 'area1 '.repeat(areas.area1[0]),
            area2 = 'area2 '.repeat(areas.area2[0]),
            area3 = 'area3 '.repeat(areas.area3[0]),
            control1 = 'control1 '.repeat(areas.control1[0]),
            controlSpace = '. '.repeat((areas.total[0]-areas.control1[0])/2);
        
        // generate grid and assign template
        let grid = getGrid(totalWidth, totalHeight, container)
            .style('grid-template-areas', `"${controlSpace}${control1}${controlSpace}""${area1}""${area2}""${area3}"`)

        // generate and assign areas in grid, returns area computed sizes
        return getSizes(totalWidth, totalHeight, selectors, areas, grid, margin, topMargin);        
    }

    function getGrid(width, height, container){
        return grid = d3.select(container)
            .style('width', width)
            .style('height', height)
            .style('display', 'grid');
    }

    function getSizes(width, height, selectors, areas, grid, margin, topMargin){
        let sizes = {};
        const availWidth = width,
            availHeight = height - topMargin;
        for(let[area, name] of Object.entries(selectors)){
            let h = Math.floor((availHeight*areas[area][1]/areas['total'][1])-(margin*2)),
                w = Math.floor((availWidth*areas[area][0]/areas['total'][0])-(margin*2));
            grid.append('div')
                .attr('id', name.replace('#', ''))
                .style('grid-area', area)
                .style('height', h)
                .style('margin', margin)
                .style('margin-bottom', ()=>{
                    return (area.includes('control')) ? topMargin+margin : margin;
                })
            sizes[area] = {width:w, height:h}
        }
        return sizes;
    }

    /**
     * LEGACY LAYOUTS BELOW
     */

    function buildDashboardC(totalWidth, totalHeight, selectors){

        // sets grid settings: total number of rows and columns
        const nRows = 15,
            nCols = 4,
            marginSize = 5, // space between elements
            topVerMargin = 10; // space between controls and visualisation

        // sets number of columns per area
        const areaCols = {
            mainBubbleMap : 2,
            wordcloud : 1,
            table : 1,
            trend : 2,
            topHorSpace : 3, // space after search box
            searchBox : 1
        }

        // sets number of rows per area
        const areaRows = {
            mainBubbleMap : 14,
            wordcloud : 7,
            table : 7,
            trend : 7,
            searchBox : 1
        }

        // builds area template strings
        const topHorSpace = '. '.repeat(areaCols.topHorSpace),
            searchBoxArea = 'searchBox '.repeat(areaCols.searchBox),
            mainBubbleMapArea = 'mainBubbleMap '.repeat(areaCols.mainBubbleMap),
            wordcloudArea = 'wordcloud '.repeat(areaCols.wordcloud),
            tableArea = 'table '.repeat(areaCols.table),
            trendArea = 'trend '.repeat(areaCols.trend);
        
        // sets container size and grid template
        let top = d3.select(container);
        top.style('width', totalWidth)
            .style('height', totalHeight)
            .style('display', 'grid')
            .style('grid-template-areas', `"${searchBoxArea}${topHorSpace}""${mainBubbleMapArea}${wordcloudArea}${tableArea}""${mainBubbleMapArea}${trendArea}"`)

        let sizes = {};

        // creates new divs per area and sets their width and height
        const availWidth = totalWidth,
            availHeight = totalHeight-topVerMargin;
        for(let [key, value] of Object.entries(selectors)){
            let height = Math.floor(availHeight*areaRows[key]/nRows)-(marginSize*2),
                width = Math.floor(availWidth*areaCols[key]/nCols)-(marginSize*2);
            
            top.append('div')
                .attr('id', value.replace('#',''))
                .style('grid-area', key)
                .style('height', height)
                .style('margin', marginSize)
                .style('margin-bottom', ()=>{
                    return (key === 'distribButtons' || key === 'searchBox') ? topVerMargin+marginSize : marginSize;
                });

            sizes[key] = {width, height};
        }

        // return the computed sizes
        return sizes
        
    }

    function buildColumnC(totalWidth, totalHeight, selectors){

        // sets grid settings: total number of rows and columns
        const nRows = 33,
            nCols = 4,
            marginSize = 5, // space between elements
            topVerMargin = 10; // space between controls and visualisation

        // sets number of columns per area
        const areaCols = {
            mainBubbleMap : 4,
            wordcloud : 2,
            table : 2,
            trend : 4,
            topHorSpace : 1, // space around search box
            searchBox : 2
        }

        // sets number of rows per area
        const areaRows = {
            mainBubbleMap : 16,
            wordcloud : 8,
            table : 8,
            trend : 8,
            searchBox : 1
        }

        // builds area template strings
        const topHorSpace = '. '.repeat(areaCols.topHorSpace),
            searchBoxArea = 'searchBox '.repeat(areaCols.searchBox),
            mainBubbleMapArea = 'mainBubbleMap '.repeat(areaCols.mainBubbleMap),
            wordcloudArea = 'wordcloud '.repeat(areaCols.wordcloud),
            tableArea = 'table '.repeat(areaCols.table),
            trendArea = 'trend '.repeat(areaCols.trend);
        
        // sets container size and grid template
        let top = d3.select(container);
        top.style('width', totalWidth)
            .style('height', totalHeight)
            .style('display', 'grid')
            .style('grid-template-areas', `"${topHorSpace}${searchBoxArea}${topHorSpace}""${mainBubbleMapArea}""${wordcloudArea}${tableArea}""${trendArea}"`)

        let sizes = {};

        // creates new divs per area and sets their width and height
        const availWidth = totalWidth,
            availHeight = totalHeight-topVerMargin;
        for(let [key, value] of Object.entries(selectors)){
            let height = Math.floor(availHeight*areaRows[key]/nRows)-(marginSize*2),
                width = Math.floor(availWidth*areaCols[key]/nCols)-(marginSize*2);
            
            top.append('div')
                .attr('id', value.replace('#',''))
                .style('grid-area', key)
                .style('height', height)
                .style('margin', marginSize)
                .style('margin-bottom', ()=>{
                    return (key === 'distribButtons' || key === 'searchBox') ? topVerMargin+marginSize : marginSize;
                });

            sizes[key] = {width, height};
        }

        // return the computed sizes
        return sizes
        
    }

    function buildDashboardB(totalWidth, totalHeight, selectors){

        // sets grid settings: total number of rows and columns
        const nRows = 15,
            nCols = 4,
            marginSize = 5, // space between elements
            topVerMargin = 10; // space between controls and visualisation

        // sets number of columns per area
        const areaCols = {
            mainBubbleMap : 2,
            wordcloud : 1,
            table : 2,
            trend : 1,
            topHorSpace : 3, // space after search box
            searchBox : 1
        }

        // sets number of rows per area
        const areaRows = {
            mainBubbleMap : 14,
            wordcloud : 7,
            table : 7,
            trend : 7,
            searchBox : 1
        }

        // builds area template strings
        const topHorSpace = '. '.repeat(areaCols.topHorSpace),
            searchBoxArea = 'searchBox '.repeat(areaCols.searchBox),
            mainBubbleMapArea = 'mainBubbleMap '.repeat(areaCols.mainBubbleMap),
            wordcloudArea = 'wordcloud '.repeat(areaCols.wordcloud),
            tableArea = 'table '.repeat(areaCols.table),
            trendArea = 'trend '.repeat(areaCols.trend);
        
        // sets container size and grid template
        let top = d3.select(container);
        top.style('width', totalWidth)
            .style('height', totalHeight)
            .style('display', 'grid')
            .style('grid-template-areas', `"${searchBoxArea}${topHorSpace}""${mainBubbleMapArea}${wordcloudArea}${trendArea}""${mainBubbleMapArea}${tableArea}"`)

        let sizes = {};

        // creates new divs per area and sets their width and height
        const availWidth = totalWidth,
            availHeight = totalHeight-topVerMargin;
        for(let [key, value] of Object.entries(selectors)){
            let height = Math.floor(availHeight*areaRows[key]/nRows)-(marginSize*2),
                width = Math.floor(availWidth*areaCols[key]/nCols)-(marginSize*2);
            
            top.append('div')
                .attr('id', value.replace('#',''))
                .style('grid-area', key)
                .style('height', height)
                .style('margin', marginSize)
                .style('margin-bottom', ()=>{
                    return (key === 'distribButtons' || key === 'searchBox') ? topVerMargin+marginSize : marginSize;
                });

            sizes[key] = {width, height};
        }

        // return the computed sizes
        return sizes
        
    }

    function buildColumnB(totalWidth, totalHeight, selectors){

        // sets grid settings: total number of rows and columns
        const nRows = 33,
            nCols = 4,
            marginSize = 5, // space between elements
            topVerMargin = 10; // space between controls and visualisation

        // sets number of columns per area
        const areaCols = {
            mainBubbleMap : 4,
            wordcloud : 2,
            table : 4,
            trend : 2,
            topHorSpace : 1, // space around search box
            searchBox : 2
        }

        // sets number of rows per area
        const areaRows = {
            mainBubbleMap : 16,
            wordcloud : 8,
            table : 8,
            trend : 8,
            searchBox : 1
        }

        // builds area template strings
        const topHorSpace = '. '.repeat(areaCols.topHorSpace),
            searchBoxArea = 'searchBox '.repeat(areaCols.searchBox),
            mainBubbleMapArea = 'mainBubbleMap '.repeat(areaCols.mainBubbleMap),
            wordcloudArea = 'wordcloud '.repeat(areaCols.wordcloud),
            tableArea = 'table '.repeat(areaCols.table),
            trendArea = 'trend '.repeat(areaCols.trend);
        
        // sets container size and grid template
        let top = d3.select(container);
        top.style('width', totalWidth)
            .style('height', totalHeight)
            .style('display', 'grid')
            .style('grid-template-areas', `"${topHorSpace}${searchBoxArea}${topHorSpace}""${mainBubbleMapArea}""${wordcloudArea}${trendArea}""${tableArea}"`)

        let sizes = {};

        // creates new divs per area and sets their width and height
        const availWidth = totalWidth,
            availHeight = totalHeight-topVerMargin;
        for(let [key, value] of Object.entries(selectors)){
            let height = Math.floor(availHeight*areaRows[key]/nRows)-(marginSize*2),
                width = Math.floor(availWidth*areaCols[key]/nCols)-(marginSize*2);
            
            top.append('div')
                .attr('id', value.replace('#',''))
                .style('grid-area', key)
                .style('height', height)
                .style('margin', marginSize)
                .style('margin-bottom', ()=>{
                    return (key === 'distribButtons' || key === 'searchBox') ? topVerMargin+marginSize : marginSize;
                });

            sizes[key] = {width, height};
        }

        // return the computed sizes
        return sizes
        
    }

    function buildDashboardA(totalWidth, totalHeight, selectors){

        // sets grid settings: total number of rows and columns
        const nRows = 15,
            nCols = 24,
            marginSize = 5, // space between elements
            topVerMargin = 10; // space between controls and visualisation

        // sets number of columns per area
        const areaCols = {
            mainBubbleMap : 12,
            subBubbleMap : 6,
            wordcloud : 6,
            table : 6,
            trend : 6,
            topHorSpace : 18, // space between buttons and search box
            searchBox : 6
        }

        // builds area template strings
        const topHorSpace = '. '.repeat(areaCols.topHorSpace),
            searchBoxArea = 'searchBox '.repeat(areaCols.searchBox),
            mainBubbleMapArea = 'mainBubbleMap '.repeat(areaCols.mainBubbleMap),
            subBubbleMapArea = 'subBubbleMap '.repeat(areaCols.subBubbleMap),
            wordcloudArea = 'wordcloud '.repeat(areaCols.wordcloud),
            tableArea = 'table '.repeat(areaCols.table),
            trendArea = 'trend '.repeat(areaCols.trend);

        // sets container size and grid template
        let top = d3.select(container);
        top.style('width', totalWidth)
            .style('height', totalHeight)
            .style('display', 'grid')
            .style('grid-template-areas', `"${searchBoxArea}${topHorSpace}""${mainBubbleMapArea}${subBubbleMapArea}${wordcloudArea}""${mainBubbleMapArea}${trendArea}${tableArea}"`)
        
        let sizes = {};

        // creates new divs per area and sets their width and height
        const availWidth = totalWidth,
            availHeight = totalHeight-topVerMargin;
        for(let [key, value] of Object.entries(selectors)){
            let height = (key === 'distribButtons' || key === 'searchBox') ? availHeight/nRows :
                         (key === 'mainBubbleMap') ? availHeight/nRows*(nRows-1) :
                         availHeight/nRows*((nRows-1)/2);
            height = Math.floor(height)-(marginSize*2);
            
            let width = Math.floor(availWidth*areaCols[key]/nCols)-(marginSize*2);
            
            top.append('div')
                .attr('id', value.replace('#',''))
                .style('grid-area', key)
                .style('height', height)
                .style('margin', marginSize)
                .style('margin-bottom', ()=>{
                    return (key === 'distribButtons' || key === 'searchBox') ? topVerMargin+marginSize : marginSize;
                });

            sizes[key] = {width, height};
        }

        // return the computed sizes
        return sizes
    }

    function buildColumnA(totalWidth, totalHeight, selectors){
        
        // sets grid settings: total number of rows and columns
        const nRows = 35,
            nCols = 4,
            marginSize = 5,
            topVerMargin = 5; // space between controls and visualisation

        // sets number of columns per area
        const areaCols = {
            mainBubbleMap : 4,
            subBubbleMap : 2,
            wordcloud : 2,
            table : 2,
            trend : 2,
            topHorSpace : 1, // space around search box
            searchBox : 2
        }

        // builds area template strings
        const topHorSpace = '. '.repeat(areaCols.topHorSpace),
            searchBoxArea = 'searchBox '.repeat(areaCols.searchBox),
            mainBubbleMapArea = 'mainBubbleMap '.repeat(areaCols.mainBubbleMap),
            subBubbleMapArea = 'subBubbleMap '.repeat(areaCols.subBubbleMap),
            wordcloudArea = 'wordcloud '.repeat(areaCols.wordcloud),
            tableArea = 'table '.repeat(areaCols.table),
            trendArea = 'trend '.repeat(areaCols.trend);

        // sets container size and grid template
        let top = d3.select(container);
        top.style('width', totalWidth)
            .style('height', totalHeight)
            .style('display', 'grid')
            .style('grid-template-areas', `"${topHorSpace}${searchBoxArea}${topHorSpace}""${mainBubbleMapArea}""${subBubbleMapArea}${wordcloudArea}""${trendArea}${tableArea}"`)
        
        let sizes = {};

        // creates new divs per area and sets their width and height
        const availWidth = totalWidth,
            availHeight = totalHeight-topVerMargin;
        for(let [key, value] of Object.entries(selectors)){
            let height = (key === 'searchBox') ? availHeight/nRows :
                         (key === 'mainBubbleMap') ? availHeight/nRows*(nRows-1)/2 :
                         availHeight/nRows*((nRows-1)/4);
            height = Math.floor(height)-(marginSize*2);
            
            let width = Math.floor(availWidth*areaCols[key]/nCols)-(marginSize*2);
            
            top.append('div')
                .attr('id', value.replace('#',''))
                .style('grid-area', key)
                .style('height', height)
                .style('margin', marginSize)
                .style('margin-bottom', ()=>{
                    return (key === 'distribButtons' || key === 'searchBox') ? topVerMargin+marginSize : marginSize;
                });

            sizes[key] = {width, height};
        }

        // return the computed sizes
        return sizes
    }

    function buildFullDashboard(totalWidth, totalHeight, selectors){
        
        // sets grid settings: total number of rows and columns
        const nRows = 15,
            nCols = 24,
            marginSize = 5,
            topVerMargin = 10; // space between controls and visualisation

        // sets number of columns per area
        const areaCols = {
            mainBubbleMap : 12,
            subBubbleMap : 6,
            wordcloud : 6,
            table : 12,
            distribButtons : 19,
            topHorSpace : 1, // space between buttons and search box
            searchBox : 4
        }

        // builds area template strings
        const distribButtonsArea = 'distribButtons '.repeat(areaCols.distribButtons),
            topHorSpace = '. '.repeat(areaCols.topHorSpace),
            searchBoxArea = 'searchBox '.repeat(areaCols.searchBox),
            mainBubbleMapArea = 'mainBubbleMap '.repeat(areaCols.mainBubbleMap),
            subBubbleMapArea = 'subBubbleMap '.repeat(areaCols.subBubbleMap),
            wordcloudArea = 'wordcloud '.repeat(areaCols.wordcloud),
            tableArea = 'table '.repeat(areaCols.table);

        // sets container size and grid template
        let top = d3.select(container);
        top.style('width', totalWidth)
            .style('height', totalHeight)
            .style('display', 'grid')
            .style('grid-template-areas', `"${distribButtonsArea}${topHorSpace}${searchBoxArea}""${mainBubbleMapArea}${subBubbleMapArea}${wordcloudArea}""${mainBubbleMapArea}${tableArea}"`)
        
        let sizes = {};

        // creates new divs per area and sets their width and height
        const availWidth = totalWidth,
            availHeight = totalHeight-topVerMargin;
        for(let [key, value] of Object.entries(selectors)){
            let height = (key === 'distribButtons' || key === 'searchBox') ? availHeight/nRows :
                         (key === 'mainBubbleMap') ? availHeight/nRows*(nRows-1) :
                         availHeight/nRows*((nRows-1)/2);
            height = Math.floor(height)-(marginSize*2);
            
            let width = Math.floor(availWidth*areaCols[key]/nCols)-(marginSize*2);
            
            top.append('div')
                .attr('id', value.replace('#',''))
                .style('grid-area', key)
                .style('height', height)
                .style('margin', marginSize)
                .style('margin-bottom', ()=>{
                    return (key === 'distribButtons' || key === 'searchBox') ? topVerMargin+marginSize : marginSize;
                });

            sizes[key] = {width, height};
        }

        // return the computed sizes
        return sizes
    }

    function buildSimpleSearchDashboard(totalWidth, totalHeight, selectors){
        
        // sets grid settings: total number of rows and columns
        const nRows = 15,
            nCols = 24,
            marginSize = 5,
            topVerMargin = 10; // space between controls and visualisation

        // sets number of columns per area
        const areaCols = {
            mainBubbleMap : 12,
            wordcloud : 12,
            table : 12,
            topHorSpace : 18, // space after search bar
            searchBox : 6
        }

        // builds area template strings
        const topHorSpace = '. '.repeat(areaCols.topHorSpace),
            searchBoxArea = 'searchBox '.repeat(areaCols.searchBox),
            mainBubbleMapArea = 'mainBubbleMap '.repeat(areaCols.mainBubbleMap),
            wordcloudArea = 'wordcloud '.repeat(areaCols.wordcloud),
            tableArea = 'table '.repeat(areaCols.table);

        // sets container size and grid template
        let top = d3.select(container);
        top.style('width', totalWidth)
            .style('height', totalHeight)
            .style('display', 'grid')
            .style('grid-template-areas', `"${searchBoxArea}${topHorSpace}""${mainBubbleMapArea}${wordcloudArea}""${mainBubbleMapArea}${tableArea}"`)
        
        let sizes = {};

        // creates new divs per area and sets their width and height
        const availWidth = totalWidth,
            availHeight = totalHeight-topVerMargin;
        for(let [key, value] of Object.entries(selectors)){
            let height = (key === 'searchBox') ? availHeight/nRows :
                         (key === 'mainBubbleMap') ? availHeight/nRows*(nRows-1) :
                         availHeight/nRows*((nRows-1)/2);
            height = Math.floor(height)-(marginSize*2);
            
            let width = Math.floor(availWidth*areaCols[key]/nCols)-(marginSize*2);
            
            top.append('div')
                .attr('id', value.replace('#',''))
                .style('grid-area', key)
                .style('height', height)
                .style('margin', marginSize)
                .style('margin-bottom', ()=>{
                    return (key === 'searchBox') ? topVerMargin+marginSize : marginSize;
                });

            sizes[key] = {width, height};
        }

        // return the computed sizes
        return sizes
    }

    function buildSimpleDashboard(totalWidth, totalHeight, selectors){
        
        // sets grid settings: total number of rows and columns
        const nRows = 14,
            nCols = 24,
            marginSize = 5,
            topVerMargin = 0; // space between controls and visualisation

        // sets number of columns per area
        const areaCols = {
            mainBubbleMap : 12,
            wordcloud : 12,
            table : 12,
        }

        // builds area template strings
        const mainBubbleMapArea = 'mainBubbleMap '.repeat(areaCols.mainBubbleMap),
            wordcloudArea = 'wordcloud '.repeat(areaCols.wordcloud),
            tableArea = 'table '.repeat(areaCols.table);

        // sets container size and grid template
        let top = d3.select(container);
        top.style('width', totalWidth)
            .style('height', totalHeight)
            .style('display', 'grid')
            .style('grid-template-areas', `"${mainBubbleMapArea}${wordcloudArea}""${mainBubbleMapArea}${tableArea}"`)
        
        let sizes = {};

        // creates new divs per area and sets their width and height
        const availWidth = totalWidth,
            availHeight = totalHeight-topVerMargin;
        for(let [key, value] of Object.entries(selectors)){
            let height = (key === 'mainBubbleMap') ? availHeight :
                         availHeight/2;
            height = Math.floor(height)-(marginSize*2);
            
            let width = Math.floor(availWidth*areaCols[key]/nCols)-(marginSize*2);
            
            top.append('div')
                .attr('id', value.replace('#',''))
                .style('grid-area', key)
                .style('height', height)
                .style('margin', marginSize);

            sizes[key] = {width, height};
        }

        // return the computed sizes
        return sizes
    }

    function buildBasicLayout(totalWidth, totalHeight, selectors){
        
        // sets grid settings: total number of rows and columns
        const nRows = 1,
            nCols = 1,
            marginSize = 5,
            topVerMargin = 0; // space between controls and visualisation

        // sets number of columns per area
        const areaCols = {
            mainBubbleMap : 1
        }

        // builds area template strings
        const mainBubbleMapArea = 'mainBubbleMap '.repeat(areaCols.mainBubbleMap);

        // sets container size and grid template
        let top = d3.select(container);
        top.style('width', totalWidth)
            .style('height', totalHeight)
            .style('display', 'grid')
            .style('grid-template-areas', `"${mainBubbleMapArea}"`)
        
        let sizes = {};

        // creates new divs per area and sets their width and height
        const availWidth = totalWidth,
            availHeight = totalHeight-topVerMargin;
        for(let [key, value] of Object.entries(selectors)){
            let height = Math.floor(availHeight)-(marginSize*2);
            
            let width = Math.floor(availWidth)-(marginSize*2);
            
            top.append('div')
                .attr('id', value.replace('#',''))
                .style('grid-area', key)
                .style('height', height)
                .style('margin', marginSize);

            sizes[key] = {width, height};
        }

        // return the computed sizes
        return sizes
    }

    function buildFullColumn(totalWidth, totalHeight, selectors){
        
        // sets grid settings: total number of rows and columns
        const nRows = 35,
            nCols = 4,
            marginSize = 5,
            topVerMargin = 5; // space between controls and visualisation

        // sets number of columns per area
        const areaCols = {
            mainBubbleMap : 4,
            subBubbleMap : 2,
            wordcloud : 2,
            table : 4,
            distribButtons : 4,
            topHorSpace : 1, // space around search box
            searchBox : 2
        }

        // builds area template strings
        const distribButtonsArea = 'distribButtons '.repeat(areaCols.distribButtons),
            topHorSpace = '. '.repeat(areaCols.topHorSpace),
            searchBoxArea = 'searchBox '.repeat(areaCols.searchBox),
            mainBubbleMapArea = 'mainBubbleMap '.repeat(areaCols.mainBubbleMap),
            subBubbleMapArea = 'subBubbleMap '.repeat(areaCols.subBubbleMap),
            wordcloudArea = 'wordcloud '.repeat(areaCols.wordcloud),
            tableArea = 'table '.repeat(areaCols.table);

        // sets container size and grid template
        let top = d3.select(container);
        top.style('width', totalWidth)
            .style('height', totalHeight)
            .style('display', 'grid')
            .style('grid-template-areas', `"${topHorSpace}${searchBoxArea}${topHorSpace}""${distribButtonsArea}""${mainBubbleMapArea}""${subBubbleMapArea}${wordcloudArea}""${tableArea}"`)
        
        let sizes = {};

        // creates new divs per area and sets their width and height
        const availWidth = totalWidth,
            availHeight = totalHeight-topVerMargin;
        for(let [key, value] of Object.entries(selectors)){
            let height = (key === 'searchBox') ? availHeight/nRows :
                         (key === 'distribButtons') ? (availHeight/nRows)*2 :
                         (key === 'mainBubbleMap') ? availHeight/nRows*(nRows-3)/2 :
                         availHeight/nRows*((nRows-3)/4);
            height = Math.floor(height)-(marginSize*2);
            
            let width = Math.floor(availWidth*areaCols[key]/nCols)-(marginSize*2);
            
            top.append('div')
                .attr('id', value.replace('#',''))
                .style('grid-area', key)
                .style('height', height)
                .style('margin', marginSize)
                .style('margin-bottom', ()=>{
                    return (key === 'distribButtons' || key === 'searchBox') ? topVerMargin+marginSize : marginSize;
                });

            sizes[key] = {width, height};
        }

        // return the computed sizes
        return sizes
    }

    function buildSimpleSearchColumn(totalWidth, totalHeight, selectors){
        
        // sets grid settings: total number of rows and columns
        const nRows = 35,
            nCols = 4,
            marginSize = 5,
            topVerMargin = 5; // space between controls and visualisation

        // sets number of columns per area
        const areaCols = {
            mainBubbleMap : 4,
            wordcloud : 4,
            table : 4,
            topHorSpace : 1, // space around search box
            searchBox : 2
        }

        // builds area template strings
        const topHorSpace = '. '.repeat(areaCols.topHorSpace),
            searchBoxArea = 'searchBox '.repeat(areaCols.searchBox),
            mainBubbleMapArea = 'mainBubbleMap '.repeat(areaCols.mainBubbleMap),
            wordcloudArea = 'wordcloud '.repeat(areaCols.wordcloud),
            tableArea = 'table '.repeat(areaCols.table);

        // sets container size and grid template
        let top = d3.select(container);
        top.style('width', totalWidth)
            .style('height', totalHeight)
            .style('display', 'grid')
            .style('grid-template-areas', `"${topHorSpace}${searchBoxArea}${topHorSpace}""${mainBubbleMapArea}""${wordcloudArea}""${tableArea}"`)
        
        let sizes = {};

        // creates new divs per area and sets their width and height
        const availWidth = totalWidth,
            availHeight = totalHeight-topVerMargin;
        for(let [key, value] of Object.entries(selectors)){
            let height = (key === 'searchBox') ? availHeight/nRows :
                         (key === 'mainBubbleMap') ? availHeight/nRows*(nRows-3)/2 :
                         availHeight/nRows*((nRows-3)/4);
            height = Math.floor(height)-(marginSize*2);
            
            let width = Math.floor(availWidth*areaCols[key]/nCols)-(marginSize*2);
            
            top.append('div')
                .attr('id', value.replace('#',''))
                .style('grid-area', key)
                .style('height', height)
                .style('margin', marginSize)
                .style('margin-bottom', ()=>{
                    return (key === 'searchBox') ? topVerMargin+marginSize : marginSize;
                });

            sizes[key] = {width, height};
        }

        // return the computed sizes
        return sizes
    }

    function buildSimpleColumn(totalWidth, totalHeight, selectors){
        
        // sets grid settings: total number of rows and columns
        const nRows = 34,
            nCols = 4,
            marginSize = 5,
            topVerMargin = 0; // space between controls and visualisation

        // sets number of columns per area
        const areaCols = {
            mainBubbleMap : 4,
            wordcloud : 4,
            table : 4
        }

        // builds area template strings
        const mainBubbleMapArea = 'mainBubbleMap '.repeat(areaCols.mainBubbleMap),
            wordcloudArea = 'wordcloud '.repeat(areaCols.wordcloud),
            tableArea = 'table '.repeat(areaCols.table);

        // sets container size and grid template
        let top = d3.select(container);
        top.style('width', totalWidth)
            .style('height', totalHeight)
            .style('display', 'grid')
            .style('grid-template-areas', `"${mainBubbleMapArea}""${wordcloudArea}""${tableArea}"`)
        
        let sizes = {};

        // creates new divs per area and sets their width and height
        const availWidth = totalWidth,
            availHeight = totalHeight-topVerMargin;
        for(let [key, value] of Object.entries(selectors)){
            let height = (key === 'mainBubbleMap') ? availHeight/2 :
                         availHeight/4;
            height = Math.floor(height)-(marginSize*2);
            
            let width = Math.floor(availWidth*areaCols[key]/nCols)-(marginSize*2);
            
            top.append('div')
                .attr('id', value.replace('#',''))
                .style('grid-area', key)
                .style('height', height)
                .style('margin', marginSize);

            sizes[key] = {width, height};
        }

        // return the computed sizes
        return sizes
    }

    return public;
}