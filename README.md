# Sentify

## the App
https://sentify-kth.herokuapp.com/

Sentify is an application that provides sentiment analysis based on user-chosen string and geographical area. The string will be able to contain hashtags/words/sentences for which the app will generate sentimental analysis within the chosen geographical area. The user will be able to explore specific countries by looking for information of a certain region, or explore differences between countries if he or she chooses a continent.

Go to this site: https://marvelapp.com/867200h to explore the prototyped app, and press the settings symbol in the top right corner (only certain screens) to display the annotations.

## What we have done
- Setup the backend
- Created the initial layout of our application

## What remains to be done
- Implement more interaction with the map
- Setup the live-tweets
- Setup the login -> replace the hardcoded data in my-searches with data from the database
- Implement the localStorage
- Clean the code, retest the app

### Architecture
This is the file structure of our project:

* `~` - contains the `/node_modules` setup for the back-end, `index.js` which is responsible for making the API calls (implemented to solve the CORS problem)
* `/client` - contains the react application
* `/client/public/index.html` - this is the static html file
* `/client/src/components` - contains all the presentation components that we use in our application
* `/client/src/containers` - includes the container components responsible for fetching and changing the data shown in the presentation components
* `/helpers` - contains files that will help with the authentication through google
* `/img` - contains images
* `/media` - contains icons and loaders
* `/styles` - contains the css files for our containers and components
* `discover.js`, `my-searches.js` and `welcome.js` correspond to the pages the user can visit, they reference container components

## Setup
1. Get an account at apps.twitter.com to get a consumer key and consumer secret for twitter API calls.
2. Set twitter key and secret environment variables by adding the following lines to your ~/.bash_profile: 
	```
	export TW_KEY=<your key>
	export TW_SECRET=<your secret>
	```
	Restart your shell and make sure that the environment variables are set with `echo $TW_KEY` and `echo $TW_SECRET`.
	
3. Make sure that you have node.js installed. To check if you have Node.js installed, run this command in your terminal:`node -v`.
4. Make sure that you have **Node Package Manager** (npm) installed on your system. To confirm that you have npm installed you can run this command in your terminal:`npm -v`. To update your npm, type this into your terminal: `npm install npm@latest -g`
5. Make sure you have yarn installed on your machine. `npm i yarn -g`. If you need more help: https://yarnpkg.com/lang/en/docs/install/
6. Install nodemon globally: `npm i nodemon -g`.
7. Install server dependencies by running `yarn` in home folder.
8. Go into the /client directory and run `yarn` to install all the dependencies for the client application.
9. Go back to the root folder and run `yarn dev` to start both user client and server.
10. **IMPORTANT** Our config.js file contains our API Keys which is why we put it in .gitignore.  @team, you can find the config.js file in the Slack channel.   
11. **IMPORTANT** If you add dependencies, make sure to also add them to package.json. This can be done when installing a package with `npm install <pkg> --save`. Make sure to run this command in the correct directory, client/ if you're adding dependencies for the client app and home/ otherwise.

