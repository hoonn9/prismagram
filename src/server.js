import "./env";
import { GraphQLServer } from "graphql-yoga";
import { authenticateJwt } from "./passport";
import { isAuthenticated } from "./middlewares";
import logger from "morgan";
import schema from "./schema";
import "./passport";
import { uploadController } from "./upload";

const PORT = process.env.PORT || 4000;

//context : resolver 끼리의 공유
const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({
    request,
    isAuthenticated
  })
});

server.express.use(logger("dev"));
// 서버 Path 보호
// server.express.use(passport.authenticate("jwt"));
// 서버에 전달되는 모든 요청은 authenticateJwt 를 통과
server.express.use(authenticateJwt);
// 서버/api/upload 에 upload 미들웨어를 실행하고 컨트롤러로 받음

server.express.post("/api/upload", uploadController);
server.start({ port: PORT }, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
