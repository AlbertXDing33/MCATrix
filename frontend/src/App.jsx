// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import ClerkRoutes from "./authentication/ClerkRoutes.jsx"
import {Routes, Route} from "react-router-dom" //react-router-dom alllows for slash routes(/home, /login, etc.)
import {AuthenticationPage} from "./authentication/AuthenticationPage.jsx"
import {Format} from "./format/Format.jsx"
import {History} from "./history/History.jsx"
import {QuestionMake} from "./quiz/QuestionMake.jsx"

function App() {
  return <ClerkRoutes>
    <Routes>
      <Route path="/sign-in/*" element = {<AuthenticationPage />}/>
      <Route path="/sign-up" element = {<AuthenticationPage />}/>
      <Route element = {<Format />}> {/* Everything inside this route is rendered inside the Format component for a uniform format*/}
        <Route path = "/" element = {<QuestionMake />}/>
        <Route path = "/history" element = {<History />}/>
      </Route>
    </Routes>
  </ClerkRoutes>
}

export default App
