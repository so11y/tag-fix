import {
  TextDocument,
  Range,
  CodeActionProvider,
  CodeActionKind,
  window,
  DocumentSymbol,
  commands,
  CodeAction,
  WorkspaceEdit
} from "vscode";
import { findInRangeTag, getRootCodeActionTag } from "../util/parse";

export class HtmlFix implements CodeActionProvider {
  static readonly providedCodeActionKinds = [CodeActionKind.QuickFix];

  async provideCodeActions(document: TextDocument, range: Range) {
    const editor = window.activeTextEditor;
    if (editor) {
      const document = editor.document;

      const symbols = (await commands.executeCommand(
        "vscode.executeDocumentSymbolProvider",
        document.uri
      )) as DocumentSymbol[];

      if (!symbols) {
        return null;
      }

      const rootTags = getRootCodeActionTag(document, range, symbols);
      if (!rootTags) {
        return;
      }

      const tag = findInRangeTag(rootTags, range);

      if (!tag) {
        return;
      }

      const fix = [
        this.emmetAction(
          "surround tag",
          "editor.emmet.action.wrapWithAbbreviation"
        ),
        this.removeTag(document, tag),
        this.emmetAction("remove only tag", "editor.emmet.action.removeTag"),
        this.emmetAction("close/join tag", "editor.emmet.action.splitJoinTag")
      ];
      return fix;
    }
  }

  removeTag(document: TextDocument, tag: DocumentSymbol) {
    const fix = new CodeAction("remove tag", CodeActionKind.RefactorRewrite);
    fix.isPreferred = true;
    fix.edit = new WorkspaceEdit();
    fix.edit.replace(document.uri, tag.range, "");
    return fix;
  }

  emmetAction(title: string, command: string) {
    const fix = new CodeAction(title, CodeActionKind.RefactorRewrite);
    fix.command = {
      title,
      command
    };
    return fix;
  }
}
