// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: smile;
const inputs = args.shortcutParameter;

const notification = new Notification();

notification.identifier = inputs.id ? inputs.id : (inputs.title ? inputs.title : "");

if (inputs.threadId) notification.threadIdentifier = inputs.threadId;
if (inputs.title) notification.title = inputs.title;

const textDivider = "──────────────";

notification.subtitle = inputs.subtitle 
    ? `${textDivider}\n${inputs.subtitle}\n${textDivider}` 
    : textDivider;

if (inputs.body) notification.body = inputs.body;
if (inputs.openURL) notification.openURL = inputs.openURL;
if (inputs.triggerDate) notification.setTriggerDate(new Date(inputs.triggerDate));

const actions = inputs.actions 
     ? JSON.parse(`[${inputs.actions.replace(/\n/g, ",")}]`) 
     : (inputs.openURL ? [{ title: "🔗 Open URL", url: inputs.openURL }] : []);

actions.forEach(action => {
    notification.addAction(action.title, action.url);
});

notification.schedule();

Script.complete();