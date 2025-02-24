// emailService.test.ts

import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { convert } from 'html-to-text';
import { sendEmail } from '../../../src/resources/email/email.service';

jest.mock('@sendgrid/mail');
jest.mock('fs');
jest.mock('path');
jest.mock('handlebars');
jest.mock('html-to-text');

describe('sendEmail Functions', () => {
  const sgMailSendMock = sgMail.send as jest.MockedFunction<typeof sgMail.send>;
  const fsExistsSyncMock = fs.existsSync as jest.MockedFunction<
    typeof fs.existsSync
  >;
  const fsReadFileSyncMock = fs.readFileSync as jest.MockedFunction<
    typeof fs.readFileSync
  >;
  const pathJoinMock = path.join as jest.MockedFunction<typeof path.join>;
  const HandlebarsCompileMock = Handlebars.compile as jest.MockedFunction<
    typeof Handlebars.compile
  >;
  const convertMock = convert as jest.MockedFunction<typeof convert>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve enviar um email com parâmetros corretos', async () => {
    // Arrange
    const to = 'test@example.com';
    const title = 'Test Email';
    const name = 'Test Sender';
    const template = 'testTemplate';
    const data = { key: 'value' };

    const templatePath = '/path/to/template';
    const templateSource = '<p>Hello {{key}}</p>';
    const compiledTemplate = jest.fn().mockReturnValue('<p>Hello value</p>');
    const finalText = 'Hello value';

    // Mock implementations
    pathJoinMock.mockReturnValue(templatePath);
    fsExistsSyncMock.mockReturnValue(true);
    fsReadFileSyncMock.mockReturnValue(templateSource);
    HandlebarsCompileMock.mockReturnValue(compiledTemplate);
    convertMock.mockReturnValue(finalText);

    // Act
    await sendEmail({ to, title, name, template, data });

    // Assert
    expect(path.join).toHaveBeenCalledWith(
      expect.any(String),
      'views',
      `${template}.hbs`,
    );
    expect(fs.existsSync).toHaveBeenCalledWith(templatePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(templatePath, 'utf8');
    expect(Handlebars.compile).toHaveBeenCalledWith(templateSource);
    expect(compiledTemplate).toHaveBeenCalledWith(data);
    expect(convert).toHaveBeenCalledWith('<p>Hello value</p>', {
      wordwrap: 130,
    });
    expect(sgMail.send).toHaveBeenCalledWith({
      to,
      from: {
        email: process.env.SENDGRID_EMAIL_SEND,
        name,
      },
      subject: title,
      text: finalText,
      html: '<p>Hello value</p>',
    });
  });

  it('deve gerar um erro se o modelo handleBars não existir', async () => {
    // Arrange
    const to = 'test@example.com';
    const title = 'Test Email';
    const name = 'Test Sender';
    const template = 'nonExistentTemplate';
    const data = { key: 'value' };

    const templatePath = '/path/to/nonexistent/template';

    // Mock implementations
    pathJoinMock.mockReturnValue(templatePath);
    fsExistsSyncMock.mockReturnValue(false);

    // Act & Assert
    await expect(
      sendEmail({ to, title, name, template, data }),
    ).rejects.toThrow(`Template ${template} não encontrado em ${templatePath}`);

    expect(fs.existsSync).toHaveBeenCalledWith(templatePath);
    expect(fs.readFileSync).not.toHaveBeenCalled();
    expect(Handlebars.compile).not.toHaveBeenCalled();
    expect(sgMail.send).not.toHaveBeenCalled();
  });

  it('deve lidar com erros de sgMail.send', async () => {
    // Arrange
    const to = 'test@example.com';
    const title = 'Test Email';
    const name = 'Test Sender';
    const template = 'testTemplate';
    const data = { key: 'value' };

    const templatePath = '/path/to/template';
    const templateSource = '<p>Hello {{key}}</p>';
    const compiledTemplate = jest.fn().mockReturnValue('<p>Hello value</p>');
    const finalText = 'Hello value';
    const sendGridError = new Error('SendGrid Error');

    // Mock implementations
    pathJoinMock.mockReturnValue(templatePath);
    fsExistsSyncMock.mockReturnValue(true);
    fsReadFileSyncMock.mockReturnValue(templateSource);
    HandlebarsCompileMock.mockReturnValue(compiledTemplate);
    convertMock.mockReturnValue(finalText);
    sgMailSendMock.mockRejectedValue(sendGridError);

    // Act & Assert
    await expect(
      sendEmail({ to, title, name, template, data }),
    ).rejects.toThrow(sendGridError);

    expect(sgMail.send).toHaveBeenCalledWith({
      to,
      from: {
        email: process.env.SENDGRID_EMAIL_SEND,
        name,
      },
      subject: title,
      text: finalText,
      html: '<p>Hello value</p>',
    });
  });
});
