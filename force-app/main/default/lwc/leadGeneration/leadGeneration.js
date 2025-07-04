import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LeadGeneration extends LightningElement {
    // get phone number and usse recordId? maybe usse populate the name and age  
    @track phoneNumber = '';
    applicantName = '';
    applicantAge = '';

    @track verified = false; // check this
    @track panCard = '';
    @track applicantAadhar = '';

    @track formDisabled = true;

    applicantCIBIL = '';

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() 
        : event.target.value;
    }

    connectedCallback() {
        console.log("Component connected");
        this.handleVerification();
    }
    // ⚠️ hard-coded hai 
    // irl fetch data from api using named credentials?

    handleVerification(){
        console.log("verification is working");
        if(this.phoneNumber == '9867187591'){
            this.verified = true;
            this.formDisabled = false;
            console.log("checked phone number");
            this.applicantName = 'Nisha';
            this.applicantAge = '23';
            console.log("Name: " + this.applicantName);
            console.log("Age: " + this.applicantAge);
        }
        if(this.verified){
            this.handleDocuments();
        }
    }

    handleDocuments(){
        console.log("documents is working");
        if(this.applicantAadhar == '123456789012' && this.panCard == 'ABCDE1234F'){
            this.applicantCIBIL = '550';
            console.log("Aadhar working");
            console.log("CIBIL Score: " + this.applicantCIBIL);

            console.log("parsed CIBIL Score: " + parseInt(this.applicantCIBIL));
            if(parseInt(this.applicantCIBIL) >= 600){ 
                console.log("parsed CIBIL Score: " + parseInt(this.applicantCIBIL));
                this.showToast('Success', 'You are eligible for a loan!', 'success');
            } else {
                this.showToast('Error', 'You are not eligible for a loan.', 'error');
            }
        } 
        if(this.applicantAadhar != '123456789012' || this.panCard != 'ABCDE1234F'){
            this.showToast('Error', 'Invalid Aadhar or PAN Card details.', 'error');
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}