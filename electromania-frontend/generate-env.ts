// generate-env.js
const fs = require('fs');
const path = require('path');

// Default to localhost for local development, use env var for Vercel deployments
const apiDomain = process.env.API_DOMAIN || 'http://localhost:3000';

// Contenido del archivo environment.ts
// Usamos process.env para acceder a las variables de entorno de Vercel.
const envFileContent = `
export const environment = {
  API_DOMAIN: '${apiDomain}',
};
`;

// Ruta donde se creará el archivo environment.ts
// Asumiendo que tu archivo está en src/environments/environment.ts
const envFilePath = path.join(__dirname, 'src', 'environments', 'environment.ts');

// Escribir el contenido en el archivo
fs.writeFileSync(envFilePath, envFileContent.trim());
console.log(`✅ Archivo de entorno generado: ${envFilePath}`);