// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 📁 https://github.com/huaminghuangtw/Your-Pocket-Life-Coach
const utility = importModule("utility");

let widget = new ListWidget();

widget.backgroundColor = new Color("#000000");
widget.useDefaultPadding();

let fm = FileManager.iCloud();

let filePath = "My-True-North/My-True-North.md";

let fileContent = fm.readString(fm.joinPath(fm.bookmarkedPath("Second-Brain"), filePath));

let paragraphs = fileContent.split("\n").filter(para => para.trim() !== "");

let selectedParagraphs = paragraphs.slice(1, paragraphs.length - 2);

let randomParagraph = utility.getRandomItem(selectedParagraphs);

let plainTextFromMarkdown = utility.convertMarkdownToPlainText(randomParagraph);

let text = widget.addText(plainTextFromMarkdown);

text.centerAlignText();
text.textColor = new Color("#ffffff");
// http://iosfonts.com
text.font = new Font("IowanOldStyle-BoldItalic", 16);
text.minimumScaleFactor = 0.1;
text.textOpacity = 1;

widget.url = `shortcuts://run-shortcut?` +
                `name=${encodeURI("Helper for 🌟 My North Star")}&` +
                `input=${encodeURI(plainTextFromMarkdown)}`;

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();