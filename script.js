const imdbKEY = 'k_6t5odul7';

// GETS ALL HTML ELEMENTS AND ASSIGNS THEM AS A JS VARIABLE
const getElementArray = ["Poster", "Plot", "loadingText", "Title", "Director", "Starring", "Actors", "Ratings", "Suggested", "Embed", "movieList", "loader", "userInput", "Similar", "movieCarousel", "similarCaption", "controllerLeft", "controllerRight", "controllerLeft1", "controllerRight1", "controllerLeft2", "controllerRight2"]
for (let i = 0; i < getElementArray.length; i++) {
  getElementArray[i] = document.getElementById(getElementArray[i]);
}

// CLEARS SEARCH BAR (CHROME ONLY)
window.onbeforeunload = function(){
  userInput = null;
}

// PRESSING ENTER WILL SEARCH
function enterKeyPressed(event) {
  if (event.keyCode == 13) {
    button();
  }
}

// DATA FETCH FOR SEARCH FUNCTION
async function dataFetch() {
    loadingText.innerHTML = "Fetching data...";
    loader.style.display = 'block';
    urlTitle = `https://imdb-api.com/en/API/Title/${imdbKEY}/${data.results[i].id}/Ratings,`;
    // FETCH DATA
    const responseTitle = await fetch(urlTitle);
    const dataTitle = await responseTitle.json();
  
    // APPEND HTML
    Title.innerHTML = `${dataTitle.title} (${dataTitle.year})`;
    Plot.innerHTML = dataTitle.plot;
    Director.innerHTML = `Directed by ${dataTitle.directors}`;
    Starring.innerHTML = "Starring:";
    Actors.innerHTML = dataTitle.stars;
    Ratings.innerHTML = `IMDb: ${dataTitle.ratings.imDb}/10<br>TMDB: ${dataTitle.ratings.theMovieDb}/10<br>Rotten Tomatoes: ${dataTitle.ratings.rottenTomatoes}%`;
    Poster.innerHTML = `<a href="https://www.imdb.com/title/${dataTitle.id}/" target="_blank"><img src="${dataTitle.image}" alt="${dataTitle.title}" id="imgPoster"></a>`;

    images = `<div class="carousel-item active"><a href="https://www.imdb.com/title/${dataTitle.similars[0].id}/" target="_blank"><img class="similarPoster mx-auto" src="${dataTitle.similars[0].image}" alt="${dataTitle.similars[0].title}"></a></div>`;
    for (j = 1; j < dataTitle.similars.length; j++) {
      images += `<div class="carousel-item"><a href="https://www.imdb.com/title/${dataTitle.similars[j].id}/" target="_blank"><img class="similarPoster mx-auto" src="${dataTitle.similars[j].image}" alt="${dataTitle.similars[j].title}"></a></div>`;
    }
    similarCaption.innerHTML = `<i>Similar to ${dataTitle.title}:</i>`;
    controllerLeft1.style.display = 'initial';
    controllerRight1.style.display = 'initial';
    controllerLeft2.style.display = 'initial';
    controllerRight2.style.display = 'initial';
    Similar.innerHTML = images;

    loadingText.innerHTML = null;

    // FETCH YOUTUBE TRAILER
    urlVideo = `https://imdb-api.com/en/API/YouTubeTrailer/${imdbKEY}/${data.results[i].id}`
    const responseVideo = await fetch(urlVideo);
    const dataVideo = await responseVideo.json();

    if (dataVideo.videoUrl != null) {
      embed = dataVideo.videoUrl.replace(/watch\?v=/g, "embed/")
      Embed.innerHTML = `<iframe id="trailer" width="420" height="315" src="${embed}"></iframe>`
    } else if (dataVideo.videoUrl == null) {
      Embed.innerHTML = '';
    }

    loader.style.display = 'none';
    movieList.style.display = 'none';
    usage();
}

function noSuggestion() {
  window.i = 0
  dataFetch()
}

function suggestion() {
  window.i = 1
  Suggested.innerHTML = "";
  dataFetch()
}

