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

Route.group(() => {
  Route.post("/login", "AuthController.login");
  Route.post("/article", "ArticlesController.register");
  Route.get("/article", "ArticlesController.getAll");
  Route.get("/article/:code", "ArticlesController.getOne");

  Route.post("/entre", "EntresController.register");
  Route.get("/entre", "EntresController.getAll");
  Route.get("/entre/:code", "EntresController.getOne");

  Route.post("/sortie", "SortiesController.register");
  Route.get("/sortie", "SortiesController.getAll");
  Route.get("/sortie/:code", "SortiesController.getOne");
}).prefix("api/v1");

// Route.get('/formation/:code', 'FormationsController.getone');
// Route.get('/blog/:code', 'BlogsController.getone');
// Route.get('/blog', 'BlogsController.getall');
// Route.get('/formation', 'FormationsController.getall');
// Route.get('/categories', 'FormationsController.getallcat');
// Route.get('/formations', 'FormationsController.getallformation');
