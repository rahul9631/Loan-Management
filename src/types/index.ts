export type UserRole = 'admin' | 'collection_boy' | 'customer';

export type AppView = 'admin' | 'collection_boy' | 'customer';

export type LoanStatus = 'Pending' | 'Approved' | 'Active' | 'Partially Paid' | 'Fully Paid' | 'Overdue' | 'Closed' | 'Rejected';

export type ApplicationStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Disbursed' | 'Closed';

export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Other';

export type PaymentStatus = 'Successful' | 'Pending' | 'Failed' | 'Voided';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  mobile: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
  collectionBoyId?: string;
  lastLoginAt?: string;
}

export interface Customer {
  id: string;
  customerCode: string; // e.g. CUST-1001
  name: string;
  fatherName: string;
  mobile: string;
  alternateMobile?: string;
  email: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  photo?: string;
  status: 'Active' | 'Inactive';
  assignedCollectionBoyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  loanId: string; // e.g. LN000123
  customerId: string;
  customerName: string;
  customerMobile: string;
  principalAmount: number;
  interestRate: number; // e.g. 12%
  interestAmount: number;
  processingFee: number;
  totalPayable: number;
  totalPaid: number;
  outstandingAmount: number;
  tenureMonths: number;
  emiAmount: number;
  startDate: string;
  endDate: string;
  disbursementDate: string;
  nextDueDate: string;
  status: LoanStatus;
  purpose: string;
  assignedCollectionBoyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanPayment {
  id: string;
  receiptNumber: string; // e.g. RCPT-2024-001
  loanId: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  collectionBoyId: string;
  collectionBoyName: string;
  amount: number;
  paymentDate: string;
  paymentMode: PaymentMode;
  transactionReference?: string;
  previousPaid: number;
  previousOutstanding: number;
  newPaid: number;
  newOutstanding: number;
  remarks?: string;
  status: PaymentStatus;
  voidReason?: string;
  voidedBy?: string;
  voidedAt?: string;
  createdAt: string;
}

export interface CollectionBoy {
  id: string;
  userId: string;
  employeeCode: string; // e.g. CB1001
  name: string;
  username: string;
  mobile: string;
  email: string;
  address: string;
  joiningDate: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
  monthlyTarget: number;
}

export interface CustomerAssignment {
  id: string;
  customerId: string;
  customerName: string;
  loanId: string;
  collectionBoyId: string;
  collectionBoyName: string;
  assignedBy: string;
  assignedAt: string;
  unassignedAt?: string;
  status: 'Active' | 'Transferred' | 'Inactive';
  remarks?: string;
}

export interface LoanApplication {
  id: string;
  applicationNumber: string; // e.g. APP-2024-890
  fullName: string;
  fatherName: string;
  mobile: string;
  alternateMobile?: string;
  email: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  requestedAmount: number;
  purpose: string;
  tenureMonths: number;
  employmentType: 'Salaried' | 'Self-Employed' | 'Business' | 'Other';
  monthlyIncome: number;
  status: ApplicationStatus;
  remarks?: string;
  submittedAt: string;
  approvedLoanId?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  module: 'Auth' | 'Customer' | 'Loan' | 'Payment' | 'CollectionBoy' | 'Assignment' | 'Application' | 'Settings';
  recordId?: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface SystemSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  currencySymbol: string;
  receiptPrefix: string;
  receiptFooterNote: string;
  enableOtpVerification: boolean;
  enableOverpayment: boolean;
  defaultPaymentModes: PaymentMode[];
  dueGracePeriodDays: number;
}
