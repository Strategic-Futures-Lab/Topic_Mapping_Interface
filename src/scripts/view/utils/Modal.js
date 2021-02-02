import {select as D3Select} from 'd3-selection';
import has from 'lodash-es/has';

import '../../../styles/utils/modal.less';

export default function(container='body', actDetails=[]){

    let Modal = {};

    // private

    let modalOpened = false,
        backClick = false;

    // [{name,disabled,action,class}]
    let actionsDetails = actDetails;

    let modalBack = D3Select(container).append('div')
        .classed('modalBack', true)
        .on('click', ()=>{Modal.toggleModal(false);});
    let modal = modalBack.append('div')
        .classed('modal', true)
        .on('click', e=>{e.stopPropagation();});
    let modalHeader = modal.append('div')
        .classed('modalHeader', true);
    let title = modalHeader.append('h1')
        .classed('modalTitle', true);
    let modalBody = modal.append('div')
        .classed('modalBody', true);
    let modalFooter = modal.append('div')
        .classed('modalFooter', true);
    let actionButtons = modalFooter.selectAll('button.modalAction');

    function updateActions(){
        actionButtons = modalFooter.selectAll('button.modalAction')
            .data(actionsDetails, d=>d.name);
        actionButtons.exit().remove();
        actionButtons.enter().append('button')
            .classed('modalAction', true);
        actionButtons = modalFooter.selectAll('button.modalAction');
        actionButtons.text(d=>d.name)
            .on('click', (e,d)=>{
                d.action();
            })
            .classed('btn', true)
            .attr('disabled', d=>{
                if(has(d, 'disabled')){
                    return d.disabled ? true : null;
                }
                return null;
            }).each(function(d){
                if(has(d, 'class')){
                    D3Select(this).classed(d.class, true);
                }
            });
    }

    // public

    Modal.setTitle = function(t){
        title.html(t);
        return Modal;
    };
    Modal.toggleBackClick = function(bool){
        backClick = typeof bool !== 'boolean' ? !backClick : bool;
        let clickCB = backClick ? ()=>{Modal.toggleModal(false);} : ()=>{};
        modalBack.on('click', clickCB);
        return Modal;
    };
    Modal.setActions = function(d){
        actionsDetails = d;
        updateActions();
        return Modal;
    };
    Modal.toggleAction = function(name, bool){
        let a = find(actionsDetails, d=>{return d.name === name;});
        if(typeof a !== 'undefined'){
            a.disabled = (typeof bool !== 'boolean') ? !a.disabled : bool;
        }
        updateActions();
        return Modal;
    };
    Modal.toggleModal = function(open){
        modalOpened = typeof open !== 'boolean' ? !modalOpened : open;
        modalBack.classed('opened', modalOpened);
        return Modal;
    };
    Modal.getModalTitle = function(){
        return title;
    };
    Modal.getModalBody = function(){
        return modalBody;
    };
    Modal.getModal = function(){
        return modal;
    };
    Modal.reset = function(){
        actionsDetails = [];
        updateActions();
        title.html('');
        modalBody.selectAll('*').remove();
        return Modal;
    };

    return Modal;
}