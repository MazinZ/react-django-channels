from tweepy import OAuthHandler, Stream
from tweepy.streaming import StreamListener

class TwitterListener(StreamListener):

  def __init__(self, pipe_func, filter_func, *args):
    self.pipe_func = pipe_func
    self.pipe_args = args
    self.filter_func = filter_func

  def on_data(self, data):
    if (self.filter_func(data)):
      self.pipe_func(*self.pipe_args, data)
    return True

  def on_error(self, status):
    if (status == 420):
      return False
