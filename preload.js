const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ensu', {
  savePdf: (data) => ipcRenderer.invoke('save-pdf', data),
  openFolder: () => ipcRenderer.invoke('open-folder')
});