const sharp = require("sharp");
const path = require("path");
const resizeImage = async (item) => {
  const imageId = item.coverCropped_id;
  const imagePath = path.resolve("public/images") + '/';
  await sharp(imagePath + item.cover_id + "." + item.cover_extension)
    .resize(400, 400)
    .toFile(imagePath + imageId + "." + item.cover_extension);
};

module.exports = resizeImage;
