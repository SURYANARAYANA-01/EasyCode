import * as vscode from "vscode";
import * as path from "path";

import { detectLanguage } from "./languageDetector";
import { extractCommand } from "./commentParser";
import {loadTemplate, hasTemplate} from "./templateLoader";
import { loadTemplateCode } from "./templateGenerator";
import {getProjectFiles, ensureFile, writeFile} from "./fileManager";
import {insertHTML} from "./htmlUpdater";
import {insertCSS} from "./cssUpdater";
import {insertJavaScript} from "./jsUpdater";
import { domCommands } from "./domCommands";

export async function generateProgram(context: vscode.ExtensionContext): Promise<void> {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {

        vscode.window.showErrorMessage("No file is open!");
        return;
    }

    const languageInfo = detectLanguage(editor);

    if (!languageInfo) {

        vscode.window.showErrorMessage("Unsupported file type!");
        return;
    }

    const currentLine = editor.selection.active.line;

    const nextLine = currentLine + 1;

    if (nextLine < editor.document.lineCount && editor.document
            .lineAt(nextLine)
            .text
            .trim() !== ""
    ) {

        vscode.window.showInformationMessage("Code already generated for this command.");
        return;
    }

    const lineText = editor.document
            .lineAt(currentLine)
            .text;

    let command = extractCommand(
            lineText,
            languageInfo
        );

    if (!command) {

        vscode.window.showErrorMessage("No EasyCode Dev command found on this line.");
        return;
    }

    let isInputVersion = false;

    if (command.endsWith(" input")) {

        isInputVersion = true;

        command = command
            .substring(0, command.length - 6)
            .trim();
    }

    const files = getProjectFiles(editor);

        if (languageInfo.language === "python" || languageInfo.language === "java" || languageInfo.language === "cpp") {

    const program = loadTemplate(context.extensionPath, languageInfo.language, command);

    if (!program) {

        vscode.window.showErrorMessage(`Unknown command: ${command}`);
        return;
    }

    const template = loadTemplateCode(context.extensionPath, languageInfo.language, program.id, isInputVersion);

    const fileBaseName = path.basename(editor.document.fileName).replace(/\.[^/.]+$/, "");

    const code = (template.code ?? "").replaceAll("${CLASS_NAME}", fileBaseName);

    const lineRange = editor.document
            .lineAt(currentLine)
            .range;

    await editor.edit(editBuilder => {
        editBuilder.insert(lineRange.end, "\n\n" + code);
        }
    );

    vscode.window.showInformationMessage("EasyCode Dev generated successfully!");
    return;
}

       else if (languageInfo.language === "html") {

        const htmlProgram = loadTemplate(context.extensionPath, "html", command);

        if (!htmlProgram) {

            vscode.window.showErrorMessage(`Unknown command: ${command}`);
            return;
        }
        

        const htmlTemplate = loadTemplateCode(context.extensionPath, "html", htmlProgram.id, isInputVersion);

        let cssTemplate = null;
let jsTemplate = null;

if (
    hasTemplate(
        context.extensionPath,
        "css",
        command
    )
) {

    const cssProgram =
        loadTemplate(
            context.extensionPath,
            "css",
            command
        );

    if (cssProgram) {

        cssTemplate =
            loadTemplateCode(
                context.extensionPath,
                "css",
                cssProgram.id
            );

    }

}

if (
    hasTemplate(
        context.extensionPath,
        "javascript",
        command
    )
) {

    const jsProgram =
        loadTemplate(
            context.extensionPath,
            "javascript",
            command
        );

    if (jsProgram) {

        jsTemplate =
            loadTemplateCode(
                context.extensionPath,
                "javascript",
                jsProgram.id
            );

    }

}

        ensureFile(files.html);

await insertHTML(files.html, htmlTemplate.code ?? "");

if (cssTemplate) {

    ensureFile(files.css);

    await insertCSS(files.css, cssTemplate.code ?? "");
}

if (jsTemplate) {

    ensureFile(files.javascript);

    await insertJavaScript(files.javascript, jsTemplate.code ?? "");
}

vscode.window.showInformationMessage(
    "EasyCode Dev generated successfully!"
);

return;
        }

    else if (
        languageInfo.language === "css"
    ) {

        const cssProgram =
            loadTemplate(
                context.extensionPath,
                "css",
                command
            );

        if (!cssProgram) {

            vscode.window.showErrorMessage(
                `Unknown command: ${command}`
            );

            return;
        }

        const cssTemplate = loadTemplateCode(context.extensionPath, "css", cssProgram.id, isInputVersion);

        const htmlProgram = loadTemplate(context.extensionPath, "html", command);

        if (!htmlProgram) {

            vscode.window.showErrorMessage(
                "Matching HTML template not found."
            );

            return;
        }

        const htmlTemplate =
    loadTemplateCode(
        context.extensionPath,
        "html",
        htmlProgram.id
    );

let jsTemplate = null;

if (
    hasTemplate(
        context.extensionPath,
        "javascript",
        command
    )
) {

    const jsProgram =
        loadTemplate(
            context.extensionPath,
            "javascript",
            command
        );

    if (jsProgram) {

        jsTemplate =
            loadTemplateCode(
                context.extensionPath,
                "javascript",
                jsProgram.id
            );

    }

}

        ensureFile(files.html);
ensureFile(files.css);

writeFile(files.html, htmlTemplate.code);

await insertCSS(files.css, cssTemplate.code);

if (jsTemplate) {

    ensureFile(files.javascript);

    await insertJavaScript(files.javascript, jsTemplate.code);
}

vscode.window.showInformationMessage(
    "EasyCode Dev generated successfully!"
);

return;
    }

    else if (languageInfo.language === "javascript") {

        const jsProgram = loadTemplate(context.extensionPath, "javascript", command);

        if (!jsProgram) {

            vscode.window.showErrorMessage(`Unknown command: ${command}`);
            return;

        }

        const jsTemplate = loadTemplateCode(context.extensionPath, "javascript", jsProgram.id, isInputVersion);

        let htmlTemplate;

        if (hasTemplate(context.extensionPath, "html", command)) {

            const htmlProgram = loadTemplate(context.extensionPath, "html", command);

            if (!htmlProgram) {

                vscode.window.showErrorMessage("Matching HTML template not found.");
                return;

            }

            htmlTemplate = loadTemplateCode(context.extensionPath, "html", htmlProgram.id);

        } else {

            const commonHtmlId = domCommands.includes(command) ? "dom" : "js";

            htmlTemplate = loadTemplateCode(context.extensionPath, "html", commonHtmlId);

        }

        const jsFileName = path.basename(files.javascript);

        const htmlCode = htmlTemplate.code.replaceAll("script.js", jsFileName);

        let cssTemplate = null;

        if (hasTemplate(context.extensionPath, "css", command)) {

            const cssProgram = loadTemplate(context.extensionPath, "css", command);

            if (cssProgram) {

                cssTemplate = loadTemplateCode(context.extensionPath, "css", cssProgram.id);

            }

        }

        ensureFile(files.html);

        writeFile(files.html, htmlCode);

        ensureFile(files.javascript);

        await insertJavaScript(files.javascript, jsTemplate.code);

        if (cssTemplate) {

            ensureFile(files.css);

            await insertCSS(files.css, cssTemplate.code);

        }

        vscode.window.showInformationMessage("EasyCode Dev generated successfully!");

        return;
    }
}