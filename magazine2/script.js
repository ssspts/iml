const API_KEY = "pub_43d82f7874b149b5831109b9c8bb6eaa";

let nextPageToken = null;
let loading = false;

// Load news
async function loadNews(token = null) {
    if (loading) return;
    loading = true;

    showLoader();

    try {
        let url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=movies`;

        if (token) {
            url += `&page=${token}`; // ✅ correct pagination
        }

        const res = await fetch(url);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            hideLoader();
            return;
        }

        nextPageToken = data.nextPage || null;

        renderFeed(data.results);

    } catch (err) {
        console.error("Error fetching news:", err);
    } finally {
        loading = false;
        hideLoader();
    }
}

// Render feed (APPEND, not replace)
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

// Infinite scroll (uses nextPageToken)
window.addEventListener("scroll", () => {
    if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
    ) {
        if (nextPageToken) {
            loadNews(nextPageToken); // ✅ correct
        }
    }
});

// Loader
function showLoader() {
    document.getElementById("loader").style.display = "block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

// Initial load
loadNews();