import {
  // Tipos base
  UserRole,
  PaymentStatus,
  ApprovalStatus,
  ConviteStatus,
  AudiovisualTipo,
  CategoriaCompeticao,
  LoteInscricao,
  UpsellTipo,
  CategoriaPatrocinador,
  StatusPatrocinador,

  // Gamificação
  GamificationAction,
  GamificationLevel,
  RewardStatus,

  // Interfaces
  FirestoreUser,
  FirestoreTeam,
  FirestorePedido,
  FirestoreAudiovisual,
  FirestorePatrocinador,
  FirestoreGamificationAction,
  FirestoreGamificationLeaderboard,
  FirestoreGamificationReward,

  // Utilitários
  isValidUserRole,
  isValidPaymentStatus,
  isValidGamificationAction,
  isValidGamificationLevel,
  calculateGamificationLevel,
  validateUserData,
  validateTeamData,
  createTimestamp,
  timestampToDate,
  dateToTimestamp,
  calculatePointsForAction,
  generateReferralCode,
  sanitizeUserData,
  sanitizeTeamData,

  // Constantes
  GAMIFICATION_POINTS,
} from '../firestore';

describe('Firestore Types - Validação de Tipos', () => {
  describe('isValidUserRole', () => {
    it('deve validar roles válidos', () => {
      expect(isValidUserRole('publico')).toBe(true);
      expect(isValidUserRole('fotografo')).toBe(true);
      expect(isValidUserRole('videomaker')).toBe(true);
      expect(isValidUserRole('patrocinador')).toBe(true);
      expect(isValidUserRole('apoio')).toBe(true);
      expect(isValidUserRole('judge')).toBe(true);
      expect(isValidUserRole('atleta')).toBe(true);
      expect(isValidUserRole('admin')).toBe(true);
    });

    it('deve rejeitar roles inválidos', () => {
      expect(isValidUserRole('invalid')).toBe(false);
      expect(isValidUserRole('')).toBe(false);
      expect(isValidUserRole('USER')).toBe(false);
    });
  });

  describe('isValidPaymentStatus', () => {
    it('deve validar status válidos', () => {
      expect(isValidPaymentStatus('pending')).toBe(true);
      expect(isValidPaymentStatus('paid')).toBe(true);
      expect(isValidPaymentStatus('failed')).toBe(true);
      expect(isValidPaymentStatus('refunded')).toBe(true);
      expect(isValidPaymentStatus('expired')).toBe(true);
    });

    it('deve rejeitar status inválidos', () => {
      expect(isValidPaymentStatus('invalid')).toBe(false);
      expect(isValidPaymentStatus('')).toBe(false);
      expect(isValidPaymentStatus('PENDING')).toBe(false);
    });
  });

  describe('isValidGamificationAction', () => {
    it('deve validar ações válidas', () => {
      expect(isValidGamificationAction('cadastro')).toBe(true);
      expect(isValidGamificationAction('indicacao_confirmada')).toBe(true);
      expect(isValidGamificationAction('compra_ingresso')).toBe(true);
      expect(isValidGamificationAction('envio_conteudo')).toBe(true);
      expect(isValidGamificationAction('qr_scan_evento')).toBe(true);
      expect(isValidGamificationAction('prova_extra')).toBe(true);
      expect(isValidGamificationAction('participacao_enquete')).toBe(true);
      expect(isValidGamificationAction('acesso_spoiler')).toBe(true);
      expect(isValidGamificationAction('checkin_evento')).toBe(true);
      expect(isValidGamificationAction('compartilhamento')).toBe(true);
      expect(isValidGamificationAction('login_diario')).toBe(true);
      expect(isValidGamificationAction('completar_perfil')).toBe(true);
    });

    it('deve rejeitar ações inválidas', () => {
      expect(isValidGamificationAction('invalid')).toBe(false);
      expect(isValidGamificationAction('')).toBe(false);
      expect(isValidGamificationAction('CADASTRO')).toBe(false);
    });
  });

  describe('isValidGamificationLevel', () => {
    it('deve validar níveis válidos', () => {
      expect(isValidGamificationLevel('iniciante')).toBe(true);
      expect(isValidGamificationLevel('bronze')).toBe(true);
      expect(isValidGamificationLevel('prata')).toBe(true);
      expect(isValidGamificationLevel('ouro')).toBe(true);
      expect(isValidGamificationLevel('platina')).toBe(true);
      expect(isValidGamificationLevel('diamante')).toBe(true);
    });

    it('deve rejeitar níveis inválidos', () => {
      expect(isValidGamificationLevel('invalid')).toBe(false);
      expect(isValidGamificationLevel('')).toBe(false);
      expect(isValidGamificationLevel('INICIANTE')).toBe(false);
    });
  });
});

