# Message board test

# Creating the database
sudo mysql

create database whatwapp

exit

sudo mysql whatwapp < mysqltables.dump

# Configuring user, password and seed key
The configuration example is located on the file .env

# Installing
npm install

# To run:
nodemon -I server.js

# To run in background
nohup nodemon -I server.js

# SEND MESSAGE
curl -s --raw -X POST -k -H "Content-Type: application/json" -i 'https://whatwapp.optwoo.com/sendmessage' -d '{"email": "user@user.com", "password": "user", "message": "testing message", "details": {"version": "1", "device": "android"}}'

# READ MESSAGES FROM CUSTOMER SIDE
curl -s --raw -X POST -k -H "Content-Type: application/json" -i 'https://whatwapp.optwoo.com/readmessages' -d '{"email": "user@user.com", "password": "user", "user": "2"}'

# READ ALL MESSAGES AS AN OPERATOR
curl -s --raw -X POST -k -H "Content-Type: application/json" -i 'https://whatwapp.optwoo.com/readmessages' -d '{"email": "admin@whatwapp.com", "password": "admin"}'

# READ ALL MESSAGES OF A USER AS AN OPERATOR
curl -s --raw -X POST -k -H "Content-Type: application/json" -i 'https://whatwapp.optwoo.com/readmessages' -d '{"email": "admin@whatwapp.com", "password": "admin", "user": "3"}'

# SHOW DETAILS OF A MESSAGE
curl -s --raw -X POST -k -H "Content-Type: application/json" -i 'https://whatwapp.optwoo.com/messagedetail' -d '{"email": "admin@whatwapp.com", "password": "admin", "message_id": "31"}'

# SHOW USER DETAILS
curl -s --raw -X POST -k -H "Content-Type: application/json" -i 'https://whatwapp.optwoo.com/userdetails' -d '{"email": "admin@whatwapp.com", "password": "admin", "user": "3"}'

# SEARCH USERS
curl -s --raw -X POST -k -H "Content-Type: application/json" -i 'https://whatwapp.optwoo.com/searchusers' -d '{"email": "admin@whatwapp.com", "password": "admin", "search": "b"}'

# SEARCH MESSAGES BY PROPERTY DETAIL
curl -s --raw -X POST -k -H "Content-Type: application/json" -i 'https://whatwapp.optwoo.com/searchdetails' -d '{"email": "admin@whatwapp.com", "password": "admin", "value_key": "version", "value_text":"1"}'
