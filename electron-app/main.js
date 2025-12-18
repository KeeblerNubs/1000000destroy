const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

const MARKER = Buffer.from('GIF_PAYLOAD::');
const SIZE_BYTES = 4;

function embedPayload(gifPath, payloadPath, outputPath) {
  const gifBytes = fs.readFileSync(gifPath);
  const payloadBytes = fs.readFileSync(payloadPath);

  const sizeBuffer = Buffer.alloc(SIZE_BYTES);
  sizeBuffer.writeUInt32LE(payloadBytes.length, 0);

  const outputBytes = Buffer.concat([gifBytes, MARKER, sizeBuffer, payloadBytes]);
  fs.writeFileSync(outputPath, outputBytes);
}

function extractPayload(gifPath, outputPath) {
  const data = fs.readFileSync(gifPath);
  const markerIndex = data.lastIndexOf(MARKER);

  if (markerIndex === -1) {
    throw new Error('Marker not found; no payload present in the GIF.');
  }

  const sizeStart = markerIndex + MARKER.length;
  const sizeEnd = sizeStart + SIZE_BYTES;
  if (sizeEnd > data.length) {
    throw new Error('Payload size prefix is incomplete.');
  }

  const payloadLength = data.readUInt32LE(sizeStart);
  const payloadStart = sizeEnd;
  const payloadEnd = payloadStart + payloadLength;
  if (payloadEnd > data.length) {
    throw new Error('Payload length exceeds available data.');
  }

  const payloadBytes = data.subarray(payloadStart, payloadEnd);
  fs.writeFileSync(outputPath, payloadBytes);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));
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

ipcMain.handle('select-file', async (event, filters) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters,
  });
  if (result.canceled || !result.filePaths.length) {
    return null;
  }
  return result.filePaths[0];
});

ipcMain.handle('select-output', async (event, defaultPath) => {
  const result = await dialog.showSaveDialog({ defaultPath });
  if (result.canceled || !result.filePath) {
    return null;
  }
  return result.filePath;
});

ipcMain.handle('embed', async (event, { gifPath, payloadPath, outputPath }) => {
  embedPayload(gifPath, payloadPath, outputPath);
  return outputPath;
});

ipcMain.handle('extract', async (event, { gifPath, outputPath }) => {
  extractPayload(gifPath, outputPath);
  return outputPath;
});
