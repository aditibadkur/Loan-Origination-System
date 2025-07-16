import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import addLead from '@salesforce/apex/addApplicant.addLead';

export default class LeadGeneration extends LightningElement {

    readOnly = true;

    @track recordId = '';

    @track applicantPhone = '';
    @track applicantName = '';
    @track applicantEmail = '';

    @track verified = false; 
    @track applicantPan = '';
    @track applicantAadhar = '';

    @track formDisabled = true;
    @track disableForm = true;
    @track freezePhone = false;
    @track freezeAddress = true;

    @track isEligible = false;
    @track addressEntered = false;

    @track applicantDOB = '';
    @track applicantAddress = '';
    @track addressType = '';
    @track currentAddressValue = '';
    @track applicantGender = '';
    @track applicantCIBIL = '';

    // handleChildEvent(event) {
    //     this.addressEntered = event.detail.message;
    //     console.log("Child event reached, address entered value: "+this.addressEntered);
    // }


    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() 
        : event.target.value;
        // console.log(`Field changed: ${field}, Value: ${this[field]}`);
    }

    connectedCallback() {
        console.log("Component connected");
        this.handleVerification();  
    }
    // ⚠️ hard-coded hai 
    // irl fetch data from api using named credentials?

    handleVerification(){
        console.log("verification is working");
        if(this.applicantPhone == '9867187591'){
            this.verified = true;
            this.formDisabled = false;
            this.disableForm = true;
            this.applicantName = 'Sreevalli';
            this.applicantEmail = 'vedicam80@gmail.com';
        }
        if(this.applicantPhone == '1234567890'){
            this.verified = true;
            this.formDisabled = false;
            this.disableForm = true;
            this.applicantName = 'Pushparaj';
            this.applicantEmail = 'rjcharsh11sci43@gmail.com';
        }
        if(this.verified){
            this.freezePhone = true;
            this.handleDocuments();
        }
    }

    get addressOptions(){
        return [
            { label: 'Yes', value: 'Permanent' }
        ];
    }

    handleDocuments(){
        console.log("documents is working");
        if(this.applicantAadhar == '123456789012' && this.applicantPan == 'ABCDE1234F'){
            this.formDisabled = true;
            this.disableForm = false;
            this.applicantCIBIL = '750';
            this.applicantDOB = '10/10/2005';
            this.applicantGender = 'Female';
            this.applicantAddress = '123 Mane Street';
            this.freezeAddress = false;

            if(parseInt(this.applicantCIBIL) >= 600){ 
                this.showToast('Success', 'You are eligible for a loan!', 'success');
                this.isEligible = true;
            } else {
                this.showToast('Error', 'You are not eligible for a loan.', 'error');
                this.isEligible = false;
            }
        } 

        if(this.applicantAadhar == '123456789011' && this.applicantPan == 'ABCDE1234W'){
            this.formDisabled = true;
            this.disableForm = false;
            this.applicantCIBIL = '550';
            this.applicantDOB = '1/08/2005';
            this.applicantGender = 'Male';
            this.applicantAddress = 'Mahavir Nagar, Kandivali West, Mumbai';
            this.freezeAddress = false;

            if(parseInt(this.applicantCIBIL) >= 600){ 
                this.showToast('Success', 'You are eligible for a loan!', 'success');
                this.isEligible = true;
            } else {
                this.showToast('Error', 'You are not eligible for a loan.', 'error');
                this.isEligible = false;
            }
        } 
    }

    handleCurrentAddress(event){
        this.addressType = event.target.value;
        console.log("handleCurrentAddress is working");
        if(this.addressType.length > 1){
            this.addressType = [this.addressType.pop()];
        }  
        if(this.addressType == 'Permanent'){
            this.currentAddressValue = this.applicantAddress;
            this.freezeAddress = true;
            console.log("Current Address is same as Permanent Address");
        }
        else{
            this.freezeAddress = false;
            console.log("Current Address is different from Permanent Address");
        }
        console.log("Current Address: " + this.currentAddressValue);
    }

    handleNext() { // Always save the record 
        addLead({
            leadName: this.applicantName,
            leadPhone: this.applicantPhone,
            leadEmail: this.applicantEmail,
            leadPan: this.applicantPan,
            leadAadhar: this.applicantAadhar,
            leadGender: this.applicantGender,
            leadDOB: this.applicantDOB,
            leadCIBIL: this.applicantCIBIL,
            leadPAddress: this.applicantAddress,
            leadCAddress: this.currentAddressValue,
            leadEligible: this.isEligible
        })
        .then(result => {
            this.recordId = result;
            this.showToast('Success', 'Record created successfully!', 'success');
            console.log('Record created with ID:', result);
            
            // Only proceed to next page if eligible
            if (this.isEligible) {
                if (this.addressType === 'Permanent') {
                    this.showToast('Success', 'Proceeded to LAF & record created', 'success');
                    this.addressEntered = true;
                } 
                else if (this.currentAddressValue === '') {
                    this.showToast('Error', 'Current address cannot be empty', 'error');
                }
                else {
                    this.showToast('Success', 'Proceeded to LAF & record created', 'success');
                    this.addressEntered = true;
                }
            } 
            else {
                this.showToast('Info', 'Applicant not eligible - record saved but cannot proceed', 'info');
            }
        })
        .catch(error => {
            this.formDisabled = false;
            const errorMessage = error.message || error.body?.message || 'Unknown error';
            this.showToast('Error', errorMessage, 'error');
            console.error('Full error:', error);
        });
    }

    get getCurrentAddress(){
        return this.currentAddressValue;
        
    }

    get nextPage() { // for rendering the next page
        return this.addressEntered;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}