describe('Firestore Types - Gamificação', () => {
  describe('calculateGamificationLevel', () => {
    it('deve calcular níveis corretamente', () => {
      expect(calculateGamificationLevel(0)).toBe('iniciante');
      expect(calculateGamificationLevel(50)).toBe('iniciante');
      expect(calculateGamificationLevel(99)).toBe('iniciante');

      expect(calculateGamificationLevel(100)).toBe('bronze');
      expect(calculateGamificationLevel(200)).toBe('bronze');
      expect(calculateGamificationLevel(299)).toBe('bronze');

      expect(calculateGamificationLevel(300)).toBe('prata');
      expect(calculateGamificationLevel(400)).toBe('prata');
      expect(calculateGamificationLevel(599)).toBe('prata');

      expect(calculateGamificationLevel(600)).toBe('ouro');
      expect(calculateGamificationLevel(800)).toBe('ouro');
      expect(calculateGamificationLevel(999)).toBe('ouro');

      expect(calculateGamificationLevel(1000)).toBe('platina');
      expect(calculateGamificationLevel(1500)).toBe('platina');
      expect(calculateGamificationLevel(1999)).toBe('platina');

      expect(calculateGamificationLevel(2000)).toBe('diamante');
      expect(calculateGamificationLevel(5000)).toBe('diamante');
      expect(calculateGamificationLevel(10000)).toBe('diamante');
    });
  });

  describe('GAMIFICATION_POINTS', () => {
    it('deve ter pontos definidos para todas as ações', () => {
      expect(GAMIFICATION_POINTS.cadastro).toBe(10);
      expect(GAMIFICATION_POINTS.indicacao_confirmada).toBe(50);
      expect(GAMIFICATION_POINTS.compra_ingresso).toBe(100);
      expect(GAMIFICATION_POINTS.envio_conteudo).toBe(75);
      expect(GAMIFICATION_POINTS.qr_scan_evento).toBe(25);
      expect(GAMIFICATION_POINTS.prova_extra).toBe(50);
      expect(GAMIFICATION_POINTS.participacao_enquete).toBe(15);
      expect(GAMIFICATION_POINTS.acesso_spoiler).toBe(20);
      expect(GAMIFICATION_POINTS.checkin_evento).toBe(30);
      expect(GAMIFICATION_POINTS.compartilhamento).toBe(10);
      expect(GAMIFICATION_POINTS.login_diario).toBe(5);
      expect(GAMIFICATION_POINTS.completar_perfil).toBe(25);
    });
  });

  describe('calculatePointsForAction', () => {
    it('deve calcular pontos base corretamente', () => {
      expect(calculatePointsForAction('cadastro')).toBe(10);
      expect(calculatePointsForAction('compra_ingresso')).toBe(100);
      expect(calculatePointsForAction('login_diario')).toBe(5);
    });

    it('deve aplicar multiplicadores corretamente', () => {
      expect(calculatePointsForAction('cadastro', { multiplier: 2 })).toBe(20);
      expect(calculatePointsForAction('compra_ingresso', { multiplier: 1.5 })).toBe(150);
      expect(calculatePointsForAction('login_diario', { multiplier: 3 })).toBe(15);
    });

    it('deve ignorar metadata inválida', () => {
      expect(calculatePointsForAction('cadastro', { invalid: 'data' })).toBe(10);
      expect(calculatePointsForAction('compra_ingresso', { multiplier: 'invalid' })).toBe(100);
    });
  });

  describe('generateReferralCode', () => {
    it('deve gerar código de referência válido', () => {
      const userId = 'user123456789';
      const code = generateReferralCode(userId);

      expect(code).toMatch(/^REF[A-Z0-9]{8}$/);
      expect(code).toContain('REF');
      expect(code.length).toBe(11); // REF + 8 caracteres
    });

    it('deve gerar códigos únicos para usuários diferentes', () => {
      const code1 = generateReferralCode('user123456789');
      const code2 = generateReferralCode('user987654321');

      expect(code1).not.toBe(code2);
    });
  });
});

