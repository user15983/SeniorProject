const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  buttonClick: (button) => ipcRenderer.send('button-click', button),
  animationReady: () => ipcRenderer.send('browser-animation-ready'),
})