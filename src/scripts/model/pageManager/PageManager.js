
import Controls from './pageControls.js';
import Panels from './pagePanels.js';
import {select as D3Select} from 'd3-selection';

export default function(container='body', layout='A', controls='',
    header='', footer='', minWidth=600, minHeight=600){

    // Margin constants
    const heightMargin = 20, // sapce to remove when computing the available height
        widthMargin = 200, // sapce to remove when computing the available width
        panelMargin = 5, // space between panels
        controlMargin = 5; // space to put below controls

    /**
     * Computes the available height
     */
    function getTotalHeight(baseH){
        let headH = (header==='') ? 0 : D3Select(header).node().offsetHeight,
            footH = (footer==='') ? 0 : D3Select(footer).node().offsetHeight;
        return baseH - headH - footH - heightMargin;
    }

    /**
     * Computes the available width
     */
    function getTotaltWidth(baseW){
        return baseW-widthMargin;
    }

    /**
     * Sizes container and applies grdi layout
     */
    function getGrid(w, h, c, t){
        return D3Select(c)
            .style('width', w+'px')
            .style('height', h+'px')
            .style('display', 'grid')
            .style('grid-template-areas', t);
    }

    /**
     * Creates and sizes the container for each control and panels
     */
    function getSizes(width, height, areas, grid){
        let sizes = {};
        // for every areas (excluding the totals)
        for(let area of Object.keys(areas)){
            if(area !== 'total' && !area.endsWith('T')){
                // compute the size
                let h = Math.floor((height*areas[area][1]/areas['total'][1])-(panelMargin*2)),
                    w = Math.floor((width*areas[area][0]/areas['total'][0])-(panelMargin*2));
                // generate a container
                let c = `div#${area}`;
                let s = grid.select(c);
                if(s.empty()){
                    s = grid.append('div')
                        .attr('id', area);
                }
                // assign grid area to container and size it
                s.style('grid-area', area)
                    .style('height', h+'px')
                    .style('margin', panelMargin+'px')
                    .style('margin-bottom', ()=>{
                        return `${(area.includes('control')) ? controlMargin+panelMargin : panelMargin}px`;
                    });
                // register the container and its size
                sizes[area] = {c,w,h};
            }
        }
        return sizes;
    }

    function buildPage(){
        // get the base dimension for the page
        const baseH = Math.max(window.innerHeight, minHeight),
            baseW = Math.max(window.innerWidth, minWidth);
        // estimate the available space
        let totalH = getTotalHeight(baseH),
            totalW = getTotaltWidth(baseW);
        // check if needs to be in column or dashboard format
        let dashboard = totalW*2/3 >= totalH;
        // adjust available height if column format
        if(!dashboard && layout!=='A'){
            totalH *= 2;
        }
        // make the controls areas and template
        let {ctrlAreas, ctrlTemplate} = (controls!=='') ? Controls(controls, dashboard) : {ctrlAreas:{controlT:[0,0]}, ctrlTemplate:''};
        // complete with panels areas and template
        let {areas, template} = Panels(ctrlAreas, ctrlTemplate, layout, dashboard);
        // get total area size
        areas['total'] = [dashboard?12:6, areas.controlT[1]+areas.panelT[1]];
        // size container and apply grid layout
        let grid = getGrid(totalW, totalH, container, template);
        // generate grid areas, size them, and return
        return  getSizes(totalW, totalH, areas, grid);
    }

    // get the controls and panels
    let sizes = buildPage();

    // watch function to auto-resize modules
    sizes.watch = function(modules){
        window.onresize = ()=>{
            let s = buildPage();
            for(let [area, module] of Object.entries(modules)){
                if('setSize' in module){
                    module.setSize(s[area].width, s[area].height);
                } else {
                    console.log(`${area} missing setSize()`);
                }
            }
        };
    };

    return sizes;
}