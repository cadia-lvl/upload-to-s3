# Upload-to-s3

This project is a way to upload podcast data (text files) via a form to an AWS
S3 bucket. But the form can be extended to add anything that needs to be
processed for asr.

This project is based off of the
[github.com/cadia-lvl/samromur-chat](https://github.com/cadia-lvl/samromur-chat)
repo.

## Contributing

Please make a pull request or create an issue if you want to contribute.

### Prerequisites
* Nodejs version 16+
* Bootstrap
* ReactJS
* AWS S3 bucket config.json
* ExpressJS
* Typescript - Superset of JavaScript which primarily provides optional static
  typing, classes and interfaces.
* Styled Components - Style components directly using template literals.

### Development


```
npm install
npm postinstall
npm run build
npm run dev    #for production mode change dev to start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Production

Run the stuff in production using pm2.

## License

[Apache 2.0](/LICENSE)

## Authors:

Reykjavík University

Judy Fong - judy@judyyfong.xyz

## Acknowledgements

This project was funded by the Language Technology Programme for Icelandic
2019-2023. The programme, which is managed and coordinated by
[Almannarómur](https://almannaromur.is/), is funded by the Icelandic Ministry
of Education, Science and Culture.
