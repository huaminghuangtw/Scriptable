// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;

// 📁 https://github.com/huaminghuangtw/Evergreen-Lists

const utils = importModule("utils");

let widget = new ListWidget();

widget.backgroundColor = Color.black();
widget.useDefaultPadding();

let fileContent;
try {
    fileContent = await new Request("https://raw.githubusercontent.com/huaminghuangtw/Evergreen-Lists/main/%F0%9F%92%AD%20Journal%20Prompt/%F0%9F%92%AD%20Journal%20Prompt.json").loadString();
} catch {
    let fm = FileManager.iCloud();
    let folderPath = fm.joinPath(fm.bookmarkedPath("Second-Brain"), "EvergreenLists");
    let jsonFile = utils.getAllFilesByExtension(folderPath, "json").find(file => file.endsWith("💭 Journal Prompt.json"));
    fileContent = fm.readString(jsonFile);
}

let reminders = JSON.parse(fileContent).reminders;

let randomJournalPrompt = utils.getRandomItem(
                                utils.getRandomItem(
                                    reminders.filter(r =>
                                        r.subtasks &&
                                        r.subtasks.length > 0 &&
                                        !r.flagged
                                    )
                                ).subtasks
                            ).name;

let text = widget.addText(randomJournalPrompt);

text.centerAlignText();
text.textColor = Color.white();
// http://iosfonts.com
text.font = new Font("IowanOldStyle-BoldItalic", 20);
text.minimumScaleFactor = 0.1;
text.textOpacity = 1;

widget.url = `shortcuts://run-shortcut?` +
                `name=${encodeURI("Search Reminders")}&` +
                `input=${encodeURI(randomJournalPrompt)}`;

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();