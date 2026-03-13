const API_URL = "https://www.omdbapi.com/?apikey=thewdb&s="

const container = document.getElementById("movieList")

async function fetchMovies(query){

const res = await fetch(API_URL + query)

const data = await res.json()

render(data.Search || [])

}

function render(movies){

container.innerHTML=""

movies.forEach(movie=>{

container.innerHTML+=`

<div class="movie">

<img src="${movie.Poster !== 'N/A' ? movie.Poster : ''}">

<div class="movie-info">

<div class="title">${movie.Title}</div>

<div class="year">📅 ${movie.Year}</div>

</div>

</div>

`

})

}

document.getElementById("search").addEventListener("input",(e)=>{

const query = e.target.value

if(query.length > 2){

fetchMovies(query)

}

})

fetchMovies("thriller")
