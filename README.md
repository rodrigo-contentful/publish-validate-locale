# Demo: publish button to validate localized fields

NOTE: 
* This code includes a demo publish button, with a focus on adding a set of localization rules per field.
* The functionality of publish/unpublish is not implemented.
* Default field validations are not overridden by this button, as the validation occurs on field value change.
* The app includes a basic Dialog component to alert on validations.

## Installation

In the project directory, you can run:

#### `npm start`

Creates or updates your app definition in Contentful, and runs the app in development mode.
Open your app to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!


## Usage

The app includes demo functionality for two different validations, validate rules per "tag" or validate rules per "team".

Both functionalities use the same logic on required locales per field.

```javascript
 const valdateTeam = true; // DEMO flag to activate the desired validation function
    let res = {};
    if (valdateTeam) {
      console.log("validating with teams");
      res = teamValidation();
    } else {
      console.log("validating with tags");
      res = tagValidation();
    }
```

### Functionality per 'Teams'

* This is accomplished by a JSON variable containing the team name, teamID as the next example
* The space needs to have the same teams setup.

```json
 /**
     * Rules on tag names and needed locales
     */
    const teamRules = [
      {
        name: "teamMexico",
        id: "3o9i7akLfDfDkg5hVm0hde", // temporal as to get a name will require an extra query
        rule: ["en-US", "fr-CH", "de-DE"], // content in this locales are required
      },
      {
        name: "teamSpain",
        id: "7q1IfTaG9tzsRZ6F4vBRfI", // temporal as to get a name will require an extra query
        rule: ["en-US", "fr-CH"], // content in this locales are required
      },
    ];
```

### Functionality per 'Tag'

* This is accomplished by a JSON variable containing the tag name as the next example
* The space needs to have the Tag setup with the same name as the tagRules.

```json
  /**
     * Rules on tag names and needed locales
     */
    const tagRules = [
      {
        name: "mexico",
        rule: ["en-US", "fr-CH"],
      },
    ];
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)

## references
made with [makeareadme](https://www.makeareadme.com/)
