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
            throw new AuraHandledException('Error updating family details: ' + e.getMessage());
        }
    }

    // employment details
    // loan application mai send employment type
    // employment data mai send employment data including type

    @AuraEnabled
    public static void propertyDetails(
        String recordId,
        String state, 
        String city,
        String pincode
    ){
        try {
            Loan_Application__c appl = [
                SELECT Id, State__c, City__c, Pincode__c
                FROM Loan_Application__c
                WHERE Id = :recordId LIMIT 1 
            ];
            
            appl.State__c = state;
            appl.City__c = city;
            appl.Pincode__c = pincode != null ? Decimal.valueOf(pincode) : null;

            update appl;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error updating property details: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void loanDetails(
        String recordId,
        String loanPurpose, 
        String loanAmt, 
        String loanTenure
    ){
        try {
            Loan_Application__c appl = [
                SELECT Id, Tenure__c, Loan_Amount__c
                FROM Loan_Application__c
                WHERE Id = :recordId LIMIT 1 
            ];

            appl.Loan_Purpose__c = loanPurpose;
            appl.Loan_Amount__c = loanAmt != null ? Decimal.valueOf(loanAmt) : null;
            appl.Tenure__c = loanTenure != null ? Decimal.valueOf(loanTenure) : null;

            update appl;
        } catch (Exception e) {
            throw new AuraHandledException('Error updating loan details: ' + e.getMessage());
        }
    }
}