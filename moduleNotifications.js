// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: smile;
// Documentation: https://docs.scriptable.app/notification/
module.exports.createNotification = (title = "", subtitle = "", body = "", openURL = "") => {
    const notification = new Notification();

    notification.title = title;
    notification.subtitle = subtitle;
    notification.body = body;
    notification.openURL = openURL;

    notification.schedule();
}