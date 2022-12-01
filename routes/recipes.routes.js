import express from "express";

import RecipeModel from "../models/Recipe.model.js";

const router = express.Router();


router.get("/all-recipes", async (req, res) => {
    try {
        const recipes = await RecipeModel.find({}, { __v: 0 }).sort({ title: 1 });
        return res.status(200).json(recipes);


    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors);

    }
});

//Iteração 2 - criando uma receita
router.post("/create-recipe", async (req, res) => {
    try {
        const form = req.body;

        const newRecipe = await RecipeModel.create(form);

        console.log(newRecipe.title);

        res.status(201).json(newRecipe);

    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: "Receita não foi criada." })

    }
});

//Iteração 3 - Inserting many
router.post("/create-many", async (req, res) => {
    try {
        const form = req.body;

        const newRecipes = await RecipeModel.insertMany(form);

        res.status(201).json({ msg: "As receitas foram salvas", newRecipes });

        console.log("As seguintes receitas foram salvas: ");
        const t = newRecipes.forEach((element) => {
            console.log(element.title);

        })



    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: "Receita não foi criada." })

    }
});


// Iteração 4 - Update a recipe

router.put("/edit/rigatone", async (req, res) => {
    try {

        const updatedRecipe = await RecipeModel.findOneAndUpdate(
            { title: "Rigatoni alla Genovese" },
            { duration: 100 },
            { new: true, runValidators: true }
        )

        return res.status(200).json(updatedRecipe);

    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors);
    }
});

// Iteração 5 - Deletar uma receita específica

router.delete("/delete/carrot", async (req, res) => {
    try {
        const deleted = await RecipeModel.deleteOne({ title: "Carrot Cake" });

        return res.status(200).json({ msg: "A receita de Carrot Cake foi deletada", deleted });

    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors);
    }

});

// Deleting all recipes
router.delete("/delete/all", async (req, res) => {
    try {
        const deleted = await RecipeModel.deleteMany({});

        const recipes = await RecipeModel.find()
        return res.status(200).json({ msg: "Todas receitas foram deletadas", recipes });

    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors);
    }

});


export default router;
