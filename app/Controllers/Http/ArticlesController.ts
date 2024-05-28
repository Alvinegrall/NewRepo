import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import DateTimeHelpers from "App/Helpers/DateTimeHelpers";
import Article from "App/Models/Article";
import fs from "fs";
import PDFDocument from "pdfkit-table";
import Mail from "@ioc:Adonis/Addons/Mail";

import Category from "App/Models/Category";
import Log from "App/Models/Log";
import Magasin from "App/Models/Magasin";
import ArticleValidator from "App/Validators/ArticleValidator";

export default class ArticlesController {
  public async register({ request, response, auth }: HttpContextContract) {
    try {
      // const { name, stock_alerte, stock_securite, cat_id, magasin_id } =
        // request.body();
      if (!auth.user) {
        return response.unauthorized({
          error: true,
          message: "Invalid credentials",
        });
      }

      const payload = await request
        .validate(ArticleValidator)
        .then((data) => data)
        .catch((error) => {
          if (error.messages?.errors) {
            return response.badRequest({
              error: true,
              message: error.messages.errors[0].message,
            });
          } else {
            return response.badRequest({
              error: true,
              message:
                "Une erreur est survenue lors de l'exécution de la requête",
            });
          }
        });

      if (payload) {
      const cat = await Category.findByOrFail("id", payload.cat_id);
      const magasin = await Magasin.findByOrFail("id", payload.magasin_id);

      const article = new Article();

      (article.name = payload.name),
        (article.code = Date.now().toString(32)),
        (article.stock_alerte = (payload.stock_alerte).toString()),
        (article.stock_securite = (payload.stock_securite).toString()),
        (article.categoryId = cat.id);
      article.magasinId = magasin.id;
      article.userCreate = auth?.user.id;

      if (Number(payload.stock_alerte) > 0) {
        article.is_alert = true;
      }

      await article.save();

      // save logs

      const logs = new Log();
      (logs.name = "Creation"),
        (logs.description =
          "<b> " +
          auth.user?.name +
          " </b>" +
          "à crée un article <b> " +
          article.name +
          " </b>"),
        (logs.sourceName = "articles");
      logs.sourceId = article.id;

      await logs.save();

      return response.status(200).json({
        error: false,
        message: "Arcticle create successfully",
        data: article,
      });
    }
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: error.message,
      });
    }
  }

  public async getAll({ response, request }: any) {
    try {
      const {
        page = 1,
        per_page = 10,
        category = null,
        nominee = null,
        start = null,
        end = null,
        search_key,
        search_value,
        limit_date,
        source_name,
        source_ref,
        type,
      } = request.qs();
      let query: any;
      query = Article.query()
        .where("is_active", true)
        .preload("category")
        .preload("magasin")
        .preload("entre")
        .preload("sortie")
        .orderBy("id", "desc");

      if (limit_date && !limit_date.includes("all")) {
        const limited_date = DateTimeHelpers.addDays(
          DateTimeHelpers.now(),
          limit_date
        );
        query.where("created_at", ">=", limited_date);
      }
      if (type && type !== "all") {
        query.where("is_alert", type);
      }
      if (search_value) {
        query
          .andWhere("name", "like", "%" + search_value + "%");

        
      }
      const articles = await query.paginate(page, per_page);

      return response.status(200).json({
        error: false,
        payement: articles.all(),
        data: {
          articles: articles.all(),
          total: articles.total,
          current_page: articles.currentPage,
          has_more_pages: articles.hasMorePages,
          first_page: articles.firstPage,
          last_page: articles.lastPage,
          is_empty: articles.isEmpty,
        },
      });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }
  public async getAllNopagination({ response, request }: any) {
    try {
      const article = await Article.query()
        .where("is_active", true)
        .preload("category")
        .preload("magasin")
        .preload("entre")
        .preload("sortie")
        .orderBy("id", "desc");

      return response.status(200).json({
        error: false,
        data: article,
      });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }

  public async getOne({ params, response }: any) {
    try {
      const article = await Article.query()
        .where("code", params.code)
        .preload("category")
        .preload("entre")
        .preload("sortie")
        .firstOrFail();

      return response.status(200).json({ error: false, data: article });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erreur lors de la récupération" + error,
      });
    }
  }
  public async delete({ params, response }: any) {
    try {
      const val = await Article.query().where("id", params.id).firstOrFail();

      val.isActive = false;

      await val.save();

      return response
        .status(200)
        .json({ error: false, data: "Supprimé avec success" });
    } catch (error) {
      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la suppression" });
    }
  }

  public async update({ response, request, params }: any) {
    try {
      const { name, stock_alerte, stock_securite, cat_id, magasin_id } =
        request.body();

      // update article

      const article = await Article.query()
        .where("id", params.id)
        .firstOrFail();

      if (article.name != name) {
        article.name = name;
      }

      if (article.stock_alerte != stock_alerte) {
        article.stock_alerte = stock_alerte;
      }

      if (article.stock_securite != stock_securite) {
        article.stock_securite = stock_securite;
      }

      if (article.categoryId != cat_id) {
        const cat = await Category.findByOrFail("id", cat_id);
        article.categoryId = cat.id;
      }

      if (article.magasinId != magasin_id) {
        const magasin = await Magasin.findByOrFail("id", magasin_id);
        article.magasinId = magasin.id;
      }

      await article.save();
      if (Number(article.stock_alerte) > Number(article.qte)) {
        article.is_alert = true;
      } else {
        article.is_alert = false;
      }
      article.save();
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }

  public async genaratePdf({ response, request, params }: any) {
    try {
      let articles:any;
      if (params.id == 1) {
        articles = await Article.query()
          .where("is_active",true)
          .andWhere("is_alert", true)
          .preload("category")
          .preload("magasin")
          .preload("entre")
          .preload("sortie")
          .orderBy("id", "desc");
      } else {
        articles = await Article.query()
          .where("is_active", true)
          .preload("category")
          .preload("magasin")
          .preload("entre")
          .preload("sortie")
          .orderBy("id", "desc");
      }


      // generate pdf file
      const doc = new PDFDocument({ margin: 30, size: "A4" });

      // Créez un tableau pour afficher les données
      // const table: any = {
      //   title: "Article en alerte :",
      //   headers: ["Bénéficiaires", "Articles", "Quantité"],
      //   padding: 5,
      //   rows: [],
      // };

      const tableArticles: any = {
        title: "Article en alerte :",
        headers: ["Articles", "Quantité", "En alerte"],
        padding: 5,
        rows: [],
      };

      // const tableEntre: any = {
      //   title: "Entrées",
      //   headers: ["Articles", "Quantité"],
      //   padding: 5,
      //   rows: [],
      // };

      let fileName = "";
      fileName = `${new Date().getFullYear()}-${new Date().getTime()}.pdf`;
      const path = `tmp/uploads/${fileName}`;

      doc.pipe(fs.createWriteStream(path));

      articles.forEach((elt) => {
        const userData = [elt?.name, elt?.qte, elt.is_alert ? "Oui" : "Non"];
        tableArticles.rows.push(userData);
      });

      // A4 595.28 x 841.89 (portrait) (about width sizes)
      // width

      // await doc.table(table);
      await doc.table(tableArticles);
      // await doc.table(tableEntre);

      // or columnsSize
      // await doc.table(table, {
      //   columnsSize: [200, 100, 100],
      // });
      // done!
      // messenguenkouealvinegrall@gmail.com
      doc.end();

      // await Mail.sendLater((message) => {
      //   message
      //     .from("tsagueyvesthibaut@gmail.com")
      //     .to("tsagueyvesthibaut@gmail.com")
      //     .subject("Rapport et etats des stocks")
      //     .attach(path);
      // });

      // return response
      //   .status(200)
      //   .header("Content-Type", "application/pdf")
      //   .send(path);

      return response.status(200).json({
        error: false,
        data: {
          path: path,
          fileName: `http://localhost:3333/uploads/${fileName}`,
        },
      });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }
}