describe('Firestore Types - Validação de Dados', () => {
  describe('validateUserData', () => {
    it('deve validar dados válidos', () => {
      const validData = {
        email: 'test@example.com',
        role: 'atleta' as UserRole,
        gamification: {
          points: 100,
        },
      };

      const errors = validateUserData(validData);
      expect(errors).toHaveLength(0);
    });

    it('deve detectar email inválido', () => {
      const invalidData = {
        email: 'invalid-email',
        role: 'atleta' as UserRole,
      };

      const errors = validateUserData(invalidData);
      expect(errors).toContain('Email inválido');
    });

    it('deve detectar role inválido', () => {
      const invalidData = {
        email: 'test@example.com',
        role: 'invalid' as any,
      };

      const errors = validateUserData(invalidData);
      expect(errors).toContain('Tipo de usuário inválido');
    });

    it('deve detectar pontos negativos', () => {
      const invalidData = {
        email: 'test@example.com',
        role: 'atleta' as UserRole,
        gamification: {
          points: -10,
        },
      };

      const errors = validateUserData(invalidData);
      expect(errors).toContain('Pontos não podem ser negativos');
    });
  });

  describe('validateTeamData', () => {
    it('deve validar dados válidos', () => {
      const validData = {
        nome: 'Time Teste',
        atletas: ['user1', 'user2'],
        valorInscricao: 100,
      };

      const errors = validateTeamData(validData);
      expect(errors).toHaveLength(0);
    });

    it('deve detectar nome muito curto', () => {
      const invalidData = {
        nome: 'A',
        atletas: ['user1', 'user2'],
      };

      const errors = validateTeamData(invalidData);
      expect(errors).toContain('Nome do time deve ter pelo menos 2 caracteres');
    });

    it('deve detectar muitos atletas', () => {
      const invalidData = {
        nome: 'Time Teste',
        atletas: Array.from({ length: 11 }, (_, i) => `user${i}`),
      };

      const errors = validateTeamData(invalidData);
      expect(errors).toContain('Time não pode ter mais de 10 atletas');
    });

    it('deve detectar valor negativo', () => {
      const invalidData = {
        nome: 'Time Teste',
        atletas: ['user1', 'user2'],
        valorInscricao: -50,
      };

      const errors = validateTeamData(invalidData);
      expect(errors).toContain('Valor de inscrição não pode ser negativo');
    });
  });
});

describe('Firestore Types - Utilitários', () => {
  describe('createTimestamp', () => {
    it('deve criar timestamp válido', () => {
      const timestamp = createTimestamp();

      expect(timestamp).toHaveProperty('seconds');
      expect(timestamp).toHaveProperty('nanoseconds');
      expect(typeof timestamp.seconds).toBe('number');
      expect(typeof timestamp.nanoseconds).toBe('number');
      expect(timestamp.seconds).toBeGreaterThan(0);
      expect(timestamp.nanoseconds).toBeGreaterThanOrEqual(0);
      expect(timestamp.nanoseconds).toBeLessThan(1000000000);
    });
  });

  describe('timestampToDate e dateToTimestamp', () => {
    it('deve converter timestamp para Date e vice-versa', () => {
      const originalDate = new Date('2024-01-15T10:30:00.123Z');
      const timestamp = dateToTimestamp(originalDate);
      const convertedDate = timestampToDate(timestamp);

      expect(convertedDate.getTime()).toBe(originalDate.getTime());
    });

    it('deve converter timestamp criado por createTimestamp', () => {
      const timestamp = createTimestamp();
      const date = timestampToDate(timestamp);

      expect(date).toBeInstanceOf(Date);
      expect(date.getTime()).toBeGreaterThan(0);
    });
  });

  describe('sanitizeUserData', () => {
    it('deve sanitizar dados de usuário', () => {
      const rawData = {
        email: '  TEST@EXAMPLE.COM  ',
        displayName: '  João Silva  ',
        phone: '(11) 99999-9999',
        isActive: false,
      };

      const sanitized = sanitizeUserData(rawData);

      expect(sanitized.email).toBe('test@example.com');
      expect(sanitized.displayName).toBe('João Silva');
      expect(sanitized.phone).toBe('11999999999');
      expect(sanitized.isActive).toBe(false);
    });

    it('deve definir isActive como true por padrão', () => {
      const rawData = {
        email: 'test@example.com',
      };

      const sanitized = sanitizeUserData(rawData);
      expect(sanitized.isActive).toBe(true);
    });
  });

  describe('sanitizeTeamData', () => {
    it('deve sanitizar dados de time', () => {
      const rawData = {
        nome: '  Time Teste  ',
        box: {
          nome: '  Box Teste  ',
          cidade: '  São Paulo  ',
          estado: '  SP  ',
        },
      };

      const sanitized = sanitizeTeamData(rawData);

      expect(sanitized.nome).toBe('Time Teste');
      expect(sanitized.box?.nome).toBe('Box Teste');
      expect(sanitized.box?.cidade).toBe('São Paulo');
      expect(sanitized.box?.estado).toBe('SP');
    });

    it('deve lidar com dados sem box', () => {
      const rawData = {
        nome: 'Time Teste',
      };

      const sanitized = sanitizeTeamData(rawData);
      expect(sanitized.box).toBeUndefined();
    });
  });
});

