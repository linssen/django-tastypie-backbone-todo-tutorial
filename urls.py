from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib import admin

from todo.api import ItemResource

admin.autodiscover()
item_resource = ItemResource()

# Root patterns
urlpatterns = patterns('',
    (r'^api/', include(item_resource.urls)),
)

urlpatterns += patterns('',
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += staticfiles_urlpatterns()
