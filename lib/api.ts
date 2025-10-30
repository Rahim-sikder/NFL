// Mock API functions for NFL Mobile App

export interface OTPSendRequest {
  msisdn: string;
}

export interface OTPSendResponse {
  ok: boolean;
  ref: string;
}

export interface OTPVerifyRequest {
  msisdn: string;
  code: string;
  ref: string;
}

export interface OTPVerifyResponse {
  ok: boolean;
}

export interface RegisterExistingRequest {
  msisdn: string;
  accountNo: string;
  dob: string;
  userId: string;
  password: string;
}

export interface RegisterExistingResponse {
  ok: boolean;
  token: string;
}

// Mock delay to simulate network request
const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Deposit-related interfaces
export interface DepositAccount {
  id: string;
  accountNumber: string;
  maskedNo: string;
  productName: string;
  currentBalance: number;
  maturityAmount?: number;
  maturityDate?: string;
  tenure?: number;
  remainingTenure?: number;
  interestPayment?: 'Monthly' | 'Quarterly';
  status: 'Active' | 'Matured' | 'Closed';
  accountType: 'Savings' | 'Current' | 'Fixed Deposit' | 'DPS' | 'Special Savings';
}

// Loan-related interfaces
export interface LoanAccount {
  id: string;
  accountNumber: string;
  maskedNo: string;
  productName: string;
  currentBalance: number;
  emiAmount: number;
  nextEmiDate: string;
  loanTenure: number;
  remainingTenure: number;
  interestRate: number;
  status: 'Active' | 'Closed' | 'Overdue';
}

export interface StatementTransaction {
  id: string;
  date: string;
  description: string;
  debitAmount?: number;
  creditAmount?: number;
  balance: number;
  transactionType: 'EMI Payment' | 'Interest Charge' | 'Late Fee' | 'Principal Payment' | 'Loan Disbursement';
}

export interface LoanStatement {
  accountId: string;
  accountNumber: string;
  statementPeriod: {
    from: string;
    to: string;
  };
  openingBalance: number;
  closingBalance: number;
  totalDebits: number;
  totalCredits: number;
  transactions: StatementTransaction[];
}

// Mock OTP Send API
export const sendOTP = async (data: OTPSendRequest): Promise<OTPSendResponse> => {
  await mockDelay(800);
  
  // Simulate validation
  if (!data.msisdn || data.msisdn.length < 11) {
    throw new Error('Invalid mobile number');
  }
  
  return {
    ok: true,
    ref: `mockRef_${Date.now()}`
  };
};

// Mock OTP Verify API
export const verifyOTP = async (data: OTPVerifyRequest): Promise<OTPVerifyResponse> => {
  await mockDelay(600);
  
  // Simulate validation
  if (!data.code || data.code.length !== 6) {
    throw new Error('Invalid OTP code');
  }
  
  if (!data.ref) {
    throw new Error('Invalid reference');
  }
  
  // Mock: Accept any 6-digit code for demo
  return {
    ok: true
  };
};

// Mock Register Existing Customer API
export const registerExisting = async (data: RegisterExistingRequest): Promise<RegisterExistingResponse> => {
  await mockDelay(1200);
  
  // Simulate validation
  if (!data.msisdn || !data.accountNo || !data.dob || !data.userId || !data.password) {
    throw new Error('All fields are required');
  }
  
  return {
    ok: true,
    token: `mock_token_${Date.now()}`
  };
};

// Export all API functions
// Deposit-related interfaces
export interface InterestRate {
  termMonths: number;
  rate: number;
}

export interface DepositApplicationRequest {
  // Applicant Info
  accountName: string;
  email?: string;
  mailingAddress: string;
  nidDoc: any; // File meta
  photo: any; // File meta
  signature: any; // File meta
  tin?: any; // File meta
  
  // Deposit Details
  depositAmount: number;
  depositTerm: number;
  occupation: string;
  
  // Nominee Details
  nominees: Array<{
    name: string;
    idDoc: any;
    relation: string;
    photo: any;
    percentage: number;
    signature: any;
  }>;
  
