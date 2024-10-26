// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
let widget = new ListWidget();

widget.backgroundColor = new Color("#000000");

widget.useDefaultPadding();

widget.addSpacer(20);

let journalPrompt = widget.addText("What might I be able to spend more time on if I find an easier way to do this?");
journalPrompt.centerAlignText();
journalPrompt.textColor = new Color("#ffffff");
// http://iosfonts.com
journalPrompt.font = new Font("IowanOldStyle-BoldItalic", 20);
journalPrompt.minimumScaleFactor = 0.1;
journalPrompt.textOpacity = 1;

widget.addSpacer(20);

widget.url = "shortcuts://run-shortcut?name=" + encodeURI("Refresh Journal Prompt Widget");

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();