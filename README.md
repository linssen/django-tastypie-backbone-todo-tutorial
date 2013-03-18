Django / TastyPie API with Backbone / Todo app tutorial
================================================================================

![Screenshot](http://cl.ly/Nexb/Screen%20Shot%202013-03-18%20at%2010.08.05.png)

Installing
--------------------------------------------------------------------------------

### Clone the repo

It needs to go into a directory called `api_backbone` so make sure you pass
a target dir:

    git clone git@github.com:linssen/django-tastypie-backbone-todo-tutorial.git api_backbone
    cd api_backbone

### Install the virtual environment and the packages

You'll need to have [virtualenv installed](https://pypi.python.org/pypi/virtualenv#installation) **globally** for this one.

    virtualenv --distribute env
    source env/bin/activate
    pip install -r requirements.pip

### Configure your local settings

I've bundled a sample local settings that uses an sqlite3 DB

    cp local_settings.sample.py local_settings.py
    
Now alter anything you like in there with your favourite editor, you could just
as easily leave it as it is though.

### Set up the database

It's bundled with South for DB migrations, so we'll first need to set up the DB
then run it's migrations. Set up your super user as you like.

    ./manage.py syncdb
    # (set up superuser)
    ./manage.py migrate --all

### Run the server

Now it should all be set up and you can run the server

    ./manage.py runserver
