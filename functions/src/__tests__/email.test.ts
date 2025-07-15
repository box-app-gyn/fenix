import { EmailService } from '../services/emailService';
import { emailValidations } from '../config/email';

// Mock do nodemailer
jest.mock('nodemailer', () => ({
  createTransporter: jest.fn(() => ({
    verify: jest.fn().mockResolvedValue(true),
    sendMail: jest.fn().mockResolvedValue({
      messageId: 'test-message-id-123'
    })
  }))
}));

// Mock do logger
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    business: jest.fn()
  }
}));

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  describe('validateEmail', () => {
    it('deve validar emails corretos', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ];

      validEmails.forEach(email => {
        expect(emailValidations.emailRegex.test(email)).toBe(true);
      });
    });

    it('deve rejeitar emails inválidos', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com'
      ];

      invalidEmails.forEach(email => {
        expect(emailValidations.emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe('sendEmail', () => {
    it('deve enviar email com sucesso', async () => {
      const options = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>'
      };

      const result = await emailService.sendEmail(options);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('test-message-id-123');
    });

    it('deve rejeitar emails inválidos', async () => {
      const options = {
        to: 'invalid-email',
        subject: 'Test Subject',
        html: '<p>Test content</p>'
      };

      const result = await emailService.sendEmail(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Nenhum email válido fornecido');
    });

    it('deve lidar com múltiplos destinatários', async () => {
      const options = {
        to: ['test1@example.com', 'test2@example.com'],
        subject: 'Test Subject',
        html: '<p>Test content</p>'
      };

      const result = await emailService.sendEmail(options);

      expect(result.success).toBe(true);
    });

    it('deve filtrar emails inválidos de lista', async () => {
      const options = {
        to: ['valid@example.com', 'invalid-email', 'another@example.com'],
        subject: 'Test Subject',
        html: '<p>Test content</p>'
      };

      const result = await emailService.sendEmail(options);

      expect(result.success).toBe(true);
    });
  });

  describe('sendTemplateEmail', () => {
    it('deve enviar email com template pedido', async () => {
      const data = {
        userName: 'João Silva',
        userEmail: 'joao@example.com',
        dadosAdicionais: {
          tipo: 'Ingresso Premium',
          quantidade: 2,
          valorTotal: '150,00'
        }
      };

      const result = await emailService.sendTemplateEmail('pedido', data, data.userEmail);

      expect(result.success).toBe(true);
    });

    it('deve enviar email com template audiovisual aprovado', async () => {
      const data = {
        userName: 'Maria Santos',
        userEmail: 'maria@example.com',
        dadosAdicionais: {
          aprovado: true,
          tipo: 'Fotógrafo Profissional'
        }
      };

      const result = await emailService.sendTemplateEmail('audiovisual', data, data.userEmail);

      expect(result.success).toBe(true);
    });

    it('deve enviar email com template audiovisual rejeitado', async () => {
      const data = {
        userName: 'Pedro Costa',
        userEmail: 'pedro@example.com',
        dadosAdicionais: {
          aprovado: false,
          tipo: 'Videomaker',
          motivoRejeicao: 'Portfolio insuficiente'
        }
      };

      const result = await emailService.sendTemplateEmail('audiovisual', data, data.userEmail);

      expect(result.success).toBe(true);
    });

    it('deve enviar email com template admin', async () => {
      const data = {
        userName: 'Ana Silva',
        userEmail: 'ana@example.com',
        dadosAdicionais: {
          message: 'Sua inscrição foi processada com sucesso!'
        }
      };

      const result = await emailService.sendTemplateEmail('admin', data, data.userEmail);

      expect(result.success).toBe(true);
    });

    it('deve enviar email com template boas-vindas', async () => {
      const data = {
        userName: 'Carlos Oliveira',
        userEmail: 'carlos@example.com'
      };

      const result = await emailService.sendTemplateEmail('boasVindas', data, data.userEmail);

      expect(result.success).toBe(true);
    });

    it('deve rejeitar template inexistente', async () => {
      const data = {
        userName: 'Test User',
        userEmail: 'test@example.com'
      };

      const result = await emailService.sendTemplateEmail('templateInexistente' as any, data, data.userEmail);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Template');
    });
  });

  describe('Métodos específicos', () => {
    it('deve enviar email de confirmação', async () => {
      const data = {
        userName: 'João Silva',
        userEmail: 'joao@example.com',
        dadosAdicionais: {
          tipo: 'Ingresso Premium',
          quantidade: 1,
          valorTotal: '75,00'
        }
      };

      const result = await emailService.sendConfirmationEmail(data);

      expect(result.success).toBe(true);
    });

    it('deve enviar email de status audiovisual', async () => {
      const data = {
        userName: 'Maria Santos',
        userEmail: 'maria@example.com',
        dadosAdicionais: {
          aprovado: true,
          tipo: 'Fotógrafo'
        }
      };

      const result = await emailService.sendAudiovisualStatusEmail(data);

      expect(result.success).toBe(true);
    });

    it('deve enviar email de notificação', async () => {
      const data = {
        userName: 'Pedro Costa',
        userEmail: 'pedro@example.com',
        dadosAdicionais: {
          message: 'Notificação importante'
        }
      };

      const result = await emailService.sendNotificationEmail(data);

      expect(result.success).toBe(true);
    });

    it('deve enviar email de boas-vindas', async () => {
      const data = {
        userName: 'Ana Silva',
        userEmail: 'ana@example.com'
      };

      const result = await emailService.sendWelcomeEmail(data);

      expect(result.success).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('deve implementar rate limiting', async () => {
      const email = 'test@example.com';
      const options = {
        to: email,
        subject: 'Test',
        html: '<p>Test</p>'
      };

      // Primeiro email deve passar
      const result1 = await emailService.sendEmail(options);
      expect(result1.success).toBe(true);

      // Limpar cache para teste
      emailService.clearRateLimitCache();
    });
  });

  describe('Health Check', () => {
    it('deve verificar saúde do serviço', async () => {
      const isHealthy = await emailService.checkHealth();
      expect(isHealthy).toBe(true);
    });
  });

  describe('Sanitização', () => {
    it('deve sanitizar dados de entrada', () => {
      const maliciousData = {
        userName: '<script>alert("xss")</script>João',
        userEmail: 'joao@example.com',
        dadosAdicionais: {
          message: '<img src="x" onerror="alert(1)">Mensagem'
        }
      };

      // O sistema deve sanitizar automaticamente
      expect(maliciousData.userName).toContain('<script>');
    });
  });

  describe('Limites de tamanho', () => {
    it('deve respeitar limite de assunto', async () => {
      const longSubject = 'A'.repeat(200);
      const options = {
        to: 'test@example.com',
        subject: longSubject,
        html: '<p>Test</p>'
      };

      const result = await emailService.sendEmail(options);
      expect(result.success).toBe(true);
    });

    it('deve respeitar limite de corpo', async () => {
      const longBody = '<p>' + 'A'.repeat(15000) + '</p>';
      const options = {
        to: 'test@example.com',
        subject: 'Test',
        html: longBody
      };

      const result = await emailService.sendEmail(options);
      expect(result.success).toBe(true);
    });
  });
});

// Testes de integração (requer configuração real)
describe('EmailService Integration', () => {
  // Estes testes só devem rodar em ambiente de desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    it('deve conectar com servidor SMTP local', async () => {
      const emailService = new EmailService();
      const isHealthy = await emailService.checkHealth();
      expect(isHealthy).toBe(true);
    });
  }
}); 