  // Bank Details
  bankAccountName: string;
  accountNo: string;
  bankName?: string;
  branchName: string;
  autoPaymentSOD: boolean;
  autoPaymentDay?: number;
  
  // Payment & Terms
  termsAccepted: boolean;
  trxId?: string;
  trxScreenshot?: any;
}

export interface DepositApplicationResponse {
  ok: boolean;
  ref: string;
}

// Mock Interest Rates API
export const getInterestRates = async (): Promise<InterestRate[]> => {
  await mockDelay(500);
  
  return [
    { termMonths: 3, rate: 8.5 },
    { termMonths: 6, rate: 9.0 },
    { termMonths: 12, rate: 9.5 },
    { termMonths: 24, rate: 10.0 },
    { termMonths: 36, rate: 10.5 },
    { termMonths: 60, rate: 11.0 }
  ];
};

// Mock Deposit Application API
export const submitDepositApplication = async (data: DepositApplicationRequest): Promise<DepositApplicationResponse> => {
  await mockDelay(2000);
  
  // Simulate validation
  if (!data.accountName || !data.depositAmount || data.nominees.length === 0) {
    throw new Error('Missing required fields');
  }
  
  // Validate nominee percentages sum to 100
  const totalPercentage = data.nominees.reduce((sum, nominee) => sum + nominee.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error('Nominee percentages must sum to 100%');
  }
  
  return {
    ok: true,
    ref: `DEP-2025-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
  };
};

// Mock Loan API functions
export const getLoanAccounts = async (): Promise<LoanAccount[]> => {
  await mockDelay(1000);
  
  return [
    {
      id: 'loan-001',
      accountNumber: '1234567890123456',
      maskedNo: '****-****-****-3456',
      productName: 'Personal Loan',
      currentBalance: 450000,
      emiAmount: 15000,
      nextEmiDate: '2024-02-15',
      loanTenure: 36,
      remainingTenure: 24,
      interestRate: 12.5,
      status: 'Active',
    },
    {
      id: 'loan-002',
      accountNumber: '2345678901234567',
      maskedNo: '****-****-****-4567',
      productName: 'Home Loan',
      currentBalance: 2850000,
      emiAmount: 35000,
      nextEmiDate: '2024-02-20',
      loanTenure: 240,
      remainingTenure: 180,
      interestRate: 9.75,
      status: 'Active',
    },
    {
      id: 'loan-003',
      accountNumber: '3456789012345678',
      maskedNo: '****-****-****-5678',
      productName: 'Car Loan',
      currentBalance: 125000,
      emiAmount: 8500,
      nextEmiDate: '2024-02-10',
      loanTenure: 60,
      remainingTenure: 18,
      interestRate: 11.25,
      status: 'Active',
    },
  ];
};

// Mock Deposit API functions
export const getDepositAccounts = async (): Promise<DepositAccount[]> => {
  await mockDelay(1000);
  
  return [
    {
      id: 'dep-003',
      accountNumber: 'PES001234567892',
      maskedNo: '****-****-7892',
      productName: 'Periodic Earner Scheme (PES)',
      currentBalance: 220000,
      maturityAmount: 265000,
      maturityDate: '2026-06-15',
      tenure: 18,
      remainingTenure: 12,
      interestPayment: 'Monthly',
      status: 'Active',
      accountType: 'Fixed Deposit',
    },
    {
      id: 'dep-004',
      accountNumber: 'EFDS001234567893',
      maskedNo: '****-****-7893',
      productName: 'Earn First Deposit Scheme (EFDS)',
      currentBalance: 50000,
      maturityAmount: 58000,
      maturityDate: '2025-12-31',
      tenure: 12,
      remainingTenure: 8,
      interestPayment: 'Monthly',
      status: 'Active',
      accountType: 'Fixed Deposit',
    },
    {
      id: 'dep-005',
      accountNumber: 'EFDS001234567894',
      maskedNo: '****-****-7894',
      productName: 'Earn First Deposit Scheme (EFDS)',
      currentBalance: 200000,
      maturityAmount: 248000,
      maturityDate: '2026-12-31',
      tenure: 24,
      remainingTenure: 18,
      interestPayment: 'Quarterly',
      status: 'Active',
      accountType: 'Fixed Deposit',
    },
  ];
};

export const getLoanStatement = async (params: {
  acct: string;
  from: string;
  to: string;
}): Promise<LoanStatement> => {
  await mockDelay(1500);
  
  // Mock transaction data based on account
  const mockTransactions: StatementTransaction[] = [
    {
      id: 'txn-001',
      date: '2024-01-15',
      description: 'Monthly EMI Payment',
      debitAmount: 15000,
      balance: 465000,
      transactionType: 'EMI Payment',
    },
    {
      id: 'txn-002',
      date: '2024-01-16',
      description: 'Interest Charge',
      creditAmount: 4687.50,
      balance: 469687.50,
      transactionType: 'Interest Charge',
    },
    {
      id: 'txn-003',
      date: '2024-01-20',
      description: 'Principal Payment',
      debitAmount: 10312.50,
      balance: 459375,
      transactionType: 'Principal Payment',
    },
    {
      id: 'txn-004',
      date: '2024-01-25',
      description: 'Late Fee Charge',
      creditAmount: 500,
      balance: 459875,
      transactionType: 'Late Fee',
    },
    {
      id: 'txn-005',
      date: '2024-02-01',
      description: 'Additional Payment',
      debitAmount: 5000,
      balance: 454875,
      transactionType: 'Principal Payment',
    },
  ];
  
  const openingBalance = 480000;
  const closingBalance = 450000;
  const totalDebits = mockTransactions.reduce((sum, txn) => sum + (txn.debitAmount || 0), 0);
  const totalCredits = mockTransactions.reduce((sum, txn) => sum + (txn.creditAmount || 0), 0);
  
  return {
    accountId: params.acct,
    accountNumber: params.acct === 'loan-001' ? '1234567890123456' : 
                   params.acct === 'loan-002' ? '2345678901234567' : '3456789012345678',
    statementPeriod: {
      from: params.from,
      to: params.to,
    },
    openingBalance,
    closingBalance,
    totalDebits,
    totalCredits,
    transactions: mockTransactions,
  };
};

export const exportStatementPDF = async (params: {
  acct: string;
  from: string;
  to: string;
  kind: 'loan';
}): Promise<{ success: boolean; message: string; downloadUrl?: string }> => {
  await mockDelay(2000);
  
  // Mock PDF export
  return {
    success: true,
    message: 'Statement exported successfully',
    downloadUrl: `https://mock-api.nfl.com/statements/${params.acct}_${params.from}_${params.to}.pdf`,
  };
};

