### Whatsapp Service (WPP Connect)

Based on https://github.com/BrandonNunes/wpp-bot. 

Spin up locally with docker: \
`docker compose -f docker-compose.local.yml up -d`


Spin up on the server with docker: \
`docker compose up -d`

After the application is running, wpp connect will wait for a few minutes before closing the connection.
The generated QR code should be read to link the whatsapp device before that. The QR code can be seen 
from the command output (`docker logs agilizone-wpp-service`) or from the service home page 
(http://localhost:3004 (local) / https://wpp.agilizone.com/ (prod)).

### Authorization
To call the send-message endpoint or to access the QR code from the home page, we need to specify an
apiKey as query param. Make sure to create an .env file (see .env.example). 


##
#### Common problem
An issue with the "sharp" dependency has happened when using yarn as package manager. We're now using
npm due to that.
