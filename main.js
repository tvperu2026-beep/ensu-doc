const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const DOCS_DIR = path.join(os.homedir(), 'Documents', 'ENSU Doc');
fs.mkdirSync(DOCS_DIR, { recursive: true });

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1500,
    height: 950,
    title: 'ENSU Doc',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Guardar PDF
ipcMain.handle('save-pdf', async (_e, { filename, base64 }) => {
  try {
    const safe = String(filename || 'documento.pdf').replace(/[^\w.-]+/g, '_');
    const target = path.join(DOCS_DIR, safe);
    fs.writeFileSync(target, Buffer.from(base64.replace(/^data:application\/pdf;base64,/, ''), 'base64'));
    return { ok: true, path: target };
  } catch (e) { return { ok: false, error: e.message }; }
});

// Abrir carpeta Documentos
ipcMain.handle('open-folder', () => {
  shell.openPath(DOCS_DIR);
  return { ok: true };
});