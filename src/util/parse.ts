import { baseParse, ElementNode, RootNode } from "@vue/compiler-core";

const igNoreTag = ["script", "style"];

export function parseHtml(domString: string) {
  return baseParse(domString, {
    onError: () => {},
    onWarn: () => {},
  });
}

export function findInRangeHtml(
  document: RootNode,
  start: number,
  end?: number
): ElementNode | undefined {
  end === undefined ? (end = start) : end;
  const nodePaths: Array<ElementNode> = [];
  const walk = (nodes: Array<ElementNode>) => {
    nodes.forEach((node) => {
      const startIndex = node.loc.start.offset;
      const endIndex = node.loc.end.offset;
      if (!(startIndex <= start && endIndex >= start)) {
        return;
      }
      nodePaths.push(node);
      if (node?.children) {
        walk(node?.children as Array<ElementNode> || []);
      }
    });
  };

  walk(document?.children as Array<ElementNode> || []);
  const lastNode = nodePaths.pop();
  if (nodePaths.some((node) => igNoreTag.includes(node.tag))) {
    return undefined;
  }
  return lastNode;
}
