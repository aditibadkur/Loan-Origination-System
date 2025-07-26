import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchFiles from '@salesforce/apex/fileUpload.fetchFiles';
import { NavigationMixin } from 'lightning/navigation';


export default class ShowFile extends LightningElement {
    @api recordId;
    @track isFileLoaded = true;
    @track files;
    @track error;
    _lastRecordIdFetched;

    @track previewUrl = '';
    @track showPreview = false;

    renderedCallback() {
        if (this.recordId && this.recordId !== this._lastRecordIdFetched) {
            this.getFiles();
            this._lastRecordIdFetched = this.recordId;
        }
    }

    @api
    getFiles() { 
        this.isFileLoaded = false; // Show loading state
        fetchFiles({ recordId: this.recordId })
            .then(result => {
                this.files = result.map(file => ({
                    ...file,
                    formattedSize: this.formattedSize(file.ContentDocument.ContentSize)
                }));
                this.error = undefined;
                this.isFileLoaded = true;
                
                if (!result || result.length === 0) {
                    this.showToast('Info', 'No files found for this record.', 'info');
                }
            })
            .catch(error => {
                this.error = error;
                this.files = undefined;
                this.isFileLoaded = false;
                this.showToast('Error', 'Error fetching files: ' + (error.body?.message || error.message), 'error');
            });
    }

    handleViewFile(event) {
        // event.preventDefault(); // Add this to prevent any default behavior
        const contentDocumentId = event.currentTarget.dataset.id;
        // Use download URL instead of preview URL
        // this.previewUrl = `/sfc/servlet.shepherd/document/preview/${contentDocumentId}`;
        // this.showPreview = true;

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

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    handleClosePreview() {
        this.showPreview = false;
        this.previewUrl = '';
    }
}