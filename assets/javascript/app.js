var qKey = "b1rMOopBhHEZCR3Thcpk9lhZzicm545Y";
var qLimit = 10;
var lastWidth = $(window).width();
var favs = ["Pizza", "Doughnuts", "Sushi", "Hamburgers", "Beer"];
loadFavs();
newFavorite();
collapseSize();
$("#favToggle").click(collapseSize)

function loadFavs(showVal) {
    for (i = 0; i < favs.length; i++) {
        let divFav = $("#favorites");
        let btnFav = $("<button>")
        btnFav.addClass("favButton collapse");
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
            loadFavs(showVal);
            $("#favName").val("")
        }
    })
}

function searchGiphy(qTerm) {
    let queryUrl = "https://api.giphy.com/v1/gifs/search?q=";
    queryUrl += qTerm;
    queryUrl += "&api_key=" + qKey;
    queryUrl += "&limit=" + qLimit;
    queryUrl += "&rating=pg";

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

function setGridRowForSizeBrkPt() {
    let w = $(window).width();
    if (w < 500) {
        if (w > lastWidth && !$("#favToggle").hasClass("collapsed")) {
            return;
        }
        $("#favToggle").addClass("collapsed").attr("aria-expanded", true);
        $(".favButton").removeClass("show");
        lastWidth = w;
        collapseSize();
    }
    else {
        $("#mainContainer").css("grid-template-rows", "80px 110px");
        $("#favToggle").removeClass("collapsed").attr("aria-expanded", true);
        $(".favButton").addClass("show");
    }
}

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
