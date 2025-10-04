# Loan Origination System (LOS)  
Salesforce Loan Origination Prototype  

The **Loan Origination System (LOS)** is a Salesforce-based prototype designed to assist Relationship Managers in streamlining loan processing by reducing manual data entry, accelerating underwriting workflows, and incorporating intelligent KYC verification.  

## 🚀 Quick Start  
### Prerequisites  
- Salesforce CLI  
- Visual Studio Code + Salesforce Extensions  
- Access to a Salesforce org (Dev / Sandbox / Production)  
- Node.js (for LWC development & testing)  

### Installation  

```bash
git clone https://github.com/aditibadkur/Loan-Origination-System.git
cd Loan-Origination-System
```

## 📋 System Overview
This prototype helps simplify loan origination by:
- 📝 Intelligent Auto-Fill Forms – Pre-populate applicant/loan fields to minimize manual entry
- ⚡ Automated Underwriting Flows – Drive decision-making via Salesforce Flows
- 🧾 Mock KYC Verification – Simulated workflows to validate applicant information
- 📊 Risk Scoring Logic – Apex logic to combine income and credit data into a single score
- 👤 Relationship Manager Dashboards – Track application statuses and risk outcomes

## 🔑 Core Features
| Feature                | Description                                               | Users                 |
|-------------------------|-----------------------------------------------------------|-----------------------|
| Auto-Fill Loan Forms    | Intelligent form population from applicant data           | Relationship Managers |
| KYC Verification        | Simulated workflow for document & identity verification   | Relationship Managers |
| Underwriting Automation | Automated Salesforce Flows for loan decisions             | Loan Officers / System|
| Risk Scoring            | Apex-driven income + credit evaluation logic              | Loan Officers / RMs   |
| Application Dashboard   | View pipeline, statuses, and risk levels                  | Relationship Managers |

## 🔧 Development Guide
### Project Structure
```bash
force-app/main/default/
├── classes/            # Apex controllers & services
├── lwc/                # Lightning Web Components
├── objects/            # Custom objects & fields
├── flows/              # Salesforce Flows
├── permissionsets/     # Permission sets
└── ...
```
## 📖 Usage Guide
### For Relationship Managers
- Create new loan applications via the Auto-Fill Form
- Submit applications for KYC verification
- Review underwriting & risk scores
- Track loan status on the dashboard

### For Loan Officers
- Configure credit/income thresholds via metadata
- Review flagged applications
- Approve/reject based on risk evaluation

### For Admins
- Manage custom metadata (rules, KYC config)
- Assign permission sets
- Deploy & monitor Salesforce Flows

## 🔒 Security Features
- Role-based access to loan application data
- Field-level security for sensitive applicant fields
- Metadata-driven configuration for underwriting rules

## 📄 License
This project is licensed under the MIT License – see the LICENSE file for details.
