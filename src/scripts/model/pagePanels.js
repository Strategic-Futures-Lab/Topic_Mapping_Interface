function buildColA(){
    let areas = {
        panel1 : [6, 12],
        panelT : [6, 12]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]);
    let template = `"${templatePanel1}"`;
    return {panelAreas:areas,panelTemplate:template}; 
}

function buildDashA(){
    let areas = {
        panel1 : [12, 12],
        panelT : [12, 12]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]);
    let template = `"${templatePanel1}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildColB(){
    let areas = {
        panel1 : [6, 12],
        panel2 : [6, 12],
        panelT : [12, 24]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]);
    let template = `"${templatePanel1}""${templatePanel2}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildDashBa(){
    let areas = {
        panel1 : [6, 12],
        panel2 : [6, 12],
        panelT : [12, 12]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]);
    let template = `"${templatePanel1}${templatePanel2}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildDashBb(){
    let areas = {
        panel1 : [8, 12],
        panel2 : [4, 12],
        panelT : [12, 12]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]);
    let template = `"${templatePanel1}${templatePanel2}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildColC(){
    let areas = {
        panel1 : [6, 12],
        panel2 : [6, 6],
        panel3 : [6, 6],
        panelT : [6, 24]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]);
    let template = `"${templatePanel1}""${templatePanel2}""${templatePanel3}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildDashCa(){
    let areas = {
        panel1 : [6, 12],
        panel2 : [6, 6],
        panel3 : [6, 6],
        panelT : [12, 12]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]);
    let template = `"${templatePanel1}${templatePanel2}""${templatePanel1}${templatePanel3}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildDashCb(){
    let areas = {
        panel1 : [8, 12],
        panel2 : [4, 6],
        panel3 : [4, 6],
        panelT : [12, 12]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]);
    let template = `"${templatePanel1}${templatePanel2}""${templatePanel1}${templatePanel3}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildColDa(){
    let areas = {
        panel1 : [6, 12],
        panel2 : [6, 6],
        panel3 : [3, 6],
        panel4 : [3, 6],
        panelT : [6, 24]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]);
    let template = `"${templatePanel1}""${templatePanel2}""${templatePanel3}${templatePanel4}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildColDb(){
    let areas = {
        panel1 : [6, 12],
        panel2 : [3, 6],
        panel3 : [3, 6],
        panel4 : [6, 6],
        panelT : [6, 24]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]);
    let template = `"${templatePanel1}""${templatePanel2}${templatePanel3}""${templatePanel4}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildDashDa(){
    let areas = {
        panel1 : [6, 12],
        panel2 : [6, 6],
        panel3 : [3, 6],
        panel4 : [3, 6],
        panelT : [12, 12]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]);
    let template = `"${templatePanel1}${templatePanel2}""${templatePanel1}${templatePanel3}${templatePanel4}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildDashDb(){
    let areas = {
        panel1 : [6, 12],
        panel2 : [3, 6],
        panel3 : [3, 6],
        panel4 : [6, 6],
        panelT : [12, 12]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]);
    let template = `"${templatePanel1}${templatePanel2}${templatePanel3}""${templatePanel1}${templatePanel4}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildColE(){
    let areas = {
        panel1 : [6, 12],
        panel2 : [3, 6],
        panel3 : [3, 6],
        panel4 : [3, 6],
        panel5 : [3, 6],
        panelT : [6, 24]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]),
        templatePanel5 = 'panel5 '.repeat(areas.panel5[0]);
    let template = `"${templatePanel1}""${templatePanel2}${templatePanel3}""${templatePanel4}${templatePanel5}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildDashE(){
    let areas = {
        panel1 : [6, 12],
        panel2 : [3, 6],
        panel3 : [3, 6],
        panel4 : [3, 6],
        panel5 : [3, 6],
        panelT : [12, 12]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]),
        templatePanel5 = 'panel5 '.repeat(areas.panel5[0]);
    let template = `"${templatePanel1}${templatePanel2}${templatePanel3}""${templatePanel1}${templatePanel4}${templatePanel5}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildColFa(){
    let areas = {
        panel1 : [3, 8],
        panel2 : [3, 8],
        panel3 : [3, 8],
        panel4 : [3, 8],
        panel5 : [3, 8],
        panel6 : [3, 8],
        panelT : [6, 24]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]),
        templatePanel5 = 'panel5 '.repeat(areas.panel5[0]),
        templatePanel6 = 'panel6 '.repeat(areas.panel6[0]);
    let template = `"${templatePanel1}${templatePanel2}""${templatePanel3}${templatePanel4}""${templatePanel5}${templatePanel6}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildDashFa(){
    let areas = {
        panel1 : [4, 6],
        panel2 : [4, 6],
        panel3 : [4, 6],
        panel4 : [4, 6],
        panel5 : [4, 6],
        panel6 : [4, 6],
        panelT : [12, 12]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]),
        templatePanel5 = 'panel5 '.repeat(areas.panel5[0]),
        templatePanel6 = 'panel6 '.repeat(areas.panel6[0]);
    let template = `"${templatePanel1}${templatePanel2}${templatePanel3}""${templatePanel4}${templatePanel5}${templatePanel6}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildColFb(){
    let areas = {
        panel1 : [3, 8],
        panel2 : [3, 8],
        panel3 : [3, 8],
        panel4 : [3, 8],
        panel5 : [3, 8],
        panel6 : [3, 8],
        panelT : [6, 24]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]),
        templatePanel5 = 'panel5 '.repeat(areas.panel5[0]),
        templatePanel6 = 'panel6 '.repeat(areas.panel6[0]);
    let template = `"${templatePanel1}${templatePanel2}""${templatePanel3}${templatePanel4}""${templatePanel5}${templatePanel6}"`;
    return {panelAreas:areas,panelTemplate:template};
}

function buildDashFb(){
    let areas = {
        panel1 : [4, 6],
        panel2 : [4, 6],
        panel3 : [4, 6],
        panel4 : [4, 6],
        panel5 : [4, 6],
        panel6 : [4, 6],
        panelT : [12, 12]
    };
    let templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]),
        templatePanel5 = 'panel5 '.repeat(areas.panel5[0]),
        templatePanel6 = 'panel6 '.repeat(areas.panel6[0]);
    let template = `"${templatePanel1}${templatePanel2}${templatePanel5}""${templatePanel3}${templatePanel4}${templatePanel6}"`;
    return {panelAreas:areas,panelTemplate:template};
}


export default function(areas, template, layout, dashboard = true){
    if(layout.length < 1){
        console.error('Panel Layout - Bad Input');
    }
    let {panelAreas, panelTemplate} = layout === 'A' ? (dashboard ? buildDashA() : buildColA()):
        layout === 'Ba' ? (dashboard ? buildDashBa() : buildColB()) :
            layout === 'Bb' ? (dashboard ? buildDashBb() : buildColB()) :
                layout === 'Ca' ? (dashboard ? buildDashCa() : buildColC()) :
                    layout === 'Cb' ? (dashboard ? buildDashCb() : buildColC()) :
                        layout === 'Da' ? (dashboard ? buildDashDa() : buildColDa()) :
                            layout === 'Db' ? (dashboard ? buildDashDb() : buildColDb()) :
                                layout === 'E' ? (dashboard ? buildDashE() : buildColE()) :
                                    layout === 'Fa' ? (dashboard ? buildDashFa() : buildColFa()) :
                                        layout === 'Fb' ? (dashboard ? buildDashFb() : buildColFb()) :
                                            buildDashA();
    for(let[area, size] of Object.entries(panelAreas)){
        areas[area] = size;
    }
    template = template+panelTemplate;
    return {areas, template};
}