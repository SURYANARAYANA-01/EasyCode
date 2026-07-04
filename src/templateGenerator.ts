import * as fs from "fs";
import * as path from "path";

export interface GeneratedTemplate {
    code: string;
}

export function loadTemplateCode(
    extensionPath: string,
    language: string,
    templateId: string,
    isInputVersion: boolean = false
): GeneratedTemplate {

    const fileName =
        isInputVersion
            ? `${templateId}_input.txt`
            : `${templateId}.txt`;

    const templatePath = path.join(
        extensionPath,
        "templates",
        language,
        fileName
    );

    if (!fs.existsSync(templatePath)) {

        throw new Error(
            `Template not found: ${language}/${fileName}`
        );

    }

    let code = fs.readFileSync(
        templatePath,
        "utf8"
    );

    code = code.replace(
        /^\uFEFF/,
        ""
    );

    return {
        code
    };

}