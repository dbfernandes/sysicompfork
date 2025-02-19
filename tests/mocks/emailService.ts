export const emailService = {
  formatarDataExtensa: jest.fn(),
  sendEmail: jest.fn(),
};

jest.mock('@/resources/email/emailService', () => emailService);
