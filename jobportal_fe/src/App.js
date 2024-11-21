import "./App.css";
import React, {Suspense} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const LoginPage = React.lazy(() => import("../src/Components/LoginPage"));
const Registration = React.lazy(() => import("../src/Components/Registration"));
const ReviewApplicant = React.lazy(() => import("../src/Components/Review"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/registration/:id" element={<Registration />} />
          <Route path="/registration/:id/:role" element={<Registration />} />

          <Route path="/Review" element={<ReviewApplicant />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
