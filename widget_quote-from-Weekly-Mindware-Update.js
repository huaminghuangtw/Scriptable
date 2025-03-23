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

    async function getLatestSHA() {
        let url = `https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/main`;
        let req = new Request(url);
        req.headers = headers;
        let response = await req.loadJSON();
        return response.object.sha;
    }

    async function getRepoTree(sha) {
        let url = `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/${sha}?recursive=true`;
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

    let sha = await getLatestSHA();
    let tree = await getRepoTree(sha);
        
    for (let item of tree) {
        if (item.path.includes("/")) {
            files.push(item);
        }
    }

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

let lineOffset = 13;
let sectionContent = fileContent.split("\n")
                                .slice(lineOffset - 1, lineOffset - 1 + 5)
                                .map(line => line.slice(1).trim());

let {
    item: randomQuote,
    index: randomIdx
} = utils.getRandomItemWithIndex(sectionContent);

let text = widget.addText(utils.convertMarkdownToPlainText(randomQuote));

text.centerAlignText();
text.textColor = Color.white();
// http://iosfonts.com
text.font = new Font("IowanOldStyle-BoldItalic", 16);
text.minimumScaleFactor = 0.1;
text.textOpacity = 1;

widget.url = utils.buildObsidianOpenFileURI(
    filePath,
    lineOffset + randomIdx
);

config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium();

Script.complete();