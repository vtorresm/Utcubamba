import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Catalog from './pages/Catalog'
import UserProfile from './pages/UserProfile'
import OrderManagement from './pages/OrderManagement'
import Reports from './pages/Reports'
import InventoryReport from './components/reports/InventoryReport'
import MovementsReport from './components/reports/MovementsReport'
import TrendsReport from './components/reports/TrendsReport'
import AlertsReport from './components/reports/AlertsReport'
import FinancialReport from './components/reports/FinancialReport'
import PatientReport from './components/reports/PatientReport'
import MedicationPrediction from './components/MedicationPrediction'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/inventory" element={<InventoryReport />} />
            <Route path="/reports/movements" element={<MovementsReport />} />
            <Route path="/reports/trends" element={<TrendsReport />} />
            <Route path="/reports/alerts" element={<AlertsReport />} />
            <Route path="/reports/financial" element={<FinancialReport />} />
            <Route path="/reports/patients" element={<PatientReport />} />
            <Route path="/predictions" element={<MedicationPrediction />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App