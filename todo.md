Okay... this might be kind of weird.  Create a viz showing the connection level of friends.

The basic idea behind this is: Friendship connections are like neural connections.  More frequent use creates stronger
bonds, while less frequent will weaken bonds, eventually falling apart.

This is obvious HUGELY simplistic, and ignores the fact that there are many types of friends, that there are just
some people you get along better with than others, that things like distance exist and screw with this stuff.

But also, FB is very much set up to make everything a forgettable stream of "now".  And very quietly trims away
friends that you don't interact with.  Which is bullshit.


Anyways:
===============
Connect via FB graph.  distance from top line of webpage is amount of time since last interaction.

Each person can be represented with their FB icon + name.  They can be randomized on the X axis, or some
subset of the X-axis (25% - 75% eg).  Should we have a max Y?  Then base distance on percentage of that max?
Or... we could just make it absolute... Y axis is kind of unlimited.


Obviously, FB is not the only way to interact, so there should be support to build off of whatever FB 
interactions exist.  Which means a DB layer as well that merges and/or updates with FB data.

There should be support to watch historically, because that would look really cool.  Seeing people moving.

Time unit should be per day?

If we even need to divide it in time units.  Maybe we can just stream it as events with exact times.  

Hmmm, depends on what the graph can support.

Very top can just be personal FB icon.  Then wireframe connectors to each friend icon.
  
  
Hoo boy, this sounds cool, but hard.  Perfect.

D3 then + FB graph in the background.  



Plan:
===============
-> get the most recent interaction per person.  Compare that vs most recent date.
-> fuck wait, no, it should be the number per time... a bunch of interactions should have a stronger effect
than just one more recent event.

-> with that perspective, we can run all sorts of interesting analytics on the data:
==> Can we identify someone that you used to have a large amount of interaction with, but have since not talked to
==> obviously here a big problem is the same problem FB has, myopia.  There are lots of reasons not to interact with
people (Eg, how about a fight?) 
==> also, FB interactions aren't always good, right? people get into FB fights all the time... and a large amount
of activity right before no activity at all, might mean a fight.


=> could build options into the DB layer to help mitigate that.

=> okay, so we should probably weight different interactions differently:
attended same event -> like -> comment -> message -> tagged in photo together?

=> can we take different cities into account?  should we?


Really need to change that name.  Ugh.



FUCKING FUCKER FUCK!!
===========

Okay, ALWAYS REMEMBER FACEBOOK IS THE WORST AND IS GOOD FOR ABSOLUTELY NOTHING.


So, apparently, you cannot even get someone's list of friends from an auth'd fb app.
In fact, you can't seem to get shit all from FB now.

What I can get:
=> user details from an id: photo, name.
=> that's about it.


Options here:
=> fuck facebook right in the fucking face.  totally disconnect from it, make this a roll your own thing.
=> this is a p.i.t.a. because all friend details will need to be user-supplied
=> do twitter instead, or instagram maybe.
=> go through gmail.  This has a lot of problems too.
=> somehow try and bruteforce/scrape friend ids from FB.  Pretty problamatic. 


Okay: May be able to do this using only the user_posts permission.  Still requires FB review, but we can
hopefully go through comments and likes.
"Provides access to the posts on a person's Timeline. Includes their own posts, posts they are tagged in, 
and posts other people make on their Timeline."

maybe also:
user_likes

Provides access to the list of all Facebook Pages and Open Graph objects that a person has liked. 
This list is available through the likes edge on the User object.

and

user_photos

Provides access to the photos a person has uploaded or been tagged in. This is available through the photos edge 
on the User object.

=====


Okay, so confirmed:
=======
AFAICT, I can go through a user's facebook post history which will include everything they've posted on their own
 wall, who has commented and liked it.  That stream will also return items other people have posted on their wall
 (which should get some sort of higher weighting), and of course what other people have written on there.
 
 It also looks like I can get everything (all graph objects) that our current user likes.
  
  Now, at this point, we might say: does the symmetry of a friendship matter?  Do they need to like my stuff as
  much as I like theirs?  If we give points to both likings though, this should just show up in the results
  anyways, as it will get double points.
  
  user photos, getting likes from ones you're tagged in is clearly a thing, as is getting comments.
  
  being tagged with someone in a photo should probably render the highest score.
  
  also, make all scores configurable, obviously.
  
  

Hmmmm
========
so, it takes forever to actually get this data... so, could make it run forwards and get data on the fly as it goes..
on each one, a few more points.... hmmmm...



Left to do:
========
- speed offset should be inversely affected by number of total likes.  (slows a frequent liker down)
- removed elements shouldn't use up resources...
- get stuff lazily/as we go rather than storing everything upfront
- actual support for someone else to log in
- fb review??
- fix the stop/start btn
- the acceleration function is over weigting older friends... acceleration factor increase should slowly decay over
time too.. not just like count and distance.




Plan for other users:
========
- loading screen only goes out and grabs all post IDs.

- sort chronologically, for each post ID, go out and grab post "like" information, for each like on that date, grab
  user information.
  
- can we buffer somehow?

- okay, so there isn't a post every day, but we shouldn't care if there's a post or not.. that service should just
 always be running in the bg.  On the server side?  use multiprocessing worker pools?
 --> 1 pool uses post information, grabs like data
 --> another pool grabs user info from like data
 --> a final pool stores that like data and name data in the db



