import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class EmploymentDetails extends LightningElement {
    @track formVisible = false; // for next page!
    readOnly = true;
        
    @api message;
    @api current;
    @api permanent;

    @track employmentType = '';
    @track self = false;
    @track student = false;
    @track unemployed = false;
    @track salaried = false;

    get employmentOptions(){
        return [
            { label: 'Salaried', value: 'Salaried' },
            { label: 'Self-Employed', value: 'Self-Employed' },
            { label: 'Unemployed', value: 'Unemployed' },
            { label: 'Student', value: 'Student' }
        ];
    }

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() 
        : event.target.value;
        console.log(`Field changed: ${field}, Value: ${this[field]}`);

        if(this.employmentType == 'Self-Employed'){
            this.self = true;
            this.student = false;
            this.unemployed = false;
            this.salaried = false;
        }
        if(this.employmentType == 'Student'){
            this.student = true;
            this.self = false;
            this.unemployed = false;
            this.salaried = false;
        }
        if(this.employmentType == 'Unemployed'){
            this.unemployed = true;
            this.self = false;
            this.student = false;
            this.salaried = false;
        }
        if(this.employmentType == 'Salaried'){
            this.salaried = true;
            this.self = false;
            this.student = false;
            this.unemployed = false;
        }
    }

    // sab submission ka logic ke liye alag alag handleSubmit banao

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    // handleBack(){ // child to parent hai to event banana padega!!!!!
    //     this.formVisible = true;
    // }

    // SALARIED AND SELF-EMPLOYED

    get formatOptions(){
        return [
            {label: 'WFH', value: 'WFH'},
            {label: 'Hybrid (2-3 days WFH)', value: 'Hybrid (2-3 days WFH)'},
            {label: 'Full-time', value: 'Full-time'}
        ];
    }

    get incomeOptions() {
        return [
            { label: 'Below 50k', value: 'Below 50k' },
            { label: '50k-1L', value: '50k-1L' },
            { label: '1L-5L', value: '1L-5L' },
            { label: '5L-10L', value: '5L-10L' },
            { label: 'Above 10L', value: 'Above 10L' }
        ];
    }

    get profitOptions() {
        return [
            { label: 'Below 50k', value: 'Below 50k' },
            { label: '50k-1L', value: '50k-1L' },
            { label: '1L-5L', value: '1L-5L' },
            { label: '5L-10L', value: '5L-10L' },
            { label: 'Above 10L', value: 'Above 10L' }
        ];
    }

    get businessOptions(){
        return [
            { label: 'IT', value: 'IT' },
            { label: 'Finance', value: 'Finance' }, 
            { label: 'Retail', value: 'Retail' },
            { label: 'Service', value: 'Service' },
            { label: 'Education', value: 'Education' },
            { label: 'Health', value: 'Health' },
            { label: 'Others', value: 'Others' }
        ];
    }

    handleBasicSubmit(){
        this.showToast('Success', 'Employment Details collected', 'success');
        this.formVisible = true;
    }

    // UNEMPLOYED AND STUDENT

    @track coApplicantNumber = '';
    @track isVerified = false;
    @track freezePhone = false;
    @track formDisabled = true;
    
    @track coApplicant = '';
    @track coApplicantEmail = '';
    @track coApplicantCIBIL = '';
    @track occupation = '';

    get relationOptions(){
        return [
            { label: 'Father', value: 'Father' },
            { label: 'Mother', value: 'Mother' },
            { label: 'Guardian', value: 'Guardian' },
            { label: 'Brother', value: 'Brother' },
            { label: 'Sister', value: 'Sister' },
            { label: 'Friend', value: 'Friend' },
            { label: 'Spouse', value: 'Spouse' }
        ];
    }

    connectedCallback(){
        this.handleVerification();
    }

    handleVerification(){
        if(this.coApplicantNumber == '9867187272'){
            this.coApplicant = 'Sara';
            this.coApplicantEmail = 'sara@gmail.com';
            this.freezePhone = true;
            this.isVerified = true;
            this.formDisabled = false;
        }
        if(this.isVerified){
            this.handleDocuments();
        }
    }

    handleDocuments(){
        if(this.coApplicantAadhar == '123456789012' && this.coApplicantPAN == 'ABCDE1234F'){
            this.coApplicantCIBIL = '590';
            this.occupation = 'Doctor';
            this.formDisabled = true;

            if(this.coApplicantCIBIL >= 600){
                this.showToast('Success', 'Co-Applicant eligible for loan', 'Success');
            }
            else{
                this.showToast('Error', 'Co-Applicant not eligible for loan, change applicant (number)', 'error');
                this.isVerified = false;
                this.freezePhone = false;
                // EMPTY THE FIELDS
            }
        }
        if(this.coApplicantAadhar == '123456789011' && this.coApplicantPAN == 'ABCDE1234W'){
            this.coApplicantCIBIL = '700';
            this.occupation = 'Doctor';
            this.formDisabled = true;

            if(this.coApplicantCIBIL >= 600){
                this.showToast('Success', 'Co-Applicant eligible for loan', 'Success');
            }
            else{
                this.showToast('Error', 'Co-Applicant not eligible for loan', 'error');
                this.formDisabled = false;
            }
        }
    }

    clearFields(){
        this.coApplicantNumber = '';
        this.coApplicant = '';
        this.coApplicantEmail = '';
        this.coApplicantAadhar = '';
        this.coApplicantPAN = '';
        this.coApplicantCIBIL = '';
        this.occupation = '';

        this.freezePhone = false;
        this.isVerified = false;
    }

    handleSubmit(){ 
        if(this.unemployed || this.student){
            if(this.coApplicantNumber == '' || this.coApplicantAadhar == '' || this.coApplicantPAN == ''){
                this.showToast('Error', 'Please enter Co-Applicant data', 'error');
            }
            else if(this.formDisabled == false){
                this.showToast('Error', 'Please fill all the fields with valid data', 'error');
            }
            else if(this.coApplicantCIBIL < 600 && this.coApplicantCIBIL != ''){
                this.showToast('Error', 'Co-Applicant is not eligible for loan, CHANGE CO-APPLICANT', 'error');
            }
            else{
                this.showToast('Success', 'Employment Details collected', 'success');
                this.formVisible = true;
            }
        }
        else{
            this.showToast('Success', 'Employment Details collected', 'success');
            this.formVisible = true;
        }
    }
}