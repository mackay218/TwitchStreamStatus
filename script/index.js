$(document).ready(function(){

  $("#streamListContainer").focus();

  var id = "";

  var channelArray = [];

  //check for localStorage
  if(typeof(localStorage) !== "undefined"){

    //set up channelArray
    //get stored channelArray if any exists
    channelArray = JSON.parse(localStorage.getItem("channelArray"));

    if(channelArray == null){
      //use default channelArray
      channelArray = ["freecodecamp", "esl_sc2", "ogamingsc2", "cretetion",
                      "storbeck", "habathcx", "robotcaleb", "noobs2ninjas"];
      //store channelArray in localStorage
      localStorage.setItem("channelArray", JSON.stringify(channelArray));
    }
    else if(channelArray != null){
      //check if array is empty
      if(channelArray.length == false){
        //use default channelArray
        channelArray = ["freecodecamp", "esl_sc2", "ogamingsc2", "cretetion",
                        "storbeck", "habathcx", "robotcaleb", "noobs2ninjas"];
        //store channelArray in localStorage
        localStorage.setItem("channelArray", JSON.stringify(channelArray));
      }
      else{
        //use array from local storage
        channelArray = channelArray;
      }
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

          //create remove button
          var x = document.createElement("span");
          x.setAttribute("class", "fas fa-plus x");

          var removeBtn = document.createElement("div");
          removeBtn.setAttribute("class", "removeBtn hideRemoveBtn");

          removeBtn.appendChild(x);

          //if not streaming
          if(response.stream == null){

            channel.setAttribute("id", (info.display_name).toLowerCase());
            channel.setAttribute("class", "channel offline")

            status.textContent = "STREAM: Offline"

            link.appendChild(logo);
            link.appendChild(name);
            channel.appendChild(link);
            channel.appendChild(status);
            channel.appendChild(removeBtn);
            offline.push(channel);

            all.push(channel);
          }

          //else if streaming
          else{
            game = response.stream.channel.game + ": ";
            video = response.stream.channel.status;
            if(video.length > 60){
              video = video.slice(0, 59) + "...";
            }

            channel.setAttribute("id", (info.display_name).toLowerCase());
            channel.setAttribute("class", "channel online");

            status.textContent = "STREAM: " + game + video;

            link.appendChild(logo);
            link.appendChild(name);
            channel.appendChild(link);
            channel.appendChild(status);
            channel.appendChild(removeBtn);
            online.push(channel);
            all.push(channel);
          }

          var list = document.getElementById("streamListWrapper");
          list.appendChild(channel);

        });
      });
    }
  }

    var list = "";

    //show all streams
    $("#all").click(function(){
      console.log(all);

      $("#all").addClass("selected");
      $("#online").removeClass("selected");
      $("#offline").removeClass("selected");

      $(".channel").show();
    });

    //show only online streams
    $("#online").click(function(){

      $("#all").removeClass("selected");
      $("#online").addClass("selected");
      $("#offline").removeClass("selected");


      console.log(online);
      $(".online").show();
      $(".offline").hide();

    });

    //show only offline streams
    $("#offline").click(function(){
      $("#all").removeClass("selected");
      $("#online").removeClass("selected");
      $("#offline").addClass("selected");


      console.log(offline)
      $(".online").hide();
      $(".offline").show();

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
        addChannelTl.add(TweenLite.to("#plusButton", 0.2, {rotation: 45}), "-=0.9");

        addChannelTl.reversed(true);

      //open add channel form
      $("#plusButton").click(function(){
        removeTl.reverse();

        addChannelTl.reversed() ? addChannelTl.play() : addChannelTl.reverse();

      });

      //add channel function
      $("#addButton").click(function(){

        var input = (document.getElementById("formInput").value).toLowerCase();

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
              loadChannels();
            }
          }
        });
      });
      $("#formInput").keypress(function(event){
        if(event.which == 13){
          var input = (document.getElementById("formInput").value).toLowerCase();

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
                loadChannels();
              }
            }
          });
        }
      });
/*************************************************************************/

/*********remove channel function******************/

    var removeTl = new TimelineLite({paused: true});

      removeTl.add(TweenLite.to("#minusButton", 0.2, {rotation: 45}));

      removeTl.reversed(true);

      var minusBtnCounter = 1;

    $("#minusButton").click(function(){
      addChannelTl.reverse();

      $("#minus").toggleClass("fa-minus");
      $("#minus").toggleClass("fa-plus");
      //show removeBtn
      $(".removeBtn").toggleClass("hideRemoveBtn");
      $(".removeBtn").toggleClass("showRemoveBtn");

      if(minusBtnCounter % 2 == 1){
        //add shake animation
        $(".channel:nth-child(odd)").toggleClass("shake");
        $(".channel:nth-child(even)").toggleClass("shake2");
      }
      else if(minusBtnCounter % 2 == 0){
        $(".channel").removeClass("shake");
        $(".channel").removeClass("shake2");
      }

      minusBtnCounter += 1;
      //toggle remove function
      removeTl.reversed() ? removeTl.play() : removeTl.reverse();

      //remove channel
      $(".removeBtn").click(function(){
        //get correct channel to remove
        parentChannel = this.parentNode;
        channelID = this.parentNode.id;

        parentChannel.remove();

        //get stored channelArray
        channelArray = JSON.parse(localStorage.getItem("channelArray"));

        var placeHolderArray = [];

        for(i = 0; i < channelArray.length; i++){
          var c = channelArray[i];
          if(c != channelID){
            placeHolderArray.push(c);
          }
        }
        channelArray = placeHolderArray;

        //store channelArray in localStorage
        localStorage.setItem("channelArray", JSON.stringify(channelArray));

        //get stored channelArray
        channelArray = JSON.parse(localStorage.getItem("channelArray"));

      });
    });
});