// Loan Application interfaces
export interface LoanProduct {
  id: string;
  name: string;
  tenorMin: number;
  tenorMax: number;
  indicativeRate: number;
  description?: string;
}

export interface LoanApplicationPayload {
  loanType: string;
  customerSegment: string;
  applicantInfo: any;
  employmentIncome: any;
  loanDetails: any;
  documents: any;
  declarations: any;
  submittedAt: string;
}

export interface LoanApplicationResponse {
  ok: boolean;
  ref: string;
}

// Loan Application API functions
export const getLoanProducts = async (): Promise<LoanProduct[]> => {
  await mockDelay(800);
  
  return [
    {
      id: 'personal',
      name: 'Personal Loan',
      tenorMin: 6,
      tenorMax: 60,
      indicativeRate: 12.5,
      description: 'Unsecured personal loan for various purposes',
    },
    {
      id: 'auto',
      name: 'Auto Loan',
      tenorMin: 12,
      tenorMax: 84,
      indicativeRate: 10.5,
      description: 'Vehicle financing with competitive rates',
    },
    {
      id: 'home',
      name: 'Home Loan',
      tenorMin: 60,
      tenorMax: 300,
      indicativeRate: 9.5,
      description: 'Home purchase and construction financing',
    },
    {
      id: 'others',
      name: 'Others',
      tenorMin: 6,
      tenorMax: 36,
      indicativeRate: 13.5,
      description: 'Other loan products as per requirement',
    },
  ];
};

