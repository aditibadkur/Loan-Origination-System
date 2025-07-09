import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CalculatorEMI extends LightningElement {

    readOnly = true;    

    @track loanAmount = 0;
    @track interestRate = 0;
    @track tenure = 0;
    @track emi = 0;

    @track tenureSlider = 5;
    @track rateSlider = 7;

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() 
        : event.target.value;
    }

    connectedCallback(){
        this.calculateEMI();
    }

    // E = [P x R x (1+R) ^N] / [(1+R) ^ (N-1)]
    calculateEMI() { 
        console.log("calculateEMI is working");
        if(!this.loanAmount || !this.rateSlider || !this.tenureSlider) {
            this.showToast('Error', 'Please fill in all fields.', 'error');
            return;
        }
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
        // this.showToast('Success', `Your EMI is ${this.emi}`, 'success');
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}