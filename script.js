const imdbKEY = '';

// CLEARS SEARCH BAR (CHROME ONLY)
window.onbeforeunload = function(){
  document.getElementById("userInput") = null;
}

// PRESSING ENTER WILL SEARCH
function enterKeyPressed(event) {
  if (event.keyCode == 13) {
    animationEvent();
    button();
  }
}

// DATA FETCH FOR SEARCH FUNCTION
async function dataFetch() {
  document.getElementById("loadingText").innerHTML = "Fetching data...";
  urlTitle = `https://imdb-api.com/en/API/Title/${imdbKEY}/${data.results[0].id}`;
  
  const responseTitle = await fetch(urlTitle);
  const dataTitle = await responseTitle.json();

  document.getElementById("Title").innerHTML = `${dataTitle.title} (${dataTitle.year})`;
  document.getElementById('Plot').innerHTML = dataTitle.plot;
  document.getElementById('Director').innerHTML = `Directed by ${dataTitle.directors}`;
  document.getElementById('Starring').innerHTML = "Starring:";
  document.getElementById('Actors').innerHTML = dataTitle.stars;
  
  var imageURL = `<a href="https://www.imdb.com/title/${dataTitle.id}/" target="_blank"><img src="${dataTitle.image}" alt="${dataTitle.title}" id="imgPoster"></a>`;
  document.getElementById('Poster').innerHTML = imageURL;
  document.getElementById("loadingText").innerHTML = null;

  urlVideo = `https://imdb-api.com/en/API/YouTubeTrailer/${imdbKEY}/${data.results[0].id}`
  const responseVideo = await fetch(urlVideo);
  const dataVideo = await responseVideo.json();
  embed = dataVideo.videoUrl
  embed = embed.replace(/watch\?v=/g, "embed/")
  console.log(embed)
  document.getElementById("Embed").innerHTML = `<iframe width="420" height="315" src="${embed}"></iframe>`

  usage();
}

// DATA FETCH FOR SUGGESTION
async function suggestion() {
  document.getElementById("loadingText").innerHTML = "Fetching data...";
  urlTitle = `https://imdb-api.com/en/API/Title/${imdbKEY}/${data.results[1].id}`;
  
  const responseTitle = await fetch(urlTitle);
  const dataTitle = await responseTitle.json();

  document.getElementById("Title").innerHTML = `${dataTitle.title} (${dataTitle.year})`;
  document.getElementById('Plot').innerHTML = dataTitle.plot;
  document.getElementById('Director').innerHTML = `Directed by ${dataTitle.directors}`;
  document.getElementById('Starring').innerHTML = "Starring:";
  document.getElementById('Actors').innerHTML = dataTitle.stars;
  document.getElementById('Suggested').innerHTML = "";

  var imageURL = `<a href="https://www.imdb.com/title/${dataTitle.id}/" target="_blank"><img src="${dataTitle.image}" alt="${dataTitle.title}" id="imgPoster"></a>`;
  document.getElementById('Poster').innerHTML = imageURL;
  document.getElementById("loadingText").innerHTML = null;

  urlVideo = `https://imdb-api.com/en/API/YouTubeTrailer/${imdbKEY}/${data.results[0].id}`
  const responseVideo = await fetch(urlVideo);
  const dataVideo = await responseVideo.json();
  embed = dataVideo.videoUrl
  embed = embed.replace(/watch\?v=/g, "embed/")
  console.log(embed)
  document.getElementById("Embed").innerHTML = `<iframe width="420" height="315" src="${embed}"></iframe>`

  usage();
}

