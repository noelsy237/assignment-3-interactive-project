# Assignment 3 - Interactive Project
Hosted online [here](http://https://assignment3.noelwilliams.au/ "here").
## Production Journal
## Initialising the project
Originally the project used the API provided by OMDB which had a daily limit of 1000 API calls. The API had many limitations however and did not have anywhere near the amount of data that IMDB had. IMDB has a very extensive and easy to use API. 

The image above shows all the different APIs that are available from IMDB, OMDB only has a search function.

## HTML
The HTML is very minimal and mostly includes premade bootstrap components. The navbar is a basic bootstrap navbar that includes a dropdown list for the IMDB movie list, and a search bar. Below that is a container that holds all of the content for both the search function and the list function. The search functions content is held in a Bootstrap grid. This content is various empty elements that are appended with JS. The page is finished with a Bootstrap footer containing a Github link.

## CSS
The CSS is half Bootstrap and half custom. I tried to use bootstrap where I could, but there a few minor custom changes to sizing, padding and margins. A significant amount of the CSS is for a loading animation which I found [here](http://https://codepen.io/iwotastic/pen/xRZrXX "here").

## JS
#### Search Function
I started by making a search function to search for any movie or tv show on IMDB’s database. For this, I used the SearchMovie API, then used the movie ID from the first results in the Title API to get the full list of information on that movie.
The data is then displayed on the page, including the name, year, poster image, director, actors, plot, ratings and similar/recommended movies.
This function is actually two main functions, the first one is to handle the user input and account for any errors that may arise with either the users input or the API. Later on in the project I added a check to see if the user's input is exactly equal to the first results name and if it is not equal then the second result is suggested.
The second is where the API is actually called and the elements in the body are appended to accept the data from the API.

#### List Function
The next addition to the site was the list function(s). Depending on which list is selected by the user, one of the following APIs is called: Top250Movies, Top250TVs, MostPopularMovies, MostPopularTVs and InTheaters. The data was then looped through to display a list of movies or tv shows, with their title and poster. This was later changed to use a bootstrap grid and display the posters in a grid of 1, 3 or 5 per row depending on device size.
This function is scalable and new lists can easily be added with just a couple of lines, assuming the JSON file uses the same list format.

## Issues and Improvements
The site has several issues. The main issue comes from the fact that it is a one page site that has several different views. This was achieved by using JS to loop through every element and setting the innerHTML value to null. This was done as the website was developed gradually and without planning. As a result of this, the main noticeable effect is that you cannot use the back button to view the previous page, as it is the same page and the content has already been erased. Pressing the back button simply does not do anything.
It could be improved greatly by using a framework of some kind to dynamically generate pages based on the content provided by the API.
