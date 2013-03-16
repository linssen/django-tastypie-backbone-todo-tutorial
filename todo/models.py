from django.db import models

class Item(models.Model):
    """An indavidual todo."""
    title = models.CharField(max_length=155)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True, auto_now=True)
    complete = models.BooleanField(default=False)
