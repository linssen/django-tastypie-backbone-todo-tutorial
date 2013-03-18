import os

CURDIR = os.path.dirname(__file__)

SITE_URL = 'http://localhost:8000'

SECRET_KEY = 'my secret key'

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'backbone_api.db',
    }
}

STATIC_ROOT = CURDIR + '/static_collected/'
STATIC_URL = '/static/'
STATICFILES_DIRS = (
    CURDIR + '/static/',
)

MEDIA_ROOT = CURDIR + '/media/'
MEDIA_URL = '/media/'

TEMPLATE_DIRS = (
    CURDIR + '/templates/'
)
