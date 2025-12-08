import * as vscode from 'vscode';
import { getMenuWebviewContent } from './webviews/menuView';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'coconut-tropical-theme.openMenu',
    () => {
      const panel = vscode.window.createWebviewPanel(
        'menuView',
        'Menu',
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = getMenuWebviewContent(
        panel.webview,
        context.extensionUri
      );
    }
  );

  context.subscriptions.push(disposable);
}
