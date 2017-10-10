[![Build Status](https://travis-ci.org/mendixlabs/text-box-search.svg?branch=master)](https://travis-ci.org/mendixlabs/text-box-search)
[![Dependency Status](https://david-dm.org/mendixlabs/text-box-search.svg)](https://david-dm.org/mendixlabs/text-box-search)
[![Dev Dependency Status](https://david-dm.org/mendixlabs/text-box-search.svg#info=devDependencies)](https://david-dm.org/mendixlabs/text-box-search#info=devDependencies)
[![codecov](https://codecov.io/gh/mendixlabs/text-box-search/branch/master/graph/badge.svg)](https://codecov.io/gh/mendixlabs/text-box-search)

# Text-box search

Add an interactive search box to all of your listview
It supports searching on single field similar to the built-in list view search capabilities.

## Features
* Search through a single field with single / multiple attributes
* Open search in default
* Hide / Show search bar

## Dependencies
Mendix 7.6

## Demo project

[https://textboxsearch.mxapps.io/](https://textboxsearch.mxapps.io/)

## Usage

## Issues, suggestions and feature requests
Please report issues at [https://github.com/mendixlabs/text-box-search/issues](https://github.com/mendixlabs/text-box-search/issues).


## Development
Prerequisite: Install git, node package manager, webpack CLI, grunt CLI, Karma CLI

To contribute, fork and clone.

    git clone https://github.com/mendixlabs/text-box-search.git

The code is in typescript. Use a typescript IDE of your choice, like Visual Studio Code or WebStorm.

To set up the development environment, run:

    npm install

Create a folder named dist in the project root.

Create a Mendix test project in the dist folder and rename its root folder to MxTestProject. Changes to the widget code shall be automatically pushed to this test project. Or get the test project from [https://github.com/mendixlabs/text-box-search/releases/latest](https://github.com/mendixlabs/text-box-search/latest)

    dist/MxTestProject

To automatically compile, bundle and push code changes to the running test project, run:

    grunt

To run the project unit tests with code coverage, results can be found at dist/testresults/coverage/index.html, run:

    npm test

or run the test continuously during development:

    karma start
