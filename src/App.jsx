import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import DiscountCard from "./DiscountCard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/discount-card" element={<DiscountCard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
