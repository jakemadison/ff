/**
 * Created by Madison on 16-03-12.
 */


var animation_speed = 150;
var jiggle = 20;  // amt of randomness to add.
var jiggle_duration = 100;
var animating = false;
var advance_timer;

var margin = 100;
var screen_width = (window.innerWidth || window.clientWidth || window.clientWidth) - margin;
//var screen_height = (window.innerHeight|| window.clientHeight|| window.clientHeight) - margin;
var screen_height = 1000;

function reset_distance(arr, target_id, target_name, target_photo_id) {
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

        arr.push({
            'user_id': target_id, 'distance': 0,
            'user_name': target_name, 'like_count': 1,
            'target_photo_id': target_photo_id
        });

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
                        $.post('/save_name', {
                            name: response.name,
                            id: response.id, target_user_id: TARGET_USER_ID
                        }, function (resp) {
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
    var node = svg.selectAll("g.node")
        .data(likes);

    // for updates:
    //node.attr("class", "update");
    //.transition()
    //.duration(750)
    //.attr("x", function (d, i) {
    //    return i * 32;
    //});

    // on enter, add a new image thing...

    var node_enter = node.enter().append("g").attr("class", "node")
            .attr("transform", function (d) {

                var x_val = Math.random() * (screen_width - 100);
                d.x_val = x_val;

                var y_offset = Math.floor(Math.abs(Math.random() * 10));
                d.y_offset = y_offset;

                d.speed_offset = Math.floor(Math.abs(Math.random() * 8))+5;

                return "translate(" + x_val + "," + (0 + y_offset) + ")";
            })

        ;

    // add text to our object:
    var node_text = node_enter.append("text")
        .attr("class", "node_text")
        .attr("width", "20")
        .attr("height", "20");

    // add image to our object:
    var node_image = node_enter.append("image")
        .attr("class", "node_image")
        .attr("width", "100px")
        .attr("height", "100px")
        .style('opacity',1);  // .6


    node_enter.select(".node_image").attr("xlink:href", function (d) {

        return "https://graph.facebook.com/" + d.user_id + "/picture?type=large";

        //
        //if (d.target_photo_id) {
        //    return "static/img/"+d.target_photo_id;
        //}
        //else {
        //    return "static/img/default.gif";
        //}
    });

    // operate on the entire group object:
    node.transition()
        .duration(function (d) {
       //return animation_speed + (Math.random() * jiggle_duration)
        return animation_speed*2;

    })
        .attr("transform", function (d) {
            //d.y_cur = (d.distance + d.y_offset) * (d.speed_offset - (d.like_count/10 *.3));

            d.y_cur = (d.distance*5 + d.y_offset) * Math.floor(d.speed_offset);
            return "translate(" + d.x_val + "," + d.y_cur + ")";
        })
        .attr('opacity', function (d) {
            return .9 - (d.y_cur/1000);
        });

    //;
    //
    //
    //node.transition().duration(1000).ease('back')
    //    .attr('opacity', function (d) {
    //     return 1/d.distance;
    //    });

    node.select(".node_text").text(function (d) {
        return d.user_name + ': ' + d.like_count; // + ' (' + d.distance + ')';
    });




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
        var date_string = current_date.toString().substring(4);
            date_string = date_string.slice(0, -24);
        $('#date_label').text(date_string);

        var index_date = new Date(data[index].date);

        while (index_date <= current_date && index < data.length - 1) {

            active_data = reset_distance(active_data, data[index].user_id,
                data[index].name, data[index].target_photo_id);

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
    animating = true;

    console.log('done');

}


function get_data() {

    d3.json('/get_friend_data?target_user_id=' + TARGET_USER_ID, function (response) {
        console.log(response.data);
        start_animation(response.data)
    });

}


function toggle_animation() {

    if (animating) {
        window.clearInterval(advance_timer);
        animating = false;
        $('#ctrl_btn').text('START');
    } else {

        // oops, this needs start_animation vars to work properly...
        advance_timer = window.setInterval(advance_day, animation_speed);
        animating = true;
        $('#ctrl_btn').text('STOP');
    }


}
