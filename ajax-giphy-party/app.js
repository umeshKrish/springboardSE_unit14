const $gifs = $("#gifs");
const $searchInput = $("#search-term");

function addGif(res) {
    let numResults = res.data.length;

    //Choose a search result at random and append it to the DOM
    let randomIdx = Math.floor(Math.random() * numResults);
    let $newDiv = $("<div>", { class: "col-md-4 col-12 mb-4" });
    let $newGif = $("<img>", {
        src: res.data[randomIdx].images.original.url,
        class: "w-100"
    });
    $newDiv.append($newGif);
    $gifs.append($newDiv);
}

$("form").on("submit", async function (evt) {
    evt.preventDefault();

    let searchTerm = $searchInput.val();
    $searchInput.val("");

    //Plug the search term into the AJAX request URL
    const response = await axios.get("http://api.giphy.com/v1/gifs/search", {
        params: {
            q: searchTerm,
            api_key: "MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym"
        }
    });
    addGif(response.data);
});

$("body").on("click", function(event) {
    if ($(event.target).hasClass("remove")) {
        $gifs.empty();
    }
  });