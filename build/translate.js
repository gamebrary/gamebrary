/* eslint-disable */

const fs = require('fs');
const translate = require('translate-json-object')();
const baseJson = require('../src/i18n/en.json');

// NOTE: Please be careful using you api key, translating the entire app to all languages can get costly
translate.init({ googleApiKey: 'GOOGLE_TRANSLATE_API_KEY' });

const supportedLanguages = ['ar','zh-CN','en','fr','de','it','ja','pt','ru','es'];

for (let i = 0, promise = Promise.resolve(); i < supportedLanguages.length; i++) {
    promise = promise.then(() => new Promise(resolve => {
        const language = supportedLanguages[i];

        translate.translate(baseJson, language)
            .then((data) => {
                fs.writeFile(`src/i18n/${language}.json`, JSON.stringify(data, null, 4), () => {
                    console.log(`Translation to ${language} completed`);
                    resolve();
                });
            }).catch((err) => {
                console.log('error ', err)
            });
    }));
}
