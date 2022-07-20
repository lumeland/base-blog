import Server from "lume/core/server.ts";
import expires from "lume/middlewares/expires.ts";
import notFound from "lume/middlewares/not_found.ts";

const server = new Server({
  port: 8000,
  root: `${Deno.cwd()}/_site`,
});

server.use(expires());
server.use(notFound({
  root: `${Deno.cwd()}/_site`,
  page404: "/404.html"
}));

server.start();

console.log("Listening on http://localhost:8000");
