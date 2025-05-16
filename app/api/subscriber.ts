import express from "express";
export const router = express.Router();

// Subscriber Home Route.
router.get("/", function (req, res) {
  res.send("Subscriber Page");
});
