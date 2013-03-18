from tastypie.resources import ModelResource
from tastypie.authorization import Authorization

from todo.models import Item

class ItemResource(ModelResource):
    class Meta:
        queryset = Item.objects.all()
        resource_name = 'item'
        authorization = Authorization()
        allowed_methods = ['get', 'post', 'delete', 'put']
        always_return_data = True
