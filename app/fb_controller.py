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
import operator
from models import Like_History
from sqlalchemy import desc, asc


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



def get_all_comments_likes_per_post(graph, post_id, current_results):

    post = graph.get_object(id=post_id)
    print post['created_time']

    # comments = graph.get_connections(id=post_id, connection_name='comments')
    likes = graph.get_connections(id=post_id, connection_name='likes')  # does not get the new reactions??

    # print 'comments:\n', comments
    # print 'likes:\n', likes

    for each_like in likes['data']:
        print each_like
        print '.',
        # like_data = graph.get_object(id=each_like['id'])

        # if like_data['name'] not in current_results:
        #     current_results[like_data['name']] = 0

        # current_results[like_data['name']] += 1

        like_record = Like_History(name='name later', date=post['created_time'], user_id=each_like['id'])
        db.session.add(like_record)
        db.session.commit()

    print

    sorted_map = sorted(current_results.items(), key=operator.itemgetter(1))

    for each_count in sorted_map:
        print each_count

    return current_results




def get_friend_data(target_user_id):

    friends = Like_History.query.order_by(asc(Like_History.date))
    friends = friends.filter(Like_History.date >= '2010-01-01')
    friends = friends.filter(Like_History.target_user_id == target_user_id)
    friends = friends.all()

    friend_data = []

    for friend in friends:
        friend_data.append({'user_id': friend.user_id, 'date': friend.date, 'name': friend.name})

    return friend_data




def save_name_to_db(u_id, name, target_user_id):

    found = db.session.query(Like_History).filter(Like_History.user_id == int(u_id))
    found = found.filter(Like_History.target_user_id == target_user_id)

    print '------>', found.all()
    found.update({'name': name})

    db.session.commit()







def explore_api():

    graph = connect_to_graph(access_token=fb_config['FB_TEST_TOKEN'])
    # all_post_ids = get_all_post_ids(graph)
    #
    # with open('temp_data.pickle', 'wb') as f:
    #     pickle.dump(all_post_ids, f)

    # with open('temp_data.pickle') as f:
    #     all_post_ids = pickle.load(f)

    # current_results = {}

    # for each_post_id in all_post_ids:
    #     current_results = get_all_comments_likes_per_post(graph, each_post_id, current_results)
        # break


    friends = Like_History.query.all()

    for each_friend in friends:
        print graph.get_connections(id=str(each_friend.user_id), connection_name='public_profile')
        break




if __name__ == '__main__':
    # explore_api()
    get_friend_data()







