import { Request, Response } from "express";

export default (_: Request, res: Response) => {
    res.contentType("text/plain");
    res.send("Hello, World!");
}