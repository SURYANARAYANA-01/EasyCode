import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export interface ProjectFiles {
    html: string;
    css: string;
    javascript: string;
}

export function getProjectFiles(
    editor: vscode.TextEditor
): ProjectFiles {

    const folder = path.dirname(
        editor.document.fileName
    );

    const currentFile =
    editor.document.fileName;

const extension =
    path.extname(currentFile).toLowerCase();

return {
    html:
        extension === ".html"
            ? currentFile
            : path.join(folder, "index.html"),

    css:
        extension === ".css"
            ? currentFile
            : path.join(folder, "style.css"),

    javascript:
        extension === ".js"
            ? currentFile
            : path.join(folder, "script.js")
};
}

export function ensureFile(
    filePath: string
): void {

    if (!fs.existsSync(filePath)) {

        fs.writeFileSync(
            filePath,
            "",
            "utf8"
        );

    }

}

export function readFile(
    filePath: string
): string {

    ensureFile(filePath);

    return fs.readFileSync(
        filePath,
        "utf8"
    );

}

export function writeFile(
    filePath: string,
    content: string
): void {

    fs.writeFileSync(
        filePath,
        content,
        "utf8"
    );

}

export function appendFile(
    filePath: string,
    content: string
): void {

    ensureFile(filePath);

    fs.appendFileSync(
        filePath,
        "\n" + content,
        "utf8"
    );

}