// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
let widget = new ListWidget();

widget.backgroundColor = new Color("#000000");

widget.useDefaultPadding();

let quote = await fetchQuote();

let q = widget.addText(quote.q);
q.centerAlignText();
q.textColor = new Color("#ffffff");
// http://iosfonts.com
q.font = new Font("AvenirNext-MediumItalic", 16);
q.minimumScaleFactor = 0.1;
q.textOpacity = 1;

widget.addSpacer(8);

let a = widget.addText(quote.a);
a.centerAlignText();
a.textColor = new Color("#ffffff");
// http://iosfonts.com
a.font = new Font("Avenir Next", 12);
a.minimumScaleFactor = 0.1;
a.textOpacity = 0.8;

widget.url = "shortcuts://run-shortcut?" +
                "name=" + encodeURI("Refresh Quote Widget") + "&" +
                "input=" + encodeURI("\"" + quote.q + "\" — " + quote.a);

let date = new Date();
date.setMinutes(date.getMinutes() + 30);
widget.refreshAfterDate = date;

if (config.runsInWidget) {
    // If the script is running as a widget, set the widget to be displayed on the home screen
    Script.setWidget(widget);
} else {
    // If the script is running within the Scriptable app, present a preview of the medium-sized widget
    // to quickly see changes and make adjustments (for testing and debugging)
    widget.presentMedium();
}

Script.complete();

// ZenQuotes API: https://zenquotes.io
async function fetchQuote() {
    const response = await new Request("https://zenquotes.io/api/random").loadJSON();
    return {
        q: response[0].q,
        a: response[0].a
    };
}