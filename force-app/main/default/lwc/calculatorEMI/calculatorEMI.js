import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CalculatorEMI extends LightningElement {
    @track loanAmount = 0;
    @track interestRate = 0;
    @track tenure = 0;
    @track emi = 0;

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() 
        : event.target.value;
    }

    // E = [P x R x (1+R) ^N] / [(1+R) ^ (N-1)]
    calculateEMI() { 
        console.log("calculateEMI is working");
        if(!this.loanAmount || !this.interestRate || !this.tenure) {
            this.showToast('Error', 'Please fill in all fields.', 'error');
            return;
        }
        if(parseInt(this.loanAmount) <= 0 || parseInt(this.interestRate) <= 0 || parseInt(this.tenure) <= 0) {
            this.showToast('Error', 'Loan Amount, Interest Rate, and Tenure must be greater than zero.', 'error');
            return;
        }   
        this.interestRate = parseInt(this.interestRate) / 100;
        this.tenure = parseInt(this.tenure) * 12; 
        this.loanAmount = parseInt(this.loanAmount);
        this.emi = (this.loanAmount * this.interestRate * Math.pow((1 + this.interestRate), this.tenure)) / (Math.pow((1 + this.interestRate), this.tenure) - 1);
        this.emi = Math.ceil(this.emi);
        console.log("EMI: " + this.emi);
        this.showToast('Success', `Your EMI is ${this.emi}`, 'success');
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}