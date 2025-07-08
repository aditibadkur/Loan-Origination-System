import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class EmploymentDetails extends LightningElement {
    @track formVisible = false;
        
    @api message;
    @api current;
    @api permanent;

    get incomeOptions() {
        return [
            { label: 'Below 50k', value: 'Below 50k' },
            { label: '50k-1L', value: '50k-1L' },
            { label: '1L-5L', value: '1L-5L' },
            { label: '5L-10L', value: '5L-10L' },
            { label: 'Above 10L', value: 'Above 10L' }
        ];
    }

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() 
        : event.target.value;
        console.log(`Field changed: ${field}, Value: ${this[field]}`);
    }

    handleSubmit(){
        this.showToast('Success', 'Employment Details collected', 'success');
        this.formVisible = true;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}