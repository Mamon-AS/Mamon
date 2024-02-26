import axios from 'axios'
import cheerio from 'cheerio'
import { Buffer } from 'buffer'

exports.handler = async (event) => {
    try {
        const { url } = JSON.parse(event.body);
        const response = await axios.get(url);
        const body = response.data;
        const $ = cheerio.load(body);

        const title = $('meta[property="og:title"]').attr('content') || $('title').text();
        const imageUrl = $('meta[property="og:image"]').attr('content')

        const imageResponse = await axios({
              method: 'GET',
              url: imageUrl,
              responseType: 'arraybuffer' 
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            body: JSON.stringify({
              title,
              image: `data:${imageResponse.headers['content-type']};base64,${Buffer.from(imageResponse.data).toString('base64')}`
          })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Failed to fetch metadata' })
        };
    }
};