// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 💁‍♂️ https://shortcutomation.com/death-clock
const CONFIG = {
  DATE_OF_BIRTH: "1996-05-01",
  LIFE_EXPECTANCY: 94,
  FONT: {
    NAME: "IowanOldStyle-BoldItalic",
    SIZE: 24,
  },
  TEXT_OPACITY: 1.0,
  TEXT_COLOR: Color.white(),
};

const ISO = new DateFormatter();
ISO.dateFormat = "yyyy-MM-dd";

const now = new Date();
const birth = ISO.date(CONFIG.DATE_OF_BIRTH);

const solarYearDays = 146097 / 400; // = 365.2425

const ageYears = daysBetween(birth, now) / solarYearDays;

const totalDays = CONFIG.LIFE_EXPECTANCY * solarYearDays;
const expiryDate = addDays(birth, totalDays);
const remainingDays = daysBetween(now, expiryDate);
const percentageLeft = (remainingDays / totalDays) * 100;

const widget = new ListWidget();

const stack = widget.addStack();
stack.layoutVertically();

const heart = "❥";

const line1 = addStyledText(
  stack,
  `${heart} I’m ${formatNumber(ageYears, 2)} years old`,
);

stack.addSpacer(6);

const line2 = addStyledText(
  stack,
  `${heart} My life is ${formatNumber(percentageLeft, 3)}% left`,
);

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();

// ================
// Helper functions
// ================

function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((b - a) / msPerDay);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + Math.round(days));
  return d;
}

function formatNumber(num, decimals) {
  return Number(num).toFixed(decimals);
}

function addStyledText(stack, str) {
  const t = stack.addText(str);
  t.leftAlignText();
  t.font = new Font(CONFIG.FONT.NAME, CONFIG.FONT.SIZE);
  t.textOpacity = CONFIG.TEXT_OPACITY;
  t.textColor = CONFIG.TEXT_COLOR;
}
