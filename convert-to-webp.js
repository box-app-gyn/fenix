import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertToWebP() {
  console.log('🔄 Iniciando conversão PNG → WebP...\n');
  
  const directories = ['public/images', 'public/logos'];
  let totalConverted = 0;
  let totalSizeReduction = 0;
  
  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Diretório não encontrado: ${dir}`);
      continue;
    }
    
    console.log(`📁 Processando: ${dir}`);
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
    
    for (const file of files) {
      const inputPath = path.join(dir, file);
      const outputPath = inputPath.replace('.png', '.webp');
      
      try {
        // Verificar se arquivo já existe
        if (fs.existsSync(outputPath)) {
          console.log(`⏭️  Pulando (já existe): ${file}`);
          continue;
        }
        
        // Obter tamanho original
        const originalStats = fs.statSync(inputPath);
        const originalSize = originalStats.size;
        
        // Converter para WebP
        await sharp(inputPath)
          .webp({ 
            quality: 80,
            effort: 6,
            nearLossless: false
          })
          .toFile(outputPath);
        
        // Obter tamanho do WebP
        const webpStats = fs.statSync(outputPath);
        const webpSize = webpStats.size;
        const reduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
        
        console.log(`✅ ${file}: ${(originalSize/1024).toFixed(0)}KB → ${(webpSize/1024).toFixed(0)}KB (${reduction}% menor)`);
        
        totalConverted++;
        totalSizeReduction += (originalSize - webpSize);
        
      } catch (error) {
        console.error(`❌ Erro ao converter ${file}:`, error.message);
      }
    }
  }
  
  console.log(`\n🎉 Conversão concluída!`);
  console.log(`📊 Total convertido: ${totalConverted} arquivos`);
  console.log(`💾 Economia total: ${(totalSizeReduction/1024/1024).toFixed(2)}MB`);
}

// Executar conversão
convertToWebP().catch(console.error); 