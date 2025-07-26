import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import propertyDetails from '@salesforce/apex/addApplicant.propertyDetails';

import fetchFiles from '@salesforce/apex/fileUpload.fetchFiles';

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

    get formattedPincode() {
        if (!this.applicantPincode) return '';
        return this.applicantPincode.replace(/(\d{3})(?=\d)/g, '$1 '); // Add space after 3 digits
    }

    handlePincodeChange(event) {
        let value = event.target.value;
        this.applicantPincode = value.replace(/\D/g, '').substring(0, 6); // Remove all non-digit characters and limit to 6 digits
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
                // this.showToast('Success', 'Property details collected', 'success');
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

    @track acceptedFormats = ['.pdf'];
    @track showFileComponent = false;

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        this.showToast('Success', uploadedFiles.length + ' File(s) uploaded successfully!', 'success');
        this.showFileComponent = true;
        
        setTimeout(() => {
            this.getFiles(); // Call getFiles directly instead of refreshFileList
        }, 1000);
    }
}