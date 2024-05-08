//making a call to localhost:3000/api/scrape/?productKey
async function callApi(productKey) {
    const data = await fetch(`http://localhost:3000/api/scrape/?productKey=${productKey}`, { method: 'GET' })
    const resp = await data.json();
    return [...resp]
}

function createThePageView(results) {
    main.innerHTML = '';
    results.forEach(result => {
        let item = document.createElement("div");
        item.className = "item";
        let image = document.createElement("img")
        let title = document.createElement("h2")
        let ratings = document.createElement("p")
        let views = document.createElement("p")

        //creating the elements
        image.src = result.imgURL;
        image.alt = "imagem do produto";
        title.textContent = result.productTitle;
        ratings.textContent = 'Ratings: ' + result.ratings;
        views.textContent = "Views: " + result.numberOfReviews
        //display the itens on the page.
        item.append(image);
        item.append(title);
        item.append(ratings);
        item.append(views);
        main.append(item);
    })
}

window.addEventListener("DOMContentLoaded", (event) => {
    let input = document.getElementById("search");
    let btn = document.getElementById("btn");
    let main = document.getElementById("main");
    let loadingMessage = document.createElement('h1');
    loadingMessage.className = "loading";
    loadingMessage.textContent = "LOADING...";
    if (btn != null) {
        //event listener on the button to start the scraping process
        btn.addEventListener("click", async (e) => {
            main.innerHTML = "";
            e.preventDefault();
            if (input.value == "") {
                main.textContent = "nenhum produto informado";
            } else {
                main.append(loadingMessage);

                let results = await callApi(input.value);
                if (results.length > 0) {
                    createThePageView(results)
                }

            }
        })
    }

});
