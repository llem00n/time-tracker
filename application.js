const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron')
const path = require('path')
const { registerIpcHandlers } = require('./bridge-handlers.js')
const AutoLaunch = require('auto-launch')

class Application {
	#breakpointWindow = null;
	#reviewWindow = null;
	#icon = null;
	#iconContextMenu = null;
	#autoLauncher = null;

	init() {
		app.whenReady()
			.then(() => { this.#initAutoLauncher() })
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
		this.#iconContextMenu = Menu.buildFromTemplate([
			{ label: 'Breakpoint', type: 'normal', click: () => { this.#breakpointClick() } },
			{ label: 'Review', type: 'normal', click: () => { this.#reviewClick() } },
			{ label: 'Autostart', type: 'checkbox', checked: false, click: () => { this.#toggleAutoLaunch() } },
			{ label: 'Exit', type: 'normal', click: () => { this.#exitClick() } },
		])
		this.#icon.setToolTip('Time tracker');
		this.#icon.setTitle('Time tracker');
		this.#icon.setContextMenu(this.#iconContextMenu);
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

	#initAutoLauncher() {
		this.#autoLauncher = new AutoLaunch({
			name: 'Time tracker',
			path: app.getPath('exe')
		})
	}

	#checkAutoLaunch() {
		if (!this.#autoLauncher) return;

		this.#autoLauncher.isEnabled()
			.then(isEnabled => {
				if (isEnabled) {
					this.#iconContextMenu.items[2].checked = true 
				} else {
					this.#iconContextMenu.items[2].checked = false;
				}
			})
	}

	#toggleAutoLaunch() {
		this.#autoLauncher.isEnabled()
			.then(isEnabled => {
				if (isEnabled) {
					this.#autoLauncher.disable()
						.then(() => this.#checkAutoLaunch())
				} else {
					this.#autoLauncher.enable()
						.then(() => this.#checkAutoLaunch())
				}
			})
	}
}

exports.Application = Application