import { Router } from "express";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";
const router = Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const isThereUser = await userModel.findOne({
      username,
    });

    if (isThereUser) {
      res.redirect("/login");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({ username, password: hashedPassword });
    await newUser.save();

    res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
});

export { router as signupRoute };
