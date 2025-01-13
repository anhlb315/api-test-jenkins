const { s3, GetObjectCommand, getSignedUrl } = require("../services/s3Bucket");

const resolveS3Urls = async (modelInstance, fields) => {
  const resolveField = async (field) => {
    if (modelInstance[field] && !modelInstance[field].includes("http")) {
      const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: modelInstance[field],
      });

      modelInstance[field] = await getSignedUrl(s3, command, {
        expiresIn: 3600 * 24 * 7, // URL expires in one week
      });
    }
  };

  await Promise.all(fields.map(resolveField));
  return modelInstance;
};

module.exports = resolveS3Urls;
