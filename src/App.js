import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CreateJobPage from "./pages/CreateJobPage";
import DashboardPage from "./pages/DashboardPage";
import Providers from "./providers";

const App = () => {
  return (
    <Providers>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<CreateJobPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </Layout>
      </Router>
    </Providers>
  );
};

export default App;
