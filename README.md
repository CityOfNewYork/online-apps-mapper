# Online Applications Mapper

A desktop application for generating JSON maps between fillable PDFs and FormStack Form fields. Used by the NYC Opportunity Online Applications project.

## Requirements

* [PDFtk Server](https://www.pdflabs.com/tools/pdftk-server/) - This should be installed on your computer. Note the path to the executible when installing.
* [FormStack Form and API Token](https://www.formstack.com/) - You will need the form ID and API token.

## Settings

The setting for the application are visible when you start the application.

* Fillable PDF - The PDF you want to create the map for filling out with FormStack data. A [sample can be found here](src/static/SCRIE_Application_Packet_EN.edited.pdf).
* FormStack Form ID - The form ID can be found by clicking on the form and using the number at the end of the URL path.
* [FormStack API Token](https://support.formstack.com/customer/portal/articles/2910896) - The token can be found in the API settings of your FormStack account.
* PDFtk Server Path - You will need to know the path to the executible if the app is installed on a Windows machine or non-default location.
* Proxy - If you are working behind a proxied network, you will need to set this so the app can hit the FormStack API.

If developing, you can prefill these settings with the `.env` file. Rename `.env.sample` and populate the settings.

## Contributing

This tool uses [Electron Forge](https://electronforge.io/) for project setup and packaging. You will need to have Electron Forge installed locally:

```
npm install -g electron-forge
```

To run the app in developer mode, clone the repo, cd into the repository and run:

```
npm run start
```

There is a production mode that simulates the "live" application menus found in a packaged app:

```
npm run production
```

To package the application run:

```
npm run package
```

Distributions can be found in the `out` directory.

## About NYCO

NYC Opportunity is the [New York City Mayor's Office for Economic Opportunity](http://nyc.gov/opportunity). We are committed to sharing open source software that we use in our products. Feel free to ask questions and share feedback. Follow @nycopportunity on [Github](https://github.com/orgs/CityOfNewYork/teams/nycopportunity), [Twitter](https://twitter.com/nycopportunity), [Facebook](https://www.facebook.com/NYCOpportunity/), and [Instagram](https://www.instagram.com/nycopportunity/).
