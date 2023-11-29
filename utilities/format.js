export const formatDate = (date) => {
  return String(date).trim("\n").replaceAll("\n", "-");
};

export const uniqueFileName = () => {
  const datetime = new Date().toISOString().split("T");
  const date = datetime[0].replaceAll("-", "_")
  const time = datetime[1].split(".")[0].replaceAll(":", "_")
  const milliseconds = datetime[1].split(".")[1].replace("Z", "")
  return `WEBDEV_${date}_${time}_${milliseconds}.pdf`
};

/**
 * Check if a string represents an integer.
 * @param {string} plainText - The input string to check.
 * @returns {boolean} True if the string represents an integer, false otherwise.
 */
export const isNumberedPoint = (plainText) => Number.isInteger(parseInt(plainText.trim()));

/**
 * Format a bulleted list by adding a newline before each bullet point.
 * @param {string} plainText - The input string containing a bulleted list.
 * @returns {string} The formatted bulleted list.
 * @throws Will throw an error if there is an issue during formatting.
 */
export const formatBulletedList = (plainText) => {
  try {
    if (plainText) {
      // Replace bullets with newline + bullet + space, and then trim any extra whitespace.
      return plainText.replace(/•/g, "\n•").replace(/-/g, "\n-").replace(/_/g, "\n_")
    }
  } catch (error) {
    console.error("Error on formatting bulleted list", error.message);
    throw error;
  }
};

/**
 * Format a numbered list by adding a newline before each numbered point.
 * @param {string} plainText - The input string containing a numbered list.
 * @returns {string} The formatted numbered list.
 * @throws Will throw an error if there is an issue during formatting.
 */
export const formatNumberedList = (plainText) => {
  try {
    if (plainText) {
      // Format the bulleted list first.
      const formattedBulletedList = formatBulletedList(plainText);

      // Split the formatted bulleted list into lines.
      const lines = Array.from(formattedBulletedList)

      // Modify lines as needed, adding a newline before numbered points.
      const newLines = lines.map((line, index) => {
        if (
          isNumberedPoint(line) &&
          (lines[index + 1] === "." || lines[index + 1] === ")" ||lines[index + 1] === "-")
        ) {
          return `\n${line.trim()}`;
        } else {
          return line;
        }
      });

      // Join the modified lines back into a single string.
      return newLines.join('');
    }
  } catch (error) {
    console.error("Error on formatting numbered list", error.message);
    throw error;
  }
};
