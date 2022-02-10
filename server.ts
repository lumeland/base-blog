import Server from "https:/deno.land/x/lume@v1.5.1/core/server.ts";

const server = new Server({
  port: 8000,
  root: `${Deno.cwd()}/_site`
});

server.start();

console.log("Listening on http://localhost:8000");
