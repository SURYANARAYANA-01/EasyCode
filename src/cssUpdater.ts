import * as fs from "fs";

export function insertCSS(
    cssPath: string,
    code: string
): void {

    if (!fs.existsSync(cssPath)) {

        fs.writeFileSync(
            cssPath,
            "",
            "utf8"
        );

    }

    let content = fs.readFileSync(
        cssPath,
        "utf8"
    );

    if (
        content.includes(
            code.trim()
        )
    ) {
        return;
    }

    if (
        content.trim().length > 0
    ) {

        content += "\n\n";

    }

    content += code;

    fs.writeFileSync(
        cssPath,
        content,
        "utf8"
    );

}