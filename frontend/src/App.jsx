import Homepage from "./pages/Homepage.jsx"
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

export default function App(){
  return(<>
    <Homepage/>
    </>);
}
