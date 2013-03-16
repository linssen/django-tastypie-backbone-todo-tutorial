from tastypie.resources import ModelResource
from todo.models import Item

class ItemResource(ModelResource):
    class Meta:
        queryset = Item.objects.all()
        resource_name = 'item'
