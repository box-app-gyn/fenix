# App Fenix - Makefile
# Comandos para desenvolvimento, build e deploy

.PHONY: help install dev build preview deploy clean lint format test firebase-setup workstation-setup

# Variáveis
PROJECT_NAME = app-fenix
NODE_VERSION = 18
PORT = 3002

# Cores para output
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
PURPLE = \033[0;35m
CYAN = \033[0;36m
WHITE = \033[1;37m
NC = \033[0m # No Color

.DEFAULT_GOAL := help

help: ## Mostra esta ajuda
	@echo "$(CYAN)App Fenix - Comandos Disponíveis$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)Exemplos de uso:$(NC)"
	@echo "  make dev          # Inicia servidor de desenvolvimento"
	@echo "  make build        # Gera build de produção"
	@echo "  make deploy       # Faz deploy no Firebase"

use-node: ## Garante versão correta do Node
	@echo "$(BLUE)Usando Node $(NODE_VERSION)...$(NC)"
	@which volta >/dev/null 2>&1 && volta install node@$(NODE_VERSION) || true
	@which nvm >/dev/null 2>&1 && . ~/.nvm/nvm.sh && nvm use $(NODE_VERSION) || true

install: ## Instala dependências
	@echo "$(BLUE)Instalando dependências...$(NC)"
	npm install
	@echo "$(GREEN)✓ Dependências instaladas$(NC)"

dev: ## Inicia servidor de desenvolvimento
	@echo "$(BLUE)Iniciando servidor de desenvolvimento na porta $(PORT)...$(NC)"
	@echo "$(YELLOW)URL: http://localhost:$(PORT)$(NC)"
	npm run dev

build: ## Gera build de produção
	@echo "$(BLUE)Gerando build de produção...$(NC)"
	npm run build
	@echo "$(GREEN)✓ Build gerado em dist/$(NC)"

build-pwa: ## Gera apenas manifest e sw.js
	@echo "$(BLUE)Buildando Service Worker e manifest...$(NC)"
	npm run build
	@echo "$(GREEN)✓ PWA gerado$(NC)"

preview: ## Preview do build de produção
	@echo "$(BLUE)Iniciando preview do build...$(NC)"
	npm run preview

deploy: ## Deploy no Firebase
	@echo "$(BLUE)Fazendo deploy no Firebase...$(NC)"
	firebase deploy
	@echo "$(GREEN)✓ Deploy concluído$(NC)"

deploy-hosting: ## Deploy apenas do hosting
	@echo "$(BLUE)Fazendo deploy do hosting...$(NC)"
	firebase deploy --only hosting
	@echo "$(GREEN)✓ Hosting deployado$(NC)"

deploy-firestore: ## Deploy das regras do Firestore
	@echo "$(BLUE)Fazendo deploy das regras do Firestore...$(NC)"
	firebase deploy --only firestore:rules
	@echo "$(GREEN)✓ Regras do Firestore deployadas$(NC)"

clean: ## Limpa arquivos temporários
	@echo "$(BLUE)Limpando arquivos temporários...$(NC)"
	rm -rf dist/
	rm -rf node_modules/.vite/
	rm -rf .firebase/
	@echo "$(GREEN)✓ Limpeza concluída$(NC)"

lint: ## Executa linter
	@echo "$(BLUE)Executando linter...$(NC)"
	npm run lint

format: ## Formata código
	@echo "$(BLUE)Formatando código...$(NC)"
	npm run format

test: ## Executa testes
	@echo "$(BLUE)Executando testes...$(NC)"
	npm run test

firebase-setup: ## Configura Firebase
	@echo "$(BLUE)Configurando Firebase...$(NC)"
	npm install -g firebase-tools
	@echo "   firebase login"
	@echo "   firebase init"
	@echo "$(GREEN)✓ Firebase configurado$(NC)"

firebase-login: ## Login no Firebase
	@echo "$(BLUE)Fazendo login no Firebase...$(NC)"
	firebase login

firebase-init: ## Inicializa projeto Firebase
	@echo "$(BLUE)Inicializando projeto Firebase...$(NC)"
	firebase init

# Google Cloud Workstations
workstation-setup: ## Configura Google Cloud Workstations
	@echo "$(BLUE)Configurando Google Cloud Workstations...$(NC)"
	@echo "   curl https://sdk.cloud.google.com | bash"
	@echo "   gcloud auth login"
	@echo "   gcloud config set project interbox-app-8d400"
	@echo "   gcloud workstations clusters create app-fenix-cluster --region=us-central1"
	@echo "   gcloud workstations configs create app-fenix-config --cluster=app-fenix-cluster --region=us-central1 --machine-type=e2-standard-4 --container-predefined-image=codeoss"

workstation-start: ## Inicia workstation
	@echo "$(BLUE)Iniciando workstation...$(NC)"
	gcloud workstations start app-fenix-dev --cluster=app-fenix-cluster --config=app-fenix-config --region=us-central1

workstation-tunnel: ## Abre túnel TCP para workstation
	@echo "$(BLUE)Abrindo túnel TCP para porta $(PORT)...$(NC)"
	gcloud workstations start-tcp-tunnel app-fenix-dev --cluster=app-fenix-cluster --config=app-fenix-config --region=us-central1 $(PORT) --local-host-port=localhost:$(PORT)

dev-setup: install firebase-setup ## Setup completo do ambiente de desenvolvimento
	@echo "$(GREEN)✓ Ambiente de desenvolvimento configurado$(NC)"

prod-setup: install build deploy ## Setup completo para produção
	@echo "$(GREEN)✓ Aplicação em produção$(NC)"

check-deps: ## Verifica dependências desatualizadas
	@echo "$(BLUE)Verificando dependências...$(NC)"
	npm outdated

update-deps: ## Atualiza dependências
	@echo "$(BLUE)Atualizando dependências...$(NC)"
	npm update

audit: ## Executa auditoria de segurança
	@echo "$(BLUE)Executando auditoria de segurança...$(NC)"
	npm audit

audit-fix: ## Corrige vulnerabilidades de segurança
	@echo "$(BLUE)Corrigindo vulnerabilidades...$(NC)"
	npm audit fix

git-status: ## Status do Git
	@echo "$(BLUE)Status do Git:$(NC)"
	git status

git-commit: ## Commit das mudanças
	@echo "$(BLUE)Fazendo commit...$(NC)"
	git add .
	git commit -m "Update: $(shell date)"

git-push: ## Push para repositório
	@echo "$(BLUE)Fazendo push...$(NC)"
	git push

check-ports: ## Verifica portas em uso
	@echo "$(BLUE)Portas em uso:$(NC)"
	lsof -i :$(PORT) || echo "$(YELLOW)Nenhum processo na porta $(PORT)$(NC)"

kill-port: ## Mata processo na porta especificada
	@echo "$(BLUE)Matando processo na porta $(PORT)...$(NC)"
	lsof -ti:$(PORT) | xargs kill -9 2>/dev/null || echo "$(YELLOW)Nenhum processo encontrado$(NC)"

# Email System
email-setup: ## Configura sistema de email
	node functions/scripts/setup-email.js

email-test: ## Testa sistema de email
	cd functions && npm run test:email

email-deploy: ## Deploy das funções de email
	firebase deploy --only functions:enviaEmailConfirmacaoFunction,functions:enviaEmailBoasVindasFunction,functions:enviaEmailNotificacaoFunction

email-logs: ## Verifica logs do sistema de email
	firebase functions:log --only enviaEmailConfirmacaoFunction,enviaEmailBoasVindasFunction,enviaEmailNotificacaoFunction

email-health: ## Verifica saúde do sistema de email
	cd functions && npm run test:email:health

backup: ## Cria backup dos arquivos importantes
	@mkdir -p backup/$(shell date +%Y%m%d_%H%M%S)
	@cp -r src/ backup/$(shell date +%Y%m%d_%H%M%S)/
	@cp package.json backup/$(shell date +%Y%m%d_%H%M%S)/
	@cp vite.config.ts backup/$(shell date +%Y%m%d_%H%M%S)/

info: ## Mostra informações do projeto
	@echo "$(CYAN)=== App Fenix - Informações ===$(NC)"
	@echo "Projeto: $(PROJECT_NAME)"
	@echo "Node.js: $(shell node --version)"
	@echo "NPM: $(shell npm --version)"
	@echo "Porta padrão: $(PORT)"
	@echo "Diretório: $(shell pwd)"
	@echo "Branch Git: $(shell git branch --show-current 2>/dev/null || echo 'N/A')"

emergency-stop: ## Para todos os processos relacionados
	@echo "$(RED)Parando todos os processos...$(NC)"
	pkill -f "vite" || true
	pkill -f "node.*$(PROJECT_NAME)" || true
	@echo "$(GREEN)✓ Processos parados$(NC)"

reset: clean emergency-stop ## Reset completo (limpa tudo e para processos)
	@echo "$(GREEN)✓ Reset completo realizado$(NC)"

restart: reset install dev ## Reset + instalação + dev
	@echo "$(GREEN)✓ Ambiente reiniciado$(NC)"

purge-cache: ## Limpa SW, caches e localStorage (Console)
	@echo "$(RED)Cole no Console do navegador:$(NC)"
	@echo "caches.keys().then(k => k.forEach(c => caches.delete(c)));"
	@echo "navigator.serviceWorker.getRegistrations().then(r => r.forEach(reg => reg.unregister()));"
	@echo "localStorage.clear(); sessionStorage.clear(); indexedDB.deleteDatabase('firebaseLocalStorageDb');"

diagnostics: ## Diagnóstico do ambiente
	@echo "$(CYAN)--- Diagnóstico do ambiente ---$(NC)"
	@echo "Node: $(shell node --version)"
	@echo "NPM: $(shell npm --version)"
	@echo "Firebase CLI: $(shell firebase --version || echo '❌ Não instalado')"
	@echo "Porta em uso? $(shell lsof -ti:$(PORT) || echo '✅ Livre')"
	@echo "Service Worker ativo? $(shell grep -irl sw.js ./dist || echo '❌ Não encontrado')"
