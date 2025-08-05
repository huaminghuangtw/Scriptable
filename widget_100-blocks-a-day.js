// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 💡 Inspired by: https://waitbutwhy.com/2016/10/100-blocks-day.html
const CONFIG = {
    startTime: "04:00",
    endTime: "20:30",
    totalBlocks: 50,
    block: {
        default: "◼️",
        current: "🩷",
        quarter1: "◼️",
        quarter2: "◼️",
        quarter3: "◼️",
        quarter4: "◼️"
    },
    messageColor: "#A0A0A0",
    messageFontSize: 16,
    messageOpacity: 0.8,
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

    let totalBlocks = CONFIG.totalBlocks;
    let currentMinutes = (now - startTime) / 60000;
    let totalAwakeMinutes = (endTime - startTime) / 60000;

    if (currentMinutes < 0 || currentMinutes > totalAwakeMinutes) {
        let message = widget.addText(
            currentMinutes < 0
                ? "☀️ A new day awaits. Time to rise and welcome the day ahead!"
                : "🌙 The day is done. Time to recharge and prepare for tomorrow!"
        );
        message.centerAlignText();
        message.textColor = new Color(CONFIG.messageColor);
        message.font = Font.boldSystemFont(CONFIG.messageFontSize);
        message.textOpacity = CONFIG.messageOpacity;
        return widget;
    }

    let blockDuration = totalAwakeMinutes / totalBlocks;
    let currentBlockIndex = Math.floor(currentMinutes / blockDuration);
    let blocks = [];
    for (let i = 0; i < totalBlocks; i++) {
        if (i === currentBlockIndex) {
            blocks.push(CONFIG.block.current);
        } else if (i === Math.floor(totalBlocks / 4)) {
            blocks.push(CONFIG.block.quarter1);
        } else if (i === Math.floor(totalBlocks / 2)) {
            blocks.push(CONFIG.block.quarter2);
        } else if (i === Math.floor((3 * totalBlocks) / 4)) {
            blocks.push(CONFIG.block.quarter3);
        } else if (i === totalBlocks - 1) {
            blocks.push(CONFIG.block.quarter4);
        } else {
            blocks.push(CONFIG.block.default);
        }
    }

    let text = widget.addText(blocks.join(" "));
    text.centerAlignText();
    
    // 👉 Download this shortcut: https://shortcutomation.com/gallery/getting-things-done/show-day-progress
    widget.url =
        `shortcuts://run-shortcut?` +
        `name=${encodeURIComponent("Show Day Progress")}`;
    
        return widget;
}

let widget = await createWidget();

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();
