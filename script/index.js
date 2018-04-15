$(document).ready(function(){

  $("#streamListContainer").focus();

  var id = "";

  var channelArray = [];

  //check for localStorage
  if(typeof(localStorage) !== "undefined"){
    //get stored channelArray if any exists
    channelArray = JSON.parse(localStorage.getItem("channelArray"));
    if(channelArray != null){
      channelArray = channelArray;
    }
    //use default channelArray
    else{
      channelArray = ["freecodecamp", "esl_sc2", "OgamingSC2", "cretetion",
                      "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    }
  }




  var offline = [];
  var online = [];
  var all = [];

  var i = "";

  loadChannels();

  function loadChannels(){

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
          link.setAttribute("target", "_blank");
          link.setAttribute("class", "link");


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

            status.textContent = "STREAM: Offline"

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
  }


    console.log(offline, online);

    var list = "";

    //show all streams
    $("#all").click(function(){
      console.log(all);

      $("#all").addClass("selected");
      $("#online").removeClass("selected");
      $("#offline").removeClass("selected");

      $("#streamListWrapper").empty();

      for(i = 0; i < all.length; i++){
        list = document.getElementById("streamListWrapper");
        list.appendChild(all[i]);
      }
    });

    //show only online streams
    $("#online").click(function(){

      $("#all").removeClass("selected");
      $("#online").addClass("selected");
      $("#offline").removeClass("selected");

      $("#streamListWrapper").empty();
      console.log(online);

      for(i = 0; i < online.length; i++){
        list = document.getElementById("streamListWrapper");
        list.appendChild(online[i]);
      }
    });

    //show only offline streams
    $("#offline").click(function(){
      $("#all").removeClass("selected");
      $("#online").removeClass("selected");
      $("#offline").addClass("selected");

      $("#streamListWrapper").empty();
      console.log(offline)

      for(i = 0; i < offline.length; i++){
        list = document.getElementById("streamListWrapper");
        list.appendChild(offline[i]);
      }
    });

/********add channel function********************/
    //add channel form animation
    var addChannelTl = new TimelineLite({paused: true});

        addChannelTl.set($("#addChannelForm"), {css:{zIndex: 3}});

        if(window.innerWidth > window.innerHeight){
          addChannelTl.add(TweenLite.to("#addChannelForm", 0.2, {width: "85vw"}));
          addChannelTl.add(TweenLite.to("#formInput", 0.2, {opacity: 1, width: "60vw"}));
        }
        if(window.innerHeight > window.innerWidth){
          addChannelTl.add(TweenLite.to("#addChannelForm", 0.2, {width: "85vw"}));
          addChannelTl.add(TweenLite.to("#formInput", 0.2, {opacity: 1, width: "60vw"}));
        }

        addChannelTl.add(TweenLite.from("#addStream", 0.2, {opacity: 0, width: 0}));
        addChannelTl.add(TweenLite.from("#addButton", 0.2, {opacity: 0, width: 0}), "-=0.2");
        addChannelTl.add(TweenLite.from("#notValidAlert", 0.1, {width: 0}));

    $("#plusButton").click(function(){
      addChannelTl.play();
      $("#formClose").attr("style", "opacity: 1; transition: 0.5s;");
    });

    $("#formClose").click(function(){
      addChannelTl.reverse();
      $("#formClose").attr("style", "opacity: 0;");
    })


    $("#addButton").click(function(){

      var input = document.getElementById("formInput").value;

      var channelURL = "https://wind-bow.glitch.me/twitch-api/channels/"
                        + input + "?callback=?"

      $.getJSON(channelURL, function(result){
        if(result.error){
          //show alert
          $("#notValidAlert").attr("style", "opacity: 1");
        }
        else{
          //close form
          addChannelTl.reverse();
          //hide alert
          $("#notValidAlert").attr("style", "opacity: 0");
          $("#formClose").attr("style", "opacity: 0;");
          $("#formInput").val("");


          //check if channel is already in channelArray
          //add channel if it's not already in channelArray
          if(channelArray.includes(input) == false){
            channelArray.unshift(input);
            console.log(channelArray);
            $("#streamListWrapper").empty();

            //store channelArray in localStorage
            localStorage.setItem("channelArray", JSON.stringify(channelArray));
            //localStorage.setItem("channelArray", channelArray);
            loadChannels();
          }

        }

      });

/*************************************************************************/
    });

});
