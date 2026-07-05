import * as vscode from "vscode";

export async function insertCSS(
    cssPath: string,
    code: string
): Promise<void> {

    const document = await vscode.workspace.openTextDocument(cssPath);

    const content = document.getText();

    if (content.includes(code.trim())) {
        return;
    }

    const insertText = content.trim().length > 0 ? "\n\n" + code : code;

    const edit = new vscode.WorkspaceEdit();

    edit.insert(
        document.uri,
        document.positionAt(content.length),
        insertText
    );

    await vscode.workspace.applyEdit(edit);

    await document.save();

}