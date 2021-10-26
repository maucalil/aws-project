"use strict";

const AWS = require("aws-sdk");
const sharp = require("sharp");
const { basename, extname } = require("path");

const S3 = new AWS.S3();

module.exports.handler = async ({ Records: records }, context) => {

  const response = {
    statusCode: 201,
    body: JSON.stringify({ message: "Succesfully optmized image to S3" }),
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // replace with hostname of frontend (CloudFront)
    },
};
  try {
    await Promise.all(
      records.map(async record => {
        let { key } = record.s3.object;
        key = key.replace(/%3a/gi, ":");
        console.log(key);
        const image = await S3.getObject({
          Bucket: process.env.bucket,
          Key: key
        }).promise();

        const optimized = await sharp(image.Body)
          .resize(1280, 720, { fit: "inside", withoutEnlargement: true })
          .toFormat("jpeg", { progressive: true, quality: 50 })
          .toBuffer();

        const optmizeResult = await S3.putObject({
          Body: optimized,
          Bucket: process.env.bucket,
          ContentType: "image/jpeg",
          Key: `optimized/${basename(key, extname(key))}.jpg`
        }).promise();

        response.body = JSON.stringify({ message: "Succesfully optmized image to S3", optmizeResult: optmizeResult } );
        console.log(response);
      })
    );
  } catch (err) {
    console.error(err);
    response.body = JSON.stringify({ message: "Failed to optmize image to S3:", err });
    response.statusCode = 500;
  }

  return response;
};