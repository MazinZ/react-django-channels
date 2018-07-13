from django.conf import settings
from channels.generic.websocket import JsonWebsocketConsumer
 
from tweepy import OAuthHandler, Stream
from tweepy.streaming import StreamListener
from tweepy import API as tweepyAPI
from .listeners import TwitterListener
from asgiref.sync import async_to_sync

class TwitterConsumer(JsonWebsocketConsumer):

  def connect(self):
    self.accept()
    self.rooms = set()

  def disconnect(self, code):
    if self.stream:
      self.stream.disconnect()
    for room_id in list(self.rooms):
      self.leave_room(room_id)

  def leave_room(self, room):
    self.rooms.discard(room)
    async_to_sync(self.channel_layer.group_discard)(
      room,
      self.channel_name,
    )
    self.send_json({
      "leave": room,
    })

  def receive_json(self, content):
    command = content.get("command", None)
    username = content["room"]
    if command == "join" or command is None:
      self.join_room(username)
      id = self.get_id(username)
      self.start_listen(username, id)
    elif command == "leave":
      self.leave_room(username)

  def send_room(self, room, message):
    async_to_sync(self.channel_layer.group_send)(
      room,
      {
        "type": "tweet.message",
        "room": room,
        "message": message,
    }
  )

  def join_room(self, room):
    self.rooms.add(room)
    async_to_sync(self.channel_layer.group_add)(
      room,
      self.channel_name
    )

  def tweet_message(self, event):
    self.send_json(
      {
        "msg_type": "tweet",
        "room": event["room"],
        "message": event["message"],
      },
    )

  def get_id(self, username):
    api = tweepyAPI(settings.TWEEPY_AUTH)
    user = api.get_user(screen_name=username)
    user = user._json
    return str(user["id"])

  def start_listen(self, username, id):
    listener = TwitterListener(self.send_room, self.filter_data, username)
    self.stream = Stream(settings.TWEEPY_AUTH, listener)
    self.stream.filter(follow=[id], async=True)

  def filter_data(self, data):
    """
      (mazinz): Implement to Filter out tweets not by our user 
      (tweepy doesn't do this by default)
    """
    return True
