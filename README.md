# [aramco-ipo](https://ig.ft.com/sites/aramco-ipo)

> [IPO calculator for Saudi Aramco](https://ig.ft.com/saudi-aramco-ipo-calculator/), part of a [Lex In Depth story package](https://www.ft.com/content/7ed59bee-163b-11e7-b0c1-37e417ee6c76).

[![Build Status][circle-image]][circle-url] [![Dependency Status][devdeps-image]][devdeps-url]

## Local

```
npm start
```

Build/compile, start a dev server and watches for changes.

# Deploy

1. Write code in a branch.
2. Make a PR. CI will automatically:
    * build and test the branch
    * deploy green builds to the review site
3. Do quick smoke testing of the review build
4. Get a code review. Once you get a thumbs up, merge into master.
5. CI will build, test and deploy a build to Production.


## Uses Starter Kit

This project was scaffolded with [Starter Kit @b3052cf](https://github.com/ft-interactive/starter-kit/tree/b3052cf).

## Licence
This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).

Please note the MIT licence includes only the software, and does not cover any FT content made available using the software, which is copyright &copy; The Financial Times Limited, all rights reserved. For more information about re-publishing FT content, please contact our [syndication department](http://syndication.ft.com/).

<!-- badge URLs -->
[circle-url]: https://circleci.com/gh/ft-interactive/aramco-ipo
[circle-image]: https://circleci.com/gh/ft-interactive/aramco-ipo/tree/master.svg?style=shield

[devdeps-url]: https://david-dm.org/ft-interactive/aramco-ipo#info=devDependencies
[devdeps-image]: https://img.shields.io/david/dev/ft-interactive/aramco-ipo.svg?style=flat-square
