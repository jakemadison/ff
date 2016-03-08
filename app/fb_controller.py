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

    profile = graph.get_object(id='me')
    print profile

    friends = graph.get_connections(id='me', connection_name='posts')
    for post in friends['data']:
        print post
        print '====='
        print

    comments = graph.get_connections(id='10154560562405931_10154527868385931', connection_name='likes')

    for comment in comments['data']:
        print comment






if __name__ == '__main__':
    explore_api()







