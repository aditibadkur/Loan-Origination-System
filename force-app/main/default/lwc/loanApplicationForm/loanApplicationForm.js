import { api, LightningElement } from 'lwc';

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
}