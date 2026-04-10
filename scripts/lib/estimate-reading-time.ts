import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const LATIN_WORDS_PER_MINUTE = 220;
const CJK_CHARACTERS_PER_MINUTE = 500;
const HEADING_SECONDS = 1;
const LIST_ITEM_SECONDS = 0.35;
const BLOCKQUOTE_SECONDS = 1.5;
const INLINE_CODE_SECONDS = 1.5;
const TABLE_BASE_SECONDS = 4;
const TABLE_ROW_SECONDS = 1.5;
const TABLE_CELL_SECONDS = 0.25;
const CODE_BLOCK_BASE_SECONDS = 8;
const CODE_BLOCK_LINE_SECONDS = 1.2;
const IMAGE_INITIAL_SECONDS = 12;
const IMAGE_MIN_SECONDS = 3;

interface MarkdownNode {
  children?: MarkdownNode[];
  type: string;
  value?: string;
}

interface MarkdownTextNode extends MarkdownNode {
  type: "text";
  value: string;
}

interface MarkdownCodeNode extends MarkdownNode {
  type: "code" | "inlineCode";
  value: string;
}

interface MarkdownTableRowNode extends MarkdownNode {
  children: MarkdownNode[];
  type: "tableRow";
}

interface MarkdownTableNode extends MarkdownNode {
  children: MarkdownTableRowNode[];
  type: "table";
}

function countLatinWords(text: string) {
  return text.match(/[\p{Script=Latin}\p{N}]+(?:['-][\p{Script=Latin}\p{N}]+)*/gu)
    ?.length ?? 0;
}

function countCjkCharacters(text: string) {
  return text.match(
    /[\p{Script=Hangul}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu,
  )?.length ?? 0;
}

function estimateTextReadingSeconds(text: string) {
  const latinWords = countLatinWords(text);
  const cjkCharacters = countCjkCharacters(text);

  return (
    (latinWords / LATIN_WORDS_PER_MINUTE) * 60 +
    (cjkCharacters / CJK_CHARACTERS_PER_MINUTE) * 60
  );
}

function estimateImageSeconds(imageIndex: number) {
  return Math.max(IMAGE_INITIAL_SECONDS - imageIndex, IMAGE_MIN_SECONDS);
}

function countCodeLines(code: string) {
  const trimmedCode = code.trim();

  if (!trimmedCode) {
    return 0;
  }

  return trimmedCode.split(/\r?\n/).length;
}

// Text contributes the baseline reading speed. Rich blocks add extra overhead
// because readers pause longer on images, code, tables, and structural sections.
export function estimateReadingTime(markdown: string) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  let textReadingSeconds = 0;
  let structuralSeconds = 0;
  let imageCount = 0;

  visit(tree, (node) => {
    const markdownNode = node as MarkdownNode;

    switch (markdownNode.type) {
      case "text": {
        textReadingSeconds += estimateTextReadingSeconds(
          (markdownNode as MarkdownTextNode).value,
        );
        return;
      }

      case "heading": {
        structuralSeconds += HEADING_SECONDS;
        return;
      }

      case "listItem": {
        structuralSeconds += LIST_ITEM_SECONDS;
        return;
      }

      case "blockquote": {
        structuralSeconds += BLOCKQUOTE_SECONDS;
        return;
      }

      case "inlineCode": {
        const inlineCode = markdownNode as MarkdownCodeNode;
        const codeLengthWeight = Math.min(inlineCode.value.trim().length / 32, 1.5);
        structuralSeconds += INLINE_CODE_SECONDS + codeLengthWeight;
        return;
      }

      case "code": {
        const codeBlock = markdownNode as MarkdownCodeNode;
        structuralSeconds +=
          CODE_BLOCK_BASE_SECONDS +
          countCodeLines(codeBlock.value) * CODE_BLOCK_LINE_SECONDS;
        return;
      }

      case "image": {
        structuralSeconds += estimateImageSeconds(imageCount);
        imageCount += 1;
        return;
      }

      case "table": {
        const table = markdownNode as MarkdownTableNode;
        const rowCount = table.children.length;
        const cellCount = table.children.reduce(
          (total, row) => total + row.children.length,
          0,
        );

        structuralSeconds +=
          TABLE_BASE_SECONDS +
          rowCount * TABLE_ROW_SECONDS +
          cellCount * TABLE_CELL_SECONDS;
        return;
      }
    }
  });

  const totalMinutes = (textReadingSeconds + structuralSeconds) / 60;

  return Math.max(1, Math.ceil(totalMinutes));
}
