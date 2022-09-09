import { renderToString } from "@vue/server-renderer";
import { createSSRApp } from "vue";
import AppComponent from "./App.vue";

export const pages = {
  "/": "home"
};

async function render(name) {
  if (name === "home") {
    const app = createSSRApp(AppComponent);
    return await renderToString(app);
  }
}

export async function renderPage(pageContext) {
  const path = new URL("http://localhost" + pageContext.url).pathname;
  const html = _ => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
        <title>Weird Vue Bug Reproduction</title>
      </head>
      <body>
        <div id="app">${_}</div>
        <script type="module" src="/entrypoints/client.js"></script>
      </body>
    </html>
  `;

  if (path in pages) {
    return {
      httpResponse: {
        statusCode: 200,
        contentType: "text/html",
        body: html(await render(pages[path]))
      }
    };
  } else {
    return {
      httpResponse: null
    };
  }
}
