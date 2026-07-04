import * as fs from "fs";

export function insertHTML(
    htmlPath: string,
    code: string
): void {

    if (!fs.existsSync(htmlPath)) {

        fs.writeFileSync(
            htmlPath,
            "",
            "utf8"
        );

    }

    let content = fs.readFileSync(
        htmlPath,
        "utf8"
    );

    if (content.includes(code.trim())) {
        return;
    }

    if (content.trim().length > 0) {
        content += "\n\n";
    }

    content += code;

    fs.writeFileSync(
        htmlPath,
        content,
        "utf8"
    );

}