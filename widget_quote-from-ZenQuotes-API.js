// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
let widget = new ListWidget();

widget.backgroundColor = Color.black();
widget.useDefaultPadding();

const cacheKey = "cachedQuote";
const cacheDurationMinutes = 480;

// Load cache
let cachedData = Keychain.contains(cacheKey)
  ? JSON.parse(Keychain.get(cacheKey))
  : null;

let quote = null;

if (await isConnectedToInternet()) {
  if (isCacheUsable(cachedData)) {
    // Use cached quote if still valid
    quote = cachedData.quote;
  } else {
    // Fetch new quote if online and cache is invalid
    quote = await fetchQuote();
    // Cache the new quote and expiry date
    Keychain.set(
      cacheKey,
      JSON.stringify({
        quote: quote,
        expiry: new Date(
          Date.now() + cacheDurationMinutes * 60 * 1000
        ).toISOString(),
      })
    );
  }
} else {
  // Use cached quote if offline
  quote = cachedData.quote;
}

let q = widget.addText(quote.q);

q.centerAlignText();
q.textColor = Color.white();
// http://iosfonts.com
q.font = new Font("IowanOldStyle-BoldItalic", 18);
q.minimumScaleFactor = 0.1;
q.textOpacity = 1;

widget.addSpacer(15);

let a = widget.addText(quote.a);

a.centerAlignText();
a.textColor = Color.white();
// http://iosfonts.com
a.font = new Font("Avenir Next", 12);
a.minimumScaleFactor = 0.1;
a.textOpacity = 0.8;

widget.url =
  `shortcuts://run-shortcut?` +
  `name=${encodeURI("📥 Add to Inbox")}&` +
  `input=${encodeURI(`“${quote.q.trim()}” — ${quote.a.trim()}`)}`;

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();

// ================
// Helper functions
// ================

// ZenQuotes API: https://zenquotes.io
async function fetchQuote() {
  const response = await new Request(
    "https://zenquotes.io/api/random"
  ).loadJSON();
  return {
    q: response[0].q,
    a: response[0].a,
  };
}

function isCacheValid(expiry) {
  return expiry.getTime() > new Date().getTime();
}

function isCacheUsable(cachedData) {
  return cachedData && isCacheValid(new Date(cachedData.expiry));
}

async function isConnectedToInternet() {
  try {
    await new Request("https://www.google.com").load();
    return true;
  } catch {
    return false;
  }
}
