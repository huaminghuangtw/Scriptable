// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
const CONFIG = {
    REFRESH_INTERVAL_MINUTES: 1440, // 1 day
    QUOTE: {
        FONT: { NAME: "IowanOldStyle-BoldItalic", SIZE: 22 },
        MINIMUM_SCALE_FACTOR: 0.1,
        TEXT_OPACITY: 1,
        TEXT_COLOR: Color.white(),
    },
    AUTHOR: {
        FONT: { NAME: "Avenir Next", SIZE: 14 },
        MINIMUM_SCALE_FACTOR: 0.1,
        TEXT_OPACITY: 0.8,
        TEXT_COLOR: Color.gray(),
    },
    SPACER: 15,
};

const Cache = importModule("Cache");

let cache = new Cache(Script.name());

let quote = await cache.getOrFetch(fetchQuote);

let widget = await createWidget(quote);

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

async function createWidget(quote) {
    let widget = new ListWidget();

    let q = widget.addText(quote.q);
    q.centerAlignText();
    q.font = new Font(CONFIG.QUOTE.FONT.NAME, CONFIG.QUOTE.FONT.SIZE);
    q.minimumScaleFactor = CONFIG.QUOTE.MINIMUM_SCALE_FACTOR;
    q.textOpacity = CONFIG.QUOTE.TEXT_OPACITY;
    q.textColor = CONFIG.QUOTE.TEXT_COLOR;

    widget.addSpacer(CONFIG.SPACER);

    let a = widget.addText(quote.a);
    a.centerAlignText();
    a.font = new Font(CONFIG.AUTHOR.FONT.NAME, CONFIG.AUTHOR.FONT.SIZE);
    a.minimumScaleFactor = CONFIG.AUTHOR.MINIMUM_SCALE_FACTOR;
    a.textOpacity = CONFIG.AUTHOR.TEXT_OPACITY;
    a.textColor = CONFIG.AUTHOR.TEXT_COLOR;

    widget.url =
        `shortcuts://run-shortcut?` +
        `name=${encodeURIComponent("📥 Add to Inbox")}&` +
        `input=${encodeURIComponent(
            `“${quote.q.trim()}” — ${quote.a.trim()}`
        )}`;

    widget.refreshAfterDate = Date.now() + CONFIG.REFRESH_INTERVAL_MINUTES * 60 * 1000;

    return widget;
}
