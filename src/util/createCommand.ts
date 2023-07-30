import * as vscode from "vscode";
import { ElementNode } from "@vue/compiler-core";
interface CreateCommandOptions {
  actionName: string;
  content: string;
}

export function createCommand(
  document: vscode.TextDocument,
  node: ElementNode,
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
      document.positionAt(node.loc.start.offset!),
      document.positionAt(node.loc.end.offset! + 1)
    ),
    options.content
  );
  return fix;
}
