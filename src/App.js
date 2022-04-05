import { Route } from "react-router-dom";
import Home from "./views/home";
import MainLayout from "./layouts/main";
import Admin from "./views/admin";


function App() {
  return (
    <MainLayout>
      <Route path="/" exact component={Home} />
      <Route path="/admin" exact component={Admin} />
    </MainLayout>
  );
}

export default App;
