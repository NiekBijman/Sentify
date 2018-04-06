# Sentify 

## How to get started

Since modern frameworks use some advanced features like compiling the templates and source code in pure
JavaScript and dynamically loading the needed content, you cannot anymore just open the HTML file 
in the browser. Instead, you will need a local webserver that will serve your app. Follow the instructions 
bellow to install all the neded dependencies (e.g. the framework libraries) and the development webserver.

1. First, make sure that you have npm installed on your system (follow the instructions
   at [Installing Node](https://docs.npmjs.com/getting-started/installing-node). The computers in the lab rooms
   should already have it, you will just need to do `module add node` to activate it (every time
   you start the terminal).

2. Run `npm install` through the terminal in the root of the repository. Let it
   install all the dependencies.

3. Run `npm start` through the terminal. This will start the webserver and the application should pop up in your
   browser ready for use. Alternatively you can open in through [http://localhost:3000]. Whenever you make changes in your code and save, the browser will update automatically, so you don't have to click refresh anymore.
