import * as vscode from "vscode";
import { HtmlParse2Document } from "./parse";
interface CreateCommandOptions {
  actionName: string;
  content: string;
}

export function createCommand(
  document: vscode.TextDocument,
  node: HtmlParse2Document,
  options: CreateCommandOptions
) {
  const fix = new vscode.CodeAction(
    options.actionName,
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
    options.content
  );
  return fix;
}
