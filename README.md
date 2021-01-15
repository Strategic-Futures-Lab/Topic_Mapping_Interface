# Bubble Map Interface Application

## Structure

Code is in ```src/```, includes scripts and styles.

App is deployed in ```app/dist/``` as bundled and minified code. The rest of ```app``` is the code for custom app.

## Develop and Build

1. Install node and npm.
2. Install the project dependencies: ```$ npm install```

In development, run ```$ npm run serve```. It will launch a local server and watch the files to automatically re-build the sources and refresh the browser page when you save a file.

To build the application, run ```$ npm run build```. It will build the sources, remove sourcemaps and minify the code for deployment on a web page.

## Usage

Check [the API doc](./doc/API.md).

---

[![CC BY-NC 4.0][cc-by-nc-shield]][cc-by-nc]

This work is licensed under a [Creative Commons Attribution 4.0 International
License][cc-by-nc].

[![CC BY-NC 4.0][cc-by-nc-image]][cc-by-nc]

[cc-by-nc]: http://creativecommons.org/licenses/by-nc/4.0/
[cc-by-nc-image]: https://i.creativecommons.org/l/by-nc/4.0/88x31.png
[cc-by-nc-shield]: https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg
