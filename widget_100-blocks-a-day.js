// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 💡 Inspired by: https://waitbutwhy.com/2016/10/100-blocks-day.html
const CONFIG = {
    startTime: "04:30",
    endTime: "20:30",
    totalBlocks: 55,
};

async function createWidget() {
    let widget = new ListWidget();
    widget.backgroundColor = Color.black();
    widget.useDefaultPadding();

    let now = new Date();
    let [startTime, endTime] = [CONFIG.startTime, CONFIG.endTime].map((time) => {
        let [hours, minutes] = time.split(":").map(Number);
        return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            minutes
        );
    });

    // 1 minute = 60 seconds = 60000 milliseconds
    let currentMinutes = (now - startTime) / 60000;
    let totalAwakeMinutes = (endTime - startTime) / 60000;

    if (currentMinutes < 0 || currentMinutes > totalAwakeMinutes) {
        widget.addText("");
        return widget;
    }

    let blockDuration = totalAwakeMinutes / CONFIG.totalBlocks;
    
    let currentBlockIndex = Math.floor(currentMinutes / blockDuration);

    let blocks = [];
    for (let i = 0; i < CONFIG.totalBlocks; i++) {
        if (i === currentBlockIndex) {
            blocks.push("🩷");
        } else {
            blocks.push("◼️");
        }
    }

    let text = widget.addText(blocks.join(" "));
    text.centerAlignText();
    
    return widget;
}

let widget = await createWidget();

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();
