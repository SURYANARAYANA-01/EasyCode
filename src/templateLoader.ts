import * as fs from "fs";
import * as path from "path";

export interface TemplateProgram {
    id: string;
    trigger: string;
}

export interface ProgramsFile {
    programs: TemplateProgram[];
}

export function loadTemplate(
    extensionPath: string,
    language: string,
    trigger: string
): TemplateProgram | null {

    const jsonPath = path.join(
        extensionPath,
        "programs",
        `${language}.json`
    );

    if (!fs.existsSync(jsonPath)) {

        throw new Error(
            `${language}.json not found`
        );

    }

    let jsonText = fs.readFileSync(
        jsonPath,
        "utf8"
    );

    jsonText = jsonText
        .replace(/^\uFEFF/, "")
        .trim();

    const data: ProgramsFile =
        JSON.parse(jsonText);

    return (
        data.programs.find(
            program =>
                normalize(program.trigger) ===
                normalize(trigger)
        ) || null
    );

}

export function hasTemplate(
    extensionPath: string,
    language: string,
    trigger: string
): boolean {

    return (
        loadTemplate(
            extensionPath,
            language,
            trigger
        ) !== null
    );

}

function normalize(text: string): string {

    return text
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}