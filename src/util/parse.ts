import { baseParse, ElementNode,RootNode } from "@vue/compiler-core";

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
):ElementNode | undefined {
  end === undefined ? (end = start) : end;
  let findNode: ElementNode | undefined;
  let parentNode: ElementNode | undefined;
  const walk = (nodes: Array<ElementNode>) => {
    nodes.forEach((node) => {
      const startIndex = node.loc.start.offset;
      if (startIndex! <= start) {
        parentNode = findNode;
        findNode = node;
      }
      if (node.children && startIndex! <= start) {
        walk(node.children as Array<ElementNode>);
      }
    });
  };
  walk(document.children as Array<ElementNode>);
  if(parentNode && igNoreTag.includes(parentNode.tag)){
    return undefined;
  }
  return findNode;
}
