const API_KEY = "708b6616d4f93c71106cbd36cd888bb0"

const SEARCH_URL =
`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}`

const DISCOVER_URL =
`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=hi`

const container = document.getElementById("movieList")

let currentPage = 1
let currentQuery = ""
let currentYear = ""

async function fetchMovies(){

let url

if(currentQuery){

url = `${SEARCH_URL}&query=${currentQuery}&page=${currentPage}`

}else{

url = `${DISCOVER_URL}&page=${currentPage}`

}

if(currentYear){

url += `&primary_release_year=${currentYear}`

}

const res = await fetch(url)

const data = await res.json()

render(data.results)

document.getElementById("pageNumber").innerText = currentPage

}

function render(movies){

container.innerHTML=""

movies.forEach(movie=>{

container.innerHTML+=`

<div class="movie">

<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">

<div class="movie-info">

<div class="title">${movie.title}</div>

<div>📅 ${movie.release_date}</div>

<div>⭐ ${movie.vote_average}</div>

</div>

</div>

`

})

}

function searchMovies(){

currentQuery = document.getElementById("search").value.trim()
currentYear = document.getElementById("yearSearch").value.trim()

currentPage = 1

fetchMovies()

}

document.getElementById("search").addEventListener("input",searchMovies)
document.getElementById("yearSearch").addEventListener("input",searchMovies)

document.getElementById("next").addEventListener("click",()=>{

currentPage++
fetchMovies()

})

document.getElementById("prev").addEventListener("click",()=>{

if(currentPage>1){
currentPage--
fetchMovies()
}

})

fetchMovies()
