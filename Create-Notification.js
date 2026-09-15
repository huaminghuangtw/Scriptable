// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: smile;
const inputs = args.shortcutParameter;

const notification = new Notification();

notification.identifier = inputs.id
    ? inputs.id
    : inputs.title
    ? inputs.title
    : "";

if (inputs.threadID) notification.threadIdentifier = inputs.threadID;

notification.title = inputs.title
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .join("\n");

const textDivider = "──────────────";

if (inputs.subtitle) {
    notification.subtitle = `${textDivider}\n${inputs.subtitle
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "")
        .join("\n")}\n${textDivider}`;
} else if (inputs.body) {
    notification.subtitle = textDivider;
}

if (inputs.body)
    notification.body = inputs.body.split("\n")
           .map((line) => line.trim())
           .filter((line) => line !== "")
           .join("\n")

if (inputs.openURL) notification.openURL = inputs.openURL;

if (inputs.triggerDate)
    notification.setTriggerDate(new Date(inputs.triggerDate));

notification.schedule();

Script.complete();
