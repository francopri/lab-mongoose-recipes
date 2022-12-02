import express from "express";
import RecipeModel from "../models/Recipe.model.js";
import UserModel from "../models/User.model.js";

const recipeRouter = express.Router();

//Buscar todas as receitas
recipeRouter.get("/all-recipes", async (req, res) => {
    try {

        const recipes = await RecipeModel.find({}).populate("creator");

        return res.status(200).json(recipes);


    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors);

    }
});

//Iteração 2 - criando uma receita
recipeRouter.post("/create-recipe/:idUser", async (req, res) => {
    try {
        const { idUser } = req.params;

        const newRecipe = await RecipeModel.create({ ...req.body, user: idUser });

        const userUpdated = await UserModel.findByIdAndUpdate(
            idUser,
            {
                $push: {
                    recipes: newRecipe._id,
                },
            },
            { new: true, runValidators: true }
        );

        console.log(newRecipe.title);

        return res.status(201).json(newRecipe);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Receita não foi criada.", error: error.errors });
    }
});

// Buscando uma receita
recipeRouter.get("/oneRecipe/:idRecipe", async (req, res) => {
    try {
        const { idRecipe } = req.params;

        const recipe = await RecipeModel.findById(idRecipe).populate("creator");

        if (!recipe) {
            return res.status(400).json({ msg: " Receita não encontrada!" });
        }

        return res.status(200).json(recipe);

    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors);
    }
});

//Iteração 3 - Inserting many
recipeRouter.post("/create-many", async (req, res) => {
    try {
        const form = req.body;

        const newRecipes = await RecipeModel.insertMany(form);

        res.status(201).json({ msg: "As receitas foram salvas", newRecipes });

        console.log("As seguintes receitas foram salvas: ");
        const t = newRecipes.forEach((element) => {
            console.log(element.title);
        });

    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: "Receitas não foram criadas." })

    }
});

// Iteração 4 - Update a recipe
recipeRouter.put("/edit/rigatone", async (req, res) => {
    try {

        const updatedRecipe = await RecipeModel.findOneAndUpdate(
            { title: "Rigatoni alla Genovese" },
            { duration: 100 },
            { new: true, runValidators: true }
        )

        console.log("A duração da receita Rigatoni foi alterada.")
        return res.status(200).json({
            msg: "A receita foi alterada para:",
            title: updatedRecipe.title
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors);
    }
});

// Editar uma receita
recipeRouter.put("/edit/:idRecipe", async (req, res) => {
    try {
        const { idRecipe } = req.params;

        const updatedRecipe = await RecipeModel.findByIdAndUpdate(
            idRecipe,
            { ...req.body },
            { new: true, runValidators: true }
        );

        return res.status(200).json(updatedRecipe);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.errors);
    }
});

// Iteração 5 - Deletar uma receita específica
recipeRouter.delete("/delete/carrot", async (req, res) => {
    try {

        const deleted = await RecipeModel.deleteOne({ title: "Carrot Cake" });

        return res.status(200).json({ msg: "A receita de Carrot Cake foi deletada", deleted });

    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors);
    }

});

// Deleting all recipes
recipeRouter.delete("/delete/all", async (req, res) => {

    try {

        const deleted = await RecipeModel.deleteMany({});

        const recipes = await RecipeModel.find({ })

        console.log("Todas as receitas foram deletadas!!");
        return res.status(200).json({ msg: "Todas receitas foram deletadas", recipes });

    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors);
    }

});

// Deleter uma receita - por ID
recipeRouter.delete("/delete/:idRecipe", async (req, res) => { 
    try {

        const { idRecipe } = req.params;

        const deletedRecipe = await RecipeModel.findByIdAndDelete(idRecipe);

        if (!deletedRecipe) {

            return res.status(400).json({ msg: "Receita não encontrada!" });
        }

        await UserModel.findByIdAndUpdate(
            deletedRecipe.user,
            {
                $pull: {
                    recipes: idRecipe,
                },
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({msg: "Receita deletada."});

    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors);
    }
});



export default recipeRouter;
