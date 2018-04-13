$(document).ready(function(){

  $("#streamListContainer").focus();

  var id = "";
  var channelArray = [];
  channelArray = ["freecodecamp", "esl_sc2", "OgamingSC2", "cretetion",
                  "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

  var offline = [];
  var online = [];
  var all = [];

  var i = "";

  for(i = 0; i < channelArray.length; i++){

    var channelURL = "https://wind-bow.glitch.me/twitch-api/channels/"
                      + channelArray[i] + "?callback=?"

    //get channel info
    $.getJSON(channelURL, function(info){

      var name = info.display_name;


      var streamURL = "https://wind-bow.glitch.me/twitch-api/streams/"+ name + "?callback=?"

      //get channel stream status
      $.getJSON(streamURL, function(response){

        //create channel div
        var channel = document.createElement("div");

        //create link anchor
        var link = document.createElement("a");
        link.setAttribute("href", info.url);
        link.setAttribute("class", "link")

        //create Channel Name div
        var name = document.createElement("h3");
        name.textContent = info.display_name;

        //create logo div
        var logo = document.createElement("div");
        logo.setAttribute("class", "logo");
        var image = "background-image: url(" + info.logo + ");"
        logo.setAttribute("style", image);

        //create status paragraph
        var status = document.createElement("p");

        //if not streaming
        if(response.stream == null){

          channel.setAttribute("id", info.display_name);
          channel.setAttribute("class", "channel offline")

          status.textContent = "STREAM: offline"

          link.appendChild(logo);
          link.appendChild(name);
          channel.appendChild(link);
          channel.appendChild(status);

          offline.push(channel);
          all.push(channel);
        }

        //else if streaming
        else{
          game = response.stream.channel.game + ": ";
          video = response.stream.channel.status;

          channel.setAttribute("id", info.display_name);
          channel.setAttribute("class", "channel online");

          status.textContent = "STREAM: " + game + video;

          link.appendChild(logo);
          link.appendChild(name);
          channel.appendChild(link);
          channel.appendChild(status);

          online.push(channel);
          all.push(channel);
        }


        var list = document.getElementById("streamListWrapper");
        list.appendChild(channel);

      });
    });

  }
    console.log(offline, online);

    var list = "";

    //show all streams
    $("#all").click(function(){
      console.log(all);

      $("#streamListWrapper").empty();

      for(i = 0; i < all.length; i++){
        list = document.getElementById("streamListWrapper");
        list.appendChild(all[i]);
      }
    });

    //show only online streams
    $("#online").click(function(){
      $("#streamListWrapper").empty();
      console.log(online);

      for(i = 0; i < online.length; i++){
        list = document.getElementById("streamListWrapper");
        list.appendChild(online[i]);
      }
    });

    //show only offline streams
    $("#offline").click(function(){
      $("#streamListWrapper").empty();
      console.log(offline)

      for(i = 0; i < offline.length; i++){
        list = document.getElementById("streamListWrapper");
        list.appendChild(offline[i]);
      }
    });
});
