import React from 'react';
import { PortfolioDashboard } from './components/PortfolioDashboard';
import { PortfolioProvider } from './context/PortfolioContext';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PortfolioProvider>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <PortfolioDashboard />
        </main>
        <Footer />
      </PortfolioProvider>
    </div>
  );
}

export default App;