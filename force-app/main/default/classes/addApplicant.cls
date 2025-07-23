public with sharing class addApplicant {
    @AuraEnabled
    public static Map<String,String> addLead(
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
            Id applId = null; 

            if(leadEligible){ // if eligible toh loan applicant record to be made
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

                insert appl;
                applId = appl.Id;
            }

            // else only lead made regardless of eligibility

            Lead newLead = new Lead();
            newLead.LastName = leadName;
            newLead.Phone = leadPhone;
            newLead.Email = leadEmail;
            newLead.Company = leadPAddress;
            newLead.Status = leadEligible ? 'Working - Contacted' : 'Closed - Not Converted';
            
            if(leadEligible){
                newLead.Applicant_ID__c = applId; 
                newLead.Loan_Application__c = applId;
            }
            
            insert newLead;

            if(leadEligible){
                Loan_Application__c appl = new Loan_Application__c(Id = applId);
                appl.Lead_ID__c = newLead.Id;
                appl.Lead__c = newLead.Id;
                update appl;
            }

            return new Map<String,String>{
                'loanAppId' => applId,
                'leadId' => newLead.Id
            };

        } catch (Exception e) {
            throw new AuraHandledException('Error creating application: ' + e.getMessage());
        }
    }

    // family details

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

    // ⚠️ loan application mai send employment type
    // employment data mai send employment data including type
    // create new employment data record with the recordId as foreign key

    @AuraEnabled
    public static void salariedDetails( 
        String applicantid,
        String type,
        String exp,
        String qualification,
        String company,
        String job,
        String workFormat,
        String annualIncome
    ){
        try {
            Applicant_Employment_Data__c empData = new Applicant_Employment_Data__c();

            empData.Loan_Application__c = applicantid; 
            empData.Name = type;
            empData.Experience_Years__c = exp;
            empData.Qualification__c = qualification;
            empData.Company_Name__c = company;
            empData.Job_Role__c = job;
            empData.Work_Format__c = workFormat;
            empData.Annual_Income__c = annualIncome;
            
            insert empData;
            Loan_Application__c loanApp = [SELECT Id FROM Loan_Application__c WHERE Id = :applicantid LIMIT 1];
            loanApp.Employment_Data__c = empData.Id;
            update loanApp;

        } catch (Exception e) {
            throw new AuraHandledException('Error updating salaried details: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void selfDetails( 
        String applicantid,
        String type,
        String exp,
        String qualification,
        String business,
        String bType,
        String job,
        String annualIncome,
        String rating
    ){
        try {
            Applicant_Employment_Data__c empData = new Applicant_Employment_Data__c();
            
            empData.Loan_Application__c = applicantid;
            empData.Name = type;
            empData.Experience_Years__c = exp;
            empData.Qualification__c = qualification;
            empData.Business_Name__c = business;
            empData.Business_Domain__c = bType;
            empData.Job_Role__c = job;
            empData.Annual_Income__c = annualIncome;
            empData.Business_Rating__c = rating;

            insert empData;
            Loan_Application__c loanApp = [SELECT Id FROM Loan_Application__c WHERE Id = :applicantid LIMIT 1];
            loanApp.Employment_Data__c = empData.Id;
            update loanApp;

        } catch (Exception e) {
            throw new AuraHandledException('Error updating self employed details: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void studentDetails( 
        String applicantid,
        String type,
        String relationToCo,
        String qualification,
        String coNumber, 
        String coName, 
        String coEmail,
        String coPan,
        String coAadhar,
        String coOccupation, 
        String coCIBIL
    ){
        try {
            Applicant_Employment_Data__c empData = new Applicant_Employment_Data__c();
            
            empData.Loan_Application__c = applicantid;
            empData.Name = type;
            empData.Relation_to_C__c = relationToCo;
            empData.Qualification__c = qualification;
            empData.Co_Applicant_Phone__c = coNumber;
            empData.Co_Applicant_Name__c = coName;
            empData.Co_Applicant_Email__c = coEmail;
            empData.Co_Applicant_PAN__c = coPan;
            empData.Co_Applicant_Aadhar__c = coAadhar != null ? Decimal.valueOf(coAadhar) : null;
            empData.Co_Applicant_Occupation__c = coOccupation;
            empData.Co_Applicant_CIBIL__c = coCIBIL != null ? Decimal.valueOf(coCIBIL) : null;

            insert empData;
            Loan_Application__c loanApp = [SELECT Id FROM Loan_Application__c WHERE Id = :applicantid LIMIT 1];
            loanApp.Employment_Data__c = empData.Id;
            update loanApp;

        } catch (Exception e) {
            throw new AuraHandledException('Error updating student details: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void unemployedDetails( 
        String applicantid,
        String type,
        String relationToCo,
        String qualification,
        String coNumber, 
        String coName, 
        String coEmail,
        String coPan,
        String coAadhar,
        String coOccupation, 
        String coCIBIL
    ){
        try {
            Applicant_Employment_Data__c empData = new Applicant_Employment_Data__c();
            
            empData.Loan_Application__c = applicantid;
            empData.Name = type;
            empData.Relation_to_C__c = relationToCo;
            empData.Qualification__c = qualification;
            empData.Co_Applicant_Phone__c = coNumber;
            empData.Co_Applicant_Name__c = coName;
            empData.Co_Applicant_Email__c = coEmail;
            empData.Co_Applicant_PAN__c = coPan;
            empData.Co_Applicant_Aadhar__c = coAadhar != null ? Decimal.valueOf(coAadhar) : null;
            empData.Co_Applicant_Occupation__c = coOccupation;
            empData.Co_Applicant_CIBIL__c = coCIBIL != null ? Decimal.valueOf(coCIBIL) : null;

            insert empData;
            Loan_Application__c loanApp = [SELECT Id FROM Loan_Application__c WHERE Id = :applicantid LIMIT 1];
            loanApp.Employment_Data__c = empData.Id;
            update loanApp;            
            
        } catch (Exception e) {
            throw new AuraHandledException('Error updating unemployed details: ' + e.getMessage());
        }
    }

    // property details

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

    // loan details

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
            appl.Total_Pending_Loans__c	= '1';

            update appl;

        } catch (Exception e) {
            throw new AuraHandledException('Error updating loan details: ' + e.getMessage());
        }
    }
}