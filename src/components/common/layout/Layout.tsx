import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./Layout.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-layout">
      {/* Fondo animado con gradientes */}
      <div className="layout-background"></div>
      
      {/* Efectos de fondo decorativos */}
      <div className="layout-orb-1"></div>
      <div className="layout-orb-2"></div>
      <div className="layout-orb-3"></div>
      
      {/* Patrón de puntos decorativo */}
      <div className="layout-dots"></div>

      {/* Contenido */}
      <div className="layout-content">
        <Header />
        <main className="layout-main">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;