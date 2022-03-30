# MetaLamp second task
second test task from MetaLamp.


## Demo production version
[start page on the server](https://thylacine.ru) `https://thylacine.ru`

### File structure
```
config
```
Contains all webpack configs, they are imported in the webpack.config.js from the root directory

#### `src`
```
src
| index.ts
└─── components
└─── pages

```
`index.ts` is a main file that import every `.ts | .js` file in the `src` directory. So when you create new `.ts | .js` file it will be automatically added to the bundle.

`components` is a folder with all possible components shared between all pages.

`pages` is a folder with all possible pages of the project.


#### `components`
`components` has the following structure:
```
components
└─── date-dropdown
| |  date-dropdown.pug
| |  date-dropdown.js
| |  date-dropdown.scss
| |  datepicker.scss
| |  readme.md
| └─── img
| | |  arrow_back.svg
| | |  arrow_forward.svg
| | |  tip.svg
|
└─── drop-down
| |  drop-down.pug
| |  drop-down.ts
| |  drop-down.scss
| └─── img
| | |  tip.svg
```
* `components` contains only directories per component. 
* Each component contains main `.pug` file with the template, `.ts | .js` that is dynamically loaded in the `index.ts` and contains all scripts for the component (and only the component) and `.scss` file.
* `.scss` should be imported in the `.ts | .js` and contains **one BEM block** in the root of the files and all possible elements and modificators inside this block's definition.



#### `pages`
`pages` has the following structure:

```
pages
└─── landing-page
| |  landing-page.pug
| |  landing-page.ts
| |  landing-page.scss
| └─── img
| | |  image_3.webp
|
└─── room-details
| |  room-details.pug
| |  room-details.ts
| |  room-details.scss
| └─── img
| | |  image.webp
| | |  image2.webp
| | |  Mask_Group.webp
```

* `landing-page.pug`, `room-details.pug` are independent separated pages, extended from `pages/index/index.pug`, so they have `<html>`, `<head>`, `<body>` tags. 
* Page ideally should NOT contain any element except of imports of different components. 


#### `plugins`
`plugins` using third-party plugins in the following components:
```
1. date-dropdown: air-datepicker: v3.0.1

2. range-slider: ion-rangeslider: v2.3.1
```

* These plugins are used in components of the project


## How to work

* Node version v14.18.1

#### Install dependencies
```commandline
npm i
```

#### Start dev server
```commandline
npm start
```
go to `http://localhost:8080/`


#### On the production server create the bundle files
```commandline
npm run build
```