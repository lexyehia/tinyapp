### URL Shortening app 

This app will allow a registered user to shorten a url.

### Please read first

My app deviates a bit from the project specifications, mainly to improve upon the basic product in the following way:

- Instead of saving all data into an in-memory object, I have implemented a rudimentary ORM that persists data into a .json file (it will create one under the 'db' subdirectory). You can see the ORM's activity through (colourful) console messages!

- I have seperated the various endpoints into their own router files located in the 'routers' subdirectory, providing the app with a better MVC structure.

- I have divided the various views into appropriate subfolders (and renamed them accordingly).

- I have added an account management functionality, allowing the user to both Edit and Delete his account (full CRUD).

### Running it

To start the app, make sure you `npm install && npm start` first. The app can then be accessed at `http://localhost:8080`.
