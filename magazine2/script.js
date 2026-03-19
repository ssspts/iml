const API_KEY = "pub_43d82f7874b149b5831109b9c8bb6eaa";

let nextPageToken = null;
let loading = false;
let currentLanguage = ""; // default
// 🎯 SINGLE SOURCE OF TRUTH
let currentQuery = "movies"; // default

// Filters config
const filters = [
    { label: "🎬 Movies", value: "movies" },
    { label: "⭐ Celebrities", value: "celebrity actor actress" },
    { label: "🎥 Trailers", value: "movie trailers teasers" },
    { label: "🍿 Reviews", value: "movie review" },
    { label: "🇮🇳 Bollywood", value: "bollywood hindi movie" },
    { label: "🌍 Hollywood", value: "hollywood movie" },
    { label: "💥 Box Office", value: "box office collection" },
    { label: "📺 OTT", value: "netflix amazon prime hotstar" }
];

// Render filters
function renderFilters() {
    const container = document.getElementById("filters");

    filters.forEach((f, index) => {
        const btn = document.createElement("button");
        btn.innerText = f.label;

        if (index === 0) btn.classList.add("active");

        btn.onclick = () => changeFilter(f.value, btn);

        container.appendChild(btn);
    });
}

// 🔁 FILTER CLICK
function changeFilter(filter, btn) {
    currentQuery = filter;

    // ✅ RESET LANGUAGE TO ALL
    currentLanguage = "";
    document.getElementById("languageSelect").value = "";

    // sync search box
    document.getElementById("searchInput").value = filter;

    resetFeed();

    document.querySelectorAll(".filters button")
        .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    loadNews();
}

// 🔁 SEARCH
function searchNews() {
    const input = document.getElementById("searchInput").value.trim();

    if (!input) return;

    currentQuery = input;

    // remove active filter highlight
    document.querySelectorAll(".filters button")
        .forEach(b => b.classList.remove("active"));

    resetFeed();
    loadNews();
}

// 🔁 RESET
function resetFeed() {
    nextPageToken = null;
    document.getElementById("feed").innerHTML = "";
}

// 🔁 LOAD NEWS
async function loadNews(token = null) {
    if (loading) return;

    loading = true;
    showLoader();

    try {
        let url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=${currentQuery}`;
        if (currentLanguage) {
            url += `&language=${currentLanguage}`;
        }
        if (token) {
            url += `&page=${token}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (!data.results) return;

        nextPageToken = data.nextPage || null;

        renderFeed(data.results);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        loading = false;
        hideLoader();
    }
}

// 🔁 RENDER
function renderFeed(articles) {
    const container = document.getElementById("feed");

    articles.forEach(item => {
        const card = document.createElement("div");
        card.className = "feed-card";

        card.innerHTML = `
            ${item.image_url ? `<img src="${item.image_url}" />` : ""}
            <div class="feed-content">
                <div class="feed-title">${item.title}</div>
                <div class="feed-desc">
                    ${item.description ? item.description.substring(0, 120) + '...' : ''}
                </div>
                <div class="feed-date">
                    ${item.pubDate ? new Date(item.pubDate).toLocaleString() : ''}
                </div>
                <a href="${item.link}" target="_blank">Read more</a>
            </div>
        `;

        container.appendChild(card);
    });
}

// 🔁 INFINITE SCROLL
window.addEventListener("scroll", () => {
    if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
    ) {
        if (nextPageToken) {
            loadNews(nextPageToken);
        }
    }
});

// 🔁 ENTER KEY
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchInput")
        .addEventListener("keypress", function(e) {
            if (e.key === "Enter") searchNews();
        });
});

// Loader
function showLoader() {
    document.getElementById("loader").style.display = "block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}
function changeLanguage() {
    const lang = document.getElementById("languageSelect").value;

    currentLanguage = lang;

    resetFeed();
    loadNews();
}
// INIT
renderFilters();
loadNews();