
__author__ = 'Madison'

from facebook import get_user_from_cookie, GraphAPI
from local_config import fb_config
from flask import request
from app import app, db
from models import User
from local_config import fb_config


def explore_api():

    access_token = fb_config['FB_TEST_TOKEN']

    graph = GraphAPI(access_token)
    profile = graph.get_object(id='me')
    print profile

    friends = graph.get_connections(id='me', connection_name='comments')
    print friends









if __name__ == '__main__':
    explore_api()







