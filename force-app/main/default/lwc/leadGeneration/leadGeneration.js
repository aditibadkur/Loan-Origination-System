import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LeadGeneration extends LightningElement {

    readOnly = true;

    @track applicantPhone = '';
    @track applicantName = '';
    @track applicantEmail = '';

    @track applicantNameValue = ''

    @track verified = false; 
    @track applicantPan = '';
    @track applicantAadhar = '';

    @track formDisabled = true;
    // @track disableForm = true;
    @track freezePhone = false;
    @track freezeAddress = true;

    @track isNext = false;
    @track isSuccess = false;

    // @track applicantAge = '';
    @track applicantDOB = '';
    @track applicantAddress = '';
    @track addressType = '';
    // @track currentAddress = 'Enter Current Address';
    @track currentAddressValue = '';
    @track applicantGender = '';
    @track applicantCIBIL = '';

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() 
        : event.target.value;
        console.log(`Field changed: ${field}, Value: ${this[field]}`);
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
            // this.disableForm = true;
            this.applicantName = 'Nisha';
            this.applicantEmail = 'nisha@email.com';
        }
        if(this.applicantPhone == '1234567890'){
            this.verified = true;
            this.formDisabled = false;
            // this.disableForm = true;
            this.applicantName = 'Aarav';
            this.applicantEmail = 'aarav@email.com';
        }
        if(this.verified){
            this.freezePhone = true;
            this.handleDocuments();
        }
    }

    get addressOptions(){
        return [
            { label: 'Yes', value: 'Permanent' }
            // , { label: 'No', value: 'Current' }
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
        if(this.applicantAadhar == '123456789012' && this.applicantPan == 'ABCDE1234F'){
            this.formDisabled = true;
            // this.disableForm = false;
            this.applicantCIBIL = '750';
            this.applicantDOB = 'Oct 10, 2002';
            // this.applicantAge = '23';
            this.applicantGender = 'Female';
            this.applicantAddress = 'Thakur Village, Kandivali East, Mumbai';
            this.freezeAddress = false;

            if(parseInt(this.applicantCIBIL) >= 600){ 
                this.showToast('Success', 'You are eligible for a loan!', 'success');
                this.isNext = true;
            } else {
                this.showToast('Error', 'You are not eligible for a loan.', 'error');
                this.isNext = false;
            }
        } 

        if(this.applicantAadhar == '123456789011' && this.applicantPan == 'ABCDE1234W'){
            this.formDisabled = true;
            // this.disableForm = false;
            this.applicantCIBIL = '550';
            this.applicantDOB = '10-10-2005';
            // this.applicantAge = '20';
            this.applicantGender = 'Male';
            this.applicantAddress = 'Mahavir Nagar, Kandivali West, Mumbai';
            this.freezeAddress = false;

            if(parseInt(this.applicantCIBIL) >= 600){ 
                this.showToast('Success', 'You are eligible for a loan!', 'success');
                this.isNext = true;
            } else {
                this.showToast('Error', 'You are not eligible for a loan.', 'error');
                this.isNext = false;
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
            // this.currentAddress = '123 Mane Street';
            this.freezeAddress = false;
            console.log("Current Address is different from Permanent Address");
        }
        console.log("Current Address: " + this.currentAddressValue);
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    get NextButton() { // for rendering the last button (if possible usko disable better rahega imo)
        return this.isNext;
    }

    handleNext(){
        if(this.isNext){
            // if yes toh theeke save ho jaayega, if not toh after the current address is entered then allow karna warna error
            if(this.addressType == 'Permanent'){
                this.showToast('Success', 'Proceeded to LAF & record created', 'success');
                this.isSuccess = true;
            }
            else if (this.addressType != 'Permanent'){
                if(this.currentAddressValue == ''){ // abhi yeh implemented nhi hai (handleChange and value saath mai nhi chal rha ig)
                    this.showToast('Error', 'current address null error', 'error');
                }
                else{
                    this.showToast('Success', 'Proceeded to LAF & record created', 'success');
                    this.isSuccess = true;
                }
            }
            else{
                this.showToast('Error', 'no option selected error', 'error');
            }
        }
        else {
            this.showToast('Error', 'Please enter valid details', 'error');
        }

    }

    get getCurrentAddress(){
        return this.currentAddressValue;
        
    }

    get nextPage() { // for rendering the next page
        return this.isSuccess;
    }
}