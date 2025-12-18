const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectGif: () => ipcRenderer.invoke('select-file', [{ name: 'GIF Image', extensions: ['gif'] }]),
  selectPayload: () =>
    ipcRenderer.invoke('select-file', [{ name: 'Payload Files', extensions: ['*'] }]),
  selectOutputGif: (defaultPath) => ipcRenderer.invoke('select-output', defaultPath),
  selectOutputPayload: (defaultPath) => ipcRenderer.invoke('select-output', defaultPath),
  embed: (gifPath, payloadPath, outputPath) =>
    ipcRenderer.invoke('embed', { gifPath, payloadPath, outputPath }),
  extract: (gifPath, outputPath) => ipcRenderer.invoke('extract', { gifPath, outputPath }),
});
