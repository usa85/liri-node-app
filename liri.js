require("dotenv").config();

// to access Spotify and Twitter keys in Twitterkeys.js

var keysFile = require("./Twitterkeys.js");

// to access Twitter API.
var Twitter = require("twitter");

// to access Spotify API.
var Spotify = require("node-spotify-api");

// to access the random.txt file
var fs = require("fs");

// NPM module for moment
var moment = require('moment');

// Output file for logs.
var filename = './log.txt';

//  Command requested
var command = process.argv[2];

// Optional additional parameters
var argument = getArgument();

processRequest(command,argument);



function processDemand (command,argument){
    switch (command){
        case "my-tweets":
            getMyTweets();
        break;
        case "spotify-this-song":
            getSongInfo(argument);
        break;
        case "movie-this":
            getMovieInfo(argument);
        break;
        case "do-what-it-says":
            doWhatItSays();
        break;
        default:
            displayHelpText();
        break;
    }
}

function logOutput(log,cmd){
    // to separate responses with liri command and timestamp
    const logMsg = `+-+-+-+-+-+-+-+-+-+-+-+-+-+- ${cmd} ${moment().format("LLL")} +-+-+-+-+-+-+-+-+-+-+-+-+-+-\n${log}`;

    // Log output to console
    console.log(logMsg);

    // Log output to log.txt
    fs.appendFile(filename, logMsg, (err,d) => {
        if (err){
            console.log(err);
        }
    });
}

function getMyTweets() {
    let client = new Twitter(keysFile.twitter);
    let params = {screen_name: 'Pierre J Callies', count: 25};
    let logString = "";

    client.get('statuses/user_timeline', params, (error, tweets, response) => {
    if (!error) {
        for (var i=0; i<tweets.length; i++){
            logString += `${moment(tweets[i].created_at,"ddd MMM DD HH:mm:ss ZZ YYYY").format("LLL")}: ${tweets[i].text}\n`
        }
        logString += "\n"
        logOutput(logString,"my-tweets");

    }
    else {
        console.log(`Twitter error: ${error}`);
    }
    });
}

function getSongInfo(song){
    var spotify = new Spotify(keysFile.spotify);
    const defaultSong = "The Sign Ace of Base";
    let querySearch = song;
    let logString = "";
    const queryLimit = 5;

    if (song.length == 0) {
         querySearch = defaultSong;
    }
    spotify.search({ type: 'track', query: querySearch, limit: queryLimit }, (err, data) => {
        if (err) {
            return console.log(`Spotify error: ${err}`);
        }
        for (var i=0; i<data.tracks.items.length; i++){
            // Log song information
            logString += `Song Name: ${data.tracks.items[i].name}\n`
                + `Artists: ${data.tracks.items[i].album.artists[0].name}\n`
                + `Album: ${data.tracks.items[i].album.name}\n`;

            if (data.tracks.items[i].preview_url == null) {
                logString += `Preview Link: No preview link available\n\n`;
            }
            else {
                logString += `Preview Link: ${data.tracks.items[i].preview_url}\n\n`;
            }
        }
        logOutput(logString,"spotify-this-song",i)
    });       
}


function getMovieInfo(movie){
    const defaultMovie = "Ms Doubtfire";
    let movieName = movie;
    let logString = "";

    // If movie name not provided, then return info for default movie title
    if (movieName.length == 0) {
        movieName = defaultMovie;
    };

    // Run a request to the OMDB API with the movie specified
    var queryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=trilogy`;

    // Create a request to the queryUrl
    request(queryUrl, (error,response,data) => {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            // Convert to JSON object
            var movie = JSON.parse(data);

            // Check if movie was found in OMDB, if not found, log error and return
            if (movie.Response === "False") {
                console.log(`Error: ${movie.Error}`);
                return;
            }

            // Log the movie information
            logString = `Movie Title: ${movie.Title}\n`
                + `Release Year: ${movie.Year}\n`
                + `The IMDB movie rating is: ${movie.imdbRating}\n`;

            // Check if more than one source for movie ratings, if so, then list all remaining source ratings
            if (movie.Ratings.length > 1){
                for (var i=1; i < movie.Ratings.length; i++) {
                    logString += `${movie.Ratings[i].Source} Rating: ${movie.Ratings[i].Value}\n`;
                }
            }

            logString += `Country Produced In: ${movie.Country}\n`
                + `Language: ${movie.Language}\n`
                + `Plot: ${movie.Plot}\n`
                + `Actors:Node ${movie.Actors}\n\n`;

            logOutput(logString,"movie-this");
        }
        else {
            console.log(`OMDB error: ${error}`);
        }
    });
};

// ____________________________________________________________________________________

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", (error,data) => {
        if (error) {
            return console.log(`Read random.txt file error: ${error}`);
        }
        var whatToDoArray = data.split(",");

        command = whatToDoArray[0];
        argument = whatToDoArray[1];

        processRequest(command,argument);
    })
}

// ____________________________________________________________________________________

function displayHelpText() {
    let logString = "LIRI - Language Interpretation and Recognition Interface\n"
        + "Commands:\n"
        + "     liri my-tweets\n"
        + "     liri spotify-this-song <song name>\n"
        + "     liri movie-this <movie name>\n"
        + "     liri do-what-it-says\n\n";

    logOutput(logString,"LIRI Help");
}