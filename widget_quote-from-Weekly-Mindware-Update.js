// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 📁 https://github.com/huaminghuangtw/Weekly-Mindware-Update
const CONFIG = {
    FONT: { NAME: "IowanOldStyle-BoldItalic", SIZE: 18 },
    MINIMUM_SCALE_FACTOR: 0.1,
    TEXT_OPACITY: 1,
    TEXT_COLOR: Color.white(),
};

const Utils = importModule("Utils");
const Cache = importModule("Cache");

let cache = new Cache(Script.name());

let randomQuote = await cache.getOrFetch(fetchRandomQuote);

let widget = await createWidget(randomQuote);

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();

// ================
// Helper functions
// ================

async function fetchRandomQuote() {
    let tree = await Utils.getRepoTree("huaminghuangtw", "Weekly-Mindware-Update");

    let filePath = Utils.getRandomItem(
        tree.filter((item) => item.path.includes("/"))
    );

    let fileContent = await Utils.getFileContent(
        "huaminghuangtw",
        "Weekly-Mindware-Update",
        filePath.path
    );

    let sectionContent = fileContent
        .split("\n")
        .filter((line) => line.startsWith("*"))
        .map((line) => line.slice(1).trim())
        .slice(0, 5);

    let randomQuote = Utils.convertMarkdownToPlainText(
        Utils.getRandomItem(sectionContent)
    );

    return randomQuote;
}

async function createWidget(randomQuote) {
    let widget = new ListWidget();

    let text = widget.addText(Utils.truncateText(randomQuote));
    text.centerAlignText();
    text.font = new Font(CONFIG.FONT.NAME, CONFIG.FONT.SIZE);
    text.minimumScaleFactor = CONFIG.MINIMUM_SCALE_FACTOR;
    text.textOpacity = CONFIG.TEXT_OPACITY;
    text.textColor = CONFIG.TEXT_COLOR;

    widget.url =
        `shortcuts://run-shortcut?` +
        `name=${encodeURIComponent("📥 Add to Inbox")}&` +
        `input=${encodeURIComponent(randomQuote)}`;

    return widget;
}