// SEARCH FUNCTION
async function button() {
 
  clearTagsSearch();
  clearTagsList();
  loadingText.innerHTML = "Processing request...";
  loader.style.display = 'block';
  var input = userInput.value;
  
  // NESTED IF STATEMENTS TO HANDLE ALL INPUTS/ERRORS
  if (input == "") {
    clearTagsSearch();
    clearTagsList();
    getListDataMostPopularMovies();
    
  } else if (input !== "") {
      var url = `https://imdb-api.com/en/API/SearchMovie/${imdbKEY}/${input}`;
      const response = await fetch(url);
      const data = await response.json();
      window.data = data;
      
      if (data.results != 0) {
        var input = input.toUpperCase();
        var firstResult = data.results[0].title.toUpperCase();

        if (input == firstResult) {
          noSuggestion();

        } else if (input != firstResult) {
          if (data.results.length >= 2) {
            noSuggestion();
            Suggested.innerHTML = `Did you mean <a class="link-light" href="#" onclick="suggestion()">${data.results[1].title}</a>? ${data.results[1].description}`;
            
          } else if (data.results.length <= 1) {
            noSuggestion();
            Suggested.innerHTML = `No other suggestions were found.`;
          }
        }
      } else if (data.results == 0) {
        loadingText.innerHTML = "Cannot find movie";
      }

  } else {
    console.log('error');
  }
}  

// LOGS THE API USAGE COUNT IN CONSOLE. THIS FUNCTION USES AN EXTRA API CALL
   async function usage() {
    const response = await fetch(`https://imdb-api.com/API/Usage/${imdbKEY}`);
    const usage = await response.json();  
    
    if (usage.maximum != 0) {
      console.log(`${usage.count}/${usage.maximum} API calls used for today.`);

    } else if (usage.maximum == 0) {
      const usageError = (usage.errorMessage).toLowerCase();
      loadingText.innerHTML = `You have reached ${usageError}.`;
    }
}

// CLEARS ALL CONTENT FROM ANY GETLIST FUNCTION
function clearTagsList() {
  const removeValues = ["movieList", "loadingText"];
    for (let i = 0; i < removeValues.length; i++) {
        document.getElementById(removeValues[i]).innerHTML = null;
  }
}

// CLEARS ALL CONTENT FROM SEARCH FUNCTION
function clearTagsSearch() {
  controllerLeft1.style.display = 'none' 
  controllerRight1.style.display = 'none' 
  controllerLeft2.style.display = 'none' 
  controllerRight2.style.display = 'none' 
  
  const removeValues = ["Poster", "Plot", "loadingText", "Title", "Director", "Starring", "Actors",  "Ratings", "Suggested", "Embed", "Similar", "similarCaption"];
    for (let i = 0; i < removeValues.length; i++) {
        document.getElementById(removeValues[i]).innerHTML = null;
  }
}

// LIST FUNCTIONS
function getListDataMostPopularMovies() {
  window.listType = 'MostPopularMovies';
  window.titleList = 'Trending Movies';
  getListData();
}

function getListDataMostPopularTV() {
  window.listType = 'MostPopularTVs';
  window.titleList = 'Trending TV Shows';
  getListData();
}

function getListDataTop250Movies() {
  window.listType = 'Top250Movies';
  window.titleList = 'Top 250 Movies of All Time';
  getListData();
}

function getListDataTop250TV() {
  window.listType = 'Top250TVs';
  window.titleList = 'Top 250 TV Shows of All Time';
  getListData();
}

function getListDataInTheatres() {
  window.listType = 'InTheaters';
  window.titleList = 'In Theatres Now';
  getListData();
}

// DATA FETCH FOR LIST FUNCTIONS
async function getListData() {
  movieList.style.display = 'block';
  loader.style.display = 'block';
  clearTagsList();
  clearTagsSearch();
  const response = await fetch(`https://imdb-api.com/en/API/${listType}/${imdbKEY}`)
  const data = await response.json();
  var row = '<div class="row row-cols-1 row-cols-md-4 row-cols-lg-5 row-cols-sm-3">'

  for (let i = 0; i < data.items.length; i++) {
    posterURL = data.items[i].image.replace(/._(.*).jpg/, '') + '.jpg' //CHANGES THE IMAGE EXTENSION, AS SOMETIMES THE API WOULD RETURN A VERY LOW RES IMAGE
    listURL = `https://www.imdb.com/title/${data.items[i].id}/`;
    row += `<div class="col align-self-center my-2"><a href="${listURL}" target="_blank"><img class="img-fluid itemListClass" src="${posterURL}" alt="${data.items[i].title}"/></a></div>`
  }
  
  movieList.innerHTML = row;
  Title.innerHTML = titleList;
  loader.style.display = 'none';
  usage();
}

// RANDOM LIST DISPLAYED ON LOAD
const functionList = [function(){getListDataMostPopularMovies()}, function(){getListDataMostPopularTV()}, function(){getListDataTop250Movies()}, function(){getListDataTop250TV()}, function(){getListDataInTheatres()}]
const randomFunction = functionList[Math.floor(Math.random() * functionList.length)];
window.onload = randomFunction;
