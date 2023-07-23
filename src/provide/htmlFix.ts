import * as vscode from "vscode";
import { parseHtml, findInRangeHtml, HtmlParse2Document } from "../util/parse";
export class HtmlFix implements vscode.CodeActionProvider {
  declare parseDomAst: HtmlParse2Document;

  // 类型为快速修复
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  constructor() {
    vscode.workspace.onDidChangeTextDocument((e) => {
      this.parseDomAst = parseHtml(e.document.getText());
    });
  }

  getParsedDomAst(text: string) {
    if (this.parseDomAst) {
      return this.parseDomAst;
    }
    this.parseDomAst = parseHtml(text);
    return this.parseDomAst;
  }

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    const parseDocumentAst = this.getParsedDomAst(document.getText());
    const node = findInRangeHtml(
      parseDocumentAst,
      document.offsetAt(range.start)
    );
    if (node) {
      const fix = [this.createFix(document, node)];
      if (node.children) {
        fix.push(this.createRemoveCommand(document, node));
      }
      return fix;
    }
  }
  private createRemoveCommand(
    document: vscode.TextDocument,
    node: HtmlParse2Document
  ) {
    const fix = new vscode.CodeAction(
      `remove tag`,
      vscode.CodeActionKind.RefactorRewrite
    );
    const lastChildrenIndex =
      node.children.length === 1 ? 0 : node.children.length - 1;
    const startIndex = node.children[0].startIndex!;
    const endIndex = node.children[lastChildrenIndex].startIndex!;
    const content = document.getText().slice(startIndex!, endIndex! + 1);
    fix.isPreferred = true;
    fix.edit = new vscode.WorkspaceEdit();
    fix.edit.replace(
      document.uri,
      new vscode.Range(
        document.positionAt(node.startIndex!),
        document.positionAt(node.endIndex! + 1)
      ),
      content
    );
    return fix;
  }
  private createFix(
    document: vscode.TextDocument,
    node: HtmlParse2Document
  ): vscode.CodeAction {
    const content = document
      .getText()
      .slice(node.startIndex!, node.endIndex! + 1);
    const fix = new vscode.CodeAction(
      `warp dev`,
      vscode.CodeActionKind.RefactorRewrite
    );
    fix.isPreferred = true;
    fix.edit = new vscode.WorkspaceEdit();
    fix.edit.replace(
      document.uri,
      new vscode.Range(
        document.positionAt(node.startIndex!),
        document.positionAt(node.endIndex! + 1)
      ),
      `<div>
      ${content}
      </div>`
    );
    return fix;
  }
}
