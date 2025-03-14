// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 📁 https://github.com/huaminghuangtw/Weekly-Mindware-Update

const utils = importModule("utils");

let widget = new ListWidget();

widget.backgroundColor = Color.black();
widget.useDefaultPadding();

let fm = FileManager.iCloud();

let folderName = "Weekly-Mindware-Update";

let folderPath = fm.joinPath(fm.bookmarkedPath("Second-Brain"), folderName);

let files = utils.getAllFilesByExtension(folderPath, "md")
                 .filter(file => !file.endsWith("README.md"))
                 .map(file => file.replace(`${folderPath}`, `${folderName}`));

let filePath = utils.getRandomItem(files);

let fileContent = fm.readString(fm.joinPath(fm.bookmarkedPath("Second-Brain"), filePath));

let lineOffset = 13;
let sectionContent = fileContent.split("\n")
                                .slice(lineOffset - 1, lineOffset - 1 + 5)
                                .map(line => line.slice(1).trim());

let {
  item: randomQuote,
  index: randomIdx
} = utils.getRandomItemWithIndex(sectionContent);

let text = widget.addText(utils.convertMarkdownToPlainText(randomQuote));

text.centerAlignText();
text.textColor = Color.white();
// http://iosfonts.com
text.font = new Font("IowanOldStyle-BoldItalic", 16);
text.minimumScaleFactor = 0.1;
text.textOpacity = 1;

widget.url = utils.buildObsidianOpenFileURI(
  filePath,
  lineOffset + randomIdx
);

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();