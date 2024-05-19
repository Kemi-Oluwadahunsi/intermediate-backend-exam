const logger = require("./logger");
const calculateReadingTime = (blog) => {
  const averageSpeed = 225; // Words per minute
  const wordCount = blog.trim().split(/\s+/).length;
  const estimatedTime = Math.ceil(wordCount / averageSpeed);
  logger.info(
    `Calculated reading time: ${estimatedTime} minute(s) for blog with ${wordCount} words.`
  );
  return estimatedTime;
};
module.exports = {
  calculateReadingTime,
};
