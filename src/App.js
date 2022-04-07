import { Route } from "react-router-dom";
import Home from "./views/home";
import MainLayout from "./layouts/main";
import Admin from "./views/admin";
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  var userLang = navigator.languages
  ? navigator.languages[0]
  : (navigator.language || navigator.userLanguage)
  i18n.changeLanguage(userLang.split("-")[0]);

  return (
    <MainLayout>
      <Route path="/" exact component={Home} />
      <Route path="/admin" exact component={Admin} />
    </MainLayout>
  );
}

export default App;