describe('Firestore Types - Interfaces', () => {
  describe('FirestoreUser', () => {
    it('deve ter estrutura válida', () => {
      const user: FirestoreUser = {
        uid: 'user123',
        email: 'test@example.com',
        displayName: 'João Silva',
        role: 'atleta',
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
        isActive: true,
        gamification: {
          points: 100,
          level: 'bronze',
          totalActions: 5,
          achievements: [],
          rewards: [],
          streakDays: 3,
          referrals: [],
          referralPoints: 0,
          weeklyPoints: 50,
          monthlyPoints: 150,
          yearlyPoints: 500,
          bestStreak: 5,
          badges: [],
          challenges: [],
        },
      };

      expect(user.uid).toBe('user123');
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('atleta');
      expect(user.gamification?.points).toBe(100);
      expect(user.gamification?.level).toBe('bronze');
    });
  });

  describe('FirestoreTeam', () => {
    it('deve ter estrutura válida', () => {
      const team: FirestoreTeam = {
        id: 'team123',
        nome: 'Time Teste',
        captainId: 'user123',
        atletas: ['user1', 'user2', 'user3'],
        status: 'complete',
        categoria: 'RX',
        lote: 'primeiro',
        box: {
          nome: 'Box Teste',
          cidade: 'São Paulo',
          estado: 'SP',
        },
        valorInscricao: 150,
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
      };

      expect(team.id).toBe('team123');
      expect(team.nome).toBe('Time Teste');
      expect(team.categoria).toBe('RX');
      expect(team.atletas).toHaveLength(3);
    });
  });

  describe('FirestorePedido', () => {
    it('deve ter estrutura válida', () => {
      const pedido: FirestorePedido = {
        id: 'pedido123',
        userId: 'user123',
        userEmail: 'test@example.com',
        userName: 'João Silva',
        tipo: 'ingresso',
        quantidade: 1,
        valorUnitario: 150,
        valorTotal: 150,
        status: 'pending',
        lote: 'primeiro',
        gateway: 'pix',
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
      };

      expect(pedido.id).toBe('pedido123');
      expect(pedido.tipo).toBe('ingresso');
      expect(pedido.status).toBe('pending');
      expect(pedido.gateway).toBe('pix');
    });
  });

  describe('FirestoreAudiovisual', () => {
    it('deve ter estrutura válida', () => {
      const audiovisual: FirestoreAudiovisual = {
        id: 'audio123',
        userId: 'user123',
        userEmail: 'test@example.com',
        nome: 'João Fotógrafo',
        telefone: '11999999999',
        tipo: 'fotografo',
        portfolio: {
          urls: ['https://example.com/photo1.jpg'],
          descricao: 'Fotógrafo profissional',
          experiencia: '5 anos',
          equipamentos: ['Canon EOS R5'],
          especialidades: ['Esportes', 'Eventos'],
        },
        termosAceitos: true,
        termosAceitosEm: createTimestamp(),
        status: 'pending',
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
      };

      expect(audiovisual.id).toBe('audio123');
      expect(audiovisual.tipo).toBe('fotografo');
      expect(audiovisual.status).toBe('pending');
      expect(audiovisual.portfolio.urls).toHaveLength(1);
    });
  });

  describe('FirestorePatrocinador', () => {
    it('deve ter estrutura válida', () => {
      const patrocinador: FirestorePatrocinador = {
        id: 'pat123',
        nome: 'Empresa Teste',
        categoria: 'Ouro',
        status: 'ativo',
        valorPatrocinio: 10000,
        email: 'contato@empresa.com',
        telefone: '1133333333',
        contato: {
          nome: 'Maria Silva',
          cargo: 'Marketing',
          email: 'maria@empresa.com',
          telefone: '11999999999',
        },
        beneficios: {
          descricao: 'Benefícios do patrocínio',
          itens: ['Logo no material', 'Stand no evento'],
          valorEstimado: 15000,
        },
        contrato: {
          dataInicio: createTimestamp(),
          dataFim: createTimestamp(),
          valorTotal: 10000,
          parcelas: 3,
          valorParcela: 3333.33,
        },
        pagamentos: [],
        criadoPor: 'admin123',
        criadoEm: createTimestamp(),
        atualizadoEm: createTimestamp(),
      };

      expect(patrocinador.id).toBe('pat123');
      expect(patrocinador.categoria).toBe('Ouro');
      expect(patrocinador.status).toBe('ativo');
      expect(patrocinador.valorPatrocinio).toBe(10000);
    });
  });

  describe('FirestoreGamificationAction', () => {
    it('deve ter estrutura válida', () => {
      const action: FirestoreGamificationAction = {
        id: 'action123',
        userId: 'user123',
        userEmail: 'test@example.com',
        userName: 'João Silva',
        action: 'cadastro',
        points: 10,
        description: 'Cadastro realizado',
        createdAt: createTimestamp(),
        processed: true,
        processedAt: createTimestamp(),
        retryCount: 0,
      };

      expect(action.id).toBe('action123');
      expect(action.action).toBe('cadastro');
      expect(action.points).toBe(10);
      expect(action.processed).toBe(true);
    });
  });

  describe('FirestoreGamificationLeaderboard', () => {
    it('deve ter estrutura válida', () => {
      const leaderboard: FirestoreGamificationLeaderboard = {
        id: 'lb123',
        userId: 'user123',
        userEmail: 'test@example.com',
        userName: 'João Silva',
        userRole: 'atleta',
        points: 500,
        level: 'prata',
        totalActions: 20,
        streakDays: 5,
        lastActionAt: createTimestamp(),
        position: 1,
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
        weeklyPoints: 100,
        monthlyPoints: 300,
        yearlyPoints: 500,
        badges: [],
        activeChallenges: [],
      };

      expect(leaderboard.id).toBe('lb123');
      expect(leaderboard.points).toBe(500);
      expect(leaderboard.level).toBe('prata');
      expect(leaderboard.position).toBe(1);
    });
  });

  describe('FirestoreGamificationReward', () => {
    it('deve ter estrutura válida', () => {
      const reward: FirestoreGamificationReward = {
        id: 'reward123',
        title: 'Acesso VIP',
        description: 'Acesso exclusivo ao evento',
        type: 'acesso_vip',
        requiredPoints: 1000,
        requiredLevel: 'ouro',
        currentRedemptions: 0,
        isActive: true,
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
      };

      expect(reward.id).toBe('reward123');
      expect(reward.type).toBe('acesso_vip');
      expect(reward.requiredPoints).toBe(1000);
      expect(reward.requiredLevel).toBe('ouro');
    });
  });
});

