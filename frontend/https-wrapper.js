import httpProxy from 'http-proxy';
import https from 'https';
import forge from 'node-forge';
import fs from 'fs';

let pemCert, pemKey;

if (fs.existsSync('cert.pem') && fs.existsSync('key.pem')) {
    pemCert = fs.readFileSync('cert.pem', 'utf8');
    pemKey = fs.readFileSync('key.pem', 'utf8');
} else {
    // Generate a self-signed certificate on the fly
    const pki = forge.pki;
    const keys = pki.rsa.generateKeyPair(2048);
    const cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10);
    const attrs = [{ name: 'commonName', value: '192.168.1.105' }];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.sign(keys.privateKey);

    pemCert = pki.certificateToPem(cert);
    pemKey = pki.privateKeyToPem(keys.privateKey);
    fs.writeFileSync('cert.pem', pemCert);
    fs.writeFileSync('key.pem', pemKey);
}

const sslConfig = { key: pemKey, cert: pemCert };

const proxy = httpProxy.createProxyServer({ ws: true });

proxy.on('error', (err, req, res) => {
    console.error('Proxy Error:', err.message);
    if (res.writeHead) res.writeHead(500, { 'Content-Type': 'text/plain' });
    if (res.end) res.end('Something went wrong. And we are reporting a custom error message.');
});

// Create HTTPS servers for each service
const services = [
    { name: 'Django Backend', httpsPort: 8445, targetPort: 8005 },
    { name: 'FastAPI AI', httpsPort: 8440, targetPort: 8080 },
    { name: 'NextChat UI', httpsPort: 3441, targetPort: 3001 },
    { name: 'RVC Studio UI', httpsPort: 3442, targetPort: 3002 },
];

services.forEach(svc => {
    const server = https.createServer(sslConfig, (req, res) => {
        proxy.web(req, res, { target: `http://127.0.0.1:${svc.targetPort}` });
    });
    
    server.on('upgrade', (req, socket, head) => {
        proxy.ws(req, socket, head, { target: `http://127.0.0.1:${svc.targetPort}` });
    });

    server.listen(svc.httpsPort, '0.0.0.0', () => {
        console.log(`[HTTPS Wrapper] ${svc.name} listening on https://0.0.0.0:${svc.httpsPort} -> http://127.0.0.1:${svc.targetPort}`);
    });
});
