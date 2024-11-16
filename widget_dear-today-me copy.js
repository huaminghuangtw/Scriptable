// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;

// 📁 https://github.com/huaminghuangtw/Dear-Today-Me

let widget = new ListWidget();

widget.backgroundColor = new Color("#000000");
widget.useDefaultPadding();

let fileContent = await new Request("https://raw.githubusercontent.com/huaminghuangtw/Dear-Today-Me/main/Dear-Today-Me.md").loadString();

let allParagraphs = fileContent.split("\n\n");

// Skip salutation and closing lines
let selectedParagraphs = allParagraphs.slice(1, allParagraphs.length - 2);

let randomParagraph = getRandomItem(selectedParagraphs);

let plainTextFromMarkdown = convertMarkdownToPlainText(randomParagraph);

let text = widget.addText(plainTextFromMarkdown);

text.centerAlignText();
text.textColor = new Color("#ffffff");
// http://iosfonts.com
text.font = new Font("IowanOldStyle-BoldItalic", 16);
text.minimumScaleFactor = 0.1;
text.textOpacity = 1;

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();

// ================
// Helper funcitons
// ================

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

function convertMarkdownToPlainText(markdown) {
    // Convert headings (e.g., "# Heading" to "Heading")
    markdown = markdown.replace(/(^|\n)#+\s*(.+)/g, '$2');

    // Convert links [text](url) to "text"
    markdown = markdown.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    // Remove bold (**text** or __text__)
    markdown = markdown.replace(/(\*\*|__)(.*?)\1/g, '$2');

    // Remove italic (*text* or _text_)
    markdown = markdown.replace(/(\*|_)(.*?)\1/g, '$2');

    // Remove inline code `code`
    markdown = markdown.replace(/`([^`]+)`/g, '$1');

    // Remove code blocks ```code```
    markdown = markdown.replace(/```[^`]*```/g, '');

    return markdown.trim();
};