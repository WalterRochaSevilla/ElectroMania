// generate-env.js
const fs = require('fs');
const path = require('path');

// Contenido del archivo environment.ts
// Usamos process.env para acceder a las variables de entorno de Vercel.
// VERCEL_ENV es una variable de Vercel que indica el entorno (production, preview, development).
const envFileContent = `
export const environment = {
  API_DOMAIN: '${process.env.API_DOMAIN}',
};
`;

// Ruta donde se creará el archivo environment.ts
// Asumiendo que tu archivo está en src/environments/environment.ts
const envFilePath = path.join(__dirname, 'src', 'environments', 'environment.ts');

// Escribir el contenido en el archivo
fs.writeFileSync(envFilePath, envFileContent.trim());
console.log(`✅ Archivo de entorno generado: ${envFilePath}`);