// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
const CONFIG = {
  EXCERPTS: {
    FONT: { NAME: "IowanOldStyle-BoldItalic", SIZE: 18 },
    MINIMUM_SCALE_FACTOR: 0.1,
    TEXT_OPACITY: 1,
    TEXT_COLOR: Color.white(),
  },
  BOOK_NAME: {
    FONT: { NAME: "IowanOldStyle-Italic", SIZE: 12 },
    MINIMUM_SCALE_FACTOR: 0.1,
    TEXT_OPACITY: 0.8,
    TEXT_COLOR: Color.gray(),
  },
  SPACER: 15,
};

const bookName = args.widgetParameter;

if (!bookName) {
    throw Error("No book selected: args.widgetParameter is missing or empty.");
}

const bookData = await fetchBookData(bookName);

const widget = await createWidget(bookName, bookData);

config.runsInWidget ? Script.setWidget(widget) : widget.presentLarge();

Script.complete();

// ================
// Helper functions
// ================

async function fetchBookData(bookName) {
  try {
    const fm = FileManager.iCloud();
    const filePath = fm.bookmarkedPath("book_excerpts.json");
    await fm.downloadFileFromiCloud(filePath);
    const allBooks = JSON.parse(fm.readString(filePath));
    return allBooks[bookName];
  } catch (e) {
    throw Error(`Failed to load excerpts for '${bookName}': ${e}`);
  }
}

async function createWidget(bookName, bookData) {
  let widget = new ListWidget();

  let a = widget.addText(bookData.excerpts);
  a.centerAlignText();
  a.textColor = CONFIG.EXCERPTS.TEXT_COLOR;
  a.font = new Font(CONFIG.EXCERPTS.FONT.NAME, CONFIG.EXCERPTS.FONT.SIZE);
  a.minimumScaleFactor = CONFIG.EXCERPTS.MINIMUM_SCALE_FACTOR;
  a.textOpacity = CONFIG.EXCERPTS.TEXT_OPACITY;

  widget.addSpacer(CONFIG.SPACER);

  let b = widget.addText(`— ${bookName}`);
  b.centerAlignText();
  b.textColor = CONFIG.BOOK_NAME.TEXT_COLOR;
  b.font = new Font(CONFIG.BOOK_NAME.FONT.NAME, CONFIG.BOOK_NAME.FONT.SIZE);
  b.minimumScaleFactor = CONFIG.BOOK_NAME.MINIMUM_SCALE_FACTOR;
  b.textOpacity = CONFIG.BOOK_NAME.TEXT_OPACITY;

  widget.url =
    `shortcuts://run-shortcut?` +
    `name=${encodeURIComponent("📥 Add to Inbox")}&` +
    `input=${encodeURIComponent(bookData.pageContent)}`;

  return widget;
}
