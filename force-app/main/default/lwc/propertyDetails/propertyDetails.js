import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import propertyDetails from '@salesforce/apex/addApplicant.propertyDetails';

export default class PropertyDetails extends LightningElement {
    @track formVisible = false;

    @api applicantid;
    
    @api message;
    @api current;
    @api permanent;

    @track applicantState = '';
    @track applicantCity = '';
    @track applicantPincode = '';

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() 
        : event.target.value;
        console.log(`Field changed: ${field}, Value: ${this[field]}`);
    }

    handleSubmit(){
        propertyDetails({
            recordId: this.applicantid,
            state: this.applicantState,
            city: this.applicantCity,
            pincode: this.applicantPincode
        })
        .then(() => {
            if((this.applicantState == '' || this.applicantCity == '') && this.applicantPinCode == ''){
                this.showToast('Error', 'Please fill either family or guardian details', 'error');
                this.formVisible = false;
            }
            else{
                this.formVisible = true;
                this.showToast('Success', 'Property details collected', 'success');
                console.log(this.applicantid+' Record updated');
            }
        })
        .catch(error => {
            this.formVisible = false;
            const errorMessage = error.message || error.body?.message || 'Unknown error';
            this.showToast('Error', errorMessage, 'error');
            console.error('Full error:', error);
        });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}