describe('Firestore Types - Integração', () => {
  it('deve integrar todos os tipos corretamente', () => {
    // Criar timestamp
    const now = createTimestamp();

    // Criar usuário
    const user: FirestoreUser = {
      uid: 'user123',
      email: 'test@example.com',
      displayName: 'João Silva',
      role: 'atleta',
      createdAt: now,
      updatedAt: now,
      isActive: true,
      gamification: {
        points: 100,
        level: calculateGamificationLevel(100),
        totalActions: 1,
        lastActionAt: now,
        achievements: [],
        rewards: [],
        streakDays: 0,
        referrals: [],
        referralPoints: 0,
        weeklyPoints: 100,
        monthlyPoints: 100,
        yearlyPoints: 100,
        bestStreak: 0,
        badges: [],
        challenges: [],
      },
    };

    // Validar usuário
    const userErrors = validateUserData(user);
    expect(userErrors).toHaveLength(0);

    // Criar ação de gamificação
    const action: FirestoreGamificationAction = {
      id: 'action123',
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || 'Usuário',
      action: 'cadastro',
      points: calculatePointsForAction('cadastro'),
      description: 'Cadastro realizado',
      createdAt: now,
      processed: true,
      processedAt: now,
      retryCount: 0,
    };

    // Validar ação
    expect(isValidGamificationAction(action.action)).toBe(true);
    expect(action.points).toBe(GAMIFICATION_POINTS.cadastro);

    // Criar time
    const team: FirestoreTeam = {
      id: 'team123',
      nome: 'Time Teste',
      captainId: user.uid,
      atletas: [user.uid],
      status: 'complete',
      categoria: 'RX',
      lote: 'primeiro',
      box: {
        nome: 'Box Teste',
        cidade: 'São Paulo',
        estado: 'SP',
      },
      valorInscricao: 150,
      createdAt: now,
      updatedAt: now,
    };

    // Validar time
    const teamErrors = validateTeamData(team);
    expect(teamErrors).toHaveLength(0);

    // Criar pedido
    const pedido: FirestorePedido = {
      id: 'pedido123',
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || 'Usuário',
      teamId: team.id,
      tipo: 'ingresso',
      quantidade: 1,
      valorUnitario: 150,
      valorTotal: 150,
      status: 'pending',
      lote: 'primeiro',
      categoria: 'RX',
      gateway: 'pix',
      createdAt: now,
      updatedAt: now,
    };

    // Validar pedido
    expect(isValidPaymentStatus(pedido.status)).toBe(true);
    expect(pedido.valorTotal).toBe(pedido.valorUnitario * pedido.quantidade);

    // Simular processamento de gamificação
    const newPoints = user.gamification!.points + action.points;
    const newLevel = calculateGamificationLevel(newPoints);

    expect(newPoints).toBe(110); // 100 + 10
    expect(newLevel).toBe('bronze'); // 110 pontos = bronze
  });
});

