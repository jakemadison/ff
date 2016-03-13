/**
 * Created by Madison on 16-03-12.
 */


var animation_speed = 700;
var jiggle = 50;  // amt of randomness to add.

var advance_timer;

var margin = 100;
var screen_width = (window.innerWidth || window.clientWidth || window.clientWidth) - margin;
//var screen_height = (window.innerHeight|| window.clientHeight|| window.clientHeight) - margin;
var screen_height = 10000;

function reset_distance(arr, target_id, target_name) {
    /*
     Called to reset distance of person.  Add that person if they don't exist yet.
     */

    var found = false;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].user_id === target_id) {
            arr[i].distance = 0;
            arr[i].like_count++;
            found = true;
        }
    }

    if (!found) {

        arr.push({'user_id': target_id, 'distance': 0, 'user_name': target_name, 'like_count': 1});

        if (target_name === '?') {
            FB.api(
                "/" + target_id,
                function (response) {
                    if (response && !response.error) {
                        /* handle the result */
                        console.log('-------->', response);

                        // find the entry in our data and update the name:
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].user_id.toString() === response.id) {
                                arr[i].user_name = response.name;
                            }
                        }

                        // might as well send to DB as well:
                        $.post('/save_name', {name: response.name, id: response.id}, function (resp) {
                            console.log('saved.', resp);
                        })
                    } else {
                        console.log(response);
                    }
                }

            );
        }


    }

    return arr;

}

function update_data(likes, svg) {

    // get the user profile from fb... then make an element with it, then do something...
    // crap, we have to update....
    console.log('updating....', svg);

    // get the current imgs + join any new data:
    var imgs = svg.selectAll("text")
        .data(likes);

    // for updates:
    imgs.attr("class", "update");
    //.transition()
    //.duration(750)
    //.attr("x", function (d, i) {
    //    return i * 32;
    //});

    // on enter, add a new image thing...
    imgs.enter()
        .append("text")
        .attr("class", "enter")
        //.attr("xlink:href", "file://Users/Madison/Development/friend_browser/app/static/img/crazy_128.png")
        //.attr("x", "60")
        .attr("x", function (d, i) {
            return Math.random() * (screen_width - 100);
        })
        .attr("y", 0)
        //.attr("y", function(d, i) { console.log('yep'); return i * 32; })
        .attr("width", "20")
        .attr("height", "20");


    imgs.text(function (d) {

        var display_name = "";

        if (d.user_name !== '?') {
            display_name = d.user_name;
        }
        else {
            display_name = d.user_id;
        }

        return display_name + '   -> ' + d.like_count + ' ('+ d.distance + ')';
    });

    imgs.transition().duration(animation_speed + (Math.random() * jiggle)).attr("y", function (d, i) {
        return (d.distance + 1) * 32 + (Math.random() * jiggle);
    });

    console.log('updating....', imgs);

}


function start_animation(data) {

    console.log('starting animation.....');

    var svg = d3.select("body").append("svg")
        .attr("width", screen_width)
        .attr("height", screen_height)
        .append("g");
    //.attr("transform", "translate(32," + (height / 2) + ")");

    // this should actually just get each day, and run on a timer....
    // okay, get data, min date... start with min data and step through each data adding new elements by date

    var current_date = new Date(data[0].date);
    var today = new Date();

    var index = 0;

    // replace this with a "distance counter" that increases every day:
    var active_data = [];


    function advance_day() {
        $('#date_label').text(current_date);

        var index_date = new Date(data[index].date);

        while (index_date <= current_date && index < data.length - 1) {

            active_data = reset_distance(active_data, data[index].user_id, data[index].name);
            update_data(active_data, svg);

            index++;
            index_date = new Date(data[index].date);
        }


        // advance the distance by 1
        for (var i = 0; i < active_data.length; i++) {
            active_data[i].distance++;
        }

        update_data(active_data, svg);

        current_date.setDate(current_date.getDate() + 1);
    }


    advance_timer = window.setInterval(advance_day, animation_speed);

    console.log('done');

}


function get_data() {

    d3.json('/get_friend_data', function (response) {
        console.log(response.data);
        start_animation(response.data)
    });

}



