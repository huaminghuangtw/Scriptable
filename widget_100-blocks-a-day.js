// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 💡 Inspired by: https://waitbutwhy.com/2016/10/100-blocks-day.html

let widget = new ListWidget();

widget.backgroundColor = Color.black();
widget.useDefaultPadding();

let now = new Date();
let startTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    4,
    0
);
let endTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    20,
    30
);

let totalBlocks = 50;

let currentMinutes = (now - startTime) / 60000;
let totalAwakeMinutes = (endTime - startTime) / 60000;

if (currentMinutes < 0 || currentMinutes > totalAwakeMinutes) {
    let message = widget.addText(
        currentMinutes < 0 
            ? "🌅 A new day awaits. Time to rise and welcome the day ahead!" 
            : "🌙 The day is done. Time to recharge and prepare for tomorrow!"
    );
    message.centerAlignText();
    message.textColor = new Color("#A0A0A0");
    message.font = Font.boldSystemFont(14);
    message.textOpacity = 0.8;
    config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();
    Script.complete();
    return;
}

let blockDuration = totalAwakeMinutes / totalBlocks;

let currentBlockIndex = Math.floor(currentMinutes / blockDuration);

let blocks = [];
for (let i = 0; i < totalBlocks; i++) {
    blocks.push(i === currentBlockIndex ? "🩷" : "◼️");
}

let text = widget.addText(blocks.join(" "));

text.centerAlignText();

widget.url =
    `shortcuts://run-shortcut?` +
    `name=${encodeURIComponent("Show Year Progress")}`;

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();
