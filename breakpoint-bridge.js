const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('actions', {
	cancel: () => ipcRenderer.invoke('breakpoint-actions-cancel'),
	save: (action, comments) => ipcRenderer.invoke('breakpoint-actions-save', action, comments)
})