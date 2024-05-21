import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import DateTimeHelpers from "App/Helpers/DateTimeHelpers";
import Article from "App/Models/Article";
import Cycle from "App/Models/Cycle";
import Entre from "App/Models/Entre";
import Fournisseur from "App/Models/Fournisseur";
import Log from "App/Models/Log";
import fs from "fs";
import PDFDocument from "pdfkit-table";

export default class EntresController {
  public async register({ auth, request, response }: HttpContextContract) {
    try {
      const {
        marque,
        code_article,
        fournisseur_id,
        prix_u,
        prix_t,
        qte,
        cycle_code,
        is_conforme,
        date,
      } = request.body();

      if (!auth.user) {
        return response.unauthorized({
          error: true,
          message: "Invalid credentials",
        });
      }

      const cycle = await Cycle.query().where("code", cycle_code).firstOrFail();

      if (cycle.isPassed) {
        return response.status(500).json({
          error: true,
          message: "Ce cycle est cloturé",
        });
      }

      const fournisseur = await Fournisseur.findByOrFail("id", fournisseur_id);
      //   const beneficiaire = await Beneficiaire.findByOrFail("id", beneficiaire_id);
      const article = await Article.findByOrFail("code", code_article);

      const entre = new Entre();

      (entre.fournisseurId = fournisseur.id),
        (entre.articleId = article.id),
        (entre.qte = qte),
        (entre.userCreate = auth.user?.id),
        (entre.marque = marque);
      entre.prixT = prix_t;
      entre.prixU = prix_u;
      entre.isConforme = is_conforme;
      entre.date = date;
      entre.code = Date.now().toString(32);
      entre.cycleId = cycle.id;

      if (is_conforme) {
        article.qteBefore = article.qte;
        article.qte = Number(article.qte) + Number(qte);
        article.stockConforme = qte;
        await entre.save();
      } else {
        if (article.qte < qte) {
          return response.status(500).json({
            error: true,
            message: "La quantité n'est pas conforme",
          });
        }
        article.stockNonConforme = (
          Number(article.stockNonConforme) + Number(qte)
        ).toString();
        await entre.save();
      }

      if (Number(article.stock_alerte) < Number(article.qte)) {
        article.is_alert = false;
      }

      await article.save();

      const logs = new Log();
      (logs.name = "Creation"),
        (logs.description =
          "<b> " +
          auth.user?.name +
          " </b>" +
          " à reçu une livraison de " +
          article.name +
          " de " +
          fournisseur.name),
        (logs.sourceName = "entre");
      logs.sourceId = entre.id;
      logs.cycleId = cycle.id;

      await logs.save();

      return response.status(200).json({
        error: false,
        message: "entré create successfully",
        data: entre,
      });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: error.message,
      });
    }
  }
  public async getAll({ response, params }: any) {
    try {
      const cycle = await Cycle.findByOrFail("code", params.cycle_code);

      const entre = await Entre.query()
        .where("is_active", true)
        .andWhere("cycle_id", cycle.id)
        .preload("article", (q) => q.where("is_active", true))
        .preload("fournisseur")
        .orderBy("id", "desc");

      // const entre = await Entre.query()
      //   .where("is_active", true)
      //   .preload("article")
      //   .preload("fournisseur")
      //   .orderBy("id", "desc");

      return response.status(200).json({ error: false, data: entre });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }

  public async getAllNonconforme({ response, params }: any) {
    4;
    try {
      const cycle = await Cycle.findByOrFail("code", params.cycle_code);

      const entre = await Entre.query()
        .where("is_active", true)
        .andWhere("cycle_id", cycle.id)
        .andWhere("is_conforme", false)
        .preload("article", (q) => q.where("is_active", true))
        .preload("fournisseur")
        .orderBy("id", "desc");

      // const entre = await Entre.query()
      //   .where("is_active", true)
      //   .preload("article")
      //   .preload("fournisseur")
      //   .orderBy("id", "desc");

      return response.status(200).json({ error: false, data: entre });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }

  public async getOne({ params, response }: any) {
    try {
      const entre = await Entre.query()
        .where("code", params.code)
        .preload("article")
        .preload("fournisseur")
        .firstOrFail();

      return response.status(200).json({ error: false, data: entre });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erreur lors de la récupération" + error,
      });
    }
  }

  public async delete({ params, response }: any) {
    try {
      const val = await Entre.query().where("id", params.id).firstOrFail();

      const article = await Article.query()
        .where("id", val.articleId)
        .firstOrFail();
      article.stockNonConforme = (
        Number(article.stockNonConforme) - Number(val.qte)
      ).toString();
      await article.save();
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

  public async getAllPaginate({ response, request, params }: any) {
    try {
      const {
        page = 1,
        per_page = 10,
        category = null,
        search_key,
        search_value,
        start_date,
        end_date,
        limit_date,
        source_name,
        fournisseur_id,
        article_id,
        source_ref,
        type,
      } = request.qs();

      const cycle = await Cycle.findByOrFail("code", params.cycle_code);
      let query: any;

      query = Entre.query()
        .where("is_active", true)
        .where("cycle_id", cycle.id)
        .preload("article")
        .preload("fournisseur")
        .orderBy("id", "desc");

      if (start_date) {
        query.where("date", ">=", start_date);
      }
      if (end_date) {
        query.where("date", "<=", end_date);
      }

      if (fournisseur_id) {
        query.where("fournisseur_id", fournisseur_id);
      }

      if (article_id) {
        query.where("article_id", article_id);
      }

      if (limit_date && !limit_date.includes("all")) {
        const limited_date = DateTimeHelpers.addDays(
          DateTimeHelpers.now(),
          limit_date
        );
        query.where("created_at", ">=", limited_date);
      }

      if (search_value) {
        query = Entre.query()
          .where("is_active", true)
          .where("cycle_id", cycle.id)
          .whereHas("article", (q) => {
            q.where("name", "like", `%${search_value}%`);
          })
          .preload("article")
          .preload("fournisseur")
          .orderBy("id", "desc");
      }
      // if (type && type !== "all") {
      //   query.where("is_alert", type);
      // }


      const entres = await query.paginate(page, per_page);

      return response.status(200).json({
        error: false,
        entres: entres.all(),
        data: {
          entres: entres.all(),
          total: entres.total,
          current_page: entres.currentPage,
          has_more_pages: entres.hasMorePages,
          first_page: entres.firstPage,
          last_page: entres.lastPage,
          is_empty: entres.isEmpty,
        },
      });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }


  public async genaratePdfEntree({ request, response, params }: any) {
    try {

      try {
        const {
          page = 1,
          per_page = 10,
          category = null,
          search_key,
          search_value,
          start_date,
          end_date,
          limit_date,
          source_name,
          show_report,
          fournisseur_id,
          article_id,
          source_ref,
          type,
          title,
        } = request.qs();
  
        const cycle = await Cycle.findByOrFail("code", params.cycle_code);
        let query: any;
  
        query = Entre.query()
          .where("is_active", true)
          .where("cycle_id", cycle.id)
          .preload("article")
          .preload("fournisseur")
          .orderBy("id", "desc");
  
        if (start_date) {
          query.where("date", ">=", start_date);
        }
        if (end_date) {
          query.where("date", "<=", end_date);
        }
  
        if (fournisseur_id) {
          query.where("fournisseur_id", fournisseur_id);
        }
  
        if (article_id) {
          query.where("article_id", article_id);
        }
  
        if (limit_date && !limit_date.includes("all")) {
          const limited_date = DateTimeHelpers.addDays(
            DateTimeHelpers.now(),
            limit_date
          );
          query.where("created_at", ">=", limited_date);
        }
  
        if (search_value) {
          query = Entre.query()
            .where("is_active", true)
            .where("cycle_id", cycle.id)
            .whereHas("article", (q) => {
              q.where("name", "like", `%${search_value}%`);
            })
            .preload("article")
            .preload("fournisseur")
            .orderBy("id", "desc");
        }
        // if (type && type !== "all") {
        //   query.where("is_alert", type);
        // }

        const entres = await query;
  
        if(show_report){
         // generate pdf file
      const doc = new PDFDocument({ margin: 30, size: "A4" });

      // Créez un tableau pour afficher les données
      // const table: any = {
      //   title: "Article en alerte :",
      //   headers: ["Bénéficiaires", "Articles", "Quantité"],
      //   padding: 5,
      //   rows: [],
      // };

      const tableEntre: any = {
        title: title ? title : "Entree",
        headers: ["No", "Date", "Article","Marque", "Quantité","PU","PT","Fournisseur"],
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
      // fileName = `${new Date().getFullYear()}-${new Date().getTime()}.pdf`;
      fileName = `Entree-${new Date().getDay()}-${new Date().getMonth()}-${new Date().getFullYear()}.pdf`;
      const path = `tmp/uploads/${fileName}`;

      doc.pipe(fs.createWriteStream(path));

      entres.forEach((elt:Entre, index) => {
        const userData = [ index ,DateTimeHelpers.formatDate(elt.date), elt?.article?.name, elt?.marque, elt?.qte, elt.prixU , elt?.prixT, elt?.fournisseur?.name];
        tableEntre.rows.push(userData);
      });

      // A4 595.28 x 841.89 (portrait) (about width sizes)
      // width

      // await doc.table(table);
      await doc.table(tableEntre);

      doc.end();

      return {
        path: path,
        fileName: `http://localhost:3333/uploads/${fileName}`,
      };
        }    
      
    } catch (error) {
      console.log("error", error);
  }
}


// https://auth.faroty.com/hello.html?user_data={"user":{"is_confirm":1,"is_wallet_confirm":1,"hash_id":"P+sRDFFpjX6UnPzNr0Lv/A","api_token":"d434bb11-7bf2-4427-a513-535989d74523","api_password":"46ca92f0-17e2-42c5-8821-5d9f9e463479"},"api_token":"d434bb11-7bf2-4427-a513-535989d74523","api_password":"46ca92f0-17e2-42c5-8821-5d9f9e463479"}&group_current_page=1hktqv6jg&callback=https://groups.faroty.com&app_mode=mobile
// https://auth.faroty.com/hello.html?user_data={"user":{"is_confirm":1,"is_wallet_confirm":1,"hash_id":"2d94eb2a-6705-4a3c-8e81-ad4d1c1f1552","api_token":"740427ad-c076-4402-b8c3-95369b3c49a9","api_password":"8cff3ff1-aabd-492e-a66f-b4c03aad0207"},"api_token":"740427ad-c076-4402-b8c3-95369b3c49a9","api_password":"8cff3ff1-aabd-492e-a66f-b4c03aad0207"}&group_current_page=1hktqv6jg&callback=https://groups.faroty.com/sanctions?query=1&app_mode=mobile
// https://auth.faroty.com/hello.html?user_data={"user":{"is_confirm":1,"is_wallet_confirm":1,"hash_id":"P+sRDFFpjX6UnPzNr0Lv/A"},"api_token":"d434bb11-7bf2-4427-a513-535989d74523","api_password":"46ca92f0-17e2-42c5-8821-5d9f9e463479"}&group_current_page=1hktqv6jg&callback=https://groups.faroty.com&app_mode=mobile
// https://auth.faroty.com/hello.html?user_data={"user":{"is_confirm":1,"is_wallet_confirm":1,"hash_id":"P+sRDFFpjX6UnPzNr0Lv/A"},"api_token":"d434bb11-7bf2-4427-a513-535989d74523","api_password":"46ca92f0-17e2-42c5-8821-5d9f9e463479"}&group_current_page=1hktqv6jg&callback=https://groups.faroty.com&app_mode=mobile

// https://auth.faroty.com/hello.html?user_data={"user":{"is_confirm":1,"is_wallet_confirm":1,"hash_id":"2d94eb2a-6705-4a3c-8e81-ad4d1c1f1552"},"api_token":"bfcf96ce-9534-4688-bbf0-f231b3a2a174","api_password":"55088d4c-a750-42c7-952f-cc14ee86303a"}&group_current_page=1hr6m5not&callback=https://groups.faroty.com&app_mode=mobile
