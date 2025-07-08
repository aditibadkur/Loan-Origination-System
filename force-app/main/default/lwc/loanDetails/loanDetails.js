import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LoanDetails extends LightningElement {
    @track formVisible = false;
    
    @api message;

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() 
        : event.target.value;
        console.log(`Field changed: ${field}, Value: ${this[field]}`);
    }

    handleSubmit(){
        this.showToast('Success', 'Send email now', 'success');
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}