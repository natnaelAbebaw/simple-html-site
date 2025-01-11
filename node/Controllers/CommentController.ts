import { NextFunction, Request, Response } from "express";
import { controller } from "../decorators/controllerDecorator";
import { del, get, patch, post } from "../decorators/routeHandlerDecorators";
import { Comment } from "../models/comment";

@controller("/comments")
export class CommentController {
  @get()
  getAllComments() {
    return async function (req: Request, res: Response, next: NextFunction) {
      const { q: query } = req.query;
      const baseUrl = " https://jsonplaceholder.typicode.com/comments?postId=3";

      let results = [];
      try {
        // getting the comments from the API
        const response = await fetch(baseUrl);

        // parsing the response
        const parsedResponse = await response.json();

        // mapping the response to the Comment model
        const comments = parsedResponse.map((comment) => {
          return new Comment(
            comment.id,
            comment.postId,
            comment.name,
            comment.email,
            comment.body
          );
        });

        if (query) {
          results = comments.filter((comment) => {
            return comment.getName().includes(query);
          });
        } else {
          results = [];
        }
      } catch (error) {
        console.error("Error:", error);
        console.log("error");
        results = [];
      }

      res
        .status(200)
        .json({ status: "success", length: results.length, results });
    };
  }
}
