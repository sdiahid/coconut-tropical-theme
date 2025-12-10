import * as vscode from 'vscode';
import * as path from 'path';

export function getMenuWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string {
  const stylePath = vscode.Uri.file(
    path.join(extensionUri.fsPath, 'media', 'menu', 'styles.css')
  );

  const lightImgPath = vscode.Uri.file(
    path.join(extensionUri.fsPath, 'media', 'menu', 'light.webp')
  );
  
  const darkImgPath = vscode.Uri.file(
    path.join(extensionUri.fsPath, 'media', 'menu', 'dark.webp')
  );

  const styleUri = webview.asWebviewUri(stylePath);
  const lightImgUri = webview.asWebviewUri(lightImgPath);
  const darkImgUri = webview.asWebviewUri(darkImgPath);
  const cspSource = webview.cspSource;

  const scriptContent = `
    const vscode = acquireVsCodeApi(); 

    window.addEventListener('DOMContentLoaded', () => {
      wireThemeCard('card-coconut-light'); 
      wireThemeCard('card-tropical-grey'); 
    });

    function wireThemeCard(elementId) { 
      const card = document.getElementById(elementId); 
      if (!card) return; 

      card.addEventListener('click', () => { 
        const themeName = card.getAttribute('data-theme'); 
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
          img-src ${cspSource} https: data:;
          style-src ${cspSource} 'unsafe-inline';
          script-src ${cspSource} https://unpkg.com 'unsafe-inline';
          font-src ${cspSource} https://unpkg.com;
        "
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Menu</title>
      <link rel="stylesheet" href="${styleUri}">
      <script type="module" src="https://unpkg.com/@vscode/webview-ui-toolkit@latest/dist/toolkit.min.js"></script>
      <style>
        body {
          padding: 20px;
        }
        .cards-container {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .theme-card {
          width: 300px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: transform 0.2s, border-color 0.2s;
        }
        .theme-card:hover {
          transform: translateY(-2px);
          border-color: var(--vscode-focusBorder);
        }
        .card-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-bottom: 1px solid var(--vscode-widget-border);
        }
        .card-content {
          padding: 15px;
        }
        h3 {
          margin: 0 0 5px 0;
          color: var(--vscode-foreground);
        }
        p {
          margin: 0;
          opacity: 0.8;
          font-size: 0.9em;
        }
      </style>
    </head>
    <body>
      <h1>Selecciona un Tema</h1> 
      
      <div class="cards-container">
        
        <vscode-card id="card-coconut-light" class="theme-card" data-theme="Coconut Light">
          <img src="${lightImgUri}" class="card-image" alt="Vista previa tema claro" />
          <div class="card-content">
            <h3>Coconut Light</h3>
            <p>Tema claro ideal para entornos iluminados.</p>
          </div>
        </vscode-card>

        <vscode-card id="card-tropical-grey" class="theme-card" data-theme="Tropical Grey">
          <img src="${darkImgUri}" class="card-image" alt="Vista previa tema oscuro" />
          <div class="card-content">
            <h3>Tropical Grey</h3>
            <p>Tema oscuro de bajo contraste y relajante.</p>
          </div>
        </vscode-card>

      </div>

      <script>
        ${scriptContent}
      </script>
    </body>
    </html>
  `;
}