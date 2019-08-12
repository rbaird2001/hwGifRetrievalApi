
var qKey = "b1rMOopBhHEZCR3Thcpk9lhZzicm545Y";
var qLimit = 10;

//On load, determine window width to respond to resizing window.
var lastWidth = $(window).width();

//prepare default favorites and setup new favorites
var favs = ["Pizza", "Doughnuts", "Sushi", "Hamburgers", "Beer"];
loadFavs();
newFavorite();

//for mobile responsiveness and dynamic favorite list.
collapseSize();
$("#favToggle").click(collapseSize)

//loads the favories to the html called at various points in the app
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
    setGridRowForSizeBrkPt();
 
}

//setup ability for adding new favorites to button list
function newFavorite() {
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
        }
    })
}

//build the giphy API and search
function searchGiphy(qTerm) {
    let queryUrl = "https://api.giphy.com/v1/gifs/search?q=";
    queryUrl += qTerm;
    queryUrl += "&api_key=" + qKey;
    queryUrl += "&limit=" + qLimit;
    queryUrl += "&rating=pg";

//execute search and return results to html
//note that attrs use JSON type notation for all the attributes added.
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
            //let gifRating = $("<span>").html(resDat[i].rating);
            divCont.append(gifImage)
            divCont.append(divRating);
            divResults.append(divCont);
        }

    });
}

//app uses grid area templates. 
//Grid row must account for dynamic number favorites in list when in mobile size.
function setGridRowForSizeBrkPt() {
    let w = $(window).width();
    if (w < 500) {
        //designed so favorites are showing and you are increasing
        //your window size, don't collapse them. Otherwise collapse.
        // if (w > lastWidth && !$("#favToggle").hasClass("collapsed")) {
        //     lastWidth = w;
        //     return;
        // }
        $("#favToggle").addClass("collapsed").attr("aria-expanded", true);
        $(".favButton").removeClass("show");
       // $(".favButton").addClass("show");
        lastWidth = w;
        collapseSize();
    }
    //if not mobile sized, just go with static settings.
    else {
        $("#mainContainer").css("grid-template-rows", "80px 110px");
        $("#favToggle").removeClass("collapsed").attr("aria-expanded", true);
        $(".favButton").addClass("show");
        lastWidth = w;
    }
}

//calculate grid row sized based on buttons being collapsed or expanded.
function collapseSize() {
        if (!$("#favToggle").hasClass("collapsed")) {
            $("#mainContainer").css("grid-template-rows", "80px 110px 40px 1fr");
        }
        else {
            let gridRowSize = (favs.length * 34);
            $("#mainContainer").css("grid-template-rows", "80px 110px " + gridRowSize + "px 1fr");
        }
}
window.addEventListener("resize", setGridRowForSizeBrkPt);
