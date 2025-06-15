import Homepage from "./pages/Homepage.jsx"
import React from "react";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Loginpage from "./pages/Loginpage.jsx";

export default function App(){
  return(<>
    <Homepage/>
    <Loginpage/>
    </>);
}
