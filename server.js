const express = require('express');
const requestClient = require('request');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

const apiBase = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video';
const apiKey = process.env.YT_API_KEY;

app.get('/', (request, response) => {
  response.render('index');
});

app.get('/about-nocache', (request, response) => {
  console.log('ping - no cache');
  setTimeout(() => response.render('about', {message: 'Slow page'}), 5000);
});

app.get('/about-precache', (request, response) => {
  console.log('ping - pre cache');
  setTimeout(() => response.render('about', {message: 'Pretty fast huh? Thats a pre-cached route!'}), 5000);
});

app.get('/api/search-videos/:searchQuery', (request, response) => {
  const requestUrl = `${apiBase}&q=${request.params.searchQuery}&key=${apiKey}`;
  requestClient(requestUrl, { json: true }, (err, res, data) => {
    const snippets = data.items.map((item) => {
      return {
        videoId: item.id.videoId,
        ...item.snippet
      } 
    });

    response.json(snippets);
  });
});

app.get('/related-videos/:videoId', (request, response) => {
  console.log(`${apiBase}&relatedToVideoId=${request.params.videoId}&key=${apiKey}&maxResults=10`);
  requestClient(`${apiBase}&relatedToVideoId=${request.params.videoId}&key=${apiKey}&maxResults=10`, { json: true }, (err, res, data) => {
    const snippets = data.items.map((item) => {
      return item.snippet;
    });

    response.render('related-videos', {snippets});
  });
});

const listener = app.listen(9500, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
