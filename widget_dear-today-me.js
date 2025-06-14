// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 📁 https://github.com/huaminghuangtw/Dear-Today-Me
const CONFIG = {
    FONT: { NAME: "IowanOldStyle-BoldItalic", SIZE: 18 },
    MINIMUM_SCALE_FACTOR: 0.1,
    TEXT_OPACITY: 1,
    TEXT_COLOR: Color.white()
};

const Utils = importModule("Utils");
const Cache = importModule("Cache");

let cache = new Cache(Script.name());

let randomParagraph = await cache.getOrFetch(fetchRandomParagraph);

let widget = await createWidget(randomParagraph);

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();

// ================
// Helper functions
// ================

async function fetchRandomParagraph() {
    let fileContent = await Utils.getFileContent(
        "huaminghuangtw",
        "Dear-Today-Me",
        "Dear-Today-Me.md"
    );

    let allParagraphs = fileContent.split("\n\n");

    // Skip salutation and closing lines
    let selectedParagraphs = allParagraphs.slice(1, allParagraphs.length - 2);

    let randomParagraph = Utils.convertMarkdownToPlainText(
        Utils.getRandomItem(selectedParagraphs)
    );
    
    return randomParagraph;
}

async function createWidget(plainTextFromMarkdown) {
    let widget = new ListWidget();
    
    let text = widget.addText("★ " + Utils.truncateText(plainTextFromMarkdown) + " ★");
    text.centerAlignText();
    text.font = new Font(CONFIG.FONT.NAME, CONFIG.FONT.SIZE);
    text.minimumScaleFactor = CONFIG.MINIMUM_SCALE_FACTOR;
    text.textOpacity = CONFIG.TEXT_OPACITY;
    text.textColor = CONFIG.TEXT_COLOR;
    
    widget.url =
        `shortcuts://run-shortcut?` +
        `name=${encodeURIComponent("_Text2Speech")}&` +
        `input=${encodeURIComponent(
            JSON.stringify({
                text: plainTextFromMarkdown,
                language: "EN",
            })
        )}`;

    return widget;
}
