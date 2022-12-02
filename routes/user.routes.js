import express from "express";
import RecipeModel from "../models/Recipe.model.js";
import UserModel from "../models/User.model.js";

const userRoute = express.Router();

userRoute.post("/create-user", async (req, res) => {
  try {
    const form = req.body;

    const newUser = await UserModel.create(form);

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

userRoute.get("/oneUser/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;

    const oneUser = await UserModel.findById(idUser).populate("recipes");

    if (!oneUser) {
      return res.status(400).json({ msg: " Usuário não encontrado!" });
    }

    return res.status(200).json(oneUser);

  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

userRoute.get("/all-users", async (req, res) => {
  try {

    const allUsers = await UserModel.find().populate("recipes");

    return res.status(200).json(allUsers);

  } catch (error) {

    console.log(error);
    return res.status(500).json(error.errors);
  }
});

userRoute.put("/edit/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: idUser },
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedUser);

  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

userRoute.delete("/delete/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(idUser);

    if (!deletedUser) {
      return res.status(400).json({ msg: "Usuário não encontrado!" });
    }

    await RecipeModel.deleteMany({ user: idUser })

    return res.status(200).json({ msg: "Usuário deletado." })

  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

export default userRoute;
