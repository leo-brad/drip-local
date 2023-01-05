import fs from 'fs';
import { app, BrowserWindow, } from 'electron';
import path from 'path';

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });
  win.loadFile('./index.html');
  const [_1, _2, configString, projectPath] = process.argv;
  const argv = JSON.stringify([configString, projectPath]);
  fs.writeFileSync(path.join(__dirname, 'argv'), argv);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
