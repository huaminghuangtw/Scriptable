// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 💁‍♂️ https://github.com/huaminghuangtw/Dear-Today-Me
const CONFIG = {
  FONT: {
    NAME: "IowanOldStyle-BoldItalic",
    SIZE: 18,
  },
  MINIMUM_SCALE_FACTOR: 0.1,
  TEXT_OPACITY: 1,
  TEXT_COLOR: Color.white(),
};

const Utils = importModule("Utils");
const Cache = importModule("Cache");

let cache = new Cache(Script.name());

let randomParagraph = await cache.getOrFetch(fetchRandomParagraph);

let widget = await createWidget(randomParagraph);

config.runsInWidget ? Script.setWidget(widget) : widget.presentLarge();

Script.complete();

// ================
// Helper functions
// ================

async function fetchRandomParagraph() {
  let fileContent = await Utils.getFileContent(
    "huaminghuangtw",
    "Dear-Today-Me",
    "index.md",
  );
  let allParagraphs = fileContent.split("\n\n");

  // Skip salutation and closing lines
  let selectedParagraphs = allParagraphs.slice(1, allParagraphs.length - 2);

  let i = Utils.getRandomIndex(selectedParagraphs.length - 1);
  let j = i + 1;

  let first = Utils.convertMarkdownToPlainText(selectedParagraphs[i]).trim();
  let second = Utils.convertMarkdownToPlainText(selectedParagraphs[j]).trim();

  return {
    text: first + " " + second,
    lineNumber: fileContent
      .slice(0, fileContent.indexOf(selectedParagraphs[i]))
      .split("\n").length,
  };
}

async function createWidget(t) {
  let widget = new ListWidget();

  let text = widget.addText(t.text);
  text.centerAlignText();
  text.font = new Font(CONFIG.FONT.NAME, CONFIG.FONT.SIZE);
  text.minimumScaleFactor = CONFIG.MINIMUM_SCALE_FACTOR;
  text.textOpacity = CONFIG.TEXT_OPACITY;
  text.textColor = CONFIG.TEXT_COLOR;

  widget.url = `https://github.com/huaminghuangtw/Dear-Today-Me/blob/main/index.md?plain=1#L${t.lineNumber}`;

  return widget;
}
