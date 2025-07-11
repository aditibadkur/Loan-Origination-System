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

    @AuraEnabled
    public static void familyDetails(
        String recordId,
        String father, 
        String fatherOccupation, 
        String mother,
        String motherOccupation,
        String guardian,
        String guardianOccupation,
        String spouse,
        String spouseOccupation,
        Boolean married
    ){
        try {
            Loan_Application__c appl = [
                SELECT Id, Father_Name__c, Father_Occupation__c,
                Mother_Name__c, Mother_Occupation__c,
                Guardian__c, Guardian_Occupation__c,
                Married__c,
                Spouse_Name__c, Spouse_Occupation__c
                FROM Loan_Application__c 
                WHERE Id = :recordId LIMIT 1 
            ];

            appl.Father_Name__c = father;
            appl.Father_Occupation__c = fatherOccupation;

            appl.Mother_Name__c = mother;
            appl.Mother_Occupation__c = motherOccupation;

            appl.Guardian__c = guardian;
            appl.Guardian_Occupation__c = guardianOccupation;

            appl.Married__c = married;

            appl.Spouse_Name__c = spouse != null ? spouse : null;
            appl.Spouse_Occupation__c = spouseOccupation  != null ? spouseOccupation : null;


            update appl;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error creating application: ' + e.getMessage());
        }
    }
}