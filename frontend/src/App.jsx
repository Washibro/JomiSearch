// frontend/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import QrScannerModal from './components/QrScannerModal';
import HomePage from './pages/HomePage';
import LandProfilePage from './pages/LandProfilePage';
import ReportPage from './pages/ReportPage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  return (
    <LanguageProvider>
      <BrowserRouter>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        <div className="min-h-screen flex flex-col justify-between">
          <Header onOpenQrModal={() => setQrModalOpen(true)} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage onOpenQrModal={() => setQrModalOpen(true)} />} />
              <Route path="/land/:id" element={<LandProfilePage />} />
              <Route path="/report/:id" element={<ReportPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <QrScannerModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
      </BrowserRouter>
    </LanguageProvider>
  );
}