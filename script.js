const API_KEY = "708b6616d4f93c71106cbd36cd888bb0"

let currentPage = 1
let totalPages = 1

let movieQuery=""
let actorQuery=""
let yearQuery=""
let countryQuery=""
let genreQuery=""
let languageQuery=""
let ottQuery = ""
let yearFromQuery = ""
let yearToQuery = ""
const container = document.getElementById("movies")

async function fetchMovies(){

let url=""

if(actorQuery){

const actorRes = await fetch(
`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${actorQuery}`
)

const actorData = await actorRes.json()

if(actorData.results.length===0){

container.innerHTML="No actor found"
return

}

const actorId = actorData.results[0].id

url=`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_cast=${actorId}&page=${currentPage}`

}
else if(movieQuery){

url=`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movieQuery}&page=${currentPage}`

}
else{

url=`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${currentPage}`

}

if(yearQuery){
url += `&primary_release_year=${yearQuery}`
}

    if(yearFromQuery){
        url += `&primary_release_date.gte=${yearFromQuery}-01-01`
    }
    if(yearToQuery){
        url += `&primary_release_date.lte=${yearToQuery}-12-31`
    }

if(countryQuery){
url += `&with_origin_country=${countryQuery}`
}

if(genreQuery){
url += `&with_genres=${genreQuery}`
}

if(languageQuery){
url += `&with_original_language=${languageQuery}`
}

    if(ottQuery){
        url += `&with_watch_providers=${ottQuery}&watch_region=${countryQuery || 'US'}`
    }

const res = await fetch(url)
const data = await res.json()

renderMovies(data.results)

document.getElementById("resultCount").innerText =
`${data.total_results} movies found`

totalPages = data.total_pages

document.getElementById("totalPages").innerText = totalPages

document.getElementById("pageInput").value = currentPage

}

function renderMovies(movies){

container.innerHTML=""

movies.forEach((movie,index)=>{

     if((index + 1) % 5 === 0){
        const adDiv = document.createElement("div")
        adDiv.className = "movie ad-cell"
        adDiv.innerHTML = `
            <ins class="adsbygoogle"
                style="display:block"
                data-ad-client="ca-pub-XXXXXXXXXXXXXXX"
                data-ad-slot="1234567890"
                data-ad-format="auto"
                data-full-width-responsive="true">{Ads}</ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        `
        container.appendChild(adDiv)
    }
        container.innerHTML += `

<div class="movie" onclick="showMovieDetails(${movie.id})">

<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">

<div class="movie-info">

<div>${movie.title}</div>

<div>⭐ ${movie.vote_average}</div>

<div>📅 ${movie.release_date}</div>

</div>

</div>

`

})

}

/* Movie Details Modal */

