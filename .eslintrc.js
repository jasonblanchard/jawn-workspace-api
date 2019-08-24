module.exports = {
    "extends": "airbnb",
    "plugins": [
        "import",
        "react",
        "cypress"
    ],
    "env": {
      "node": true,
      "cypress/globals": true
    },
    "rules": {
      "arrow-body-style": 0,
      "arrow-parens": 0,
      "consistent-return": 0,
      "import/extensions": 0,
      "import/no-extraneous-dependencies": 0,
      "import/no-unresolved": 0,
      "max-len": 0,
      "no-param-reassign": 0,
      "no-underscore-dangle": 0,
      "prefer-destructuring": 0,
      "prefer-template": 0,
      "space-before-function-paren": 0,
    }
};
