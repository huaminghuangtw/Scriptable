// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;

let widget = new ListWidget();
widget.backgroundColor = new Color("#000000");
widget.useDefaultPadding();

const cacheKey = "cachedQuote";
const cacheDurationMinutes = 120;

// Load cache
let quote;
let cachedData = Keychain.contains(cacheKey) ? JSON.parse(Keychain.get(cacheKey)) : null;

if (!cachedData || !isCacheValid(new Date(cachedData.expiry))) {
    // Fetch new quote
    quote = await fetchQuote();
    // Cache new quote and expiry date
    Keychain.set(cacheKey, JSON.stringify({
        quote: quote,
        expiry: new Date(Date.now() + cacheDurationMinutes * 60 * 1000).toISOString()
    }));
} else {
    // Use cached quote if still valid
    quote = cachedData.quote;
}

// Add quote text to the widget
let q = widget.addText(quote.q);
q.centerAlignText();
q.textColor = new Color("#ffffff");
q.font = new Font("AvenirNext-MediumItalic", 16);
q.minimumScaleFactor = 0.1;
q.textOpacity = 1;

widget.addSpacer(8);

let a = widget.addText(quote.a);
a.centerAlignText();
a.textColor = new Color("#ffffff");
a.font = new Font("Avenir Next", 12);
a.minimumScaleFactor = 0.1;
a.textOpacity = 0.8;

// Add refresh link
widget.url = "shortcuts://run-shortcut?" +
                "name=" + encodeURI("Refresh Quote Widget") + "&" +
                "input=" + encodeURI("\"" + quote.q + "\" — " + quote.a);

// Display the widget
if (config.runsInWidget) {
    Script.setWidget(widget);
} else {
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

// Check if cache has expired
function isCacheValid(expiry) {
    return expiry.getTime() > new Date().getTime();
}