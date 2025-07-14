// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: magic;
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

function truncateText(text, maxLength = 180) {
    if (typeof text !== "string") return text;
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + "…";
    }
    return text;
}

// https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#get-a-tree
async function getRepoTree(repoOwner, repoName) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/main?recursive=true`;
    let req = new Request(url);
    req.headers = {
        accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    };
    return (await req.loadJSON()).tree;
}

async function getFileContent(repoOwner, repoName, filePath) {
    let url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}`;
    let req = new Request(url);
    return await req.loadString();
}

function isChinese(text) {
    return /[\u4e00-\u9fff]/.test(text);
}

module.exports = {
    getRandomItem,
    getRandomItemWithIndex,
    buildObsidianOpenFileURI,
    getAllFilesByExtension,
    convertMarkdownToPlainText,
    truncateText,
    getRepoTree,
    getFileContent,
    isChinese
};
