// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: smile-wink;
// 📁 https://github.com/huaminghuangtw/Weekly-Mindware-Update

const utils = importModule("utils");

let widget = new ListWidget();

widget.backgroundColor = Color.black();
widget.useDefaultPadding();

let files = [];
let filePath = "";
let fileContent = "";

try {
    const repoOwner = "huaminghuangtw";
    const repoName = "Weekly-Mindware-Update";

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

    filePath = utils.getRandomItem(files);

    fileContent = await getFileContent(filePath.path);
} catch {
    let fm = FileManager.iCloud();
    let folderName = "Weekly-Mindware-Update";
    let folderPath = fm.joinPath(fm.bookmarkedPath("Second-Brain"), folderName);

    files = utils
        .getAllFilesByExtension(folderPath, "md")
        .filter((file) => !file.endsWith("README.md"))
        .map((file) => file.replace(`${folderPath}`, `${folderName}`));

    filePath = utils.getRandomItem(files);

    fileContent = fm.readString(
        fm.joinPath(fm.bookmarkedPath("Second-Brain"), filePath)
    );
}

let sectionContent = fileContent
    .split("\n")
    .filter((line) => line.startsWith("*"))
    .map((line) => line.slice(1).trim())
    .slice(0, 5);

let randomQuote = utils.convertMarkdownToPlainText(
    utils.getRandomItem(sectionContent)
);

let text = widget.addText(randomQuote);

text.centerAlignText();
text.textColor = Color.white();
// http://iosfonts.com
text.font = new Font("IowanOldStyle-BoldItalic", 18);
text.minimumScaleFactor = 0.1;
text.textOpacity = 1;

widget.url =
    `shortcuts://run-shortcut?` +
    `name=${encodeURIComponent("_Text2Speech")}&` +
    `input=${encodeURIComponent(
        JSON.stringify({
            text: randomQuote,
            language: "EN",
        })
    )}`;

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();
