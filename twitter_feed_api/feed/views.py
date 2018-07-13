from rest_framework import views
from rest_framework.response import Response
from tweepy import API as tweepyAPI
from django.conf import settings
import json

class TwitterFeedView(views.APIView):
  """
  Get a user's twitter feed.
  """
  def get(self, request, format=None):
    print(request)
    user = request.GET.get("user", None)
    if user is not None:
      api = tweepyAPI(settings.TWEEPY_AUTH)
      data = api.user_timeline(screen_name=user, count=10, include_rts=False)
      tweets = []
      for status in data:
        tweets.append(status._json)
      return Response({"tweets": tweets})
    else:
      return Response({"error": "Must provide a valid user"})
