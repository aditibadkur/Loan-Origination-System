import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LeadGeneration extends LightningElement {

    @track applicantPhone = '';
    @track applicantName = '';
    @track applicantEmail = '';

    @track verified = false; 
    @track applicantPan = '';
    @track applicantAadhar = '';

    @track formDisabled = true;
    @track disableForm = true;
    @track freezeInput = false;

    @track isNext = false;
    @track isSuccess = false;

    // @track applicantAge = '';
    @track applicantDOB = '';
    @track applicantAddress = '';
    @track addressType = '';
    @track currentAddress = 'Enter Current Address';
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
            this.disableForm = true;
            // this.applicantName = 'Nisha';
            this.applicantEmail = 'nisha@email.com';
        }
        if(this.applicantPhone == '1234567890'){
            this.verified = true;
            this.formDisabled = false;
            this.disableForm = true;
            this.applicantName = 'Aarav';
            this.applicantEmail = 'aarav@email.com';
        }
        if(this.verified){
            this.freezeInput = true;
            this.handleDocuments();
            // if(this.applicantAadhar == '' || this.applicantPan == ''){
            //     this.showToast('Error', 'Invalid Aadhar or PAN Card details.', 'error');
            // }
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
        if(this.applicantAadhar == '123456789012' && this.applicantPan == 'ABCDE1234F'){
            this.formDisabled = true;
            this.disableForm = false;
            this.applicantCIBIL = '750';
            this.applicantDOB = 'Oct 10, 2002';
            // this.applicantAge = '23';
            this.applicantGender = 'Female';
            this.applicantAddress = 'Thakur Village, Kandivali East, Mumbai';

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
            this.disableForm = false;
            this.applicantCIBIL = '550';
            this.applicantDOB = '10-10-2005';
            // this.applicantAge = '20';
            this.applicantGender = 'Male';
            this.applicantAddress = 'Mahavir Nagar, Kandivali West, Mumbai';

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
            this.currentAddress = this.applicantAddress;
            console.log("Current Address is same as Permanent Address");
        }
        if(this.addressType == 'Current'){
            this.currentAddress = '123 Mane Street';
            console.log("Current Address is different from Permanent Address");
        }
        console.log("Current Address: " + this.currentAddress);
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    get NextButton() {
        return this.isNext;
    }

    handleNext(){
        if(this.isNext){
            // if yes toh theeke save ho jaayega, if not toh after the current address is entered then allow karna warna error
            if(this.addressType == 'Permanent'){
                this.showToast('Success', 'Proceeded to Loan Application Form', 'success');
                this.isSuccess = true;
            }
            else if (this.addressType == 'Current'){
                if(this.currentAddress == ''){ // abhi yeh implemented nhi hai (handleChange and value saath mai nhi chal rha ig)
                    this.showToast('Error', 'Please enter the Current Address', 'error');
                }
                else{
                    this.showToast('Success', 'Proceeded to Loan Application Form', 'success');
                    this.isSuccess = true;
                }
            }
            else{
                this.showToast('Error', 'Please enter the Current Address', 'error');
            }
        }
        else {
            this.showToast('Error', 'Please enter valid details', 'error');
        }

    }

    get nextPage() {
        return this.isSuccess;
    }
}