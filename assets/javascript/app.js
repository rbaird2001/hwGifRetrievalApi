var queryUrl = "https://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=b1rMOopBhHEZCR3Thcpk9lhZzicm545Y&limit=5";
var responseDetail;
$.ajax({
    url: queryUrl,
    method: "GET"}).then(function(response){
    responseDetail = response
    console.log(responseDetail)});
