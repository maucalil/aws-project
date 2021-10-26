"use strict";

const AWS = require("aws-sdk");
const sharp = require("sharp");

const s3 = new AWS.S3();

const BUCKET_NAME = process.env.bucket;

module.exports.handler = async (event) => {
    console.log("Evento:", event)
    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "Succesfully retrived image from S3" }),
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          },
    };
    try {
        let { key } = event.pathParameters;
        // key = key.replace(/%3a/gi, ":");
        console.log(key);
        const image = await s3.getObject({
            Bucket: process.env.bucket,
            Key: `optimized/${key}`,
        }).promise();

        const imageBuffer = await sharp(image.Body).toBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');

        response.body = JSON.stringify({ message: "Succesfully retrived image from S3", result: base64Image } );
      } catch (err) {
        console.error(err);
        response.body = JSON.stringify({ message: `Failed to retrive image from S3:${err}` });
        response.statusCode = 500;
      }

    return response;
}
