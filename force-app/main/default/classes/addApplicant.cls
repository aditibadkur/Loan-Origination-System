public with sharing class addApplicant {
    @AuraEnabled
    public static String addLead(
        String leadName, 
        String leadPhone, 
        String leadEmail, 
        String leadPan, 
        String leadAadhar, 
        String leadGender,
        String leadDOB,
        String leadCIBIL, 
        String leadPAddress, 
        String leadCAddress,
        Boolean leadEligible
    ){
        try {
            Loan_Application__c appl = new Loan_Application__c();

            appl.Name = leadName;
            appl.Phone__c = leadPhone;
            appl.Email__c = leadEmail;
            appl.PAN_Card__c = leadPan;
            appl.Aadhar__c = leadAadhar != null ? Decimal.valueOf(leadAadhar) : null;
            appl.Gender__c = leadGender;
            appl.DOB__c = leadDOB != null ? Date.parse(leadDOB) : null;
            appl.CIBIL__c = leadCIBIL != null ? Decimal.valueOf(leadCIBIL) : null;
            appl.Permanent_Address__c = leadPAddress;
            appl.Current_Address__c = leadCAddress;
            appl.Eligible__c = leadEligible ? 'Yes': 'No';
            // appl.Loan_Amount__c = applicantAmount != null ? Decimal.valueOf(applicantAmount) : null;

            insert appl;
            return appl.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error creating application: ' + e.getMessage());
        }
    }
}