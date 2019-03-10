# Project 3: Connect Private Blockchain to Front-End Client via APIs

This project provides a private blockchain and RESTful API to create and retrieve blocks.

## Requirements

This project is built using `Node.js v10.15.0`, before installing, download and install [Node.js](https://nodejs.org/en/download/).

Finally, the frameworks used in this projects are: `express`, `level` and `crypto-js`.

## Installing

Installation is done using the npm install command:

    npm install

Running the application is done using the command:
    
    node app.js

## Details

This application provides two endpoint to interact with the private blockchain and it is configured to run on http://localhost:8000/.

# GET /api/block/:height
------

* **Method:** `GET`
* **Parameter:** `height` (Height of the block)

* **Success Response:**
    * **Code:** 200
    * **Content:**

```
{
    "hash": "bfef325cbf7d63d0ab0e6728980aaf50e0ccac0457b16b38fdb46b707e6fa3b4",
    "height": 0,
    "body": "First block in the chain - Genesis block",
    "time": "1552227235",
    "previousBlockHash": ""
}
```
* **Error Responses:**

| Code   | Content                                      |
|:------:|:---------------------------------------------|
| 404    | { "error": "Block Not Found"}                |
| 500    | { "error":  "Unexpected error occurred"}     |

# POST /api/block
------
* **Method:** `POST`
* **Body:** `{ "body": "Body Payload" } `
* **Success Response:**
    * **Code:** 201
    * **Content:**

```
{
    "hash": "e126e1261f1f26d67956616b40a95107fdb390fec41adff91e3943ba49562994",
    "height": 7,
    "body": "Body Payload",
    "time": "1552233816",
    "previousBlockHash": "446387eea5143f3549398a14be48b5eea8935f684524479b9d6529cb3ef19113"
}
```
* **Error Responses:**

| Code   | Content                                      |
|:------:|:---------------------------------------------|
| 400    | { "error": "Invalid body payload"}           |
| 500    | { "error":  "Unexpected error occurred"}     |