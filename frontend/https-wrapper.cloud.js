import httpProxy from 'http-proxy';
import https from 'https';
import fs from 'fs';
const sslConfig = { key: fs.readFileSync('key.pem', 'utf8'), cert: fs.readFileSync('cert.pem', 'utf8') };
const proxy = httpProxy.createProxyServer({ ws: true, xfwd: true, changeOrigin: true, secure: false });
proxy.on('error', (err, req, res) => {
    console.error('Proxy Error for', req.url, ':', err);
    if (res.writeHead) res.writeHead(500);
    if (res.end) res.end('Proxy Error: ' + err.message);
});

const proxyServices = [
    { name: 'Django Backend', httpsPort: 8445, targetHost: 'portal_django_backend_1', targetPort: 8005 },
    { name: 'FastAPI AI',     httpsPort: 8440, targetHost: 'portal_ai_copilot_1',     targetPort: 8080 },
    { name: 'Meeting AI',     httpsPort: 3440, targetHost: '10.0.0.105',              targetPort: 3000 },
    { name: 'NextChat',       httpsPort: 3441, targetHost: 'nextchat_nextchat_1',     targetPort: 3000 }
];

proxyServices.forEach(svc => {
    const server = https.createServer(sslConfig, (req, res) => {
        proxy.web(req, res, { target: 'http://' + svc.targetHost + ':' + svc.targetPort });
    });
    server.on('upgrade', (req, socket, head) => {
        proxy.ws(req, socket, head, { target: 'http://' + svc.targetHost + ':' + svc.targetPort });
    });
    server.listen(svc.httpsPort, '0.0.0.0', () => {
        console.log('[HTTPS Wrapper] ' + svc.name + ' -> https://0.0.0.0:' + svc.httpsPort);
    });
});
