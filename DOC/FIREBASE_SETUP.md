# Configuração do Firebase

## Problema Atual
O erro `auth/invalid-api-key` indica que o Firebase não está reconhecendo o domínio localhost.

## Solução

### 1. Acesse o Firebase Console
- Vá para https://console.firebase.google.com/
- Selecione o projeto `interbox-app-8d400`

### 2. Configure Autenticação
- No menu lateral, clique em "Authentication"
- Vá para a aba "Settings" (Configurações)
- Na seção "Authorized domains" (Domínios autorizados), adicione:
  - `localhost`
  - `127.0.0.1`

### 3. Verifique as Credenciais
As credenciais atuais estão corretas:
```javascript
apiKey: "AIzaSyDdLZo5ZO32WOpxNgqqSQw381cekJPfVBg"
authDomain: "interbox-app-8d400.firebaseapp.com"
projectId: "interbox-app-8d400"
```

### 4. Limpe o Cache do Navegador
- Pressione `Ctrl+Shift+R` (ou `Cmd+Shift+R` no Mac)
- Ou abra uma aba anônima/privada

### 5. Teste a Aplicação
- Acesse http://localhost:3000
- Tente fazer login com Google
- Verifique o console do navegador para logs

## Logs de Debug
A aplicação agora inclui logs detalhados:
- "Firebase inicializado com sucesso" - Firebase configurado
- "Tentando fazer login..." - Início do processo de login
- "Login realizado com sucesso" - Login bem-sucedido

## Fallback
Se o Firebase falhar, a aplicação mostrará uma tela de erro amigável com opção de recarregar. 