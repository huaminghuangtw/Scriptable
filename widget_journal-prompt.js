// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 📁 https://docs.google.com/spreadsheets/d/1RI3C2N7-LaWG1pZC6xMVvS08OJJQp92qJhLaPSXNzQ0
const utility = importModule("utility");

let widget = new ListWidget();

widget.backgroundColor = new Color("#000000");
widget.useDefaultPadding();

let fm = FileManager.iCloud();

let folderName = "EvergreenLists";

let folderPath = fm.joinPath(fm.bookmarkedPath("Second-Brain"), folderName);

let jsonFile = utility.getAllFilesByExtension(folderPath, "json")
                        .find(file => file.endsWith("💭 Journal Prompt.json"));

let fileContent = fm.readString(jsonFile);

let reminders = JSON.parse(fileContent).reminders;

let randomJournalPrompt = utility.getRandomItem(
                                utility.getRandomItem(
                                    reminders.filter(r =>
                                        r.subtasks &&
                                        r.subtasks.length > 0 &&
                                        !r.flagged
                                    )
                                ).subtasks
                            ).name;

let text = widget.addText(randomJournalPrompt);

text.centerAlignText();
text.textColor = new Color("#ffffff");
// http://iosfonts.com
text.font = new Font("IowanOldStyle-BoldItalic", 20);
text.minimumScaleFactor = 0.1;
text.textOpacity = 1;

widget.url = `shortcuts://run-shortcut?` +
                `name=${encodeURI("Search Reminders")}&` +
                `input=${encodeURI(randomJournalPrompt)}`;

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();