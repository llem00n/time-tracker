const { ipcMain, app, BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')


function registerIpcHandlers() {
	registerbreakpointActionHandlers()
	registerReviewActionHandlers()
}

function registerbreakpointActionHandlers() {
	ipcMain.handle('breakpoint-actions-cancel', () => {
		const window = BrowserWindow.getFocusedWindow()
		window.hide();
	})

	ipcMain.handle('breakpoint-actions-save', (event, action, comment) => {
		const window = BrowserWindow.getFocusedWindow()
		window.hide();

		const date = new Date().toJSON();
		const filename = path.join(__dirname, `./breakpoints/breakpoints-${date.split('T')[0]}`);
		const actionData = { date, action, comment }

		if (!fs.existsSync(path.join(__dirname, './breakpoints'))){
			fs.mkdirSync(path.join(__dirname, './breakpoints'), { recursive: true });
		}

		let fileContents = null
		if (fs.existsSync(filename)) {
			fileContents = fs.readFileSync(filename)
		}

		try { fileContents = JSON.parse(fileContents); } 
		catch { fileContents = [] }
		if (!Array.isArray(fileContents)) fileContents = []

		fileContents.push(actionData);
		fs.writeFileSync(filename, JSON.stringify(fileContents));
	})
}

function registerReviewActionHandlers() {
	ipcMain.handle('review-request-breakpoints', (event, firstDate, secondDate) => {
		if (!fs.existsSync(path.join(__dirname, './breakpoints'))) return {}

		const result = {}
		let date = firstDate;
		if (!secondDate) secondDate = new Date(firstDate.getTime());
		for(; date.getTime() <= secondDate.getTime(); date.setDate(date.getDate() + 1)) {
			const filename = path.join(__dirname, `./breakpoints/breakpoints-${date.toJSON().split('T')[0]}`);
			if (!fs.existsSync(filename)) continue;
			const fileData = fs.readFileSync(filename);
			result[date.getTime()] = JSON.parse(fileData)
		}

		return result;
	})
}

module.exports = {
	registerIpcHandlers
}