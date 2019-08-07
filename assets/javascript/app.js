var qKey = "b1rMOopBhHEZCR3Thcpk9lhZzicm545Y";
var qLimit = 10;
var favs = ["Pizza", "Doughnuts", "Sushi", "Hamburgers", "Beer"];
loadFavs();
newFavorite();  

function loadFavs() {
    for (i = 0; i < favs.length; i++) {
        let divFav = $("#favorites");
        let btnFav = $("<button>");
        btnFav.attr("val", favs[i].toLowerCase());
        btnFav.html(favs[i]);
        btnFav.click(function () {
            searchFav = $(this)
            searchGiphy(searchFav.attr("val"));
        })
        divFav.append(btnFav);
    }
}

function newFavorite() {
    $("#addFav").click(function () {
    let favName = $("#favName").val().trim();
        if (!favName) {
            alert("Specify your favorite first");
            return false;
        }
        else {
            favs.push(favName);
            $("#favorites").empty();
            loadFavs();
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
        var resDet = response.data
        var divResponse = $("#results")
        divResponse.empty();
        for (i = 0; i < resDet.length; i++) {
            let gifImage = $("<img>")
            gifImage.attr({
                "src": resDet[i].images.fixed_height_still.url,
                "data-state": "still",
                "data-still": resDet[i].images.fixed_height_still.url,
                "data-move": resDet[i].images.fixed_height.url
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
            let gifRating = $("<p>").html(resDet[i].rating);
            divResponse.append(gifRating);
            divResponse.append(gifImage);
        }

    });
}

