
import Controls from './pageControls.js';
import Panels from './pagePanels.js';
import {select as D3Select} from 'd3-selection';

export default function(container='body', layout='A', controls='', selectors={},
    header='', footer='', minWidth=600, minHeight=600){

    function getTotalHeight(baseH){
        let headH = (header==='') ? 0 : D3Select(header).node().offsetHeight,
            footH = (footer==='') ? 0 : D3Select(footer).node().offsetHeight;
        return baseH - headH - footH - 20;
    }

    function getTotaltWidth(baseW){
        return baseW-200;
    }

    function getGrid(w, h, c, t){
        return D3Select(c)
            .style('width', w+'px')
            .style('height', h+'px')
            .style('display', 'grid')
            .style('grid-template-areas', t);
    }

    function getSizes(width, height, selectors, areas, grid){
        const margin = 5,
            topMargin = 5;

        let sizes = {};
        for(let[area, name] of Object.entries(selectors)){
            let h = Math.floor((height*areas[area][1]/areas['total'][1])-(margin*2)),
                w = Math.floor((width*areas[area][0]/areas['total'][0])-(margin*2));
            let s = grid.select(`div${name}`);
            if(s.empty()){
                s = grid.append('div')
                    .attr('id', name.replace('#', ''));
            }
            s.style('grid-area', area)
                .style('height', h+'px')
                .style('margin', margin+'px')
                .style('margin-bottom', ()=>{
                    return `${(area.includes('control')) ? topMargin+margin : margin}px`;
                });
            sizes[area] = {container:name,width:w,height:h};
        }
        return sizes;
    }

    function buildPage(){
        const baseH = Math.max(window.innerHeight, minHeight),
            baseW = Math.max(window.innerWidth, minWidth);
        let totalH = getTotalHeight(baseH),
            totalW = getTotaltWidth(baseW);
        let dashboard = totalW*2/3 >= totalH;
        if(!dashboard && layout!=='A'){
            totalH *= 2;
        }
        let {ctrlAreas, ctrlTemplate} = (controls!=='') ? Controls(controls, dashboard) : {ctrlAreas:{controlT:[0,0]}, ctrlTemplate:''};
        let {areas, template} = Panels(ctrlAreas, ctrlTemplate, layout, dashboard);
        areas['total'] = [dashboard?12:6, areas.controlT[1]+areas.panelT[1]];

        let grid = getGrid(totalW, totalH, container, template);
        
        return  getSizes(totalW, totalH, selectors, areas, grid);
    }

    let sizes = buildPage();

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