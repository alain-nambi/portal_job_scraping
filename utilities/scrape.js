import cheerio from "cheerio";
import axios from "axios";
import chalk from "chalk";
import ora from "ora";
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
  const loadingSpinnerScrapping = ora({
    text: chalk.white(
      "Récupération des données sur les offres d'emploi en ligne..."
    ),
    spinner: "dots",
    color: "white",
  });

  loadingSpinnerScrapping.start();

  try {
    const jobLists = [];
    const pageList = 5;

    for (let i = 0; i <= pageList; i++) {
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
  } catch (error) {
    chalk.redBright(
      "\n Une erreur s'est produite lors de la récupération des données"
    );
    console.error(error.message);
    loadingSpinnerScrapping.stop();
  }
};

export { findTextByHTMLTag, scrapeJobData };
