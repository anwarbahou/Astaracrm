import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Clients from "./pages/Clients";
import ClientProfile from "./pages/ClientProfile";
import Auth from "@/pages/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Clients />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientProfile />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
