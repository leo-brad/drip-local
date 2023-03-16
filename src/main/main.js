import path from 'path';
import fs from 'fs';
import net from 'net';
import { app, BrowserWindow, } from 'electron';

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 625,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });
  win.setMinimumSize(805, 510);
  win.loadFile('./index.html');
  win.webContents.openDevTools();
  const server = net.createServer((s) => {
    const [_1, _2, ...argv] = process.argv;
    s.write(argv.join(' '));
    server.close();
  });
  server.listen(8124);
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
