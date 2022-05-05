import React from "react"

const localization = require("../../src/localization.json")

const LanguageContext = React.createContext({data: localization["english"], setData: () => {}});

export default LanguageContext;