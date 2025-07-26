import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import loanDetails from '@salesforce/apex/addApplicant.loanDetails';

import fetchFiles from '@salesforce/apex/fileUpload.fetchFiles';

export default class LoanDetails extends LightningElement {
    @track formVisible = false;

    @track showModal = false;
    @track topic = '';
    @track content = '';

    @api applicantid;

    @api message;

    @track applicantPurpose = '';
    @track loanAmount = '';
    @track loanTenure = '';
    // @track interestRate = '';


    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() 
        : event.target.value;
        console.log(`Field changed: ${field}, Value: ${this[field]}`);
    }

    handleSubmit(){
        loanDetails({
            recordId: this.applicantid,
            loanPurpose: this.applicantPurpose,
            loanAmt: this.loanAmount,
            loanTenure: this.loanTenure
        })
        .then(() => {
            if((this.applicantState == '' || this.applicantCity == '') && this.applicantPinCode == ''){
                this.showToast('Error', 'Please fill either family or guardian details', 'error');
                this.formVisible = false;
            }
            else{
                this.formVisible = true;
                this.topic = 'Application Sent';
                this.content = "Your application has been sent to the Underwriter for approval. We will notify you once credit decision has been made. Thank you for your patience.";
                this.showModal = true;
                // this.showToast('Success', 'Loan details collected', 'success');
            }
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

    handleModalClose() {
        this.showModal = false;
        window.location.href = `https://orgfarm-0e96062adb-dev-ed.develop.lightning.force.com/lightning/r/Loan_Application__c/${this.applicantid}/view`;
    }

    @track acceptedFormats = ['.pdf'];
    @track showFileComponent = false;

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        this.showToast('Success', uploadedFiles.length + ' File(s) uploaded successfully!', 'success');
        this.showFileComponent = true;
        
        setTimeout(() => {
            this.getFiles(); // Call getFiles directly instead of refreshFileList
        }, 1000);
    }

    get fileVisible() {
        return this.showFileComponent && this.files && this.files.length > 0;
    }

    @track isFileLoaded = true;
    @track files;
    @track error;
    _lastRecordIdFetched;

    @track previewUrl = '';
    @track showPreview = false;

    renderedCallback() {
        // Only fetch files when showFileComponent is true and applicantid changes
        if (this.showFileComponent && this.applicantid && this.applicantid !== this._lastRecordIdFetched) {
            this.getFiles();
            this._lastRecordIdFetched = this.applicantid;
        }
    }

    @api
    forceRefreshFiles() {
        this._lastRecordIdFetched = null; // Reset the last fetched ID
        if (this.applicantid) {
            this.getFiles();
        }
    }
    
    @api 
    getFiles() { 
        console.log('Fetching files for applicant:', this.applicantid);
        fetchFiles({ 
            recordId: this.applicantid 
        })
        .then(result => {
            console.log('Files fetched:', result);
            if (result && result.length > 0) {
                this.files = result.map(file => ({
                    ...file,
                    formattedSize: this.formattedSize(file.ContentDocument.ContentSize)
                }));
                this.error = undefined;
                this.isFileLoaded = true;
                this.showFileComponent = true; 
                
                console.log('Processed files:', this.files);
            } else {
                this.files = [];
                this.isFileLoaded = false;
                this.showToast('No Files', 'No files found for this record.', 'info');
            }
        })
        .catch(error => {
            console.error('Error fetching files:', error);
            this.error = error;
            this.files = [];
            this.isFileLoaded = false;
            this.showToast('Error', 'Error fetching files: ' + (error.body?.message || error.message), 'error');
        });
    }
    
    handleViewFile(event) {
        const contentDocumentId = event.currentTarget.dataset.id;
        this.previewUrl = `/sfc/servlet.shepherd/document/preview/${contentDocumentId}`;
        this.showPreview = true;
        // Salesforce standard file viewer URL
        // window.open(`/sfc/servlet.shepherd/document/preview/${contentDocumentId}`, '_self'); // not working same page preview
        // window.open(`/sfc/servlet.shepherd/document/download/${contentDocumentId}`, '_blank'); // opens in new tab
    }

    formattedSize(size) {
        if (size < 1024) return size + ' B';
        if (size < 1048576) return Math.round(size / 102.4) / 10 + ' KB';
        return Math.round(size / 104857.6) / 10 + ' MB';
    }

    handleClosePreview() {
        this.showPreview = false;
        this.previewUrl = '';
    }
}