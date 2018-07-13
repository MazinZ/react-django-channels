from django.conf.urls import url
from channels.http import AsgiHandler
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

from feed.consumers import TwitterConsumer

channel_routing = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter([
            url(r'feed/twitter-stream/', TwitterConsumer),
        ]),
    ),
})
