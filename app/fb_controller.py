
__author__ = 'Madison'

from facebook import get_user_from_cookie, GraphAPI
from local_config import fb_config
from flask import request
from app import app, db
from models import User



def explore_api():

    result = User.query.filter(User.id == '10154560562405931').first()

    if result:
        graph = GraphAPI(result.access_token)
        profile = graph.get_object('me')
        print profile








if __name__ == '__main__':
    explore_api()







