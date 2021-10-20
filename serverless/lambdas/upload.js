"use strict";

const AWS = require("aws-sdk");
// var multipart = require("parse-multipart");
// const crypto = require("crypto");

const s3 = new AWS.S3();

const BUCKET_NAME = process.env.bucket;

module.exports.handler = async (event) => {
    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "Succesfully uploaded image to S3" }),
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          },
    };
    try {
        const parsedBody = JSON.parse(event.body);
        const base64Image = parsedBody.file;
        const decodedImage = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const params = {
            Body: decodedImage,
            Bucket: BUCKET_NAME,
            ContentType: "image/jpeg",
            Key: `uploads/${new Date().toISOString()}.jpeg`,
        };

        const uploadResult = await s3.upload(params).promise();

        response.body = JSON.stringify({ message: "Succesfully uploaded image to S3", uploadResult });
    } catch (err) {
        console.error("Erro:", err);
        response.body = JSON.stringify({ message: "Failed to upload image to S3:", err });
        response.statusCode = 500;
    }

    return response;
};

