import { HashRouter, Routes, Route } from "react-router-dom";
import WeatherApp from "./Dashboard";
import Header from "./header";


const Portal = () => {
  return (
    <>
      <Header />
      <Routes>
       <Route  path="/data" element={<WeatherApp />} />
       
      </Routes>
    </>
  );
};

export default Portal;
