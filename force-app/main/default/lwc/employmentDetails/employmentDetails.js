import { api, LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import selfDetails from '@salesforce/apex/addApplicant.selfDetails';
import salariedDetails from '@salesforce/apex/addApplicant.salariedDetails';
import studentDetails from '@salesforce/apex/addApplicant.studentDetails';
import unemployedDetails from '@salesforce/apex/addApplicant.unemployedDetails';

import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import OBJECT_API from '@salesforce/schema/Applicant_Employment_Data__c';
import EMPLOYMENT_FIELD from '@salesforce/schema/Applicant_Employment_Data__c.Name';
import WORK_FIELD from '@salesforce/schema/Applicant_Employment_Data__c.Work_Format__c';
import INCOME_FIELD from '@salesforce/schema/Applicant_Employment_Data__c.Annual_Income__c';
import BUSINESS_FIELD from '@salesforce/schema/Applicant_Employment_Data__c.Business_Domain__c';
import RELATION_FIELD from '@salesforce/schema/Applicant_Employment_Data__c.Relation_to_C__c';
import QUALIFICATION_FIELD from '@salesforce/schema/Applicant_Employment_Data__c.Qualification__c';

export default class EmploymentDetails extends LightningElement {
    @track formVisible = false; // for next page!
    readOnly = true;

    @api applicantid;
        
    @api message;
    @api current;
    @api permanent;

    @track employmentType = '';
    @track self = false;
    @track student = false;
    @track unemployed = false;
    @track salaried = false;

    @track formatOptions = [];
    @track incomeOptions = [];
    @track businessOptions = [];
    @track relationOptions = [];

    get employmentOptions(){
        return [
            { label: 'Salaried', value: 'Salaried' },
            { label: 'Self-Employed', value: 'Self-Employed' },
            { label: 'Unemployed', value: 'Unemployed' },
            { label: 'Student', value: 'Student' }
        ];
    }

    @wire(getObjectInfo, { objectApiName: OBJECT_API })
    objectInfo;

    // @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: EMPLOYMENT_FIELD })
    // wiredDurationPicklistValues({ error, data }) {
    //     if (data) {
    //         this.employmentOptions = data.values.map(item => ({
    //             label: item.label,
    //             value: item.value
    //         }));
    //         console.log('Picklist options loaded:', this.loanDurationOptions);
    //     } else if (error) {
    //         console.error('Error loading picklist values:', error);
    //         this.showToast('Error', 'Failed to load EMPLOYMENT OPTIONS', 'error');
    //     }
    // }

    handleChange(event) {
        console.log("recordID: "+this.applicantid);
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() 
        : event.target.value;
        console.log(`Field changed: ${field}, Value: ${this[field]}`);
    }

    handleEmploymentType(event){
        this.employmentType = event.target.value;
        console.log(`Selected employment type: ${this.employmentType}`);
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

    @track jobRole = '';
    @track qualification = '';
    @track experience = '';

    // SALARIED
    @track companyName = '';
    @track workFormat = '';
    @track annualIncome = '';

    // SELF
    @track bName = '';
    @track businessType = '';
    @track annualIncome = '';
    @track businessRating = '';

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: QUALIFICATION_FIELD })
    wiredQualificationValues({ error, data }) {
        if (data) {
            this.qualificationOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
            console.log('Picklist options loaded:', this.loanDurationOptions);
        } else if (error) {
            console.error('Error loading picklist values:', error);
            this.showToast('Error', 'Failed to load RELATION OPTIONS', 'error');
        }
    }

    // get formatOptions(){
    //     return [
    //         {label: 'WFH', value: 'WFH'},
    //         {label: 'Hybrid (2-3 days WFH)', value: 'Hybrid (2-3 days WFH)'},
    //         {label: 'WFO', value: 'WFO'}
    //     ];
    // }

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: WORK_FIELD })
    wiredWorkFormatValues({ error, data }) {
        if (data) {
            this.formatOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
            console.log('Picklist options loaded:', this.loanDurationOptions);
        } else if (error) {
            console.error('Error loading picklist values:', error);
            this.showToast('Error', 'Failed to load WORK FORMAT OPTIONS', 'error');
        }
    }

    // get incomeOptions() {
    //     return [
    //         { label: 'Below 50k', value: 'Below 50k' },
    //         { label: '50k-1L', value: '50k-1L' },
    //         { label: '1L-5L', value: '1L-5L' },
    //         { label: '5L-10L', value: '5L-10L' },
    //         { label: 'Above 10L', value: 'Above 10L' }
    //     ];
    // }

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: INCOME_FIELD })
    wiredIncomeValues({ error, data }) {
        if (data) {
            this.incomeOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
            console.log('Picklist options loaded:', this.loanDurationOptions);
        } else if (error) {
            console.error('Error loading picklist values:', error);
            this.showToast('Error', 'Failed to load INCOME OPTIONS', 'error');
        }
    }

    // get businessOptions(){
    //     return [
    //         { label: 'IT', value: 'IT' },
    //         { label: 'Finance', value: 'Finance' }, 
    //         { label: 'Retail', value: 'Retail' },
    //         { label: 'Service', value: 'Service' },
    //         { label: 'Education', value: 'Education' },
    //         { label: 'Health', value: 'Health' },
    //         { label: 'Others', value: 'Others' }
    //     ];
    // }

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: BUSINESS_FIELD })
    wiredBusinessDomainValues({ error, data }) {
        if (data) {
            this.businessOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
            console.log('Picklist options loaded:', this.loanDurationOptions);
        } else if (error) {
            console.error('Error loading picklist values:', error);
            this.showToast('Error', 'Failed to load BUSINESS OPTIONS', 'error');
        }
    }

    handleBasicSubmit(){
        
        if(this.self){
            selfDetails({
                applicantid: this.applicantid,
                type: this.employmentType,
                exp: this.experience, 
                qualification: this.qualification, 
                business: this.bName,
                bType: this.businessType,
                job: this.jobRole,
                annualIncome: this.annualIncome,
                rating: this.businessRating
            })
            .then(result => {
                // if(this.businessType == '' || this.jobRole == '' || this.applicantProfit == ''){
                //     this.showToast('Error', 'Please fill all self-employed details', 'error');
                //     this.formVisible = false;
                // }
                // else{
                    this.employRecId = result;
                    this.formVisible = true;
                    this.showToast('Success', 'Self-Employed details collected', 'success');
                    console.log(this.applicantid+' Record updated');
                // }
            })
            .catch(error => {
                this.formVisible = false;
                const errorMessage = error.message || error.body?.message || 'Unknown error';
                this.showToast('Error', errorMessage, 'error');
                console.error('Full error:', error);
            });
        }

        else if(this.salaried){
            salariedDetails({
                applicantid: this.applicantid,
                type: this.employmentType,
                exp: this.experience, 
                qualification: this.qualification, 
                company: this.companyName,
                job: this.jobRole,
                workFormat: this.workFormat,
                annualIncome: this.annualIncome
            })
            .then(result => {
                // if(this.businessType == '' || this.jobRole == '' || this.applicantProfit == ''){
                //     this.showToast('Error', 'Please fill all self-employed details', 'error');
                //     this.formVisible = false;
                // }
                // else{
                    this.employRecId = result;
                    this.formVisible = true;
                    this.showToast('Success', 'Salaried details collected', 'success');
                    console.log(this.applicantid+' Record updated');
                // }
            })
            .catch(error => {
                this.formVisible = false;
                const errorMessage = error.message || error.body?.message || 'Unknown error';
                this.showToast('Error', errorMessage, 'error');
                console.error('Full error:', error);
            });
        }
    }

    // UNEMPLOYED AND STUDENT

    @track coApplicantNumber = '';
    @track isVerified = false;
    @track freezePhone = false;
    @track formDisabled = true;
    
    @track coApplicant = '';
    @track coApplicantPAN = '';
    @track coApplicantAadhar = '';
    @track coApplicantEmail = '';
    @track coApplicantCIBIL = '';
    @track occupation = '';

    @track relation = '';

    @track acceptedFormats = ['.pdf','.png','.jpg','.jpeg'];

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        this.showToast('Success', `${uploadedFiles.length} file(s) uploaded successfully`, 'success');
    }
    // qualification upar mentioned hai

    // get relationOptions(){
    //     return [
    //         { label: 'Father', value: 'Father' },
    //         { label: 'Mother', value: 'Mother' },
    //         { label: 'Guardian', value: 'Guardian' },
    //         { label: 'Brother', value: 'Brother' },
    //         { label: 'Sister', value: 'Sister' },
    //         { label: 'Friend', value: 'Friend' },
    //         { label: 'Spouse', value: 'Spouse' }
    //     ];
    // }

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: RELATION_FIELD })
    wiredRelationValues({ error, data }) {
        if (data) {
            this.relationOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
            console.log('Picklist options loaded:', this.loanDurationOptions);
        } else if (error) {
            console.error('Error loading picklist values:', error);
            this.showToast('Error', 'Failed to load RELATION OPTIONS', 'error');
        }
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
        this.relation = '';

        this.freezePhone = false;
        this.isVerified = false;
    }

    handleSubmit(){ 
        let isValid = true;
        let errorMessage = '';
        
        if(this.unemployed || this.student) {
            if(!this.coApplicantNumber || !this.coApplicantAadhar || !this.coApplicantPAN) {
                isValid = false;
                errorMessage = 'Please enter Co-Applicant data';
            }
            else if(!this.isVerified) {
                isValid = false;
                errorMessage = 'Please verify co-applicant details';
            }
            else if(this.coApplicantCIBIL < 600) {
                isValid = false;
                errorMessage = 'Co-Applicant CIBIL score too low';
            }
        }
        else if(this.salaried) {
            if(!this.companyName || !this.workFormat || !this.annualIncome) {
                isValid = false;
                errorMessage = 'Please fill all salaried employment details';
            }
        }
        else if(this.self) {
            if(!this.bName || !this.businessType || !this.annualIncome) {
                isValid = false;
                errorMessage = 'Please fill all self-employed details';
            }
        }
        
        if(!isValid) {
            this.showToast('Error', errorMessage, 'error');
            return;
        }
        if(this.salaried || this.self) {
            this.handleBasicSubmit();
        } 
        else{
            if(this.student){
                studentDetails({
                    applicantid: this.applicantid,
                    type: this.employmentType,
                    relationToCo: this.relation,
                    qualification: this.qualification,
                    coNumber: this.coApplicantNumber,
                    coName: this.coApplicant,
                    coEmail: this.coApplicantEmail,
                    coPan: this.coApplicantPAN,
                    coAadhar: this.coApplicantAadhar,
                    occupation: this.occupation,
                    coCibil: this.coApplicantCIBIL
                })
                .then(result => {
                    // if(this.businessType == '' || this.jobRole == '' || this.applicantProfit == ''){
                    //     this.showToast('Error', 'Please fill all self-employed details', 'error');
                    //     this.formVisible = false;
                    // }
                    // else{
                        this.employRecId = result;
                        this.formVisible = true;
                        this.showToast('Success', 'Student details collected', 'success');
                        console.log(this.applicantid+' Record updated');
                    // }
                })
                .catch(error => {
                    this.formVisible = false;
                    const errorMessage = error.message || error.body?.message || 'Unknown error';
                    this.showToast('Error', errorMessage, 'error');
                    console.error('Full error:', error);
                });
            }

            else if(this.unemployed){
                unemployedDetails({
                    applicantid: this.applicantid,
                    type: this.employmentType,
                    relationToCo: this.relation,
                    qualification: this.qualification,
                    coNumber: this.coApplicantNumber,
                    coName: this.coApplicant,
                    coEmail: this.coApplicantEmail,
                    coPan: this.coApplicantPAN,
                    coAadhar: this.coApplicantAadhar,    
                    occupation: this.occupation,
                    coCibil: this.coApplicantCIBIL
                })
                .then(result => {
                    // if(this.businessType == '' || this.jobRole == '' || this.applicantProfit == ''){
                    //     this.showToast('Error', 'Please fill all self-employed details', 'error');
                    //     this.formVisible = false;
                    // }
                    // else{
                        this.employRecId = result;
                        this.formVisible = true;
                        this.showToast('Success', 'Unemployed details collected', 'success');
                        console.log(this.applicantid+' Record updated');
                    // }
                })
                .catch(error => {
                    this.formVisible = false;
                    const errorMessage = error.message || error.body?.message || 'Unknown error';
                    this.showToast('Error', errorMessage, 'error');
                    console.error('Full error:', error);
                });
            }
        }
    }
}