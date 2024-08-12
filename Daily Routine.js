// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: smile;
const moduleCreateNotification = importModule("moduleCreateNotification");

let inputs = args.shortcutParameter;

const myArray = inputs.split(',');
if (myArray.length > 1) {
	const title = myArray[myArray.length - 1];
	const nextShortcut = myArray.shift();
	const remainingShortcuts = myArray.join(',');
	
	moduleCreateNotification.createNotification(
        decodeURI(title),
		"༺═────────═༻",
		"👉 " + decodeURI(nextShortcut),
		"shortcuts://run-shortcut?" +
		"name=" + nextShortcut + "&" +
		"input=" + remainingShortcuts
	);

    Script.setShortcutOutput(remainingShortcuts);
}

Script.complete();