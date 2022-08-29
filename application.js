const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron')
const path = require('path')
const { registerIpcHandlers } = require('./bridge-handlers.js')
const AutoLaunch = require('auto-launch')

class Application {
	#breakpointWindow = null;
	#reviewWindow = null;
	#icon = null;

	init() {
		app.whenReady()
			.then(() => { this.#createTrayIcon() })
			.then(() => { this.#createBreakpointWindow() })
			.then(() => { this.#createReviewWindow() })
			.then(() => { registerIpcHandlers() })
			.then(() => { this.#checkAutoLaunch() })
	}

	#createBreakpointWindow() {
		this.#breakpointWindow = new BrowserWindow({
			width: 320,
			height: 175,
			frame: false,
			show: false,
			transparent: true,
			resizable: false,
			webPreferences: {
				preload: path.join(__dirname, 'breakpoint-bridge.js'),
				devTools: false,
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
			resizable: false,
			webPreferences: {
				preload: path.join(__dirname, 'review-bridge.js'),
				devTools: false,
			}
		});
		this.#reviewWindow.on('close', (event) => {
			event.preventDefault();
			this.#reviewWindow.hide();
		})
		this.#reviewWindow.loadFile(path.join(__dirname, './client-app/src/review/index.html'))
	}
	
	#createTrayIcon() {
		this.#icon = new Tray(path.join(__dirname, process.platform === 'win32' ? '/res/icon.ico' : './res/icon.png'))
		const contextMenu = Menu.buildFromTemplate([
			{ label: 'Breakpoint', type: 'normal', click: () => { this.#breakpointClick() } },
			{ label: 'Review', type: 'normal', click: () => { this.#reviewClick() } },
			{ label: 'Exit', type: 'normal', click: () => { this.#exitClick() } },
		])
		this.#icon.setToolTip('Time tracker');
		this.#icon.setTitle('Time tracker');
		this.#icon.setContextMenu(contextMenu);
		this.#icon.on('click', () => {
			this.#icon.popUpContextMenu()
		})
	}

	#exitClick() {
		app.exit()
	}

	#breakpointClick() {
		this.#breakpointWindow.show();
	}

	#reviewClick() {
		this.#reviewWindow.show();
		this.#reviewWindow.webContents.send('review-onload')
	}

	#checkAutoLaunch() {
		const autoLauncher = new AutoLaunch({
			name: 'Time tracker',
			path: app.getPath('exe')
		})

		autoLauncher.isEnabled()
			.then((isEnabled) => {
				if (isEnabled) return;
				autoLauncher.enable();
			})
	}
}

exports.Application = Application