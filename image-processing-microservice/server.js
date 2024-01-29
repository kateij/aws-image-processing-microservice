import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */
  //! END @TODO1

  app.get("/filteredimage", async (req, res) => {
      try {
          const imageUrl = req.query.image_url;

          if (!imageUrl) {
              const message = "Missing image url. An image url is required.";
              console.log(message)
              res.status(400).send(message);
          } else {
              console.log('Image URL: ', imageUrl);

              let filteredImagePath = "";

              try {
                  filteredImagePath = await filterImageFromURL(imageUrl)

                  console.log('Filtered image path: ', filteredImagePath);

                  res.status(200).sendFile(filteredImagePath, function() {
                      deleteLocalFiles([filteredImagePath]);
                  } );
              } catch (error) {
                  console.log("ERROR: ", error);
                  const message = "Bad image url. Image not found or not an image.";
                  console.log(message);
                  res.status(404).send(message);
              }
          }
      } catch (error) {
          console.log("Internal Server error:", error);
          res.status(500).send("Unexpected error, check logs.")
      }
  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
      res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
