import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(
	context: vscode.ExtensionContext
) {

	const disposable =
		vscode.commands.registerCommand(
			'easycode.generateProgram',
			async () => {

				const editor =
					vscode.window.activeTextEditor;

				if (!editor) {

					vscode.window.showErrorMessage(
						'No file is open!'
					);

					return;
				}

				const fileName =
					editor.document.fileName;

				let language = '';

				if (fileName.endsWith('.py')) {
					language = 'python';
				}
				else if (
					fileName.endsWith('.java')
				) {
					language = 'java';
				}
				else if (
					fileName.endsWith('.cpp')
				) {
					language = 'cpp';
				}
				else {

					vscode.window.showErrorMessage(
						'Unsupported file type!'
					);

					return;
				}

				const currentLine =
					editor.selection.active.line;

				const nextLineNumber =
					currentLine + 1;

				if (
					nextLineNumber <
						editor.document.lineCount &&
					editor.document
						.lineAt(nextLineNumber)
						.text
						.trim() !== ''
				) {

					vscode.window.showInformationMessage(
						'Code already generated for this command.'
					);

					return;
				}

				const lineText =
					editor.document
						.lineAt(currentLine)
						.text
						.trim();

				let command = '';

				if (language === 'python') {

					if (
						!lineText.startsWith('#')
					) {

						vscode.window.showErrorMessage(
							'No EasyCode Dev command found on this line.'
						);

						return;
					}

					command = lineText
						.substring(1)
						.trim();
				}
				else {

					if (
						!lineText.startsWith('//')
					) {

						vscode.window.showErrorMessage(
							'No EasyCode Dev command found on this line.'
						);

						return;
					}

					command = lineText
						.substring(2)
						.trim();
				}

				command = command
					.toLowerCase()
					.replace(/\s+/g, ' ')
					.trim();

				const programsPath =
					path.join(
						context.extensionPath,
						'programs',
						`${language}.json`
					);

				if (
					!fs.existsSync(
						programsPath
					)
				) {

					vscode.window.showErrorMessage(
						`${language}.json not found`
					);

					return;
				}

				let programsData: any;

				try {

					let jsonText =
						fs.readFileSync(
							programsPath,
							'utf8'
						);

					jsonText = jsonText
						.replace(
							/^\uFEFF/,
							''
						)
						.trim();

					programsData =
						JSON.parse(
							jsonText
						);

				}
				catch {

					vscode.window.showErrorMessage(
						`Invalid JSON: ${language}.json`
					);

					return;
				}

				let isInputVersion =
					false;

				if (
					command.endsWith(
						' input'
					)
				) {

					isInputVersion =
						true;

					command = command
						.substring(
							0,
							command.length - 6
						)
						.trim();
				}

				const program =
					programsData.programs.find(
						(p: any) =>
							p.trigger &&
							p.trigger
								.toLowerCase()
								.replace(
									/\s+/g,
									' '
								)
								.trim() ===
								command
					);

				if (!program) {

					vscode.window.showErrorMessage(
						`Unknown command: ${command}`
					);

					return;
				}

				const templateFile =
					isInputVersion
						? `${program.id}_input.txt`
						: `${program.id}.txt`;

				const templatePath =
					path.join(
						context.extensionPath,
						'templates',
						language,
						templateFile
					);

				if (
					!fs.existsSync(
						templatePath
					)
				) {

					vscode.window.showErrorMessage(
						`Template not found: ${templateFile}`
					);

					return;
				}

				let code =
					fs.readFileSync(
						templatePath,
						'utf8'
					);

				code = code.replace(
					/^\uFEFF/,
					''
				);

				const fileBaseName =
					path
						.basename(
							fileName
						)
						.replace(
							/\.[^/.]+$/,
							''
						);

				code =
					code.replaceAll(
						'${CLASS_NAME}',
						fileBaseName
					);

				const lineRange =
					editor.document
						.lineAt(
							currentLine
						)
						.range;

				await editor.edit(
					editBuilder => {

						editBuilder.insert(
							lineRange.end,
							'\n\n' + code
						);

					}
				);

				vscode.window.showInformationMessage(
					'EasyCode Dev generated successfully!'
				);
			}
		);

	context.subscriptions.push(
		disposable
	);
}

export function deactivate() {}