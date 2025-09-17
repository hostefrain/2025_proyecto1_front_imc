import "./Header.css";

function Header() {
  return (
    <header className="app-header">
      {/* Efecto de brillo */}
      <div className="header-shine"></div>
      
      <div className="header-content">
        <div className="header-main">
          {/* Icono decorativo */}
          <div className="header-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          
          {/* Título principal */}
          <div className="header-text">
            <h1 className="header-title">Calculadora IMC</h1>
            <p className="header-subtitle">Entrega 1</p>
          </div>
        </div>
        
        {/* Indicadores decorativos */}
        <div className="header-indicators">
          <div className="header-dot header-dot-1"></div>
          <div className="header-dot header-dot-2"></div>
          <div className="header-dot header-dot-3"></div>
        </div>
      </div>
    </header>
  );
}

export default Header;