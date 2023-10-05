/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return { hello: "world" };
});
Route.post("api/v1/login", "AuthController.login");
Route.group(() => {
  Route.post("/article", "ArticlesController.register");
  Route.get("/article", "ArticlesController.getAll");
  Route.get("/article/:code", "ArticlesController.getOne");
  Route.post("/article/stats", "HomePageDataController.getStatistics");
  Route.get("/article/stats/all", "HomePageDataController.getAllStatistics");
  Route.delete("/article/:id/delete", "ArticlesController.delete");

  Route.post("/entre/:cycle_code", "EntresController.register");
  Route.get("/entre/:cycle_code/all", "EntresController.getAll");
  Route.get("/entre/:code", "EntresController.getOne");
  Route.delete("/entre/:id/delete", "EntresController.delete");

  Route.post("/cat", "CategoriesController.register");
  Route.get("/cat", "CategoriesController.getAll");
  Route.get("/cat/:id", "CategoriesController.getOne");
  Route.delete("/cat/:id/delete", "CategoriesController.delete");

  Route.post("/fournisseur", "FournisseursController.register");
  Route.get("/fournisseur", "FournisseursController.getAll");
  Route.get("/fournisseur/:id", "FournisseursController.getOne");
  Route.delete("/fournisseur/:id/delete", "FournisseursController.delete");

  Route.post("/beneficiaire", "BeneficiairesController.register");
  Route.get("/beneficiaire", "BeneficiairesController.getAll");
  Route.get("/beneficiaire/:id", "BeneficiairesController.getOne");
  Route.delete("/beneficiaire/:id/delete", "BeneficiairesController.delete");

  Route.post("/magasin", "MagasinsController.register");
  Route.get("/magasin", "MagasinsController.getAll");
  Route.get("/magasin/:id", "MagasinsController.getOne");
  Route.delete("/magasin/:id/delete", "MagasinsController.delete");

  Route.get("/logs/:cycle_code/all", "LogsController.getAll");
  Route.delete("/logs/:id/delete", "LogsController.delete");
  Route.get("/home-page-data", "HomePageDataController.getHomePageData");

  Route.post("/sortie/:cycle_code", "SortiesController.register");
  Route.get("/sortie/:cycle_code/all", "SortiesController.getAll");
  Route.get("/sortie/:code", "SortiesController.getOne");
  Route.delete("/sortie/:id/delete", "SortiesController.delete");

  Route.post("/cycles", "CyclesController.register");
  Route.get("/cycles", "CyclesController.getAll");
  Route.get("/cycles/active", "CyclesController.getActive");
  Route.get("/cycles/:cycle_code/show", "CyclesController.getOne");
  // Route.delete("/sortie/:id/delete", "CyclesController.delete");
})
  .prefix("api/v1")
  .middleware("auth");

// Route.get('/formation/:code', 'FormationsController.getone');
// Route.get('/blog/:code', 'BlogsController.getone');
// Route.get('/blog', 'BlogsController.getall');
// Route.get('/formation', 'FormationsController.getall');
// Route.get('/categories', 'FormationsController.getallcat');
// Route.get('/formations', 'FormationsController.getallformation');
