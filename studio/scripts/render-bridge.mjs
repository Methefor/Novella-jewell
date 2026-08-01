import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const studioRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(studioRoot, 'out');
const port = 4317;
const allowedOrigins = new Set([
  'https://novellajewell.com',
  'https://www.novellajewell.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);
const compositions = {
  story: ['Novella-YuzukLansmani-Story', 'novella-yuzuk-lansmani-story.mp4'],
  feed: ['Novella-YuzukLansmani-Feed', 'novella-yuzuk-lansmani-feed.mp4'],
  square: ['Novella-YuzukLansmani-Square', 'novella-yuzuk-lansmani-square.mp4'],
};

function headers(origin) {
  return {
    'Access-Control-Allow-Origin': allowedOrigins.has(origin) ? origin : 'https://novellajewell.com',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Private-Network': 'true',
    'Content-Type': 'application/json; charset=utf-8',
    Vary: 'Origin',
  };
}

function respond(response, status, body, origin = '') {
  response.writeHead(status, headers(origin));
  response.end(JSON.stringify(body));
}

function runRender(composition, output, propsPath) {
  return new Promise((resolve, reject) => {
    const cli = join(studioRoot, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
    const child = spawn(process.execPath, [cli, 'render', composition, output, `--props=${propsPath}`], {
      cwd: studioRoot,
      stdio: 'inherit',
      windowsHide: true,
    });
    child.once('error', reject);
    child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`Render işlemi ${code} koduyla durdu.`)));
  });
}

function validate(payload) {
  if (!payload || typeof payload !== 'object') return false;
  if (!Array.isArray(payload.formats) || payload.formats.length < 1 || payload.formats.some((item) => !(item in compositions))) return false;
  const props = payload.props;
  if (!props || !Array.isArray(props.gorseller) || props.gorseller.length !== 3) return false;
  if (props.gorseller.some((item) => typeof item !== 'string' || item.length > 1200)) return false;
  return ['baslik', 'altBaslik', 'cta'].every((key) => typeof props[key] === 'string' && props[key].length <= 180);
}

createServer(async (request, response) => {
  const origin = request.headers.origin ?? '';
  if (origin && !allowedOrigins.has(origin)) return respond(response, 403, { error: 'Bu kaynak için erişim reddedildi.' }, origin);
  if (request.method === 'OPTIONS') { response.writeHead(204, headers(origin)); return response.end(); }
  if (request.method === 'GET' && request.url === '/health') return respond(response, 200, { ok: true, name: 'Novella Render Köprüsü' }, origin);
  if (request.method !== 'POST' || request.url !== '/render') return respond(response, 404, { error: 'İşlem bulunamadı.' }, origin);

  try {
    let raw = '';
    for await (const chunk of request) {
      raw += chunk;
      if (raw.length > 25_000) throw new Error('İstek çok büyük.');
    }
    const payload = JSON.parse(raw);
    if (!validate(payload)) return respond(response, 400, { error: 'Render paketi geçersiz.' }, origin);

    await mkdir(outputDir, { recursive: true });
    const propsPath = join(outputDir, 'novella-yuzuk-lansmani-props.json');
    await writeFile(propsPath, JSON.stringify(payload.props, null, 2), 'utf8');
    const outputs = [];
    for (const format of payload.formats) {
      const [composition, filename] = compositions[format];
      await runRender(composition, join('out', filename), propsPath);
      outputs.push(join(outputDir, filename));
    }
    return respond(response, 200, { ok: true, outputs }, origin);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Render işlemi tamamlanamadı.';
    return respond(response, 500, { error: message }, origin);
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`\nNovella Render Köprüsü hazır: http://127.0.0.1:${port}`);
  console.log('Bu pencere açıkken admin panelinden videoları oluşturabilirsiniz.\n');
});
