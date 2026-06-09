/** Truncate text to maxLength, breaking at the last whole word before the limit. */
export function truncateAtWord(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }

    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
        return `${truncated.slice(0, lastSpace).trimEnd()}...`;
    }

    return `${truncated.trimEnd()}...`;
}
