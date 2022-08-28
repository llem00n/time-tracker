const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
	requestBreakpoints: (firstDate, secondDate) => ipcRenderer.invoke('review-request-breakpoints', firstDate, secondDate)
})