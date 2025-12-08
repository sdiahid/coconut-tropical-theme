import * as vscode from 'vscode';
import * as path from 'path';

export function getMenuWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string {
  const stylePath = vscode.Uri.file(
    path.join(
      extensionUri.fsPath,
      'media',
      'menu',
      'styles.css'
    )
  );

  const scriptPath = vscode.Uri.file(
    path.join(
      extensionUri.fsPath,
      'media',
      'menu',
      'main.js'
    )
  );

  const styleUri = webview.asWebviewUri(stylePath);
  const scriptUri = webview.asWebviewUri(scriptPath);

  const cspSource = webview.cspSource;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta
        http-equiv="Content-Security-Policy"
        content="
          default-src 'none';
          img-src https: data:;
          style-src ${cspSource};
          script-src ${cspSource};
        "
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Menu</title>
      <link rel="stylesheet" href="${styleUri}">
    </head>
    <body>
      <h1>Menu Webview</h1> 
      <script src="${scriptUri}"></script>
    </body>
    </html>
  `;
}
