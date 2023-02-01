import fs from 'fs';
import { app, BrowserWindow, } from 'electron';
import path from 'path';

function dealMessage() {
  const [_1, _2, ...argv] = process.argv;
  const message = { argv, };
  fs.writeFileSync(
    path.join(__dirname, 'message'),
    JSON.stringify(message)
  );
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 625,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });
  win.setMinimumSize(805, 550);
  win.loadFile('./index.html');
  win.webContents.openDevTools();
  dealMessage();
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
