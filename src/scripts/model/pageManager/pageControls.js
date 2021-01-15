
function getControls(nCtrl, colSizes, align, dashboard=true){

    let sum = (a,b)=>a+b;
    // set default column sizes if no defined
    if(colSizes.length == 0){
        for(let i=0;i<nCtrl;i++){colSizes.push(3);}
    }
    // get total number of columns needed and estimate available grid (dashboard:[12,1], column:[6,2])
    let sumCols = colSizes.reduce(sum, 0),
        nCols = dashboard ? 12 : 6,
        nRows = sumCols <= nCols ? 1 : 2;
    // set up area names and column sizes, if cumul size exceed available columns, add a new row
    let rows = [];
    let cumulCols = 0;
    let row = {};
    for(let i=0; i<nCtrl; i++){
        if(cumulCols+colSizes[i] > nCols){
            rows.push({...row});
            row = {};
            cumulCols = 0;
        }
        row[`control${i+1}`] = [colSizes[i], 1];
        cumulCols += colSizes[i];
    }
    rows.push({...row});
    // create the area strings for the grid template
    let areaStrings = rows.map(r=>Object.entries(r).map(([area,size])=>(area+' ').repeat(size[0])));
    // for each row, build the grid template
    let template = [];
    for(let i=0; i<rows.length; i++){
        let rowTemplate = '';
        // get row size in total
        let rowLength = Object.values(rows[i]).map(s=>s[0]).reduce(sum, 0);
        // get space left in row
        let space = nCols-rowLength;
        let a = align;
        if(areaStrings[i].length == 1 && align == 'b'){
            a = 'r';
        } else if(areaStrings[i].length == 1 && align == 'a') {
            a = 'c';
        }
        if(a === 'l'){
            // left align: join all areas and add spaces at the end
            rowTemplate = areaStrings[i].join('')+'. '.repeat(space);
        } else if(a === 'r'){
            // right align: add spaces and join all areas afterwards
            rowTemplate = '. '.repeat(space)+areaStrings[i].join('');
        } else if(a === 'c'){
            // centre align: add half the spaces, join all areas, add other half of spaces + extra if any
            let spaces = Math.floor(space/2);
            let extra = space%2;
            rowTemplate = '. '.repeat(spaces)+areaStrings[i].join('')+'. '.repeat(spaces)+'. '.repeat(extra);
        } else if(a === 'b'){
            // space between align: join areas strings + in between space, then add any extra
            let spaces = Math.floor(space/(areaStrings[i].length-1));
            let extra = space%(areaStrings[i].length-1);
            rowTemplate = areaStrings[i].join('. '.repeat(spaces))+'. '.repeat(extra);
        } else if(a === 'a'){
            // space around align: set initial space, join areas strings + in between space, add remaining space + extra if any
            let spaces = Math.floor(space/(areaStrings[i].length+1));
            let extra = space%(areaStrings[i].length+1);
            rowTemplate = '. '.repeat(spaces)+areaStrings[i].join('. '.repeat(spaces))+'. '.repeat(spaces)+'. '.repeat(extra);
        }
        template.push(rowTemplate);
    }
    let areas = {};
    rows.forEach(r=>{
        Object.entries(r).forEach(([a,s])=>{
            areas[a] = s;
        });
    });
    areas['controlT'] = [nCols, nRows];
    return {ctrlAreas: areas, ctrlTemplate: template.map(r=>`"${r}"`).join('')};
}

function checkAlign(a){
    let values = ['a', 'b', 'c', 'l', 'r'];
    if(values.includes(a)){
        return a;
    } else {
        console.log('Control Layout - Bad Alignment - Default to \'left\'');
        return 'l';
    }
}

function checkColSizes(c){
    if(c.some(isNaN) || c.some(s=>s.length<1)){
        console.error('Control Layout - Bad Column Size');
        return [];
    } else {
        return c.map(s=>Math.min(parseInt(s),6));
    }
}

export default function(controls, dashboard=true){

    let [nCtrl, ...rest] = controls.split('-');

    if(isNaN(nCtrl) || nCtrl.length<1){
        console.error('Control Layout - Bad Input');
        return {controls: [], controlTemplate: ''};
    } else {
        nCtrl = parseInt(nCtrl);
        let sizes, align;
        if(nCtrl > rest.length || nCtrl > 4){
            console.error('Control Layout - Bad Input');
            return {controls: [], controlTemplate: ''};
        } else if(nCtrl == rest.length){
            sizes = checkColSizes(rest);
            align = 'l';
        } else {
            align = checkAlign(rest.pop());
            sizes = checkColSizes(rest).slice(0,nCtrl);
        }
        if(sizes.reduce((a,b)=>a+b,0) > 12){
            console.error('Control Layout - Bad Input');
            return {controls: [], controlTemplate: ''};
        }
        return getControls(nCtrl, sizes, align, dashboard);
    }
}