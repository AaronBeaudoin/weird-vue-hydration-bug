const express = require("express");
const chalk = require("chalk");
const resolveConfig = require("vite").resolveConfig;
const createViteServer = require("vite").createServer;

resolveConfig({}, "serve").then(async viteConfig => {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom"
  });

  app.use((request, response, next) => {
    vite.middlewares(request, response, next);

    response.once("finish", _ => {
      const message = `${response.statusCode} ${request.originalUrl}`;
      if (response.locals.fallback) console.log(`${chalk.red('server')} ${message}`);
      else if (response.locals.custom) console.log(`${chalk.blue('custom')} ${message}`);
      else console.log(`${chalk.magenta('middle')} ${message}`);
    });
  });

  app.use("*", async (request, response, next) => {
    response.locals.custom = true;

    try {
      const module = await vite.ssrLoadModule("/entrypoints/server.js");
      const pageContext = await module.renderPage({ url: request.originalUrl });
      const renderResponse = pageContext.httpResponse;

      if (!renderResponse) {
        response.locals.fallback = true;
        return response.sendStatus(404);
      }

      response.statusCode = renderResponse.statusCode;
      response.contentType(renderResponse.contentType);
      response.send(await vite.transformIndexHtml(request.originalUrl, renderResponse.body));
      
    } catch (error) {
      vite.ssrFixStacktrace(error);
      next(error);
    }
  });

  const host = typeof viteConfig.server.host === "string" ? viteConfig.server.host : "0.0.0.0";
  const port = viteConfig.server.port || 3000;

  app.listen(port, host);
  console.log(`${chalk.green('server')} http://${host}:${port}...`);
  console.log(`${chalk.green('server')} mode=dev`);
});