async function showMovieDetails(movieId){

    // Fetch movie details
    const movieRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
    )
    const movie = await movieRes.json()

    // Fetch OTT providers
    const providerRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`
    )
    const providerData = await providerRes.json()

    let providers = []

    const region = countryQuery || "US" // default region

    if(providerData.results && providerData.results[region] && providerData.results[region].flatrate){
        providers = providerData.results[region].flatrate
    }

    const modalBody = document.getElementById("modalBody")

    // Construct provider logos HTML inside a flex container
    let providersHTML = "Not available"
    if(providers.length>0){
        providersHTML = `<div class="ott-logos">` +
            providers.map(p =>
                `<img src="https://image.tmdb.org/t/p/original${p.logo_path}" alt="${p.provider_name}" title="${p.provider_name}">`
            ).join("") +
            `</div>`
    }

    modalBody.innerHTML = `

    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" style="float:left; margin-right:20px; max-width:150px; border-radius:8px;">

    <h2>${movie.title}</h2>

    <p><b>Release:</b> ${movie.release_date}</p>

    <p><b>Rating:</b> ⭐ ${movie.vote_average}</p>

    <p><b>OTT:</b> ${providersHTML}</p>

    <p>${movie.overview}</p>
  `

    document.getElementById("movieModal").style.display="flex"

}

/* Close modal */

document.getElementById("closeModal").onclick = function(){

document.getElementById("movieModal").style.display="none"

}

window.onclick = function(event){

const modal = document.getElementById("movieModal")

if(event.target==modal){

modal.style.display="none"

}

}

/* Search Listeners */

document.getElementById("search").addEventListener("input",(e)=>{

movieQuery = e.target.value
actorQuery=""
currentPage=1
fetchMovies()

})

document.getElementById("ottFilter").addEventListener("change", (e) => {
    ottQuery = e.target.value
    currentPage = 1
    fetchMovies()
})

document.getElementById("languageFilter").addEventListener("change",(e)=>{

languageQuery = e.target.value
currentPage = 1
fetchMovies()

})

document.getElementById("actorSearch").addEventListener("input",(e)=>{

actorQuery = e.target.value
movieQuery=""
currentPage=1
fetchMovies()

})

document.getElementById("yearSearch").addEventListener("input",(e)=>{

yearQuery = e.target.value
currentPage=1
fetchMovies()

})

document.getElementById("countryFilter").addEventListener("change",(e)=>{

countryQuery = e.target.value
currentPage=1
fetchMovies()

})

document.getElementById("genreFilter").addEventListener("change",(e)=>{

genreQuery = e.target.value
currentPage=1
fetchMovies()

})

/* Pagination */

document.getElementById("next").addEventListener("click",()=>{

if(currentPage < totalPages){

currentPage++
fetchMovies()

}

})

document.getElementById("prev").addEventListener("click",()=>{

if(currentPage > 1){

currentPage--
fetchMovies()

}

})

document.getElementById("pageInput").addEventListener("change",()=>{

let newPage = parseInt(document.getElementById("pageInput").value)

if(newPage>=1 && newPage<=totalPages){

currentPage=newPage
fetchMovies()

}else{

document.getElementById("pageInput").value=currentPage

}

})

const donateBtn = document.getElementById("donateBtn")
const qrModal = document.getElementById("qrModal")
const closeQrBtn = document.getElementById("closeQrBtn")

donateBtn.addEventListener("click", () => {
    qrModal.style.display = "flex"  // show modal
})

closeQrBtn.addEventListener("click", () => {
    qrModal.style.display = "none"  // hide modal
})

// Reset Search (movie + actor + year search input)
document.getElementById("resetSearch").addEventListener("click", () => {
    movieQuery = ""
    actorQuery = ""
    yearQuery = ""
    document.getElementById("search").value = ""
    document.getElementById("actorSearch").value = ""
    document.getElementById("yearSearch").value = ""
    currentPage = 1
    fetchMovies()
})

// Reset Filters (country, genre, language, OTT)
document.getElementById("resetFilters").addEventListener("click", () => {
    countryQuery = ""
    genreQuery = ""
    languageQuery = ""
    ottQuery = ""
    yearFromQuery = ""
    yearToQuery = ""

    document.getElementById("countryFilter").value = ""
    document.getElementById("genreFilter").value = ""
    document.getElementById("languageFilter").value = ""
    document.getElementById("ottFilter").value = ""

    document.getElementById("yearFrom").value = ""
    document.getElementById("yearTo").value = ""
    currentPage = 1
    fetchMovies()
})

// Elements
const yearFromInput = document.getElementById("yearFrom")
const yearToInput = document.getElementById("yearTo")
const yearRangeError = document.getElementById("yearRangeError")



// Helper to validate year range
function validateAndFetchYearRange(){
    const fromVal = yearFromInput.value.trim()
    const toVal = yearToInput.value.trim()

    yearRangeError.innerText = "" // reset error

    if(fromVal && isNaN(fromVal)){
        yearRangeError.innerText = "Enter a valid number for From Year"
        return false
    }
    if(toVal && isNaN(toVal)){
        yearRangeError.innerText = "Enter a valid number for To Year"
        return false
    }

    if(fromVal && toVal && parseInt(fromVal) > parseInt(toVal)){
        yearRangeError.innerText = "'From Year' cannot be greater than 'To Year'"
        return false
    }

    // Valid input, update queries
    yearFromQuery = fromVal
    yearToQuery = toVal
    currentPage = 1
    fetchMovies() // your existing function
    return true
}

// Trigger on blur
yearFromInput.addEventListener("blur", validateAndFetchYearRange)
yearToInput.addEventListener("blur", validateAndFetchYearRange)

// Trigger on Enter
yearFromInput.addEventListener("keypress", (e) => { if(e.key==="Enter"){ e.preventDefault(); validateAndFetchYearRange() }})
yearToInput.addEventListener("keypress", (e) => { if(e.key==="Enter"){ e.preventDefault(); validateAndFetchYearRange() }})
fetchMovies()
