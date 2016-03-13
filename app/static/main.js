/**
 * Created by Madison on 16-03-12.
 */



function reset_distance(arr, target_id) {
    /*
     Called to reset distance of person.  Add that person if they don't exist yet.
     */

    var found = false;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].user_id === target_id) {
            arr[i].distance = 0;
            found = true;
        }
    }

    if (!found) {
        arr.push({'user_id': target_id, 'distance': 0});
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
            return Math.random() * (960 - 0) + 0;
        })
        .attr("y", 0)
        //.attr("y", function(d, i) { console.log('yep'); return i * 32; })
        .attr("width", "20")
        .attr("height", "20");


    imgs.text(function (d) {
        return d.user_id + '   -> ' + d.distance;
    });

    imgs.transition().duration(750).attr("y", function (d, i) {
        return (d.distance + 1) * 32;
    });

    console.log('updating....', imgs);

}


function start_animation(data) {
    console.log('starting animation.....');

    var width = 960,
        height = 10000;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
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

            active_data = reset_distance(active_data, data[index].user_id);
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


    window.setInterval(advance_day, 200);


    //while (current_date < today) {
    //
    //    current_date.setDate(current_date.getDate() + 1);
    //
    //    $('#date_label').text(current_date);
    //    var index_date = new Date(data[index].date);
    //
    //    while (index_date <= current_date && index < data.length - 1) {
    //        //console.log('==========>', data[index].date);
    //        active_data = reset_distance(active_data, data[index].user_id);
    //        update_data(active_data, svg);
    //
    //        index++;
    //        index_date = new Date(data[index].date);
    //
    //    }
    //
    //    // every day, distance should increase by 1..
    //    for (var i = 0; i < active_data.length; i++) {
    //        active_data[i].distance++;
    //    }
    //
    //    update_data(active_data, svg);
    //
    //
    //    if (index > 5) {
    //        break;
    //    }
    //
    //}


    console.log('done');

}


function get_data() {

    d3.json('/get_friend_data', function (response) {
        console.log(response.data);
        start_animation(response.data)
    });

}



