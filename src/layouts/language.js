import {
    Select,
  } from "@chakra-ui/react";
  import { AddIcon } from "@chakra-ui/icons";
  import { useCallback, useEffect, useState } from "react";
  import { useTranslation } from 'react-i18next';
  
  const Language = () => {
    const { t, i18n } = useTranslation();
    var userLang = navigator.languages
    ? navigator.languages[0]
    : (navigator.language || navigator.userLanguage)
console.log(userLang.split("-")[0])
    i18n.changeLanguage(userLang.split("-")[0]);
    
  };
  
  export default Language;
  