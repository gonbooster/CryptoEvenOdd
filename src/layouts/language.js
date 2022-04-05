import {
    Select,
  } from "@chakra-ui/react";
  import { AddIcon } from "@chakra-ui/icons";
  import { useCallback, useEffect, useState } from "react";
  import { useTranslation } from 'react-i18next';
  
  const Language = () => {
    const { t, i18n } = useTranslation();

    const handleSelected = (e) => {
        const { target: { value } } = e;
        i18n.changeLanguage(value);
      }
 

    return (
        <Select onChange={handleSelected} 
        size={"sm"} 
        maxWidth={"150px"}>
        <option value='en' defaultChecked='true'>{t('english')}</option>
        <option value='es'>{t('spanish')}</option>
      </Select>
    );
  };
  
  export default Language;
  