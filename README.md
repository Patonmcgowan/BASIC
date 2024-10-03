# BBASIC
A browser based BASIC interpreter.  This program is a customised version of Jeff Friesen's work.

This project is written in vanilla Javascript, and is installed and run on a client system. Aside from a Javascript browser, all dependancies are included in the project (ie no need for Node.js, React, jQuery etc etc). This code will consequently require CORS Access-Control-Allow-Origin enabled to run.

Start by opening BBASIC.html in a browser window.  Type HELP to start.

This is a running program but is still a work in progress, so not all features are complete. The code was developed for the Chrome browser under Microsoft Windows, so may render differently under other browsers. Limited testing has been completed under *nix and MacOS environments, with no real operability tests on the iOS environment for an iPhone and iPad.

TODO: 
- Add revision history command to the CLI
- Add TODO command to the CLI
- Add facility for User Defined Functions
- Add facility to load a program upon startup (using <script> tag)
- Add access to the stack from external
- Move engines (Scanner and BASICI) to webworkers
- Allow headless (CLI less) engines - ie translate to APIs
