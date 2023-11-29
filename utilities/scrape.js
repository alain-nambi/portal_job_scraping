import cheerio from "cheerio";
import axios from "axios";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import {
  contenuAnnonceSelector,
  itemAnnonceSelector,
  itemDetailSelector,
} from "../constants/index.js";
import { extractJobData } from "./extract.js";
import { exportToPDF } from "./export.js";
import { uniqueFileName } from "./format.js";

const webDevUrl =
  "https://www.portaljob-madagascar.com/emploi/liste/secteur/informatique-web/page/";

const findTextByHTMLTag = ($annonce, HTMLTag) => {
  const textFound = $annonce
    .find(contenuAnnonceSelector)
    .find(HTMLTag)
    .text()
    .trim();
  if (textFound) {
    return textFound;
  } else {
    console.log("Aucune texte n'a été récupérée");
  }
};

const scrapeJobData = async () => {
  console.time("Testing performance for scraping")
  const howManyPages = async () => {
    const page = await prompts({
      type: "number",
      name: "number",
      message: "Combien de pages voudrais-tu récupérer ?"
    })
    return page.number > 0 ? page.number : await howManyPages() // recursively call the functions
  }

  try {
    const pageNumber = await howManyPages()
    const jobLists = [];

    if (pageNumber) {
      const loadingSpinnerScrapping = ora({
        text: chalk.white(
          "Récupération des données sur les offres d'emploi en ligne..."
        ),
        spinner: "dots",
        color: "white",
      });
    
      loadingSpinnerScrapping.start();


      for (let i = 0; i <= pageNumber; i++) {
        const result = await axios.get(webDevUrl + i);
        if (result.data) {
          const $ = cheerio.load(result.data);
          const itemAnnounce = $(itemAnnonceSelector);
  
          if (itemAnnounce) {
            itemAnnounce.each(async function (_index, annonce) {
              const { jobData } = await extractJobData($(annonce));
  
              if (jobData.title && jobData.company && jobData.contractType) {
                jobLists.push(jobData);
              }
            });
          }
        }
      }

      if (jobLists) {
        loadingSpinnerScrapping.succeed(
          chalk.white("Récupération des données terminées !")
        );
  
        exportToPDF(jobLists, uniqueFileName());
      } else {
        loadingSpinnerScrapping.fail(
          chalk.redBright(
            "Aucune donnée récupérée. Veuillez vérifier l'URL ou réessayer plus tard"
            )
            );
          }
        } else {
          console.log('No page');
          return howManyPages()
        }
        
      } catch (error) {
        chalk.redBright(
          "\n Une erreur s'est produite lors de la récupération des données"
          );
          console.error(error.message);
        }
  console.timeEnd("Testing performance for scraping")
};

export { findTextByHTMLTag, scrapeJobData };
