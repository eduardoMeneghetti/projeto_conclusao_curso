const os = require('os');
const fs = require('fs');
const path = require('path');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const priority = ['wi-fi', 'wlan', 'wireless', 'ethernet', 'en0', 'eth0'];

  // Tenta encontrar por ordem de prioridade (Wi-Fi primeiro)
  for (const pref of priority) {
    for (const [name, addrs] of Object.entries(interfaces)) {
      if (name.toLowerCase().includes(pref)) {
        const ipv4 = addrs.find(a => a.family === 'IPv4' && !a.internal);
        if (ipv4) return ipv4.address;
      }
    }
  }

  // Fallback: primeiro IPv4 não-interno que não seja WSL/Docker (evita 172.x.x.x)
  for (const addrs of Object.values(interfaces)) {
    for (const iface of addrs) {
      if (iface.family === 'IPv4' && !iface.internal && !iface.address.startsWith('172.')) {
        return iface.address;
      }
    }
  }

  return null;
}

const ip = getLocalIP();
if (!ip) {
  console.warn('[update-api-ip] Não foi possível detectar o IP local. Mantendo IP atual.');
  process.exit(0);
}

const apiFilePath = path.join(__dirname, '..', 'src', 'services', 'api.ts');
const content = fs.readFileSync(apiFilePath, 'utf8');

const match = content.match(/http:\/\/([\d.]+):(\d+)/);
if (!match) {
  console.warn('[update-api-ip] Formato de URL não reconhecido em api.ts. Nenhuma alteração feita.');
  process.exit(0);
}

const currentIP = match[1];
const port = match[2];

if (currentIP === ip) {
  console.log(`[update-api-ip] IP já está correto: ${ip}:${port}`);
  process.exit(0);
}

const updated = content.replace(/http:\/\/[\d.]+:(\d+)/, `http://${ip}:$1`);
fs.writeFileSync(apiFilePath, updated, 'utf8');
console.log(`[update-api-ip] IP atualizado: ${currentIP} → ${ip} (porta ${port})`);
