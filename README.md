# Sentify

# @Sentify-team

## Setup
1. First, make sure that you have npm installed on your system
2. Run `npm install` through the terminal in the root of the repository. Let it
   install all the dependencies.
3. Run `npm start` through the terminal. This will start the webserver and the application should pop up in your
   browser ready for use. Alternatively you can open in through [http://localhost:3000]. Whenever you make changes in your code and save, the browser will update automatically, so you don't have to click refresh anymore.
4. Make sure to update the dependencies in the *package.json*. Updating all the dependencies is possble by `npm install <pkg> --save`. It will append the dependencies to your existing *package.json* file.

## the App
Go to this site: https://marvelapp.com/867200h to explore the app, and press the settings symbol in the top right corner (only certain screens) to display the annotations.

###Architecture
This is the file structure I think is appropriate for our project.
- The file structure is according to this reference https://reactjs.org/docs/faq-structure.html  Paragraph: *‘ Grouping by file type’*
- Views with interaction have a *container* that supplies the functionality
- The highest order presentational component is named  *-view*, it’s children are named after their function. For example: *-input, -button* etc.

### Components
These components contain links to the websites where I found libraries and reference projects that implement the needed functionality

###API Calls
I annotated which components trigger certain API calls
- The numerals *A-D* represent my opinion about which should be implemented first. *A high priority, D last*
- The dotted lines represent API calls and responses that are made by the system rather than a user interaction
