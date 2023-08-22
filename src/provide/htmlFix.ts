import * as vscode from "vscode";
import {  RootNode,ElementNode } from "@vue/compiler-core";
import { parseHtml, findInRangeHtml } from "../util/parse";
import { createCommand } from "../util/createCommand";

export class HtmlFix implements vscode.CodeActionProvider {
  declare parseDomAst: RootNode | null;

  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  constructor() {
    const canParseExtendedSymbol = ["html", "vue"];
    vscode.workspace.onDidChangeTextDocument((e) => {
      const fileName = e.document.fileName;
      const canParse = canParseExtendedSymbol.some((extendedSymbol) =>
        fileName.endsWith(extendedSymbol)
      );
      if (canParse) {
        this.parseDomAst = parseHtml(e.document.getText());
      } else {
        this.parseDomAst = null;
      }
    });
    vscode.window.onDidChangeActiveTextEditor((e) => {
      this.parseDomAst = null;
    });
  }

  getParsedDomAst(text: string) {
    if (this.parseDomAst) {
      return this.parseDomAst;
    }
    this.parseDomAst = parseHtml(text);
  }

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    const parseDocumentAst = this.getParsedDomAst(document.getText())!;
    const node = findInRangeHtml(
      parseDocumentAst,
      document.offsetAt(range.start)
    );
    if (node) {
      const fix = [
        this.createFix(document, node, "div"),
      ];
      if (node.children && node.children.length) {
        fix.push(this.createRemoveCommand(document, node));
      }
      return fix;
    }
  }

  private createRemoveCommand(document: vscode.TextDocument, node: ElementNode) {
    const lastChildrenIndex =
      node.children.length === 1 ? 0 : node.children.length - 1;
    const startIndex = node.children[0].loc.start.offset!;
    const endIndex = node.children[lastChildrenIndex].loc.end.offset!;
    const content = document.getText().slice(startIndex!, endIndex! + 1);
    const fix = createCommand(document, node, {
      content,
      actionName: `remove tag`,
    });
    return fix;
  }
  private createFix(
    document: vscode.TextDocument,
    node: ElementNode,
    tag: string
  ): vscode.CodeAction {
    const { start, end } = node.loc;
    const content = document.getText().slice(start.offset!, end.offset! + 1);
    const fix = createCommand(document, node, {
      content: `<${tag}>
      ${content}
      </${tag}>`,
      actionName: `wrap ${tag}`,
    });
    return fix;
  }
}
