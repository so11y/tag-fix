import { parseDocument } from "htmlparser2";

const igNoreTag = ["script", "style"];

export type HtmlParse2Document = ReturnType<typeof parseDocument>;

export function parseHtml(domString: string) {
  return parseDocument(domString, {
    withStartIndices: true,
    withEndIndices: true,
  });
}

export function findInRangeHtml(
  document: HtmlParse2Document,
  start: number,
  end?: number
) {
  end === undefined ? (end = start) : end;
  let findNode: HtmlParse2Document | undefined;
  const walk = (nodes: Array<HtmlParse2Document>) => {
    nodes.forEach((node) => {
      if (node.startIndex! <= start) {
        findNode = node;
      }
      if (node.children && node.startIndex! <= start) {
        walk(node.children as Array<HtmlParse2Document>);
      }
    });
  };
  walk(document.children as Array<HtmlParse2Document>);
  if (
    findNode &&
    findNode.parentNode &&
    igNoreTag.includes(findNode.parentNode.type)
  ) {
    return null;
  }
  return findNode;
}
