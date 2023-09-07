import * as vscode from "vscode";
import { HtmlFix } from "./provide/htmlFix";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("html", new HtmlFix(), {
      providedCodeActionKinds: HtmlFix.providedCodeActionKinds,
    })
  );
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("vue", new HtmlFix(), {
      providedCodeActionKinds: HtmlFix.providedCodeActionKinds,
    })
  );
  const disposable = vscode.commands.registerCommand(
    "tag-custom",
    (callback: (v: string) => void) => {
      const inputBox = vscode.window.createInputBox();
      inputBox.title = "自定义标签";
      inputBox.onDidAccept(() => {
        if (inputBox.value.trim()) {
          callback(inputBox.value.trim());
        }
        inputBox.hide();
      });
      inputBox.show();
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
