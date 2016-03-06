"""
Okay, so somehow I fucking finally got access to the friends list.  went through the graph API and added these to
get an access token:

user_relationships, user_likes, user_work_history, user_events, user_photos, user_friends, user_about_me,
user_tagged_places, user_actions.music, public_profile

But I can't seem to extend that token.
"""


__author__ = 'Madison'

from facebook import get_user_from_cookie, GraphAPI
from local_config import fb_config
from flask import request
from app import app, db
from models import User
from local_config import fb_config
import requests





def explore_api():

    access_token = fb_config['FB_TEST_TOKEN']

    graph = GraphAPI(access_token)
    profile = graph.get_object(id='10152972423651677')
    print profile

    friends = graph.get_connections(id='10152972423651678', connection_name='friends')
    print friends

    #
    # allfriends = []
    #
    # # Wrap this block in a while loop so we can keep paginating requests until
    # # finished.
    # while(True):
    #     try:
    #         for friend in friends['data']:
    #             allfriends.append({'name': friend['name'].encode('utf-8'), 'id': friend['id'].encode('utf-8')})
    #         # Attempt to make a request to the next page of data, if it exists.
    #         friends = requests.get(friends['paging']['next']).json()
    #         print friends
    #     except KeyError:
    #         # When there are no more pages (['paging']['next']), break from the
    #         # loop and end the script.
    #         print 'end'
    #         break
    # print allfriends
    #
    #
    #





if __name__ == '__main__':
    explore_api()







