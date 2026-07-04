import { LanguageInfo } from "./languageDetector";

export function extractCommand(
    lineText: string,
    languageInfo: LanguageInfo
): string | null {

    lineText = lineText.trim();

    switch (languageInfo.commentType) {

        case "#":

            if (!lineText.startsWith("#")) {
                return null;
            }

            return normalize(
                lineText.substring(1)
            );

        case "//":

            if (!lineText.startsWith("//")) {
                return null;
            }

            return normalize(
                lineText.substring(2)
            );

        case "html":

            if (
                !lineText.startsWith("<!--") ||
                !lineText.endsWith("-->")
            ) {
                return null;
            }

            return normalize(
                lineText
                    .replace("<!--", "")
                    .replace("-->", "")
            );

        case "css":

            if (
                !lineText.startsWith("/*") ||
                !lineText.endsWith("*/")
            ) {
                return null;
            }

            return normalize(
                lineText
                    .replace("/*", "")
                    .replace("*/", "")
            );

        default:
            return null;
    }
}

function normalize(text: string): string {

    return text
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}