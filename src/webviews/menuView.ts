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

  const styleUri = webview.asWebviewUri(stylePath);
  const cspSource = webview.cspSource;

  const scriptContent = `
    const vscode = acquireVsCodeApi(); 

    window.addEventListener('DOMContentLoaded', () => {
      wireThemeButton('btn-coconut-light'); 
      wireThemeButton('btn-tropical-grey'); 
    });

    function wireThemeButton(buttonId) { 
      const btn = document.getElementById(buttonId); 
      if (!btn) return; 

      btn.addEventListener('click', () => { 
        const themeName = btn.getAttribute('data-theme'); 
        if (themeName) {
          vscode.postMessage({            
            type: 'changeTheme',        
            themeName                    
          });
        }
      });
    }
  `;

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
          style-src ${cspSource} 'unsafe-inline';
          script-src ${cspSource} https://unpkg.com 'unsafe-inline';
          font-src ${cspSource} https://unpkg.com;
        "
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Menu</title>
      <link rel="stylesheet" href="${styleUri}">
      <script type="module" src="https://unpkg.com/@vscode/webview-ui-toolkit@latest/dist/toolkit.min.js"></script>
    </head>
    <body>
      <h1>Menu Webview</h1> 
      
      <div style="display: flex; flex-direction: column; gap: 10px; align-items: flex-start;">
        <vscode-button id="btn-coconut-light" data-theme="Coconut Light">
          Coconut Light (claro)
        </vscode-button>

        <vscode-button id="btn-tropical-grey" data-theme="Tropical Grey" appearance="secondary">
          Tropical Grey (oscuro)
        </vscode-button>
      </div>

      <script>
        ${scriptContent}
      </script>
    </body>
    </html>
  `;
}