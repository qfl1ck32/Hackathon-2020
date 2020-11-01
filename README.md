# fix.it/

![Node.js](https://img.shields.io/badge/node-%3E%3D%2010.0.0-brightgreen.svg)
![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
[![Viewer](https://img.shields.io/badge/Viewer-v7-green.svg)](http://developer.autodesk.com/)
[![oAuth2](https://img.shields.io/badge/oAuth2-v1-green.svg)](http://developer.autodesk.com/)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](http://developer.autodesk.com/)
[![OSS](https://img.shields.io/badge/OSS-v2-green.svg)](http://developer.autodesk.com/)
[![Model-Derivative](https://img.shields.io/badge/Model%20Derivative-v2-green.svg)](http://developer.autodesk.com/)
![](https://img.shields.io/github/repo-size/qfl1ck32/Hackathon-2020) ![](https://img.shields.io/github/last-commit/qfl1ck32/Hackathon-2020) ![](https://tokei.rs/b1/github/qfl1ck32/Hackathon-2020)

# Description

This code is derived from a sample that is part of the [Learn Forge](http://learnforge.autodesk.io) tutorials. It has been modified by our team, 134stillAlive for Smarthack 2020. We participated as contestants for Autodesk, with the theme "How could we use cloud computing in BIM to help your city develop into a smart city?".

Our solution is an app aims to load a model while using sensors connected to a server. You can use the GUI then to join the elements in the viewer with the sensors, and monitor the data that the server receives. The changes are reflected in a graph, and in the viewer (the elements color changes according to the data received from the joined sensor). This is just a demo, and it simulates the data using random values, but in a real world scenario this setup can be used for monitoring many parameters (water, electricity, waste management).

# Setup

To use this sample, you will need Autodesk developer credentials. Visit the [Forge Developer Portal](https://developer.autodesk.com), sign up for an account, then [create an app](https://developer.autodesk.com/myapps/create). For this new app, use **http://localhost:3000/api/forge/callback/oauth** as the Callback URL, although it is not used on a 2-legged flow. Finally, take note of the **Client ID** and **Client Secret**.

### Run locally

Install [NodeJS](https://nodejs.org).

Clone to project, install the required packages, and modify the code with your cliend ID and client secret. Also, you may want to change the URN so the viewer will render a different file (the file needs to be translated before it can be used in the application, for this see [the Autodesk Model Derivative API](https://forge.autodesk.com/en/docs/model-derivative/v2/tutorials/translate-to-obj/about-this-tutorial/)).

    npm install
    npm start

Open the browser: [http://localhost:3000](http://localhost:3000).

# License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).
Please see the [LICENSE](LICENSE) file for full details.

## Written by

Augusto Goncalves [@augustomaia](https://twitter.com/augustomaia), [Forge Partner Development](http://forge.autodesk.com)

The original code was a sample from [Autodesk Learn Forge](http://learnforge.autodesk.io), that was modified by the 134stillAlive team for Smarthack 2020.
