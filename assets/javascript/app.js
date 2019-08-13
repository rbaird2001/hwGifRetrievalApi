
//api query parameters
var qKey = "b1rMOopBhHEZCR3Thcpk9lhZzicm545Y";
var qLimit = 10;


//prepare and load default favorites
var favs = ["Pizza", "Doughnuts", "Sushi", "Hamburgers", "Beer"];
loadFavs();
setFavDispBehavior();

//adjust favs display area based on collapsed or not.
$("#favToggle").click(function () {
    if ($("#favToggle").hasClass("collapsed")) {
        collapseSize("expand");
        $("#favToggle").text("Hide Favorites");
    }
    else {
        collapseSize("collapse");
        $("#favToggle").text("Show Favorites");
    }
})

//Add new favorites and display all favs if collapsed.
$("#addFav").click(function () {
    let favName = $("#favName").val().trim();
    if (!favName) {
        alert("Specify your favorite first");
        return false;
    }
    else {
        let showVal = "show"
        favs.push(favName);
        $("#favorites").empty();
        $("#favName").val("")
        loadFavs(showVal);
        collapseSize("expand")
        $("#favToggle").removeClass("collapsed").attr("aria-expanded", true).text("Hide Favorites");
    }
})

//loads the list of favories to the html. 
//runs at windows load and called when new favorite added.
function loadFavs(showVal) {
    for (i = 0; i < favs.length; i++) {
        let divFav = $("#favorites");
        let btnFav = $("<button>")
        btnFav.addClass("favButton collapse");
        btnFav.addClass(showVal);
        btnFav.attr("val", favs[i].toLowerCase());
        btnFav.html(favs[i]);
        btnFav.click(function () {
            searchFav = $(this)
            searchGiphy(searchFav.attr("val"));
        })
        divFav.append(btnFav);
    }
}

//build the giphy API and search
function searchGiphy(qTerm) {
    let queryUrl = "https://api.giphy.com/v1/gifs/search?q=";
    queryUrl += qTerm;
    queryUrl += "&api_key=" + qKey;
    queryUrl += "&limit=" + qLimit;
    queryUrl += "&rating=pg";

    //execute search and return results to html
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        var resDat = response.data
        var divResults = $("#results")
        divResults.empty();
        for (i = 0; i < resDat.length; i++) {
            let divCont = $("<div>").addClass("container imgCont")
            let divRating = $("<div>").addClass("imgCaption").text(resDat[i].rating)
            let gifImage = $("<img>")
            gifImage.attr({
                "src": resDat[i].images.fixed_height_still.url,
                "data-state": "still",
                "data-still": resDat[i].images.fixed_height_still.url,
                "data-move": resDat[i].images.fixed_height.url
            }).click(function () {
                clik = $(this)
                if (clik.attr("data-state") === "still") {
                    clik.attr("src", clik.attr("data-move"));
                    clik.attr("data-state", "move");
                }
                else {
                    clik.attr("src", clik.attr("data-still"));
                    clik.attr("data-state", "still");
                }
            });
            divCont.append(gifImage)
            divCont.append(divRating);
            divResults.append(divCont);
        }
    });
}

//The following three functions determine sizing and favorites display based on window size.

//Window size at load will determine setting of the favorites toggle. 
function setFavDispBehavior() {
    let w = $(window).width();
    //if mobile, collapse favorites when loaded.
    if (w < 500) {
        $("#favToggle").addClass("collapsed").attr("aria-expanded", false);
        collapseSize("collapse");
    }
    //if not mobile sized, display favorites automatically
    else {
        $("#favToggle").removeClass("collapsed").attr("aria-expanded", true);
        $(".favButton").addClass("show");
        collapseSize("expand")
    }
}

//calculate grid row sized based on favorites being collapsed or expanded.
function collapseSize(action) {
    if (action === "collapse") {
        $("#mainContainer").css("grid-template-rows", "80px 110px 40px 1fr");
    }
    else if (action === "expand") {
        let gridRowSize = (favs.length * 34);
        $("#mainContainer").css("grid-template-rows", "80px 110px " + gridRowSize + "px 1fr");
    }
}

//if window size is altered after loading, this will adjust display of favorites. 
window.addEventListener("resize", function () {
    let w = $(window).width();
    if (w < 500) {
        $(".favButton").removeClass("show");   
    }
    else {
        $(".favButton").addClass("show");
    }
    setFavDispBehavior();
});
