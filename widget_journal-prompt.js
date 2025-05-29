// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 📁 https://github.com/huaminghuangtw/Evergreen-Lists
const CONFIG = {
    REFRESH_INTERVAL_MINUTES: 1440, // 1 day
    FONT: { NAME: "IowanOldStyle-BoldItalic", SIZE: 20 },
    MINIMUM_SCALE_FACTOR: 0.1,
    TEXT_OPACITY: 1,
    TEXT_COLOR: Color.white(),
};

const Utils = importModule("Utils");
const Cache = importModule("Cache");

let cache = new Cache(Script.name());

let randomJournalPrompt = await cache.getOrFetch(fetchRandomJournalPrompt);

let widget = await createWidget(randomJournalPrompt);

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();

// ================
// Helper functions
// ================

async function fetchRandomJournalPrompt() {
    let filename = "💭 Journal Prompt";

    let fileContent = await new Request(
        `https://raw.githubusercontent.com/huaminghuangtw/Evergreen-Lists/main/${encodeURIComponent(
            filename
        )}/${encodeURIComponent(filename)}.json`
    ).loadString();

    let reminders = JSON.parse(fileContent).reminders;

    let randomJournalPrompt = Utils.convertMarkdownToPlainText(
        Utils.getRandomItem(
            Utils.getRandomItem(
                reminders.filter(
                    (r) => r.subtasks && r.subtasks.length > 0 && !r.flagged
                )
            ).subtasks
        ).name
    );
    
    return randomJournalPrompt;
}

async function createWidget(randomJournalPrompt) {
    let widget = new ListWidget();

    let text = widget.addText("“" + randomJournalPrompt + "”");
    text.centerAlignText();
    text.font = new Font(CONFIG.FONT.NAME, CONFIG.FONT.SIZE);
    text.minimumScaleFactor = CONFIG.MINIMUM_SCALE_FACTOR;
    text.textOpacity = CONFIG.TEXT_OPACITY;
    text.textColor = CONFIG.TEXT_COLOR;

    widget.url =
        `shortcuts://run-shortcut?` +
        `name=${encodeURIComponent("Gemini - Generate Content")}&` +
        `input=${encodeURIComponent(
            JSON.stringify({
                prompt: "If you were in my shoes, how would you answer this question? Get specific and be brief. Use less than 100 words.",
                content: randomJournalPrompt,
            })
        )}`;

    widget.refreshAfterDate = new Date(
        Date.now() + CONFIG.REFRESH_INTERVAL_MINUTES * 60 * 1000
    );

    return widget;
}
