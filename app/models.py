from datetime import datetime

from app import db


class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'useexisting': True}

    id = db.Column(db.String, nullable=False, primary_key=True)
    created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated = db.Column(db.DateTime, default=datetime.utcnow, nullable=False,
                        onupdate=datetime.utcnow)
    name = db.Column(db.String, nullable=False)
    profile_url = db.Column(db.String, nullable=False)
    access_token = db.Column(db.String, nullable=False)



class Like_History(db.Model):
    __tablename__ = 'like_history'
    __table_args__ = {'useexisting': True}

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    name = db.Column(db.String, nullable=False)
    date = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer)
    target_user_id = db.Column(db.Integer)
