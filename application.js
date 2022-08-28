const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron')
const path = require('path')
const { registerIpcHandlers } = require('./bridge-handlers.js')

class Application {
	#breakpointWindow = null;
	#reviewWindow = null;
	#icon = null;

	init() {
		app.whenReady()
			.then(() => {this.#createTrayIcon() })
			.then(() => { this.#createBreakpointWindow() })
			.then(() => { this.#createReviewWindow() })
			.then(() => { registerIpcHandlers() })
	}

	#createBreakpointWindow() {
		this.#breakpointWindow = new BrowserWindow({
			width: 310,
			height: 162,
			frame: false,
			show: false,
			transparent: true,
			resizable: false,
			webPreferences: {
				preload: path.join(__dirname, 'breakpoint-bridge.js')
			}
		})
		this.#breakpointWindow.on('close', (event) => {
			event.preventDefault();
			this.#breakpointWindow.hide();
		})
		this.#breakpointWindow.loadFile(path.join(__dirname, './client-app/src/breakpoint/index.html'))
	}

	#createReviewWindow() {
		this.#reviewWindow = new BrowserWindow({
			width: 550,
			height: 600,
			frame:	false,
			show: false,
			transparent: true,
			webPreferences: {
				preload: path.join(__dirname, 'review-bridge.js')
			}
		});
		this.#reviewWindow.on('close', (event) => {
			event.preventDefault();
			this.#reviewWindow.hide();
		})
		this.#reviewWindow.loadFile(path.join(__dirname, './client-app/src/review/index.html'))
	}
	
	#createTrayIcon() {
		this.#icon = new Tray(path.join(__dirname, './res/icon.ico'))
		const contextMenu = Menu.buildFromTemplate([
			{ label: 'Breakpoint', type: 'normal', click: () => { this.#breakpointClick() } },
			{ label: 'Review', type: 'normal', click: () => { this.#reviewClick() } },
			{ label: 'Exit', type: 'normal', click: () => { this.#exitClick() } },
		])
		this.#icon.setToolTip('Time tracker');
		this.#icon.setTitle('Time tracker');
		this.#icon.setContextMenu(contextMenu);
	}

	#exitClick() {
		app.quit()
	}

	#breakpointClick() {
		this.#breakpointWindow.show();
	}

	#reviewClick() {
		this.#reviewWindow.show();
		this.#reviewWindow.webContents.send('onload', 'hello')
	}
}

exports.Application = Application