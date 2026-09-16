// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: smile;
const inputs = args.shortcutParameter;

const notification = new Notification();

notification.identifier = inputs.body
    ? inputs.body
    : inputs.title
    ? inputs.title
    : "";

if (inputs.threadID) notification.threadIdentifier = inputs.threadID;

notification.title =  inputs.title ? inputs.title : "‏‎‎‏";

const textDivider = "──────────────";

if (inputs.subtitle) {
    notification.subtitle = `${textDivider}\n${inputs.subtitle}\n${textDivider}`;
} else if (inputs.title && inputs.body) {
    notification.subtitle = textDivider;
}

if (inputs.body) notification.body = inputs.body

if (inputs.openURL) notification.openURL = inputs.openURL;

if (inputs.triggerDate)
    notification.setTriggerDate(new Date(inputs.triggerDate));

notification.schedule();

Script.complete();
