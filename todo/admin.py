from django.contrib import admin
from todo.models import Item

class ItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'complete')

admin.site.register(Item, ItemAdmin)
