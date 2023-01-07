var en = require("./en.json");
var fr = require("./fr.json");

const i18n = {
  translations: {
    en,
    fr,
  },
  defaultLang: "en",
  useBrowserDefault: true,
};

module.exports = i18n;
