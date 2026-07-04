import * as vscode from "vscode";
import { generateProgram } from "./commandHandler";

export function activate(
    context: vscode.ExtensionContext
): void {

    const disposable =
        vscode.commands.registerCommand(    
            "easycodedev.generateProgram",
            async () => {

                await generateProgram(
                    context
                );

            }
        );

    context.subscriptions.push(
        disposable
    );

}

export function deactivate(): void {}