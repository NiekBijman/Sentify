# Sentify

## Setup
1. Get an account at apps.twitter.com to get a consumer key and consumer secret for twitter API calls.
2. Set twitter key and secret environment variables by adding the following lines to your ~/.bash_profile: 
```
export TW_KEY=<your key>
export TW_SECRET=<your secret>
```
Restart your shell and make sure that the environment variables are set with `echo $TW_KEY` and `echo $TW_SECRET`.
3. Make sure that you have **Node Package Manager** (npm) installed on your system. To check if you have Node.js installed, run this command in your terminal:`node -v` To confirm that you have npm installed you can run this command in your terminal:`npm -v`. To update your npm, type this into your terminal: `npm install npm@latest -g`
4. Make sure you have yarn installed on your machine. `npm i yarn -g`. If you need more help: https://yarnpkg.com/lang/en/docs/install/
5. Install nodemon globally: `npm i nodemon -g`.
6. Install server dependencies by running `yarn` in home folder.
7. Go into the /client directory and run `yarn` to install all the dependencies for the client application.
8. Go back to the root folder and run `yarn dev` to start both user client and server.
9. **IMPORTANT** Our config.js file contains our API Keys which is why we put it in .gitignore.  @team, you can find the config.js file in the Slack channel.   
10. **IMPORTANT** If you add dependencies, make sure to also add them to package.json. This can be done when installing a package with `npm install <pkg> --save`. Make sure to run this command in the correct directory, client/ if you're adding dependencies for the client app and home/ otherwise.

### @Sentify-team

## the App
Go to this site: https://marvelapp.com/867200h to explore the app, and press the settings symbol in the top right corner (only certain screens) to display the annotations.

### Architecture
This is the file structure I think is appropriate for our project.
- The file structure is according to this reference https://reactjs.org/docs/faq-structure.html  Paragraph: **‘Grouping by file type’**
- Views with interaction have a **container** that supplies the functionality
- The highest order presentational component is named  **-view**, it’s children are named after their function. For example: **-input, -button** etc.

### Components
These components contain links to the websites where I found libraries and reference projects that implement the needed functionality

### API Calls
I annotated which components trigger certain API calls
- The numerals **A-D** represent my opinion about which should be implemented first. **A high priority, D last**
- The dotted lines represent API calls and responses that are made by the system rather than a user interaction

