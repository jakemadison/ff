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
import pickle


def connect_to_graph(access_token):
    graph = GraphAPI(access_token)
    return graph


def get_all_post_ids(graph):

    post_ids = []

    posts = graph.get_connections(id='me', connection_name='posts')

    while posts['data']:

        for post in posts['data']:
            post_ids.append(post['id'])

        if 'next' in posts['paging']:
            print 'paging...'
            posts = requests.get(posts['paging']['next']).json()

        else:
            print 'broke it'
            break

    return post_ids








def explore_api():

    # graph = connect_to_graph(access_token=fb_config['FB_TEST_TOKEN'])
    # all_post_ids = get_all_post_ids(graph)
    #
    # with open('temp_data.pickle', 'wb') as f:
    #     pickle.dump(all_post_ids, f)

    with open('temp_data.pickle') as f:
        all_post_ids = pickle.load(f)

    print all_post_ids


if __name__ == '__main__':
    explore_api()







