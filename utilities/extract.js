import cheerio from "cheerio";
import axios from "axios";
import {
  contenuAnnonceSelector,
  itemDetailSelector,
} from "../constants/index.js";
import { findTextByHTMLTag } from "./scrape.js";
import { formatDate } from "./format.js";

const extractJobDetails = async (jobDataURL) => {
  try {
    const result = await axios.get(jobDataURL);
    if (result.data) {
      const $ = cheerio.load(result.data);
      const itemDetail = $(itemDetailSelector).text().trim();

      if (itemDetail) {
        const cleanText = itemDetail.replace(/\s+/g, " ");
        return { cleanText };
      }
    }
  } catch (error) {
    console.error("Error extracting job details : " + error.message);
    throw error;
  }
};

const extractJobData = async ($annonce) => {
  try {
    const title = findTextByHTMLTag($annonce, "h3");
    const company = findTextByHTMLTag($annonce, "h4");
    const contractType = findTextByHTMLTag($annonce, "h5");
    const link = $annonce
      .find(contenuAnnonceSelector)
      .find("h3 > a")
      .attr("href");
    const dateAnnonce = formatDate(
      $annonce.find(".date_annonce > .date").text()
    );
    const { cleanText } = await extractJobDetails(link);

    const jobData = {
      title: title,
      company: company,
      contractType: contractType,
      link: link,
      dateAnnonce: dateAnnonce,
      details: cleanText,
    };

    return { jobData };
  } catch (error) {
    console.error("Error extracting job data : " + error.message);
    throw error;
  }
};

export { extractJobData };
