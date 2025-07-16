import { api, LightningElement } from 'lwc';

export default class EligibilityModal extends LightningElement {
    @api message;

    handleClick(){
        this.dispatchEvent(new CustomEvent('close'));
    }
}