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

      panel.webview.onDidReceiveMessage(
        (message: any) => {
          if (message.type === 'changeTheme' && typeof message.themeName === 'string') {
            const config = vscode.workspace.getConfiguration('workbench');

            config.update(
              'colorTheme',
              message.themeName,
              vscode.ConfigurationTarget.Global
            );

            vscode.window.showInformationMessage(
              `Tema cambiado a: ${message.themeName}`
            );
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(disposable);
}