import axios from 'axios'
import cheerio from 'cheerio'

exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const url = data.url;

        console.log("Fetching data from url: " + url + " ...");


        const response = await axios.get(url);
        const body = response.data;
        const $ = cheerio.load(body);
        const title = $('meta[property="og:title"]').attr('content') || $('title').text();
        const image = $('meta[property="og:image"]').attr('content')

        return {
            statusCode: 200,
            body: JSON.stringify({ title, image })
        };
     } catch (error) {
        console.error("Error in function:", error);
      return { 
        statusCode: 500, 
        body: `Error: ${error.message}` 
      };
    }
  };