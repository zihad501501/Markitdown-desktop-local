const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (content) => ipcRenderer.invoke('dialog:saveFile', content),
  convertFile: (filePath, apiKey, modelName, customPrompt) => ipcRenderer.invoke('convert:file', filePath, apiKey, modelName, customPrompt)
});
