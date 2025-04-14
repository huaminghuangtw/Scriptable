// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 💡 Inspired by: https://waitbutwhy.com/2016/10/100-blocks-day.html

let widget = new ListWidget();

widget.backgroundColor = Color.black();
widget.useDefaultPadding();

let now = new Date();
let [startTime, endTime] = ["04:00", "20:30"].map((time) => {
    let [hours, minutes] = time.split(":").map(Number);
    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
    );
});

let totalBlocks = 50;

// 1 minute = 60 seconds = 60000 milliseconds
let currentMinutes = (now - startTime) / 60000;
let totalAwakeMinutes = (endTime - startTime) / 60000;

if (currentMinutes < 0 || currentMinutes > totalAwakeMinutes) {
    let message = widget.addText(
        currentMinutes < 0
            ? "☀️ A new day awaits. Time to rise and welcome the day ahead!"
            : "🌙 The day is done. Time to recharge and prepare for tomorrow!"
    );
    message.centerAlignText();
    message.textColor = new Color("#A0A0A0");
    message.font = Font.boldSystemFont(16);
    message.textOpacity = 0.8;
    config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();
    Script.complete();
    return;
}

let blockDuration = totalAwakeMinutes / totalBlocks;

let currentBlockIndex = Math.floor(currentMinutes / blockDuration);

let blocks = [];
for (let i = 0; i < totalBlocks; i++) {
    //blocks.push(i === currentBlockIndex ? "🔲" : "🔳");

    // 🍀 The 4 Quarters Rule
    //     “Instead of feeling that you've blown the day and thinking, “I'll get back on track tomorrow,”
    //     try thinking of each day as a set of four quarters: morning, midday, afternoon, evening.
    //     If you blow one quarter, you get back on track for the next quarter. Fail small, not big.”
    //     — [Gretchen Rubin, Better Than Before](https://www.goodreads.com/book/show/22889767-better-than-before)
    if (i === currentBlockIndex) {
        blocks.push("🩷");
    } else if (i === Math.floor(totalBlocks / 4)) {
        blocks.push("🔺");
    } else if (i === Math.floor(totalBlocks / 2)) {
        blocks.push("🔺");
    } else if (i === Math.floor((3 * totalBlocks) / 4)) {
        blocks.push("🔺");
    } else if (i === totalBlocks - 1) {
        blocks.push("🔺");
    } else {
        blocks.push("◼️");
    }
}

let text = widget.addText(blocks.join(" "));

text.centerAlignText();

widget.url =
    `shortcuts://run-shortcut?` +
    `name=${encodeURIComponent("Show Day Progress")}`;

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();
