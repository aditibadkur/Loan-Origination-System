import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import familyDetails from '@salesforce/apex/addApplicant.familyDetails';

export default class LoanApplicationForm extends LightningElement {

    @track formVisible = false;
    @api applicantid;

    @api message;
    @api name;
    @api email;
    @api phone;
    @api age;
    @api gender;
    @api aadhar;
    @api pan;
    @api current;
    @api permanent;
    @api bday;

    @track readOnly = true;
    @track isSingle = true;

    @track marriedType = '';

    @track applicantFather = '';
    @track fatherOccupation = '';

    @track applicantMother = '';
    @track motherOccupation = '';

    @track applicantGuardian = '';
    @track guardianOccupation = '';

    @track applicantSpouse = '';
    @track spouseOccupation = '';

    get marriedOptions(){
        return [
            { label: 'Yes', value: 'Married' }
        ];
    }

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() 
        : event.target.value;
        console.log(`Field changed: ${field}, Value: ${this[field]}`);
    }

    handleMarried(event){
        this.marriedType = event.target.value;
        if(this.marriedType == 'Married'){
            this.isSingle = false;
        }
        else{
            this.isSingle = true;
        }
    }

    handleSubmit(){
        // this.formVisible = true;
        // this.showToast('Success', 'Personal + Family details collected', 'success');
        familyDetails({
            recordId: this.applicantid,
            father: this.applicantFather,
            fatherOccupation: this.fatherOccupation,
            mother: this.applicantMother,
            motherOccupation: this.motherOccupation,
            guardian: this.applicantGuardian,
            guardianOccupation: this.guardianOccupation,
            spouse: this.applicantSpouse,
            spouseOccupation: this.spouseOccupation,
            married: !this.isSingle
        })
        .then(() => {
            this.formVisible = true;
            this.showToast('Success', 'Personal + Family details collected', 'success');
            console.log(this.applicantid+' Record updated');
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

    get finalName(){
        if(this.name != ''){
            return this.name;
        }
        else{
            return this.name1;
        }
    }
}