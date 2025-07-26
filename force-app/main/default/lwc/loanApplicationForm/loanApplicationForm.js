import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import familyDetails from '@salesforce/apex/addApplicant.familyDetails';

import fetchFiles from '@salesforce/apex/fileUpload.fetchFiles';
import { NavigationMixin } from 'lightning/navigation';

export default class LoanApplicationForm extends NavigationMixin(LightningElement)  {

    @track formVisible = false;
    @api applicantid;

    @api message;
    @api name;
    @api lname;
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
            if((this.applicantFather == '' || this.applicantMother == '') && this.applicantGuardian == ''){
                this.showToast('Error', 'Please fill either family or guardian details', 'error');
                this.formVisible = false;
            }
            else if(!this.isSingle && (this.applicantSpouse == '' || this.spouseOccupation == '')){
                this.showToast('Error', 'Please fill Spouse details', 'error');
                this.formVisible = false;
            }
            else{
                this.formVisible = true;
                // this.showToast('Success', 'Personal + Family details collected', 'success');
                console.log(this.applicantid+' Record updated');
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

    // @api childMessage = "false";
    // handleBack(){
    //     const myEvent = new CustomEvent('childEvent', {
    //         detail: { message: this.childMessage }
    //     });
    //     this.dispatchEvent(myEvent);
    // }
    
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
        this.isFileLoaded = false; // Show loading state
        this._lastRecordIdFetched = null; // Reset the last fetched ID
        if (this.applicantid) {
            this.getFiles()
                .then(() => {
                    this.showToast('Success', 'Files refreshed successfully', 'success');
                })
                .catch(error => {
                    this.showToast('Error', 'Error refreshing files', 'error');
                });
        }
    }
    
    @api 
    getFiles() { 
        return new Promise((resolve, reject) => {
            console.log('Fetching files for applicant:', this.applicantid);
            this.isFileLoaded = false;
            
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
                    this.showFileComponent = true; 
                    console.log('Processed files:', this.files);
                } else {
                    this.files = [];
                    this.showToast('Info', 'No files found for this record.', 'info');
                }
                this.isFileLoaded = true;
                resolve();
            })
            .catch(error => {
                console.error('Error fetching files:', error);
                this.error = error;
                this.files = [];
                this.isFileLoaded = true;
                this.showToast('Error', 'Error fetching files: ' + (error.body?.message || error.message), 'error');
                reject(error);
            });
        });
    }
    
    handleViewFile(event) {
        const contentDocumentId = event.currentTarget.dataset.id;
        // console.log('Attempting to preview file with ID:', contentDocumentId);
        // this.previewUrl = `/sfc/servlet.shepherd/version/download/${contentDocumentId}`;
        // this.previewUrl = `/sfc/servlet.shepherd/document/download/${contentDocumentId}`;
        // this.showPreview = true;
        // Salesforce standard file viewer URL
        // window.open(`/sfc/servlet.shepherd/document/preview/${contentDocumentId}`, '_self'); // not working same page preview
        // window.open(`/sfc/servlet.shepherd/document/download/${contentDocumentId}`, '_blank'); // opens in new tab

        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'filePreview'
            },
            state: {
                recordIds: contentDocumentId,
                selectedRecordId: contentDocumentId
            }
        });

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