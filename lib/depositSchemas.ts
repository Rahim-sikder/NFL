import { z } from 'zod';
import { validateExt, validateFileSize, MAX_FILE_SIZE } from './file';

// File validation schema
const fileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  uri: z.string(),
}).refine(
  (file) => validateFileSize(file.size),
  { message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB` }
);

// Image file schema (png, jpeg, jpg, webp)
const imageFileSchema = fileSchema.refine(
  (file) => validateExt(file.type, ['png', 'jpeg', 'jpg', 'webp']),
  { message: 'File must be PNG, JPEG, JPG, or WebP format' }
);

// Document file schema (png, jpeg, jpg, webp, pdf)
const documentFileSchema = fileSchema.refine(
  (file) => validateExt(file.type, ['png', 'jpeg', 'jpg', 'webp', 'pdf']),
  { message: 'File must be PNG, JPEG, JPG, WebP, or PDF format' }
);

// Step 1: Applicant Info Schema
export const applicantInfoSchema = z.object({
  accountName: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name must be less than 80 characters'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  mailingAddress: z.string().min(5, 'Address must be at least 5 characters').max(200, 'Address must be less than 200 characters'),
  nidDoc: documentFileSchema,
  photo: imageFileSchema,
  signature: documentFileSchema,
  tin: documentFileSchema.nullable().optional(),
});

// Step 0: Deposit Type Selection Schema
export const depositTypeSchema = z.object({
  depositCategory: z.string().min(1, 'Please select a deposit category'),
  depositType: z.string().min(1, 'Please select a deposit type'),
});

// Step 2: Deposit Details Schema
export const depositDetailsSchema = z.object({
  depositAmount: z.number().positive('Deposit amount must be greater than 0'),
  depositTerm: z.number().int().positive('Deposit term must be a positive integer'),
  monthlyInstallment: z.number().optional(),
  occupation: z.string().min(2, 'Occupation must be at least 2 characters'),
});

// Nominee schema
const nomineeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name must be less than 60 characters'),
  idDoc: documentFileSchema,
  relation: z.string().min(2, 'Relation must be at least 2 characters').max(40, 'Relation must be less than 40 characters'),
  photo: imageFileSchema,
  percentage: z.number().min(0, 'Percentage must be at least 0').max(100, 'Percentage must be at most 100'),
  signature: documentFileSchema,
});

// Step 3: Nominee Details Schema
export const nomineeDetailsSchema = z.object({
  nominees: z.array(nomineeSchema).min(1, 'At least one nominee is required'),
}).refine(
  (data) => {
    const totalPercentage = data.nominees.reduce((sum, nominee) => sum + nominee.percentage, 0);
    return Math.abs(totalPercentage - 100) < 0.01;
  },
  { message: 'Total nominee percentages must equal 100%', path: ['nominees'] }
);

// Step 4: Bank Details Schema
export const bankDetailsSchema = z.object({
  bankAccountName: z.string().min(2, 'Account name must be at least 2 characters').max(80, 'Account name must be less than 80 characters'),
  accountNo: z.string().regex(/^[0-9-]{6,20}$/, 'Account number must be 6-20 characters with only digits and hyphens'),
  bankName: z.string().min(2, 'Bank name must be at least 2 characters').max(80, 'Bank name must be less than 80 characters').optional().or(z.literal('')),
  branchName: z.string().min(2, 'Branch name must be at least 2 characters').max(80, 'Branch name must be less than 80 characters'),
  autoPaymentSOD: z.boolean(),
  autoPaymentDay: z.number().int().min(1).max(28).optional(),
}).refine(
  (data) => {
    if (data.autoPaymentSOD && !data.autoPaymentDay) {
      return false;
    }
    return true;
  },
  { message: 'Auto payment day is required when auto payment is enabled', path: ['autoPaymentDay'] }
);

// Step 5: Payment & Terms Schema
export const paymentTermsSchema = z.object({
  termsAccepted: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms and conditions' }) }),
  trxId: z.string().min(6, 'Transaction ID must be at least 6 characters').max(40, 'Transaction ID must be less than 40 characters').optional().or(z.literal('')),
  trxScreenshot: documentFileSchema.optional(),
}).refine(
  (data) => {
    if (data.trxScreenshot && (!data.trxId || data.trxId.trim() === '')) {
      return false;
    }
    return true;
  },
  { message: 'Transaction ID is required when transaction screenshot is provided', path: ['trxId'] }
);

// Full application schema
export const fullApplicationSchema = z.object({
  depositType: depositTypeSchema,
  applicantInfo: applicantInfoSchema,
  depositDetails: depositDetailsSchema,
  nomineeDetails: nomineeDetailsSchema,
  bankDetails: bankDetailsSchema,
  paymentTerms: paymentTermsSchema,
});