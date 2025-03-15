// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
let widget = new ListWidget();

widget.backgroundColor = Color.black();
widget.useDefaultPadding();

let fm = FileManager.iCloud();
let book_excerpts = fm.readString(fm.bookmarkedPath("book_excerpts.txt"));

let text = widget.addText(book_excerpts);

text.centerAlignText();
text.textColor = Color.white();
// http://iosfonts.com
text.font = new Font("IowanOldStyle-BoldItalic", 16);
text.minimumScaleFactor = 0.1;
text.textOpacity = 1;

widget.url = `shortcuts://run-shortcut?` +
                `name=${encodeURIComponent("🌐 Search Web")}&` +
                `input=${encodeURIComponent(book_excerpts)}`;

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();