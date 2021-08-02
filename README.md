# MetaLamp_second_task
second test task from MetaLamp.


## Demo production version
[start page on the server](https://thylacine.ru)

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
└─── plugins
```
`index.ts` is a main file that import every `.ts | .js` file in the `src` directory. So when you create new `.ts | .js` file it will be automatically added to the bundle.

`components` is a folder with all possible components shared between all pages.

`pages` is a folder with all possible pages of the project.

`plugins` is a folder with all possible plugins of the project.


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
| | |  image 3.webp
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
`plugins` has the following structure:

```
plugins
└─── air-datepicker
| |  
| └─── css
| | |  datepicker.min.css
| |  
| └─── js
| | |  datepicker.min.js
|
└─── rangeSlider
| |  
| └─── css
| | |  ion.rangeSlider.min.css
| |  
| └─── js
| | |  ion.rangeSlider.min.js
| java-import.js
```

* All plugins dependencies are imported in file `java-import.js` in 'plugins' folder. File `java-import.js` in its turn is imported in `index.ts`

* These plugins are used in components of the project


## How to work
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