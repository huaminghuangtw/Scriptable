// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: smile;
const moduleNotifications = importModule("moduleNotifications");

let inputs = args.shortcutParameter;

const title = inputs.hasOwnProperty("title") ? inputs["title"] : "";
const subtitle = inputs.hasOwnProperty("subtitle") ? inputs["subtitle"] : "";
const body = inputs.hasOwnProperty("body") ? inputs["body"] : "";
const openURL = inputs.hasOwnProperty("openURL") ? inputs["openURL"] : "";

moduleNotifications.createNotification(title, subtitle, body, openURL);

Script.complete();