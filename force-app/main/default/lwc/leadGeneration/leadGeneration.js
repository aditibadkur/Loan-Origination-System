import { LightningElement, track } from 'lwc';

export default class LeadGeneration extends LightningElement {
    // get phone number and usse recordId? maybe usse populate the name and age  
    @track phoneNumber = '';
    applicantName = '';
    applicantAge = '';

    @track verified = false; // check this
    @track panCard = '';
    @track applicantAadhar = '';

    // @track formDisabled = true;

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
            // formDisabled = false;
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
        if(this.applicantAadhar == '123456789012'){
            this.applicantCIBIL = '750';
            console.log("Aadhar working");
            console.log("CIBIL Score: " + this.applicantCIBIL);
        } 
        if(this.panCard == 'ABCDE1234F'){
            this.applicantCIBIL = '650';
            console.log("PAN Card working");
            console.log("CIBIL Score: " + this.applicantCIBIL);
        }  
    }
}