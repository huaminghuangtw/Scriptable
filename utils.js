// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-brown; icon-glyph: toolbox;
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomItemWithIndex(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return { item: arr[randomIndex], index: randomIndex };
}

function buildObsidianOpenFileURI(filePath, lineNumber = 1) {
    return (
        `obsidian://adv-uri?` +
        `filepath=${encodeURIComponent(filePath)}&` +
        `viewmode=live&` +
        `openmode=true&` +
        `line=${lineNumber}&` +
        `commandid=${encodeURIComponent("editor:unfold-all")}`
    );
}

function getAllFilesByExtension(folderPath, fileExtension) {
    let fm = FileManager.iCloud();
    let files = fm.listContents(folderPath);
    let matchedFiles = [];

    files.forEach((file) => {
        let fullPath = fm.joinPath(folderPath, file);
        if (fm.fileExists(fullPath)) {
            if (fm.isDirectory(fullPath)) {
                matchedFiles = matchedFiles.concat(
                    getAllFilesByExtension(fullPath, fileExtension)
                );
            } else if (file.endsWith(fileExtension)) {
                matchedFiles.push(fullPath);
            }
        }
    });

    return matchedFiles;
}

function convertMarkdownToPlainText(markdown) {
    // Convert headings (e.g., "# Heading" to "Heading")
    markdown = markdown.replace(/(^|\n)#+\s*(.+)/g, "$2");

    // Convert links [text](url) to "text"
    markdown = markdown.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");

    // Remove bold (**text** or __text__)
    markdown = markdown.replace(/(\*\*|__)(.*?)\1/g, "$2");

    // Remove italic (*text* or _text_)
    markdown = markdown.replace(/(\*|_)(.*?)\1/g, "$2");

    // Remove inline code `code`
    markdown = markdown.replace(/`([^`]+)`/g, "$1");

    // Remove code blocks ```code```
    markdown = markdown.replace(/```[^`]*```/g, "");

    return markdown.trim();
}

module.exports = {
    getRandomItem,
    getRandomItemWithIndex,
    buildObsidianOpenFileURI,
    getAllFilesByExtension,
    convertMarkdownToPlainText
};
