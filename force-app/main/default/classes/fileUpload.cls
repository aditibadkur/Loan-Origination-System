public with sharing class fileUpload {
    @AuraEnabled(cacheable=false) 
    public static List<ContentDocumentLink> fetchFiles(String recordId){
        try {
            // More flexible access check
            if (!Schema.sObjectType.ContentDocumentLink.isAccessible()) {
                throw new AuraHandledException('No access to files');
            }
            
            return [SELECT ContentDocumentId, 
                    ContentDocument.Title, 
                    ContentDocument.FileType,
                    ContentDocument.ContentSize,
                    ContentDocument.LatestPublishedVersionId
                    FROM ContentDocumentLink  
                    WHERE LinkedEntityId = :recordId
                    AND ContentDocument.IsDeleted = false
                    ORDER BY ContentDocument.Title ASC
                    LIMIT 50];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching files: ' + e.getMessage());
        }
    }
}