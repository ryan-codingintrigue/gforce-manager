import http from "http";
import path from "path";
import express from "express";
import helmet from "helmet";
import homeRoute from "./routes/home";
import robotsTxt from "./robots";
import contentSecurityPolicy from "./csp";
// @ts-ignore
import favicon from "../images/favicon.ico";

const app = express();

app.use(helmet({ frameguard: false, contentSecurityPolicy }));
app.use("/client", express.static(path.join(__dirname, "../client")));
app.use("/styles", express.static(path.join(__dirname, "./styles")));
app.use("/manifest.json", express.static(path.join(__dirname, "../client/manifest/manifest.json")));
app.use("/sw.js", express.static(path.join(__dirname, "../client/sw.js")));
app.use("/favicon.ico", express.static(path.join(__dirname, favicon)));
app.use("/robots.txt", (_, res) => {
    res.set("Content-Type", "text/plain");
    res.send(robotsTxt);
});

app.get("/", homeRoute);

// Listen
const port = process.env.PORT || 3000;
http.createServer(app).listen(port);

console.log(`Listening on ${port}`);