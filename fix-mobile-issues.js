#!/usr/bin/env node

/**
 * Script para corrigir problemas comuns no mobile
 * Execute: node fix-mobile-issues.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigindo problemas comuns no mobile...\n');

// 1. Verificar se o arquivo .env existe
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
    console.log('❌ Arquivo .env não encontrado');
    console.log('📝 Criando arquivo .env básico...');
    
    const envContent = `# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=app-fenix-XXXXX.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=app-fenix-XXXXX
VITE_FIREBASE_STORAGE_BUCKET=app-fenix-XXXXX.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# ⚠️ IMPORTANTE: Substitua os valores XXXXX pelos valores reais do seu projeto Firebase
# Você pode encontrar essas informações no console do Firebase: https://console.firebase.google.com/
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Arquivo .env criado');
    console.log('⚠️  Lembre-se de substituir os valores XXXXX pelos valores reais do Firebase\n');
} else {
    console.log('✅ Arquivo .env encontrado');
}

// 2. Verificar configuração do viewport
const indexHtmlPath = path.join(process.cwd(), 'index.html');
if (fs.existsSync(indexHtmlPath)) {
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    
    if (!indexHtml.includes('viewport')) {
        console.log('❌ Meta viewport não encontrada no index.html');
        console.log('📝 Adicionando meta viewport...');
        
        const updatedHtml = indexHtml.replace(
            '<head>',
            `<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`
        );
        
        fs.writeFileSync(indexHtmlPath, updatedHtml);
        console.log('✅ Meta viewport adicionada');
    } else {
        console.log('✅ Meta viewport já configurada');
    }
}

// 3. Verificar configuração do PWA
const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    if (!manifest.orientation) {
        console.log('📝 Adicionando orientação ao manifest.json...');
        manifest.orientation = 'portrait-primary';
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log('✅ Orientação adicionada ao manifest');
    } else {
        console.log('✅ Orientação já configurada no manifest');
    }
}

// 4. Verificar configuração do Vite
const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
    const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    
    if (!viteConfig.includes('server')) {
        console.log('📝 Adicionando configuração de servidor ao Vite...');
        
        const updatedConfig = viteConfig.replace(
            'export default defineConfig({',
            `export default defineConfig({
  server: {
    port: 3002,
    host: '0.0.0.0',
    open: true,
    hmr: {
      overlay: true,
      port: 3002
    }
  },`
        );
        
        fs.writeFileSync(viteConfigPath, updatedConfig);
        console.log('✅ Configuração de servidor adicionada');
    } else {
        console.log('✅ Configuração de servidor já existe');
    }
}

// 5. Verificar CSS para mobile
const cssPath = path.join(process.cwd(), 'src', 'index.css');
if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf8');
    
    if (!css.includes('@media')) {
        console.log('📝 Adicionando media queries para mobile...');
        
        const mobileCSS = `
/* Mobile-specific styles */
@media (max-width: 768px) {
  body {
    font-size: 16px;
    line-height: 1.4;
  }
  
  h1 {
    font-size: 2em;
  }
  
  h2 {
    font-size: 1.5em;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  /* Prevent zoom on input focus */
  input, select, textarea {
    font-size: 16px;
  }
  
  /* Touch-friendly buttons */
  button, .btn {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Prevent horizontal scroll */
html, body {
  overflow-x: hidden;
  width: 100%;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Better touch targets */
@media (pointer: coarse) {
  button, a, input, select, textarea {
    min-height: 44px;
    min-width: 44px;
  }
}
`;
        
        fs.appendFileSync(cssPath, mobileCSS);
        console.log('✅ CSS mobile adicionado');
    } else {
        console.log('✅ CSS mobile já configurado');
    }
}

// 6. Verificar se há erros de importação
const appPath = path.join(process.cwd(), 'src', 'App.tsx');
if (fs.existsSync(appPath)) {
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    // Verificar imports faltantes
    const missingImports = [];
    
    if (appContent.includes('HomePage') && !appContent.includes('import.*HomePage')) {
        missingImports.push('HomePage');
    }
    
    if (appContent.includes('HubPage') && !appContent.includes('import.*HubPage')) {
        missingImports.push('HubPage');
    }
    
    if (missingImports.length > 0) {
        console.log('❌ Imports faltantes detectados:', missingImports.join(', '));
        console.log('📝 Verifique se todos os componentes estão sendo importados corretamente');
    } else {
        console.log('✅ Imports verificados');
    }
}

console.log('\n🎯 Próximos passos:');
console.log('1. Configure as variáveis do Firebase no arquivo .env');
console.log('2. Execute: npm run dev');
console.log('3. Teste no mobile: http://seu-ip:3002');
console.log('4. Use o debug: http://seu-ip:3002/mobile-debug.html');
console.log('\n📱 Dicas para mobile:');
console.log('- Use HTTPS em produção');
console.log('- Teste em diferentes dispositivos');
console.log('- Verifique a performance com Lighthouse');
console.log('- Monitore erros no console do navegador');

console.log('\n✅ Correções aplicadas!'); 