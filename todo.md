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







