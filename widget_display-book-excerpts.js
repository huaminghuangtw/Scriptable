// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
let bookName = args.widgetParameter;

let widget = new ListWidget();

widget.backgroundColor = Color.black();
widget.useDefaultPadding();

let fm = FileManager.iCloud();
let filePath = fm.bookmarkedPath("book_excerpts.json");
let bookExcerpts = JSON.parse(fm.readString(filePath))[bookName];

let a = widget.addText(bookExcerpts);

a.centerAlignText();
a.textColor = Color.white();
// http://iosfonts.com
a.font = new Font("IowanOldStyle-BoldItalic", 18);
a.minimumScaleFactor = 0.1;
a.textOpacity = 1;

widget.addSpacer(15);

let b = widget.addText(`— ${bookName}`);

b.centerAlignText();
b.textColor = Color.gray();
// http://iosfonts.com
b.font = new Font("IowanOldStyle-Italic", 12);
b.minimumScaleFactor = 0.1;
b.textOpacity = 0.8;

widget.url =
    `shortcuts://run-shortcut?` +
    `name=${encodeURIComponent("Gemini - Generate Content")}&` +
    `input=${encodeURIComponent(
        JSON.stringify({
            prompt: `Please elaborate more on the following passage from the book <${bookName}>. Be brief and keep it short.`,
            content: bookExcerpts,
        })
    )}`;

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();
