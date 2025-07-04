import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LeadGeneration extends LightningElement {

    @track phoneNumber = '';
    @track applicantName = '';
    @track applicantEmail = '';

    @track verified = false; 
    @track panCard = '';
    @track applicantAadhar = '';

    @track formDisabled = true;
    @track disableForm = true;

    @track applicantAge = '';
    @track applicantAddress = '';
    @track addressType = '';
    @track currAddress = false; 
    @track currentAddress = 'Current Address';
    @track applicantGender = '';
    @track applicantCIBIL = '';

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
            this.disableForm = true;
            this.applicantName = 'Nisha';
            this.applicantEmail = 'nisha@email.com';
        }
        if(this.verified){
            this.handleDocuments();
        }
    }

    get addressOptions(){
        return [
            { label: 'Yes', value: 'Permanent' },
            { label: 'No', value: 'Current' }
        ];
    }

    get genderOptions(){
        return [
            { label : 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' }
        ];
    }

    handleDocuments(){
        console.log("documents is working");
        if(this.applicantAadhar == '123456789012' && this.panCard == 'ABCDE1234F'){
            this.disableForm = false;
            this.applicantCIBIL = '750';
            this.applicantAge = '23';
            this.applicantGender = 'Female';
            this.applicantAddress = 'Thakur Village, Kandivali East, Mumbai';

            if(parseInt(this.applicantCIBIL) >= 600){ 
                this.showToast('Success', 'You are eligible for a loan!', 'success');
            } else {
                this.showToast('Error', 'You are not eligible for a loan.', 'error');
            }
        } 
        // if(this.applicantAadhar != '123456789012' || this.panCard != 'ABCDE1234F'){
        //     this.showToast('Error', 'Invalid Aadhar or PAN Card details.', 'error');
        // }
    }

    handleCurrentAddress(event){
        this.addressType = event.target.value;
        this.currAddress = true;
        console.log("handleCurrentAddress is working");
        if(this.addressType == 'Permanent'){
            this.currentAddress = this.applicantAddress;
            console.log("Current Address is same as Permanent Address");
        }
        if(this.addressType == 'Current'){
            this.currentAddress = '';
            console.log("Current Address is different from Permanent Address");
        }
        console.log("Current Address: " + this.currentAddress);
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}