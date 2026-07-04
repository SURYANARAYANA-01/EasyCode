import * as fs from "fs";

export function insertJavaScript(
    jsPath: string,
    code: string
): void {

    if (!fs.existsSync(jsPath)) {

        fs.writeFileSync(
            jsPath,
            "",
            "utf8"
        );

    }

    let content = fs.readFileSync(
        jsPath,
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
        jsPath,
        content,
        "utf8"
    );

}