import express from "express";
export const router = express.Router();

// Publisher Home Route.
router.get("/", function (req, res) {
  res.send("Publisher Page");
});
