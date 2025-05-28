// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 📁 https://github.com/huaminghuangtw/Weekly-Mindware-Update
const CONFIG = {
    FONT: { NAME: "IowanOldStyle-BoldItalic", SIZE: 18 },
    MINIMUM_SCALE_FACTOR: 0.1,
    TEXT_OPACITY: 1,
    TEXT_COLOR: Color.white()
};

const Utils = importModule("Utils");
const Cache = importModule("Cache");

let cache = new Cache(Script.name());

let randomQuote = await cache.getOrFetch(fetchRandomQuote);

let widget = await createWidget(randomQuote);

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();

// ================
// Helper functions
// ================

async function fetchRandomQuote() {
    let files = [];
    let filePath = "";
    let fileContent = "";

    const WEEKLY_MINDWARE_UPDATE = "Weekly-Mindware-Update";

    try {
        const repoOwner = "huaminghuangtw";
        const repoName = WEEKLY_MINDWARE_UPDATE;
        const headers = {
            accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        };
        async function getRepoTree() {
            let url = `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/main?recursive=true`;
            let req = new Request(url);
            req.headers = headers;
            let response = await req.loadJSON();
            return response.tree;
        }
        async function getFileContent(filePath) {
            let url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}`;
            let req = new Request(url);
            let content = await req.loadString();
            return content;
        }
        let tree = await getRepoTree();
        files = tree.filter((item) => item.path.includes("/"));
        filePath = Utils.getRandomItem(files);
        fileContent = await getFileContent(filePath.path);
    } catch {
        let fm = FileManager.iCloud();
        let folderName = WEEKLY_MINDWARE_UPDATE;
        let folderPath = fm.joinPath(fm.bookmarkedPath("Second-Brain"), folderName);
        files = Utils
            .getAllFilesByExtension(folderPath, "md")
            .filter((file) => !file.endsWith("README.md"))
            .map((file) => file.replace(`${folderPath}`, `${folderName}`));
        filePath = Utils.getRandomItem(files);
        fileContent = fm.readString(
            fm.joinPath(fm.bookmarkedPath("Second-Brain"), filePath)
        );
    }
    let sectionContent = fileContent
        .split("\n")
        .filter((line) => line.startsWith("*"))
        .map((line) => line.slice(1).trim())
        .slice(0, 5);
    let randomQuote = Utils.convertMarkdownToPlainText(
        Utils.getRandomItem(sectionContent)
    );
    return randomQuote;
}

async function createWidget(randomQuote) {
    let widget = new ListWidget();
    let text = widget.addText(randomQuote);
    text.centerAlignText();
    text.font = new Font(CONFIG.FONT.NAME, CONFIG.FONT.SIZE);
    text.minimumScaleFactor = CONFIG.MINIMUM_SCALE_FACTOR;
    text.textOpacity = CONFIG.TEXT_OPACITY;
    text.textColor = CONFIG.TEXT_COLOR;
    widget.url =
        `shortcuts://run-shortcut?` +
        `name=${encodeURIComponent("📥 Add to Inbox")}&` +
        `input=${encodeURIComponent(randomQuote)}`;
    return widget;
}