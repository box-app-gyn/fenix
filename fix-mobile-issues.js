// Fix Mobile Issues - interbox-app-8d400
// Script para corrigir problemas de mobile no projeto atual

const fs = require('fs');
const path = require('path');

// Configurações do projeto atual
const PROJECT_CONFIG = {
  projectId: 'interbox-app-8d400',
  authDomain: 'interbox-app-8d400.firebaseapp.com',
  storageBucket: 'interbox-app-8d400.appspot.com',
  apiKey: 'AIzaSyDdLZo5ZO32WOpxNgqqSQw381cekJPfVBg',
  messagingSenderId: '1087720410628',
  appId: '1:1087720410628:web:12ee7c7a6b6d987f102f51',
  measurementId: 'G-VRZEQPCZ55'
};

console.log('🔧 Iniciando correções para mobile - interbox-app-8d400');

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