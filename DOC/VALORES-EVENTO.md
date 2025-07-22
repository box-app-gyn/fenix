# Valores CERRADØ INTERBOX 2025 - INFORMAÇÕES OFICIAIS

## 🎫 **Tipos de Ingresso**

### 1. **INGRESSO INDIVIDUAL**
- **Valor:** R$ 150,00
- **Inclui:**
  - Acesso aos 3 dias do evento
  - Participação nas competições
  - Certificado digital
  - Acesso à área de ativações

### 2. **KIT COMPLETO**
- **Valor:** R$ 250,00
- **Inclui:**
  - Tudo do ingresso individual
  - Kit oficial do evento (camiseta, mochila, etc.)
  - Acesso VIP às áreas de descanso
  - Snacks durante o evento

### 3. **PREMIUM**
- **Valor:** R$ 350,00
- **Inclui:**
  - Tudo do kit completo
  - Acesso exclusivo ao lounge premium
  - Meet & Greet com atletas
  - Foto oficial do time
  - Brindes exclusivos

## 📅 **Lotes de Inscrição**

### **1º LOTE** (13/07/2025 a 24/07/2025 ou até 120 primeiros times)
- **RX:** R$ 494,95
- **Todas as demais categorias:** R$ 394,95
- **Kit especial:** 50 primeiros times (exceto RX)

### **2º LOTE** (25/07/2025 a 16/08/2025 ou até 180 times)
- **RX:** R$ 544,95
- **Todas as demais categorias:** R$ 444,95

### **3º LOTE** (08/08/2025 a 08/09/2025 ou até 220 times)
- **RX:** R$ 594,95
- **Todas as demais categorias:** R$ 494,95

## 🏆 **Categorias e Vagas**

| Categoria | Vagas | Preço 1º Lote | Preço 2º Lote | Preço 3º Lote |
|-----------|-------|---------------|---------------|---------------|
| **RX** | 20 times | R$ 494,95 | R$ 544,95 | R$ 594,95 |
| **Master 145+** | 20 times | R$ 394,95 | R$ 444,95 | R$ 494,95 |
| **Amador** | 40 times* | R$ 394,95 | R$ 444,95 | R$ 494,95 |
| **Scale** | 80 times | R$ 394,95 | R$ 444,95 | R$ 494,95 |
| **Iniciante** | 40 times* | R$ 394,95 | R$ 444,95 | R$ 494,95 |

*Pode aumentar para 60 times dependendo da procura

## 🎬 **Audiovisual**

- **Valor:** R$ 29,90
- **Processo:** 
  1. Cadastro de interessados
  2. Salva contato no Firestore
  3. Redireciona para checkout

## 📊 **Estrutura de Dados Atualizada**

### **Interface de Inscrição:**

```typescript
interface InscricaoTime {
  timeId: string;
  timeName: string;
  categoria: 'rx' | 'master145' | 'amador' | 'scale' | 'iniciante';
  lote: 1 | 2 | 3;
  valor: number;
  status: 'pending' | 'paid' | 'confirmed' | 'cancelled';
  atletas: {
    nome: string;
    email: string;
    telefone: string;
    genero: 'masculino' | 'feminino';
  }[];
  box: string;
  createdAt: Date;
  updatedAt: Date;
  flowpayOrderId?: string;
  pixCode?: string;
  pixExpiration?: Date;
}

interface Audiovisual {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  area: 'fotografia' | 'video' | 'drone' | 'podcast' | 'midia';
  experiencia: string;
  portfolio?: string;
  status: 'pending' | 'paid' | 'confirmed';
  valor: 29.90;
  createdAt: Date;
  flowpayOrderId?: string;
}
```

### **Valores por Categoria e Lote:**
```javascript
const VALORES_INSCRICAO = {
  lote1: {
    rx: 494.95,
    master145: 394.95,
    amador: 394.95,
    scale: 394.95,
    iniciante: 394.95
  },
  lote2: {
    rx: 544.95,
    master145: 444.95,
    amador: 444.95,
    scale: 444.95,
    iniciante: 444.95
  },
  lote3: {
    rx: 594.95,
    master145: 494.95,
    amador: 494.95,
    scale: 494.95,
    iniciante: 494.95
  }
};

const VAGAS_CATEGORIAS = {
  rx: 20,
  master145: 20,
  amador: 40, // pode aumentar para 60
  scale: 80,
  iniciante: 40 // pode aumentar para 60
};

const LIMITES_LOTES = {
  lote1: 120,
  lote2: 180,
  lote3: 220
};
```

## 🔄 **Fluxo de Inscrição**

### **Para Times:**
1. **Usuário seleciona categoria**
2. **Sistema verifica lote atual e vagas disponíveis**
3. **Calcula valor baseado na categoria e lote**
4. **Cria inscrição no Firestore**
5. **Integra com FlowPay**
6. **Retorna QR Code PIX**
7. **Webhook confirma pagamento**
8. **Atualiza status da inscrição**

### **Para Audiovisual:**
1. **Usuário preenche formulário**
2. **Salva dados no Firestore**
3. **Redireciona para checkout R$ 29,90**
4. **Integra com FlowPay**
5. **Webhook confirma pagamento**

## 📋 **Webhook FlowPay**

### **Payload Esperado:**
```json
{
  "orderId": "flowpay_order_id",
  "externalId": "nosso_pedido_id",
  "status": "paid",
  "amount": 49495,
  "customer": {
    "name": "Nome do Time",
    "email": "email@exemplo.com"
  },
  "paymentMethod": "PIX",
  "paidAt": "2025-07-01T10:00:00Z",
  "metadata": {
    "tipo": "inscricao_time" | "audiovisual",
    "categoria": "rx" | "master145" | "amador" | "scale" | "iniciante",
    "lote": 1 | 2 | 3
  }
}
```

## 🎯 **Próximos Passos**

1. ✅ Informações oficiais organizadas
2. 🔄 Atualizar função de criação de pedido
3. 🔄 Implementar lógica de lotes e vagas
4. 🔄 Criar função para audiovisual
5. 🔄 Configurar webhook FlowPay
6. 🔄 Criar frontend de inscrição
7. 🔄 Testar fluxo completo

## 📝 **Observações Importantes**

- **Kit especial:** Apenas 50 primeiros times (exceto RX)
- **Vagas flexíveis:** Amador e Iniciante podem aumentar
- **Audiovisual:** Valor fixo de R$ 29,90
- **Sistema flexível:** Preparado para novos produtos futuros 