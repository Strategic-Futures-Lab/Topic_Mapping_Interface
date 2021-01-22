
## Styles

The modules' and page's styles are already predefined and set to work with the scripts rendering them. It is however possible to overwrite some of these styles individually inside a `main.css` file loaded by your HTML document.

Colors and fonts values are however used throughout the modules to ensure consistency. These values can be globally set using the CSS `:root` property:
```css
:root{
    --primary-color: #d65076;
    --primary-color-dark: #ad4965;
    --primary-color-light: #f7e7eb;
    --action-color: #d65076;
    --color-black: #333333;
    --color-dark-grey: #4C4C4C;
    --color-grey: #787878;
    --color-light-grey: #989898;
    --color-lighter-grey: #E3E5E5;
    --color-white: #FEFFFF;

    --color-success: #4CAF50;
    --color-danger: #F44336;
    --color-warning: #FFC107;
    --color-info: #03A9F4;

    --title-font: 'Raleway', sans-serif;
    --text-font: 'Open Sans', sans-serif;
}
```
