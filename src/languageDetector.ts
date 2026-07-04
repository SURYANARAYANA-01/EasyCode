import * as vscode from "vscode";
import * as path from "path";

export type SupportedLanguage =
    | "python"
    | "java"
    | "cpp"
    | "html"
    | "css"
    | "javascript";

export interface LanguageInfo {
    language: SupportedLanguage;
    commentType: "#" | "//" | "html" | "css";
}

export function detectLanguage(
    editor: vscode.TextEditor
): LanguageInfo | null {

    const fileName = path.basename(
        editor.document.fileName
    );

    if (fileName.endsWith(".py")) {
        return {
            language: "python",
            commentType: "#"
        };
    }

    if (fileName.endsWith(".java")) {
        return {
            language: "java",
            commentType: "//"
        };
    }

    if (fileName.endsWith(".cpp")) {
        return {
            language: "cpp",
            commentType: "//"
        };
    }

    if (fileName.endsWith(".js")) {
        return {
            language: "javascript",
            commentType: "//"
        };
    }

    if (fileName.endsWith(".html")) {
        return {
            language: "html",
            commentType: "html"
        };
    }

    if (fileName.endsWith(".css")) {
        return {
            language: "css",
            commentType: "css"
        };
    }

    return null;
}