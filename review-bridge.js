const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
	requestBreakpoints: (firstDate, secondDate) => ipcRenderer.invoke('review-request-breakpoints', firstDate, secondDate),
	close: () => ipcRenderer.invoke('review-close'),
	onload: (callback) => {
		ipcRenderer.on('review-onload', (event, ...args) => callback(...args));
	}
})