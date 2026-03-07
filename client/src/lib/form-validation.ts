export interface FormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  project?: string;
  address?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateContactForm(data: Partial<FormData>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  return errors;
}

export function validateEstimateForm(data: Partial<FormData>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  if (!data.project || data.project.trim().length < 10) {
    errors.push({ field: 'project', message: 'Project description must be at least 10 characters long' });
  }

  
  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}
