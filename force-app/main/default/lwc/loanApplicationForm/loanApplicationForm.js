import { api, LightningElement, track } from 'lwc';

export default class LoanApplicationForm extends LightningElement {
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
    @track disableForm = true;

    @track marriedType = '';
    @track annualIncome = '';

    get marriedOptions(){
        return [
            { label: 'Married', value: 'Married' },
            { label: 'Single', value: 'Single' }
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
            this.disableForm = false;
        }
        else{
            this.disableForm = true;
        }
    }

    get spouseName(){
        return this.readOnly;
    }
}