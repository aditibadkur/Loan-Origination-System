import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import addLead from '@salesforce/apex/addApplicant.addLead';
export default class LeadGeneration extends LightningElement {

    readOnly = true;

    @track recordId = '';
    @track leadRecordId = '';

    @track topic = ''
    @track content = '';
    @track showModal = false;

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
        if(this.applicantPhone == '9867180018'){
            this.verified = true;
            this.formDisabled = false;
            this.disableForm = true;
            this.applicantName = 'Arav';
            this.applicantEmail = 'arav@gmail.com';
        }
        if(this.applicantPhone == '1234567896'){
            this.verified = true;
            this.formDisabled = false;
            this.disableForm = true;
            this.applicantName = 'Reyansh';
            this.applicantEmail = 'aditisbadkur@gmail.com';
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
        if(this.applicantAadhar == '123456789018' && this.applicantPan == 'ABCDE1234W'){
            this.formDisabled = true;
            this.disableForm = false;
            this.applicantCIBIL = '710';
            this.applicantDOB = '02/02/02';
            this.applicantGender = 'Male';
            this.applicantAddress = '123 Oxford Street';
            this.freezeAddress = false;

            if(parseInt(this.applicantCIBIL) >= 600){ 
                this.showToast('Success', 'You are eligible for a loan!', 'success');
                this.isEligible = true;
            } else {
                this.showToast('Error', 'You are not eligible for a loan.', 'error');
                this.isEligible = false;
            }
        } 

        if(this.applicantAadhar == '123456789088' && this.applicantPan == 'ABCDE1234U'){
            this.formDisabled = true;
            this.disableForm = false;
            this.applicantCIBIL = '430';
            this.applicantDOB = '12/03/2002';
            this.applicantGender = 'Male';
            this.applicantAddress = 'Thakur Complex, Kandivali East, Mumbai';
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
            this.recordId = result.loanAppId;
            this.leadRecordId = result.leadId;
            console.log('recordId: '+this.recordId+' Lead record ID: '+this.leadRecordId);
            this.showToast('Success', 'Record created successfully!', 'success');
            
            if (this.isEligible) {
                // Only redirect to Loan Application if eligible
                if (this.addressType === 'Permanent' || this.currentAddressValue !== '') {
                    this.addressEntered = true;
                    // window.location.href = `https://orgfarm-0e96062adb-dev-ed.develop.lightning.force.com/lightning/r/Loan_Application__c/${this.recordId}/view`;
                }
            } else {
                // Redirect to Lead view page if not eligible
                this.topic = 'Not Applicable';
                this.content = `You're not eligible to apply for a loan at our organization due to low CIBIL score ${this.applicantCIBIL}. To learn more about CIBIL, click here: "https://www.cibil.in/"`;
                this.showModal = true;
            }
        })
        .catch(error => {
            this.formDisabled = false;
            const errorMessage = error.message || error.body?.message || 'Unknown error';
            this.showToast('Error in createApplicant', errorMessage, 'error');
            console.error('Full error:', error);
        });
    }

    handleModalClose() {
        this.showModal = false;
        window.location.href = `https://orgfarm-0e96062adb-dev-ed.develop.lightning.force.com/lightning/r/Lead/${this.leadRecordId}/view`;
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

    @track loanAmount = 0;
    @track interestRate = 0;
    @track tenure = 0;
    @track emi = 0;

    @track tenureSlider = 5;
    @track rateSlider = 7;

    handleEMI(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() 
        : event.target.value;

        if(this.loanAmount && this.rateSlider && this.tenureSlider) {
            if(parseInt(this.loanAmount) <= 0 || parseInt(this.rateSlider) <= 0 || parseInt(this.tenureSlider) <= 0) {
                this.showToast('Error', 'Loan Amount, Interest Rate, and Tenure must be greater than zero.', 'error');
                return;
            }   
            this.rateSliderValue = parseInt(this.rateSlider) / 100;  
            this.tenureSliderValue = parseInt(this.tenureSlider) * 12; 
            this.loanAmount = parseInt(this.loanAmount);
            this.emi = (this.loanAmount * this.rateSliderValue * Math.pow((1 + this.rateSliderValue), this.tenureSliderValue)) / (Math.pow((1 + this.rateSliderValue), this.tenureSliderValue) - 1);
            this.emi = Math.ceil(this.emi);
            console.log("EMI: " + this.emi);
        }
        else{
            this.showToast('Error', 'Please fill in all fields.', 'error');
            return;
        }
    }

    // // E = [P x R x (1+R) ^N] / [(1+R) ^ (N-1)]
}