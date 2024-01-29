import fs from "fs";
import Jimp from "jimp";
import axios from "axios";


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
// Refactored to use axios to retrieve the image from the given URL into a buffer.
// The buffered image data is then given in the input to Jimp.read(). This fixes
// an issue with Jimp.read() where is was failing to retrieve an image resulting in 
// it giving the error, "Error: Could not find MIME for Buffer". This error is
// discussed in the following link, https://github.com/jimp-dev/jimp/issues/775.
// A suggesion is given there to use axios to retreive the image. This suggestion
// has been implemented here.
export async function filterImageFromURL(inputURL) {
    return axios({
        method: 'get',
        url: inputURL,
        responseType: 'arraybuffer'
    } )
    .then(function ({data: imageBuffer}) {
        return new Promise(async (resolve, reject) => {
            try {
                const photo = await Jimp.read(imageBuffer);
                const outpath = "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
                console.log("Photo; ", photo);
                await photo
                    .resize(256, 256) // resize
                    .quality(60) // set JPEG quality
                    .greyscale() // set greyscale
                    .write(outpath, (img) => {
                        resolve(outpath);
                    });
                // }
            } catch (error) {
                reject(error);
            }
        } );
    } );
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
    for (let file of files) {
        fs.unlinkSync(file);
    }
}