// SEARCH FUNCTION
async function button() {
  clearTagsSearch();
  clearTagsList();
  document.getElementById("loadingText").innerHTML = "Processing request...";
  var input = document.getElementById("userInput").value;
  
  if (input == "") {
    clearTagsSearch();
    clearTagsList();
    document.getElementById("loadingText").innerHTML = "";
    
  } else if (input !== "") {
      var url = `https://imdb-api.com/en/API/SearchMovie/${imdbKEY}/${input}`;
      const response = await fetch(url);
      const data = await response.json();
      window.data = data;
      
      if (data.results != 0) {
        var input = input.toUpperCase();
        var firstResult = data.results[0].title;
        var firstResult = firstResult.toUpperCase();

        if (input == firstResult) {
          dataFetch();

        } else if (input != firstResult) {

          if (data.results.length >= 2) {
            dataFetch();
            document.getElementById('Suggested').innerHTML = `Did you mean <a class="link-light" href="#" onclick="suggestion()">${data.results[1].title}</a>? ${data.results[1].description}`;
            
          } else if (data.results.length <= 1) {
            dataFetch();
            document.getElementById('Suggested').innerHTML = `No other suggestions were found.`;
          }
        }
      } else if (data.results == 0) {
        document.getElementById("loadingText").innerHTML = "Cannot find movie";
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
      let usageError = (usage.errorMessage).toLowerCase();
      document.getElementById("loadingText").innerHTML = `You have reached ${usageError}.`;
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
  const removeValues = ["Poster", "Plot", "loadingText", "Title", "Director", "Starring", "Actors", "Suggested", "Embed"];
    for (let i = 0; i < removeValues.length; i++) {
        document.getElementById(removeValues[i]).innerHTML = null;
  }
}

// LOADING TEXT
function animationEvent() {
  document.getElementById("loadingText").innerHTML = "Fetching data...";
}

// LIST FUNCTIONS
// TOP 250 MOVIES
async function getListDataTop250Movies() {
    clearTagsList();
    clearTagsSearch();
    const response = await fetch(`https://imdb-api.com/en/API/Top250Movies/${imdbKEY}`);
    const data = await response.json();
    
    var list = document.getElementById("movieList");
    for (var i = 0; i < data.items.length; i++) {
      listURL = `https://www.imdb.com/title/${data.items[i].id}/`;
      var div = document.createElement("div");
      div.innerHTML = `${data.items[i].rank}. ${data.items[i].title}<br><a href="${listURL}" target="_blank"><img id="topMovies" class="itemListClass" src="${data.items[i].image}" alt="${data.items[i].title}"/></a>`;
     
      list.appendChild(div);
  }
    clearTagsSearch();
    document.getElementById("Title").innerHTML = 'Top 250 Movies of All Time';
    usage();
}

// MOVIES IN THEATRES NOW
async function getListDataInTheatres() {
    clearTagsList();
    clearTagsSearch();
    const response = await fetch(`https://imdb-api.com/en/API/InTheaters/${imdbKEY}`);
    const data = await response.json();

    var list = document.getElementById("movieList");
    for (var i = 0; i < data.items.length; i++) {
      listURL = `https://www.imdb.com/title/${data.items[i].id}/`;
      var div = document.createElement("div");
      div.innerHTML = `${data.items[i].title}<br><a href="${listURL}" target="_blank"><img id="inTheatres" class="itemListClass" src="${data.items[i].image}" alt="${data.items[i].title}"/></a>`;
      list.appendChild(div);
  }
    clearTagsSearch();
    document.getElementById("Title").innerHTML = 'In Theatres Now';
    usage();
}

// MOST POPULAR MOVIES
async function getListDataMostPopularMovies() {
    clearTagsList();
    clearTagsSearch();
    const response = await fetch(`https://imdb-api.com/en/API/MostPopularMovies/${imdbKEY}`);
    const data = await response.json();
    
    var list = document.getElementById("movieList");
    for (var i = 0; i < data.items.length; i++) {
      listURL = `https://www.imdb.com/title/${data.items[i].id}/`
      var div = document.createElement("div");
      div.innerHTML = `${data.items[i].title}<br><a href="${listURL}" target="_blank"><img id="mostPopularMovies" class="itemListClass" src="${data.items[i].image}" alt="${data.items[i].title}"/></a>`;
      list.appendChild(div);
  } 
    clearTagsSearch();
    document.getElementById("Title").innerHTML = 'Most Popular Movies';
    usage();
}

// HIGHEST GROSSING MOVIES
async function getListDataHighestGrossing() {
    clearTagsList();
    clearTagsSearch();
    const response = await fetch(`https://imdb-api.com/en/API/BoxOfficeAllTime/${imdbKEY}`);
    const data = await response.json();

    var list = document.getElementById("movieList");
    for (var i = 0; i < data.items.length; i++) {
      var div = document.createElement("div");
      div.innerHTML = `<b>${data.items[i].title}</b> (<i>${data.items[i].year}</i>): ${data.items[i].worldwideLifetimeGross}`;
      list.appendChild(div);
  } 
    clearTagsSearch();
    document.getElementById("Title").innerHTML = 'Highest Grossing Movies of All Time';
    usage();
  }

// TOP 250 TV SHOWS
async function getListDataTop250TV() {
    clearTagsList();
    clearTagsSearch();
    const response = await fetch(`https://imdb-api.com/en/API/Top250TVs/${imdbKEY}`);
    const data = await response.json();
    
    var list = document.getElementById("movieList");
    for (var i = 0; i < data.items.length; i++) {
      listURL = `https://www.imdb.com/title/${data.items[i].id}/`;
      var div = document.createElement("div");
      div.innerHTML = `${data.items[i].rank}. ${data.items[i].title}<br><a href="${listURL}" target="_blank"><img id="topTV" class="itemListClass" src="${data.items[i].image}" alt="${data.items[i].title}"/></a>`;
      list.appendChild(div);
  } 
    clearTagsSearch();
    document.getElementById("Title").innerHTML = 'Top 250 TV Shows of All Time';
    usage();
  }

// MOST POPULAR TV SHOWS
async function getListDataMostPopularTV() {
    clearTagsList();
    clearTagsSearch();
    const response = await fetch(`https://imdb-api.com/en/API/MostPopularTVs/${imdbKEY}`);
    const data = await response.json();
    
    var list = document.getElementById("movieList");
    for (var i = 0; i < data.items.length; i++) {
      listURL = `https://www.imdb.com/title/${data.items[i].id}/`;
      var div = document.createElement("div");
      div.innerHTML = `${data.items[i].rank}. ${data.items[i].title}<br><a href="${listURL}" target="_blank"><img id="mostPopularTV" class="itemListClass" src="${data.items[i].image}" alt="${data.items[i].title}"/></a>`;
      list.appendChild(div);
  } 
    clearTagsSearch();
    document.getElementById("Title").innerHTML = 'Most Popular TV Shows';
    usage();
  }
