import { LightningElement, track } from 'lwc';

export default class LeadGeneration extends LightningElement {
    // get phone number and usse recordId? maybe usse populate the name and age  
    @track phoneNumber = '';
    applicantName = '';
    applicantAge = '';

    handleChange(event) {
        const field = event.target.name;
        if (field === 'phoneNumber') {
            this.phoneNumber = event.target.value;
        }
    }       

    connectedCallback() {
        console.log("Component connected");
        this.handleVerification();
    }

    // ⚠️ hard-coded hai 
    // irl fetch data from api using named credentials?

    handleVerification(){
        console.log("this is working");
        if(this.phoneNumber == '9867187591'){
            console.log("checked phone number");
            this.applicantName = 'Nisha';
            this.applicantAge = '23';
            console.log("Name: " + this.applicantName);
            console.log("Age: " + this.applicantAge);
        }
    }
}