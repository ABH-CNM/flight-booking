# Flight Booking
## Dependences:
* [MongoDB](https://www.mongodb.com/)
* [Pug](https://github.com/pugjs/pug)
* [React](https://facebook.github.io/react/)
* [Webpack](https://webpack.github.io/)
* [Nodemon](https://github.com/remy/nodemon)
* [Babel](https://babeljs.io/)

## Installation:
```
$ npm install
```

## Walkthrough:
### Backend:
1. Start MongoDB server
  ```
  $ mongo --dbpath your-dbpath
  ```
2. Monitor for changing in source file (js, jsx) and restart server:
  ```
  $ npm run watch-back
  ```
  
### Frontend:
1. Start MongoDB server
  ```
  $ mongo --dbpath your-dbpath
  ```
2. Start server:
  ```
  $ node server
  ```
3. Monitor for changing in jsx file and create bundle.js:
  ```
  $ npm run watch-front
  ```
4. Monitor for changing in SCSS file:
  ```
  $ sass --watch --style expanded --cache-location ./tmp/.sass-cache public/scss/style.scss:public/css/style.css
  ```
  
## License:
  Public domain

