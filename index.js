$(document).ready(function(){

  var channelArray = [];

  var i = "";

  channelArray = ["freecodecamp", "esl_sc2"];

  for(i = 0; i < channelArray.length; i++){
    //get channel info
    var status = "";
    var streamName = "";
    var logoURL = "";
    var linkURL = "";
    var game = "";
    var video = "";
    var channel = "";
    var channelName = "";
    var link = "";
    var logo = "";
    var image = "";
    var stream = "";

    var name = channelArray[i];

    var streamURL = "https://wind-bow.glitch.me/twitch-api/streams/"+ channelArray[i] + "?callback=?"
    console.log(streamURL);
    //get channel info
    $.getJSON("https://wind-bow.glitch.me/twitch-api/channels/" + channelArray[i] + "?callback=?"
              , function(info){
                streamName = info.display_name;
                //console.log(streamName);
                logoURL = info.logo;
                //console.log(logoURL);
                linkURL = info.url;
                //console.log(linkURL);

                //create channel div
                channel = document.createElement("div");
                channel.setAttribute("class", "channel");
                channel.setAttribute("id", streamName);

                //add channel to wrapper
                streamListWrapper.appendChild(channel);

                //create link
                link = document.createElement("a");
                link.setAttribute("class", "link");
                link.setAttribute("href", linkURL);

                //create logo div
                logo = document.createElement("div");
                logo.setAttribute("class", "logo");

                image = "background-image: url(" + logoURL + ")"

                logo.setAttribute("style", image);

                //channel name
                channelName = document.createElement("h3");
                channelName.textContent = streamName;
                //add logo and channel name
                link.appendChild(logo);
                link.appendChild(channelName);

                //add link to channel
                channel = document.getElementById(streamName);
                channel.appendChild(link);
              });

    //add stream status to channel
    $.getJSON(streamURL, function(response){

      stream = document.createElement("p");


      if(response.stream == null){
        console.log("offline");
        stream.textContent = "stream: offline";

        channel = document.getElementById(streamName);
        channel.appendChild(stream);

      }
      else{
        console.log(response.stream);
        game = response.stream.channel.game + ": ";
        video = response.stream.channel.status;

        stream.textContent = "stream: " + game + video;

        channel = document.getElementById(streamName);
        channel.appendChild(stream);

      }

    });

  }


});
