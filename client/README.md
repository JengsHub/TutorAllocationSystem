# Client

React frontend with TypeScript

## Running the frontend

1. `yarn install` to install all packages you haven't already
2. `yarn start` will compile the TypeScript files and run a nodemon server (hot-reloading) based on the compiled JS files

## Other scripts

- `yarn build` builds an optimised production copy in the /build folder. For now, you probably don't have to use this.

## Recommended tools/software

- VSCode extensions
  - Prettier

## General guidelines

- Please keep styling consistent across the whole frontend.
- Main page components should be in src/pages.
- All other components should be in src/components.
- All images should be in src/images.
- All .css files (except index.css) should be placed inside the styles folder in either /pages or /components, depending on the component that uses it.
- If a component already exists in the codebase for what you want to create, please use the component by importing it into your file, instead of duplicating the code or making your own.
- Use yarn instead of npm when adding packages.
- The current preference is to use functional components and hooks for React.