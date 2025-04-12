// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 📁 https://github.com/huaminghuangtw/Dear-Today-Me

const utils = importModule("utils");

let widget = new ListWidget();

widget.backgroundColor = Color.black();
widget.useDefaultPadding();

let filename = "Dear-Today-Me";
let fileContent;

try {
    fileContent = await new Request(
        `https://raw.githubusercontent.com/huaminghuangtw/${filename}/main/${filename}.md`
    ).loadString();
} catch {
    let fm = FileManager.iCloud();
    fileContent = fm.readString(
        fm.joinPath(
            fm.bookmarkedPath("Second-Brain"),
            `${filename}/${filename}.md`
        )
    );
}

let allParagraphs = fileContent.split("\n\n");

// Skip salutation and closing lines
let selectedParagraphs = allParagraphs.slice(1, allParagraphs.length - 2);

let randomParagraph = utils.getRandomItem(selectedParagraphs);

let plainTextFromMarkdown = utils.convertMarkdownToPlainText(randomParagraph);

let text = widget.addText("★ " + plainTextFromMarkdown + " ★");

text.centerAlignText();
text.textColor = Color.white();
// http://iosfonts.com
text.font = new Font("IowanOldStyle-BoldItalic", 18);
text.minimumScaleFactor = 0.1;
text.textOpacity = 1;

widget.url =
    `shortcuts://run-shortcut?` +
    `name=${encodeURIComponent("_Text2Speech")}&` +
    `input=${encodeURIComponent(
        JSON.stringify({
            text: plainTextFromMarkdown,
            language: "EN",
        })
    )}`;

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();
