import { TextDocument, Range, DocumentSymbol } from "vscode";

export function findInRangeTag(
  roots: DocumentSymbol[],
  range: Range
): undefined | DocumentSymbol {
  const walk = (nodes: Array<DocumentSymbol>): undefined | DocumentSymbol => {
    for (const node of nodes) {
      if (node.children) {
        const v = walk(node.children);
        if (v) {
          return v;
        }
      }
      if (node.range.contains(range)) {
        return node;
      }
    }
  };
  return walk(roots);
}

export function getRootCodeActionTag(
  document: TextDocument,
  range: Range,
  symbols: DocumentSymbol[]
) {
  if (document.languageId === "vue") {
    const hasTemplate = symbols.find((v) => v.name.includes("template"));
    if (hasTemplate?.range.contains(range)) {
      return [hasTemplate];
    }
  }
  if (document.languageId === "html") {
    return symbols;
  }
}
