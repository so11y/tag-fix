import * as vscode from "vscode";
import { HtmlFix } from "./provide/htmlFix";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("html", new HtmlFix(), {
      providedCodeActionKinds: HtmlFix.providedCodeActionKinds
    })
  );
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("vue", new HtmlFix(), {
      providedCodeActionKinds: HtmlFix.providedCodeActionKinds
    })
  );
}

export function deactivate() {}
