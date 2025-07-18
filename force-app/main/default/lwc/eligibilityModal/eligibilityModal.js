import { api, LightningElement } from 'lwc';

export default class EligibilityModal extends LightningElement {
    @api label;
    @api message;

    handleClick(){
        this.dispatchEvent(new CustomEvent('close'));
    }
}