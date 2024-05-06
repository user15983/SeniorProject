const { ipcRenderer } = require('electron')

window.onscroll = () => ipcRenderer.send('webview-scrolled');