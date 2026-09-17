// Renders the four placeholder legal PDFs (one page each, branded, clearly marked as
// samples) into studio/scripts/seed-data/docs/, where studio/scripts/patch-mocks.ts
// uploads them. Run: node scripts/mock-docs.mjs
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const out = 'studio/scripts/seed-data/docs';
const docs = [
  { file: 'reglamento-copropiedad.pdf', title: 'Reglamento de copropiedad', en: 'Co-ownership regulations', sections: ['Objeto y ámbito de aplicación', 'Bienes comunes y privativos', 'Derechos y obligaciones de los copropietarios', 'Administración y asamblea', 'Gastos comunes y fondo de reserva', 'Régimen de convivencia', 'Modificaciones y vigencia'] },
  { file: 'minuta-compraventa.pdf', title: 'Minuta tipo de compraventa', en: 'Standard purchase agreement', sections: ['Partes y antecedentes', 'Objeto de la compraventa', 'Precio y forma de pago', 'Plazos de entrega', 'Garantías y postventa', 'Resolución y penalidades', 'Jurisdicción'] },
  { file: 'planos-aprobaciones.pdf', title: 'Planos y aprobaciones', en: 'Plans and approvals', sections: ['Plano de ubicación', 'Plantas arquitectónicas por nivel', 'Cortes y elevaciones', 'Licencia de construcción', 'Aprobación municipal', 'Certificados de servicios', 'Registro de modificaciones'] },
  { file: 'fichas-politicas.pdf', title: 'Fichas y políticas del proyecto', en: 'Project sheets and policies', sections: ['Ficha técnica del proyecto', 'Especificaciones de acabados', 'Política comercial', 'Política de garantías', 'Política de personalización', 'Canales de atención', 'Anexos'] },
];

const page = (doc) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 0; }
  body { margin: 0; padding: 22mm 20mm; height: 297mm; box-sizing: border-box; font-family: Helvetica, Arial, sans-serif; color: #003a36; background: #f4eedf; }
  header { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 6mm; border-bottom: 1px solid rgba(0,58,54,.35); font-size: 9pt; letter-spacing: .16em; text-transform: uppercase; }
  header b { font-size: 12pt; letter-spacing: .08em; }
  .kicker { margin: 18mm 0 4mm; font-size: 8.5pt; letter-spacing: .16em; text-transform: uppercase; color: rgba(0,58,54,.7); }
  h1 { margin: 0 0 6mm; font-size: 30pt; font-weight: 500; line-height: 1.02; letter-spacing: -.02em; }
  .en { margin: 0 0 12mm; font-size: 12pt; color: rgba(0,58,54,.7); }
  .note { padding: 6mm 7mm; margin-bottom: 12mm; border: 1px solid rgba(0,58,54,.35); font-size: 10pt; line-height: 1.5; }
  .note b { display: block; margin-bottom: 1.5mm; letter-spacing: .12em; text-transform: uppercase; font-size: 8.5pt; }
  ol { margin: 0; padding: 0; list-style: none; counter-reset: s; }
  li { display: flex; gap: 8mm; padding: 4mm 0; border-top: 1px solid rgba(0,58,54,.2); font-size: 12pt; }
  li::before { counter-increment: s; content: counter(s, decimal-leading-zero); font-size: 8.5pt; letter-spacing: .12em; color: rgba(0,58,54,.6); line-height: 2; }
  dl { display: grid; grid-template-columns: auto auto auto; gap: 4mm 14mm; margin: 14mm 0 0; font-size: 9pt; }
  dt { letter-spacing: .12em; text-transform: uppercase; color: rgba(0,58,54,.6); font-size: 8pt; }
  dd { margin: 1mm 0 0; font-size: 11pt; }
  footer { position: absolute; left: 20mm; right: 20mm; bottom: 16mm; display: flex; justify-content: space-between; font-size: 8pt; letter-spacing: .12em; text-transform: uppercase; color: rgba(0,58,54,.6); }
</style></head><body>
  <header><b>Putnam · Ereditá</b><span>Documentación para compradores</span></header>
  <p class="kicker">Documento de muestra · Sample document</p>
  <h1>${doc.title}</h1>
  <p class="en">${doc.en}</p>
  <div class="note"><b>Aviso</b>Este archivo es un marcador de posición generado para mostrar cómo se publica la documentación legal del proyecto. No tiene validez legal ni comercial: será reemplazado por la versión oficial firmada antes de la comercialización. <br><em>This is a placeholder file with no legal or commercial validity; the signed official version will replace it.</em></div>
  <ol>${doc.sections.map((s) => `<li><span>${s}</span></li>`).join('')}</ol>
  <dl><div><dt>Versión</dt><dd>v0.1 (muestra)</dd></div><div><dt>Vigente desde</dt><dd>01 · 09 · 2026</dd></div><div><dt>Proyecto</dt><dd>Ereditá Art · La Paz</dd></div></dl>
  <footer><span>Putnam Desarrollos Inmobiliarios</span><span>Página 1 de 1</span></footer>
</body></html>`;

await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage();
for (const doc of docs) {
  await tab.setContent(page(doc), { waitUntil: 'load' });
  await tab.pdf({ path: `${out}/${doc.file}`, format: 'A4', printBackground: true, preferCSSPageSize: true });
  console.log(`  ${out}/${doc.file}`);
}
await browser.close();
