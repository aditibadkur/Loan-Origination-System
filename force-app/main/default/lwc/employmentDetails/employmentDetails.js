import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class EmploymentDetails extends LightningElement {
    @track formVisible = false;
        
    @api message;
    @api current;
    @api permanent;

    @track employmentType = '';
    @track self = false;
    @track student = false;
    @track unemployed = false;
    @track salaried = false;

    get incomeOptions() {
        return [
            { label: 'Below 50k', value: 'Below 50k' },
            { label: '50k-1L', value: '50k-1L' },
            { label: '1L-5L', value: '1L-5L' },
            { label: '5L-10L', value: '5L-10L' },
            { label: 'Above 10L', value: 'Above 10L' }
        ];
    }

    get employmentOptions(){
        return [
            { label: 'Salaried', value: 'Salaried' },
            { label: 'Self-Employed', value: 'Self-Employed' },
            { label: 'Unemployed', value: 'Unemployed' },
            { label: 'Student', value: 'Student' }
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

    handleSubmit(){
        this.showToast('Success', 'Employment Details collected', 'success');
        this.formVisible = true;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}