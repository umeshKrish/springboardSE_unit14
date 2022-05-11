"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesList = $("#episodesList");
const TVMAZE_API_URL = "http://api.tvmaze.com/";
const MISSING_IMAGE_URL = "https://tinyurl.com/missing-tv";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  const res = await axios({
    url: `${TVMAZE_API_URL}search/shows?q=${term}`,
    method: "GET",
  });

  let shows = res.data;
  return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    let id = show.show.id;
    let name = show.show.name;
    let summary = show.show.summary;
    let image = show.show.image ? show.show.image.medium : MISSING_IMAGE_URL;
    const $show = $(
      `<div id="${id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${image}" 
              alt="${name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${name}</h5>
             <div><small>${summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const res = await axios({
    url: `${TVMAZE_API_URL}shows/${id}/episodes?specials=1`,
    method: "GET",
  });

  let episodes = res.data;
  return episodes;
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesList.empty();
  $episodesArea.show();
  for (let episode of episodes) {
    let name = episode.name;
    let number = episode.number;
    let season = episode.season;
    let episodeString = name + " (season " + season + ", episode " + number + ")";
    let listEntry = $("<li></li>").text(episodeString);
    $episodesList.append(listEntry);
    //alert(episodeString);
  }
}

//Handle click of episode button
$showsList.on("click", async function (event) {
  if ($(event.target).hasClass("btn btn-outline-light btn-sm Show-getEpisodes")) {
    let $showDiv = $(event.target).parent().parent().parent();
    let $showId = $showDiv.attr('id');
    let episodes = await getEpisodesOfShow($showId);
    populateEpisodes(episodes);
  }
});
