const action = document.getElementById('inp-action');
const comment = document.getElementById('inp-comment');

function onCancelClick() {
	window.actions.cancel();
	action.value = ''
	window.value = ''
}

function onSaveClick() {
	window.actions.save(action.value, comment.value)
	action.value = ''
	comment.value = ''
}