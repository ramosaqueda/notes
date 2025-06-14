import React, { useState, useEffect } from 'react';
import { User, Lock, Plus, LogOut, FileText, Trash2 } from 'lucide-react';
import './App.css';

// Componente de Login
const LoginPage = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Login básico (¡INSEGURO para producción!)
    if (usuario === 'admin' && password === '123456') {
      localStorage.setItem('usuario', usuario);
      onLogin(usuario);
      setError('');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="login-title">MiApp de notas Mentales (no de notas de evaluaciones)</h2>
          <p className="login-subtitle">Inicia sesión para continuar</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="form-group">
            <label className="form-label">
              Usuario
            </label>
            <div className="input-container">
              <User className="input-icon" />
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input"
                placeholder="Ingresa tu usuario"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Contraseña
            </label>
            <div className="input-container">
              <Lock className="input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input"
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="btn-primary"
          >
            Iniciar Sesión
          </button>
        </div>

        <div className="login-demo">
          <p className="demo-text">
            <strong>Demo:</strong> Usuario: admin, Contraseña: 123456
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente de Home con Notas
const HomePage = ({ usuario, onLogout }) => {
  const [notas, setNotas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Cargar notas del localStorage al inicializar
  useEffect(() => {
    const notasGuardadas = localStorage.getItem('notas');
    if (notasGuardadas) {
      setNotas(JSON.parse(notasGuardadas));
    }
  }, []);

  // Guardar notas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('notas', JSON.stringify(notas));
  }, [notas]);

  const agregarNota = () => {
    if (titulo.trim() && contenido.trim()) {
      const nuevaNota = {
        id: Date.now(),
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        fecha: new Date().toLocaleDateString('es-ES')
      };
      
      setNotas([nuevaNota, ...notas]);
      setTitulo('');
      setContenido('');
      setMostrarFormulario(false);
    }
  };

  const eliminarNota = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      setNotas(notas.filter(nota => nota.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    onLogout();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      agregarNota();
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="header-title">Mis Notas</h1>
              <p className="header-subtitle">Bienvenido, {usuario}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="main-content">
        {/* Botón Nueva Nota */}
        <div className="mb-8">
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="new-note-btn"
          >
            <Plus className="h-5 w-5" />
            <span>Nueva Nota</span>
          </button>
        </div>

        {/* Formulario Nueva Nota */}
        {mostrarFormulario && (
          <div className="note-form">
            <h3 className="note-form-title">Crear Nueva Nota</h3>
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">
                  Título
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="Título de la nota"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Contenido
                </label>
                <textarea
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={4}
                  className="form-input"
                  style={{ paddingLeft: '1rem', resize: 'vertical' }}
                  placeholder="Escribe tu nota aquí... (Ctrl+Enter para guardar)"
                />
              </div>
              <div className="note-form-actions">
                <button
                  onClick={agregarNota}
                  disabled={!titulo.trim() || !contenido.trim()}
                  className="btn-success"
                >
                  Guardar Nota
                </button>
                <button
                  onClick={() => {
                    setMostrarFormulario(false);
                    setTitulo('');
                    setContenido('');
                  }}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Notas */}
        <div className="space-y-6">
          <div className="notes-header">
            <h2 className="notes-title">
              Tus Notas ({notas.length})
            </h2>
            {notas.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que quieres eliminar todas las notas?')) {
                    setNotas([]);
                  }
                }}
                className="btn-danger-text"
              >
                Eliminar todas
              </button>
            )}
          </div>

          {notas.length === 0 ? (
            <div className="empty-state">
              <FileText className="empty-icon h-12 w-12" />
              <h3 className="empty-title">No tienes notas aún</h3>
              <p className="empty-subtitle">Crea tu primera nota para comenzar</p>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="btn-primary inline"
              >
                Crear Primera Nota
              </button>
            </div>
          ) : (
            <div className="notes-grid">
              {notas.map((nota) => (
                <div key={nota.id} className="note-card">
                  <div className="note-card-content">
                    <div className="note-card-header">
                      <h3 className="note-title">
                        {nota.titulo}
                      </h3>
                      <button
                        onClick={() => eliminarNota(nota.id)}
                        className="note-delete-btn"
                        title="Eliminar nota"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="note-content">
                      {nota.contenido}
                    </p>
                    <div className="note-footer">
                      <span>Creada el {nota.fecha}</span>
                      <span className="note-id">
                        ID: {nota.id}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estadísticas */}
        {notas.length > 0 && (
          <div className="stats-container">
            <h3 className="stats-title">Estadísticas</h3>
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-value blue">{notas.length}</div>
                <div className="stat-label">Total de Notas</div>
              </div>
              <div className="stat-card green">
                <div className="stat-value green">
                  {Math.round(notas.reduce((acc, nota) => acc + nota.contenido.length, 0) / notas.length) || 0}
                </div>
                <div className="stat-label">Caracteres Promedio</div>
              </div>
              <div className="stat-card purple">
                <div className="stat-value purple">
                  {notas.length > 0 ? notas[0].fecha : '-'}
                </div>
                <div className="stat-label">Última Nota</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>MiApp Segura - Taller DevSecOps | Datos almacenados en localStorage</p>
        </div>
      </footer>
    </div>
  );
};

// Componente Principal de la App
const App = () => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Verificar si hay usuario logueado al inicializar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }
    setCargando(false);
  }, []);

  const handleLogin = (nombreUsuario) => {
    setUsuario(nombreUsuario);
  };

  const handleLogout = () => {
    setUsuario(null);
  };

  if (cargando) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {usuario ? (
        <HomePage usuario={usuario} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;