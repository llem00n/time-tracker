const checkbox = document.getElementById('range-checkbox')
const firstDate = document.getElementById('first-date')
const secondDate = document.getElementById('second-date')

const today = new Date()
firstDate.valueAsDate = today;
secondDate.valueAsDate = today;

function onRangeCheckboxClick(checked) {
	const secondDate = document.getElementById('second-date')
	if (checked)
		secondDate.classList.remove('hidden')
	else
		secondDate.classList.add('hidden')
} 

function requestBreakpoints() {
	const isRange = checkbox.checked;
	const a = window.api.requestBreakpoints(new Date(firstDate.valueAsNumber), isRange ? new Date(secondDate.valueAsNumber) : false)
		.then(response => applyBreakpointsRequest(response))
}

function applyBreakpointsRequest(breakpoints) {
	const daysElement = document.getElementById('days')
	daysElement.innerHTML = ''
	
	for (let key in breakpoints) {
		const day = breakpoints[key]
		const dayElement = document.createElement('div')
		dayElement.classList.add('day');
		const dayTitleElement = document.createElement('p');
		dayTitleElement.classList.add('day-title')
		dayTitleElement.innerText = new Array('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT')[new Date(Number.parseInt(key)).getDay()]
		dayElement.appendChild(dayTitleElement)

		for (let breakpoint of day) {
			const breakpointElement = document.createElement('div');
			breakpointElement.classList.add('breakpoint');

			const timeElement = document.createElement('span');
			timeElement.classList.add('breakpoint-time')
			timeElement.innerText = `${new Date(breakpoint.date).getHours()}:${new Date(breakpoint.date).getMinutes()} - `

			const actionElement = document.createElement('span');
			actionElement.classList.add('breakpoint-action')
			actionElement.innerText = breakpoint.action

			const commentElement = document.createElement('span')
			commentElement.classList.add('breakpoint-comment')
			commentElement.innerText = breakpoint.comment;

			breakpointElement.appendChild(timeElement);
			breakpointElement.appendChild(actionElement);
			breakpointElement.appendChild(commentElement);
			dayElement.appendChild(breakpointElement);
		}

		const hr = document.createElement('hr');
		hr.classList.add('day-break')
		dayElement.appendChild(hr);

		daysElement.appendChild(dayElement);
	}
}

requestBreakpoints();