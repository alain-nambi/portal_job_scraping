import fs from "fs";
import Papa from "papaparse";
import PDFDocument from "pdfkit";
import chalk from "chalk";

const formatBulletedList = (jobDetails) => {
  try {
    if (jobDetails) {
      return jobDetails.replace(/ • /g, "\n• ").replace(/ - /g, "\n- ");
    }
  } catch (error) {
    console.error("Error on formating bulleted list", error.message);
    throw error;
  }
};

const exportToPDF = (data, fileName) => {
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(fileName);

  doc.pipe(stream);

  doc
    .fontSize(16)
    .text("Offres d'emploi", { align: "center", underline: true });

  doc.moveDown();

  if (data) {
    data.forEach((job, index) => {
      doc.fontSize(14).text(`Offres d'emploi ${index + 1} :`, {
        underline: true,
      });

      doc.fontSize(12).text(`Titre : ${job.title}`);
      doc.fontSize(12).text(`Entreprise : ${job.company}`);
      doc.fontSize(12).text(`Type de contrat : ${job.contractType}`);
      if (job.dateAnnonce) {
        doc.fontSize(12).text(`Date de l'annonce : ${job.dateAnnonce}`);
      }
      doc.fontSize(12).text(`URL : ${job.link}`);
      doc
        .fontSize(12)
        .text(`Description`, { underline: true })
        .text(formatBulletedList(job.details));
      doc.moveDown();
    });

    doc.end();

    stream.on("finish", () => {
      console.log(
        chalk.green(
          "Les données ont été exportées avec succès vers le fichier PDF : "
        ),
        fileName
      );
    });
  }
};

export { exportToPDF };