describe('Firestore Types - Edge Cases', () => {
  it('deve lidar com dados vazios', () => {
    const emptyUser = sanitizeUserData({});
    expect(emptyUser.isActive).toBe(true);

    const emptyTeam = sanitizeTeamData({});
    expect(emptyTeam).toEqual({});
  });

  it('deve lidar com dados nulos/undefined', () => {
    const nullUser = sanitizeUserData({
      email: null,
      displayName: undefined,
      phone: null,
    });

    expect(nullUser.email).toBe('');
    expect(nullUser.displayName).toBe('');
    expect(nullUser.phone).toBe('');
  });

  it('deve lidar com timestamps extremos', () => {
    const pastDate = new Date('1970-01-01');
    const futureDate = new Date('2100-01-01');

    const pastTimestamp = dateToTimestamp(pastDate);
    const futureTimestamp = dateToTimestamp(futureDate);

    expect(timestampToDate(pastTimestamp).getTime()).toBe(pastDate.getTime());
    expect(timestampToDate(futureTimestamp).getTime()).toBe(futureDate.getTime());
  });

  it('deve lidar com multiplicadores extremos', () => {
    expect(calculatePointsForAction('cadastro', { multiplier: 0 })).toBe(0);
    expect(calculatePointsForAction('cadastro', { multiplier: 10 })).toBe(100);
    expect(calculatePointsForAction('cadastro', { multiplier: -1 })).toBe(-10);
  });
});

describe('Firestore Types - Performance', () => {
  it('deve criar timestamps rapidamente', () => {
    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      createTimestamp();
    }

    const end = performance.now();
    expect(end - start).toBeLessThan(100); // Deve ser rápido
  });

  it('deve validar dados rapidamente', () => {
    const testData = {
      email: 'test@example.com',
      role: 'atleta' as UserRole,
      gamification: { points: 100 },
    };

    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      validateUserData(testData);
    }

    const end = performance.now();
    expect(end - start).toBeLessThan(100); // Deve ser rápido
  });
});
