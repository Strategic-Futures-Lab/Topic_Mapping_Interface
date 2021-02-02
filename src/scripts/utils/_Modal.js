import {select as D3Select,
    event as D3Event} from 'd3-selection';
import '../../styles/Modal.less';

export default function Modal(DOMContainer, actDetails){

    let Modal = {};

    Modal.toggleModal = function(open){
        modalOpened = typeof open !== 'boolean' ? !modalOpened : open;
        modalBack.classed('opened', modalOpened);
        return Modal;
    };
    Modal.setTitle = function(t){
        title.html(t);
        return Modal;
    };
    Modal.enableBackClick = function(){
        modalBack.on('click', ()=>{Modal.toggleModal(false);});
        return Modal;
    };
    Modal.disableBackClick = function(){
        modalBack.on('click', ()=>{});
        return Modal;
    };
    Modal.setActions = function(d){
        actionsDetails = d;
        updateActions();
        return Modal;
    };
    Modal.toggleAction = function(actionName, value){
        let a = find(actionsDetails, d=>{return d.name === actionName;});
        if(typeof a !== 'undefined'){
            a.disabled = (typeof value !== 'boolean') ? !a.disabled : value;
        }
        updateActions();
        return Modal;
    };
    Modal.enableAction = function(actionName){
        Modal.toggleAction(actionName, false);
        return Modal;
    };
    Modal.disableAction = function(actionName){
        Modal.toggleAction(actionName, true);
        return Modal;
    };
    // Modal.getModalCloseBtn = function(){
    //     return close;
    // }
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


    let modalOpened = false;

    let actionsDetails = (typeof actDetails === 'undefined') ? [] : actDetails;

    let modalBack = D3Select(DOMContainer).append('div')
        .classed('modalBack', true)
        .on('click', ()=>{Modal.toggleModal(false);});
    let modal = modalBack.append('div')
        .classed('modal', true)
        .on('click', ()=>{D3Event.stopPropagation();});

    let modalHeader = modal.append('div')
        .classed('modalHeader', true);
    let title = modalHeader.append('h1')
        .classed('modalTitle', true);
    // let close = modalTop.append('span')
    //     .classed('btn btn-err close', true)
    //     .html('&times;')
    //     .on('click', ()=>{toggleModal(false)});

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
            .on('click', d=>{
                d.action();
            })
            .classed('btn', true)
            .attr('disabled', d=>{
                if (d.disabled) return true;
                else null;
            }).each(function(d){
                D3Select(this).classed(d.class, true);
            });
    }
    updateActions();

    return Modal;
}