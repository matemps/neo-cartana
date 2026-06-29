import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import CarSearch from "./features/cars/CarSearch";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* navigate to cars search page if we're at the index */}
        <Route index element={<Navigate to="/cars" replace />} />
      </Route>

      {/* public routes */}
      <Route path="cars" element={<CarSearch />} />
    </Routes>
  );
};

export default App;
