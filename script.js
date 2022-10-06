const imdbKEY = ''
const omdbKEY = ''


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

// SEARCH FUNCTION (OMDB)
// async function button1() {
//     var input = document.getElementById("userInput").value;
    
//     var input = input.replace(/ /i, "+")
//     var url = `http://www.omdbapi.com/?t=${input}&apikey=${omdbKEY}`;

//     if (input != null) {
//       clearTagsList();
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.Response == 'True') {
//           document.getElementById("Title").innerHTML = data.Title;
//           document.getElementById('Year').innerHTML = `(${data.Year})`;
//           document.getElementById('Plot').innerHTML = data.Plot;
//           document.getElementById('Director').innerHTML = `Directed by ${data.Director}`
//           document.getElementById('Starring').innerHTML = "Starring:"
//           document.getElementById('Actors').innerHTML = data.Actors;


//           // // const addValues = ["Title", "Year", "Plot", "Actors"]
//           // // for (let i = 0; i < addValues.length; i++) {
//           // //   value = addValues[i]
//           // //   console.log(test)
//           // //   document.getElementById(value).innerHTML = data[value];
//           // // }

//           var imageURL = `<a href="https://www.imdb.com/title/${data.imdbID}/" target="_blank"><img src="${data.Poster}" alt="${data.Title}" id="imgPoster"></a>`;
//           document.getElementById('Poster').innerHTML = imageURL;
//           document.getElementById("loadingText").innerHTML = null;

//           console.log(url)

//       }   else if (data.Error == 'Movie not found!') {
//           clearTagsSearch();
//           document.getElementById("Title").innerHTML = data.Error;

//       }   else  if (data.Error == 'Incorrect IMDb ID.') {
//           clearTagsSearch();
//           document.getElementById("Title").innerHTML = "";
//       }

//     } else if (input == null) {
//       clearTagsList();
//       document.getElementById("Title").innerHTML = data.Error;
//     }
// }

// DATA FETCH FOR SEARCH FUNCTION
async function dataFetch() {
  document.getElementById("loadingText").innerHTML = "Fetching data..."
  urlTitle = `https://imdb-api.com/en/API/Title/${imdbKEY}/${data.results[0].id}`
  
  const responseTitle = await fetch(urlTitle);
  const dataTitle = await responseTitle.json();

  document.getElementById("Title").innerHTML = dataTitle.title;
  document.getElementById('Year').innerHTML = `(${dataTitle.year})`;
  document.getElementById('Plot').innerHTML = dataTitle.plot;
  document.getElementById('Director').innerHTML = `Directed by ${dataTitle.directors}`
  document.getElementById('Starring').innerHTML = "Starring:"
  document.getElementById('Actors').innerHTML = dataTitle.stars;
  
  var imageURL = `<a href="https://www.imdb.com/title/${dataTitle.id}/" target="_blank"><img src="${dataTitle.image}" alt="${dataTitle.title}" id="imgPoster"></a>`;
  document.getElementById('Poster').innerHTML = imageURL;
  document.getElementById("loadingText").innerHTML = null;
  usage();
}

// SEARCH FUNCTION (IMDB)
async function button() {
  clearTagsList();
  document.getElementById("loadingText").innerHTML = "Processing request..."
  var input = document.getElementById("userInput").value;
  
  if (input == "") {
    clearTagsSearch();
    clearTagsList()
    document.getElementById("loadingText").innerHTML = "Input Required"
    
  } else if (input !== "") {
    var url = `https://imdb-api.com/en/API/SearchMovie/${imdbKEY}/${input}`
    const response = await fetch(url);
    const data = await response.json();
    window.data = data;

    var input = input.toUpperCase();
    var firstResult = data.results[0].title;
    var firstResult = firstResult.toUpperCase();

    if (input == firstResult) {
      dataFetch();

    } else if (input != firstResult) {

      if (data.results.length >= 2) {
        dataFetch();
        test = `Did you mean <a href="https://www.imdb.com/title/${data.results[1].id}/" target="_blank">${data.results[1].title}</a>? (${data.results[1].description})`
        console.log('test: ' + test)
        document.getElementById('Suggested').innerHTML = test
        
      } else if (data.results.length <= 1) {
        dataFetch();
        document.getElementById('Suggested').innerHTML = `No other suggestions were found.`
      }
  }

} else {
  console.log('error')
}


}   


// LOGS THE API USAGE COUNT IN CONSOLE. THIS FUNCTION USES AN EXTRA API CALL
   async function usage() {
    const response = await fetch(`https://imdb-api.com/API/Usage/${imdbKEY}`);
    const usage = await response.json();  
    
    if (usage.maximum != 0) {
      console.log(`You have used ${usage.count}/${usage.maximum} API calls for today.`);

    } else if (usage.maximum == 0) {
      let usageError = (usage.errorMessage).toLowerCase();
      document.getElementById("loadingText").innerHTML = `You have reached ${usageError}.`
    }
    
}

// CLEARS ALL CONTENT FROM ANY GETLIST FUNCTION
function clearTagsList() {
  const removeValues = ["movieList", "loadingText"]
    for (let i = 0; i < removeValues.length; i++) {
        document.getElementById(removeValues[i]).innerHTML = null;
  }
}

// CLEARS ALL CONTENT FROM SEARCH FUNCTION
function clearTagsSearch() {
  const removeValues = ["Year", "Poster", "Plot", "loadingText", "Title", "Director", "Starring", "Actors"]
    for (let i = 0; i < removeValues.length; i++) {
        document.getElementById(removeValues[i]).innerHTML = null;
  }
}

// LOADING TEXT
function animationEvent() {
  document.getElementById("loadingText").innerHTML = "Processing search..."
}

// LIST FUNCTIONS
// TOP 250 MOVIES
async function getListDataTop250Movies() {
    clearTagsList();
    
    const response = await fetch(`https://imdb-api.com/en/API/Top250Movies/${imdbKEY}`);
    const data = await response.json();
    
    var list = document.getElementById("movieList");
    for (var i = 0; i < data.items.length; i++) {
      listURL = `https://www.imdb.com/title/${data.items[i].id}/`
      var div = document.createElement("div");
      div.innerHTML = `${data.items[i].rank}. ${data.items[i].title}<br><a href="${listURL}" target="_blank"><img id="topMovies" class="itemListClass" src="${data.items[i].image}" alt="${data.items[i].title}"/></a>`;
      list.appendChild(div);
  }
    clearTagsSearch();
    usage();
}

// MOVIES IN THEATRES NOW
async function getListDataInTheatres() {
    clearTagsList();

    const response = await fetch(`https://imdb-api.com/en/API/InTheaters/${imdbKEY}`);
    const data = await response.json();

    var list = document.getElementById("movieList")
    for (var i = 0; i < data.items.length; i++) {
      listURL = `https://www.imdb.com/title/${data.items[i].id}/`
      var div = document.createElement("div");
      div.innerHTML = `${data.items[i].title}<br><a href="${listURL}" target="_blank"><img id="inTheatres" class="itemListClass" src="${data.items[i].image}" alt="${data.items[i].title}"/></a>`;
      list.appendChild(div);
  }
    clearTagsSearch();
    usage();
}

// MOST POPULAR MOVIES
async function getListDataMostPopularMovies() {
    clearTagsList();

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
    usage();
}

// HIGHEST GROSSING MOVIES
async function getListDataHighestGrossing() {
    clearTagsList();

    const response = await fetch(`https://imdb-api.com/en/API/BoxOfficeAllTime/${imdbKEY}`);
    const data = await response.json();
    
    var list = document.getElementById("movieList");
    for (var i = 0; i < data.items.length; i++) {
      var div = document.createElement("div");
      div.innerHTML = `<b>${data.items[i].title}</b>: ${data.items[i].worldwideLifetimeGross}`;
      list.appendChild(div);
  } 
    clearTagsSearch();
    usage();
  }

// TOP 250 TV SHOWS
async function getListDataTop250TV() {
    clearTagsList();

    const response = await fetch(`https://imdb-api.com/en/API/Top250TVs/${imdbKEY}`);
    const data = await response.json();
    
    var list = document.getElementById("movieList");
    for (var i = 0; i < data.items.length; i++) {
      listURL = `https://www.imdb.com/title/${data.items[i].id}/`
      var div = document.createElement("div");
      div.innerHTML = `${data.items[i].rank}. ${data.items[i].title}<br><a href="${listURL}" target="_blank"><img id="topTV" class="itemListClass" src="${data.items[i].image}" alt="${data.items[i].title}"/></a>`;
      list.appendChild(div);
  } 
    clearTagsSearch();
    usage();
  }

// MOST POPULAR TV SHOWS
async function getListDataMostPopularTV() {
    clearTagsList();

    const response = await fetch(`https://imdb-api.com/en/API/MostPopularTVs/${imdbKEY}`);
    const data = await response.json();
    
    var list = document.getElementById("movieList");
    for (var i = 0; i < data.items.length; i++) {
      listURL = `https://www.imdb.com/title/${data.items[i].id}/`
      var div = document.createElement("div");
      div.innerHTML = `${data.items[i].rank}. ${data.items[i].title}<br><a href="${listURL}" target="_blank"><img id="mostPopularTV" class="itemListClass" src="${data.items[i].image}" alt="${data.items[i].title}"/></a>`;
      list.appendChild(div);
  } 
    clearTagsSearch();
    usage();
  }