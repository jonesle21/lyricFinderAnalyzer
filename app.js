

//https://api.lyrics.ovh/v1/artist/title lyrics api

//gather lryic api url call
const lyricURL = "https://api.lyrics.ovh/v1/";
const artistInput = document.getElementById('artist-input');
const songInput = document.getElementById('song-input');
const description = document.getElementById('description');
const lyricText = document.getElementById('lyrics');
const errorBox = document.getElementById("error-box");

//buttons
const findButton = document.getElementById('button');
const randomButton = document.getElementById('random-button');

//spotify top song api call
const spotifyURL = "https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M";
const token = "Bearer [INSERT BEARER TOKEN HERE]";
const spotifyToSend = {

}


//testing sentiment analysis for lyrics
/*const toSend = {
  url: 'https://www.musixmatch.com/lyrics/Olivia-Rodrigo/good-4-u'
}
const lyricsSentiment = JSON.stringify(toSend);*/

findButton.addEventListener('click', getLyrics);
randomButton.addEventListener('click', getPlaylist);

function getLyrics(){
  //get values from inputs
  const artistValue = artistInput.value;
  const songValue = songInput.value;

  //check if input values are blank
  if (artistValue.trim() === '' || songValue.trim() === '') {
    errorBox.style.display = 'block';
    setTimeout(() => {
      errorBox.style.display = 'none';
    }, 2000);

    return;
  }

  errorBox.style.display = 'none';

  //checking that api call is correct
  console.log('Fetching from lyric API...');
  const payload = lyricURL + artistValue + '/' + songValue;
  console.log(payload);

  const req = new XMLHttpRequest();
  req.open("GET", payload, true);
  req.addEventListener('load', function(){
    if (req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText);
    } else {
      console.log("Error in Network" + response.status);
    }
    console.log(response.lyrics);
    description.innerHTML = "ARTIST: " + artistValue.toUpperCase() + ' SONG: ' + songValue.toUpperCase();
    const lyrics = formatLyrics(response.lyrics);
    lyricText.innerHTML = lyrics;
    getSentiment(response.lyrics);
  })
  req.send();

  /*fetch(payload)
    .then(response => response.json())
    .then(lyricsData => {
      console.log(lyricsData)
      description.innerHTML = "ARTIST: " + artistValue.toUpperCase() + ' SONG: ' + songValue.toUpperCase();
      const formattedLyrics = formatLyrics(lyricsData.lyrics);
      console.log(formattedLyrics);
      lyricText.innerHTML = formattedLyrics;
      getSentiment(lyricsData.lyrics);
    })*/
}

//get lyrics sentiment
function getSentiment(lyrics){
  const req = new XMLHttpRequest();
  const sentimentURL = 'https://twinword-sentiment-analysis.p.rapidapi.com/analyze/?text='
  console.log("Fetching sentiment analysis api from " + 'http://flip3.engr.oregonstate.edu:4209/analyze')
  req.open("GET", sentimentURL + lyrics, true);
  req.setRequestHeader("x-rapidapi-key", "d065572370mshf5c0079b4d8daf3p14f48bjsnb0f228fb8e4e");
  req.setRequestHeader("x-rapidapi-host", "twinword-sentiment-analysis.p.rapidapi.com");
  req.addEventListener('load', function(){
    if (req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText);
      console.log(response.type);
      console.log(response.score)
      if (response.score >= 0.1){
        document.getElementById('background').style.backgroundColor = "rgb(252,244,163)";
        document.body.style.backgroundColor = "rgb(248,222,126)";
        document.getElementById('artist-input').classList.remove("bg-dark");
        document.getElementById('song-input').classList.remove("bg-dark");
        document.getElementById('textHeader').classList.remove("bg-dark");
        document.getElementById('mainText').classList.remove("bg-secondary");
        document.getElementById('artist-input').classList.add("bg-info");
        document.getElementById('song-input').classList.add("bg-info");
        document.getElementById('textHeader').classList.add("bg-info");
        document.getElementById('mainText').classList.add("bg-info");
      } else if ( -0.1 < response.score && response.score < 0.1 ){
        document.getElementById('background').style.backgroundColor = 'LightGray';
        document.body.style.backgroundColor = "gray";
        document.getElementById('artist-input').classList.add("bg-dark");
        document.getElementById('song-input').classList.add("bg-dark");
        document.getElementById('textHeader').classList.add("bg-dark");
        document.getElementById('mainText').classList.add("bg-secondary");
        document.getElementById('artist-input').classList.remove("bg-info");
        document.getElementById('song-input').classList.remove("bg-info");
        document.getElementById('textHeader').classList.remove("bg-info");
        document.getElementById('mainText').classList.remove("bg-info");
      } else {
        document.getElementById('background').style.backgroundColor = 'SlateBlue';
        document.body.style.backgroundColor = "black";
      }
      if (response.type === 'neutral' || (-0.1 < response.score && response.score < 0.1)){
        document.getElementById('sentinment').innerHTML = 'a little negative';
      } else {
        document.getElementById('sentinment').innerHTML = response.type;
      }
    }
  })
  req.send();
}

//format lyrics for the page
function formatLyrics(lyrics){
  return lyrics.split('\n').join('<br />');
}


  //getting the artist name and song title from spotify
function getPlaylist(){
  var req = new XMLHttpRequest();
  req.open("GET", spotifyURL);

  req.setRequestHeader("Accept", "application/json");
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader("Authorization", token);
  req.addEventListener('load', function(){
    if (req.status >= 200 && req.status < 400){
      var result = JSON.parse(req.responseText);
      console.log(result);
      console.log(result.tracks.items[0].track.artists[0].name);
      console.log(result.tracks.items[0].track.name);
      var artistName = result.tracks.items[0].track.artists[0].name;
      var songTitle = result.tracks.items[0].track.name;
      getLyricsFromSpotify(artistName, songTitle);
    }
  });
  req.send();
}

function getLyricsFromSpotify(artist, song){
  console.log (artist);
  //checking that api call is correct
  console.log('Fetching from lyric API...');
  const payload = lyricURL + artist + '/' + song;
  console.log(payload);
  
  const req = new XMLHttpRequest();
  req.open("GET", payload, true);
  req.addEventListener('load', function(){
    if (req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText);
    } else {
      console.log("Error in Network" + response.status);
    }
    console.log(response.lyrics);
    description.innerHTML = "ARTIST: " + artist.toUpperCase() + ' SONG: ' + song.toUpperCase();
    const lyrics = formatLyrics(response.lyrics);
    lyricText.innerHTML = lyrics;
    getSentiment(response.lyrics);
  })
  req.send();
}