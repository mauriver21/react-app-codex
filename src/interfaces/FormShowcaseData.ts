import type { FormShowcaseContactMethod } from '@/interfaces/FormShowcaseContactMethod';
import type { FormShowcaseRole } from '@/interfaces/FormShowcaseRole';

export interface FormShowcaseData {
  fullName: string;
  email: string;
  password: string;
  role: FormShowcaseRole | '';
  preferredContact: FormShowcaseContactMethod | '';
  acceptTerms: boolean;
}