export const postLoanApply = async (payload: LoanApplicationPayload): Promise<LoanApplicationResponse> => {
  await mockDelay(2000);
  
  // Generate a mock reference number
  const timestamp = Date.now();
  const ref = `LN-${new Date().getFullYear()}-${String(timestamp).slice(-6)}`;
  
  // Simulate success (you could add validation logic here)
  return {
    ok: true,
    ref,
  };
};

// Draft storage helpers (using AsyncStorage)
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setLoanDraft = async (stepKey: string, data: any): Promise<void> => {
  try {
    const existingDraft = await getLoanDraft();
    const updatedDraft = {
      ...existingDraft,
      [stepKey]: data,
      lastUpdated: new Date().toISOString(),
    };
    await AsyncStorage.setItem('loanDraft', JSON.stringify(updatedDraft));
  } catch (error) {
    console.error('Error saving loan draft:', error);
  }
};

export const getLoanDraft = async (): Promise<any> => {
  try {
    const draft = await AsyncStorage.getItem('loanDraft');
    return draft ? JSON.parse(draft) : {};
  } catch (error) {
    console.error('Error loading loan draft:', error);
    return {};
  }
};

export const clearLoanDraft = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('loanDraft');
  } catch (error) {
    console.error('Error clearing loan draft:', error);
  }
};

// SSL Payment Gateway interfaces and functions
export interface PaymentInitiateRequest {
  depositId: string;
  amount: number;
  userId: string;
}

export interface PaymentInitiateResponse {
  gatewayUrl: string;
  txnId: string;
}

export interface PaymentVerifyRequest {
  txnId: string;
}

export interface PaymentVerifyResponse {
  status: 'success' | 'failed' | 'pending';
  amount?: number;
  transactionId?: string;
  paymentMethod?: string;
  timestamp?: string;
}

// Mock SSL Payment Gateway functions
export const initiateDepositPayment = async (data: PaymentInitiateRequest): Promise<PaymentInitiateResponse> => {
  await mockDelay(1500);
  
  // Mock gateway URL with embedded success/fail/cancel URLs
  const baseUrl = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
  const mockGatewayUrl = `${baseUrl}?store_id=nfl_test&amount=${data.amount}&currency=BDT&tran_id=${data.depositId}_${Date.now()}&success_url=${encodeURIComponent('exp://localhost:8081/open-deposit/payment/success')}&fail_url=${encodeURIComponent('exp://localhost:8081/open-deposit/payment/failed')}&cancel_url=${encodeURIComponent('exp://localhost:8081/open-deposit/payment/cancel')}`;
  
  return {
    gatewayUrl: mockGatewayUrl,
    txnId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
};

export const verifyDepositPayment = async (data: PaymentVerifyRequest): Promise<PaymentVerifyResponse> => {
  await mockDelay(1000);
  
  // Mock verification - randomly return success/failed for demo
  const isSuccess = Math.random() > 0.2; // 80% success rate
  
  if (isSuccess) {
    return {
      status: 'success',
      amount: 10000,
      transactionId: data.txnId,
      paymentMethod: 'Visa Card ending in 1234',
      timestamp: new Date().toISOString()
    };
  } else {
    return {
      status: 'failed'
    };
  }
};

export const api = {
  sendOTP,
  verifyOTP,
  registerExisting,
  getInterestRates,
  submitDepositApplication,
  getLoanAccounts,
  getDepositAccounts,
  getLoanStatement,
  exportStatementPDF,
  getLoanProducts,
  postLoanApply,
  setLoanDraft,
  getLoanDraft,
  clearLoanDraft,
  initiateDepositPayment,
  verifyDepositPayment
};

export default api;