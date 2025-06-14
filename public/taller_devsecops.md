# Taller Evaluado: Pipeline DevSecOps Básico - Versión Simplificada

## 📋 Información General

**Duración:** 1 semana  
**Modalidad:** Grupal (max 4) 
**Ponderación N2:** 60%  
**Entrega:** Repositorio GitHub + Documento PDF (4-6 páginas)

---

## 💰 TODAS LAS HERRAMIENTAS SON GRATUITAS

### ✅ **Herramientas 100% Gratuitas (Sin Limitaciones)**

| Herramienta | Costo | Limitaciones | Alternativa |
|-------------|-------|--------------|-------------|
| **GitHub Actions** | ✅ GRATIS | 2,000 min/mes (privado) | Hacer repo público = ilimitado |
| **CodeQL** | ✅ GRATIS | Ninguna | Integrado en GitHub |
| **Docker** | ✅ GRATIS | Ninguna para uso personal | - |
| **Bandit** | ✅ GRATIS | Ninguna | - |
| **OWASP Dependency Check** | ✅ GRATIS | Ninguna | - |
| **Trivy** | ✅ GRATIS | Ninguna | - |
| **ESLint/Pylint** | ✅ GRATIS | Ninguna | - |

### 🎓 **GitHub Student Pack (Recomendado)**
- **Gratis para estudiantes**: https://education.github.com/pack
- **Incluye**: GitHub Pro, más minutos de Actions, Copilot gratis
- **Requisito**: Email institucional (.edu)

### 📝 **Recomendación Final para Estudiantes**
```yaml
# Configuración 100% gratuita recomendada:
Repositorio: GitHub (público) ✅ GRATIS
Pipeline: GitHub Actions ✅ GRATIS  
Análisis: CodeQL + Bandit ✅ GRATIS
Contenedores: Docker ✅ GRATIS
Escaneo: Trivy + OWASP ✅ GRATIS
```


---

## 🎯 Objetivos

### Objetivo General
Crear un pipeline DevSecOps básico que integre controles de seguridad automatizados en una aplicación web simple en la cual ha sido abordada con ennfoque de desarrollo seguro.

### Objetivos Específicos
- Desarrollar una aplicación web básica con autenticación
- Configurar un pipeline CI/CD con 2-3 herramientas de seguridad
- Desplegar en contenedor Docker
- Documentar el proceso y evidencias

---

## 📚 Proyecto: "MiApp Segura"

**Aplicación Simple de Notas Personales:**
- ✅ Login básico (usuario/contraseña)
- ✅ Crear, ver y eliminar notas
- ✅ Página principal con lista de notas
- ✅ API simple (opcional)

---

## 🛠️ Tecnologías Requeridas

### Lenguajes Sugeridos (Elige el que mejor conozcas)
- **Python**: Flask + SQLite
- **Node.js**: Express + archivo JSON
- **Java**: Spring Boot + H2
- **PHP**: Laravel/CodeIgniter + MySQL

### Herramientas Obligatorias (Solo 3 - TODAS GRATUITAS)
1. **GitHub/GitLab**: Repositorio y CI/CD ✅ **100% Gratis**
2. **Análisis de Código** (Elige una opción):
   - **Opción A:** SonarCloud (gratis para repos públicos) ✅ **Gratis**
   - **Opción B:** CodeQL (integrado en GitHub) ✅ **100% Gratis** 
   - **Opción C:** ESLint/Pylint (herramientas locales) ✅ **100% Gratis**
3. **Docker**: Containerización ✅ **100% Gratis**

### Herramientas Opcionales (+5 puntos extra - TODAS GRATUITAS)
- OWASP Dependency Check ✅ **100% Gratis**
- Trivy (escaneo de contenedores) ✅ **100% Gratis**
- Bandit (Python security linter) ✅ **100% Gratis**

---

## 📝 Entregables Simplificados

### 1. **Aplicación Funcional (30 puntos)**
- ✅ Código fuente en GitHub
- ✅ Funcionalidades básicas trabajando
- ✅ Dockerfile funcionando

### 2. **Pipeline DevSecOps (40 puntos)**
- ✅ GitHub Actions configurado
- ✅ SonarCloud integrado
- ✅ Pipeline ejecutándose correctamente

### 3. **Documentación (30 puntos)**
- ✅ README del proyecto
- ✅ Documento PDF (4-6 páginas)
- ✅ Capturas de pantalla como evidencia

---

## 🚀 Desarrollo Paso a Paso

### **Crear la Aplicación**

#### Ejemplo Simple en Python/Flask:
```python
# app.py
from flask import Flask, render_template, request, redirect, session
import json
import os

app = Flask(__name__)
app.secret_key = 'tu-clave-secreta-aqui'  # ¡CAMBIAR!

# Archivo para guardar notas
NOTAS_FILE = 'notas.json'

def cargar_notas():
    if os.path.exists(NOTAS_FILE):
        with open(NOTAS_FILE, 'r') as f:
            return json.load(f)
    return []

def guardar_notas(notas):
    with open(NOTAS_FILE, 'w') as f:
        json.dump(notas, f)

@app.route('/')
def home():
    if 'usuario' not in session:
        return redirect('/login')
    
    notas = cargar_notas()
    return render_template('home.html', notas=notas)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form['usuario']
        password = request.form['password']
        
        # Login super básico (¡INSEGURO para producción!)
        if usuario == 'admin' and password == '123456':
            session['usuario'] = usuario
            return redirect('/')
        else:
            return render_template('login.html', error='Credenciales incorrectas')
    
    return render_template('login.html')

@app.route('/nueva-nota', methods=['POST'])
def nueva_nota():
    if 'usuario' not in session:
        return redirect('/login')
    
    titulo = request.form['titulo']
    contenido = request.form['contenido']
    
    notas = cargar_notas()
    notas.append({'titulo': titulo, 'contenido': contenido})
    guardar_notas(notas)
    
    return redirect('/')

@app.route('/logout')
def logout():
    session.pop('usuario', None)
    return redirect('/login')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

#### Dockerfile Simple:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Copiar requirements
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copiar código
COPY . .

# Exponer puerto
EXPOSE 5000

# Ejecutar aplicación
CMD ["python", "app.py"]
```

#### requirements.txt:
```
Flask==2.3.3
```

### **Configurar Pipeline DevSecOps**

#### Archivo: `.github/workflows/pipeline.yml`
```yaml
name: Pipeline DevSecOps Básico

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  # Fase 1: Análisis de Código (100% GRATIS)
  analisis-codigo:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v3
      with:
        fetch-depth: 0
    
    - name: Configurar Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
    
    - name: Instalar dependencias
      run: |
        pip install -r requirements.txt
        pip install bandit  # Security linter gratuito
    
    # OPCIÓN A: CodeQL (100% gratuito)
    - name: Inicializar CodeQL
      uses: github/codeql-action/init@v2
      with:
        languages: python
    
    - name: Análisis CodeQL
      uses: github/codeql-action/analyze@v2
    
    # OPCIÓN B: Bandit (Python security - 100% gratuito)
    - name: Análisis de Seguridad con Bandit
      run: |
        bandit -r . -f json -o bandit-report.json || true
        cat bandit-report.json

  # Fase 2: Construir y Probar Docker
  construir-docker:
    runs-on: ubuntu-latest
    needs: analisis-codigo
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v3
    
    - name: Construir imagen Docker
      run: |
        docker build -t miapp-segura:latest .
    
    - name: Probar contenedor
      run: |
        docker run -d -p 5000:5000 --name test-app miapp-segura:latest
        sleep 10
        curl -f http://localhost:5000/login || exit 1
        docker stop test-app
        docker rm test-app
    
    - name: Guardar imagen (opcional)
      run: |
        docker save miapp-segura:latest > miapp-imagen.tar
    
    - name: Subir artefacto
      uses: actions/upload-artifact@v3
      with:
        name: docker-image
        path: miapp-imagen.tar
```

### **Día 5: Configurar Herramientas de Seguridad (100% GRATIS)**

#### **Opción A: CodeQL (Recomendado - 100% Gratuito)**
```yaml
# Ya incluido en el pipeline - No requiere configuración adicional
# CodeQL se activa automáticamente en repositorios públicos de GitHub
```

#### **Opción B: SonarCloud (Solo para repos públicos)**
Si eliges SonarCloud, crea: `sonar-project.properties`
```properties
sonar.projectKey=tu-usuario_miapp-segura
sonar.organization=tu-usuario

# Información del proyecto
sonar.projectName=MiApp Segura
sonar.projectVersion=1.0

# Configuración de archivos
sonar.sources=.
sonar.exclusions=**/*.tar,**/venv/**,**/__pycache__/**,**/node_modules/**
```

**Pasos para SonarCloud (SOLO si repo es público):**
1. Ir a https://sonarcloud.io
2. Login con GitHub (GRATIS para repos públicos)
3. Crear proyecto
4. Agregar SONAR_TOKEN en GitHub Secrets

#### **Opción C: Herramientas Locales (100% Gratuitas)**
```bash
# Para Python
pip install bandit pylint safety

# Ejecutar análisis local
bandit -r . -f json -o security-report.json
pylint *.py
safety check
```

### **Día 6-7: Documentación y Evidencias**

#### Estructura del README.md:
```markdown
# MiApp Segura - Pipeline DevSecOps

## Descripción
Aplicación web simple de notas personales con pipeline DevSecOps integrado.

## Características
- Login básico
- Gestión de notas (crear, ver, eliminar)
- Containerización con Docker
- Pipeline CI/CD con controles de seguridad

## Instalación Local
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/miapp-segura.git

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar aplicación
python app.py
```

## Uso con Docker
```bash
# Construir imagen
docker build -t miapp-segura .

# Ejecutar contenedor
docker run -p 5000:5000 miapp-segura
```

## Pipeline DevSecOps
- **Análisis de código**: SonarCloud
- **Construcción**: Docker automatizado
- **Pruebas**: Verificación de funcionamiento

## Evidencias
- Badge de SonarCloud: [Insertar badge aquí]
- Estado del pipeline: [Insertar badge de GitHub Actions]
```

---

## 📊 Plantillas HTML Básicas

### login.html
```html
<!DOCTYPE html>
<html>
<head>
    <title>Login - MiApp Segura</title>
    <style>
        body { font-family: Arial; max-width: 400px; margin: 100px auto; }
        .form-group { margin: 10px 0; }
        input { width: 100%; padding: 8px; }
        button { width: 100%; padding: 10px; background: #007bff; color: white; }
        .error { color: red; }
    </style>
</head>
<body>
    <h2>Iniciar Sesión</h2>
    {% if error %}
        <div class="error">{{ error }}</div>
    {% endif %}
    
    <form method="POST">
        <div class="form-group">
            <input type="text" name="usuario" placeholder="Usuario" required>
        </div>
        <div class="form-group">
            <input type="password" name="password" placeholder="Contraseña" required>
        </div>
        <button type="submit">Ingresar</button>
    </form>
    
    <p><small>Usuario: admin, Contraseña: 123456</small></p>
</body>
</html>
```

### home.html
```html
<!DOCTYPE html>
<html>
<head>
    <title>Mis Notas - MiApp Segura</title>
    <style>
        body { font-family: Arial; max-width: 800px; margin: 20px auto; }
        .header { display: flex; justify-content: space-between; align-items: center; }
        .nota { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
        .form-group { margin: 10px 0; }
        input, textarea { width: 100%; padding: 8px; }
        button { padding: 10px 20px; background: #007bff; color: white; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Mis Notas</h1>
        <a href="/logout">Cerrar Sesión</a>
    </div>
    
    <h3>Nueva Nota</h3>
    <form method="POST" action="/nueva-nota">
        <div class="form-group">
            <input type="text" name="titulo" placeholder="Título de la nota" required>
        </div>
        <div class="form-group">
            <textarea name="contenido" placeholder="Contenido de la nota" rows="4" required></textarea>
        </div>
        <button type="submit">Guardar Nota</button>
    </form>
    
    <h3>Mis Notas ({{ notas|length }})</h3>
    {% for nota in notas %}
        <div class="nota">
            <h4>{{ nota.titulo }}</h4>
            <p>{{ nota.contenido }}</p>
        </div>
    {% endfor %}
</body>
</html>
```

---

## 📋 Criterios de Evaluación Simplificados

### Distribución de Puntos

| Aspecto | Puntos | Descripción |
|---------|--------|-------------|
| **Aplicación Funcional** | 30 | App funciona correctamente con login y notas |
| **Pipeline DevSecOps** | 40 | GitHub Actions + SonarCloud configurados |
| **Documentación** | 30 | README + PDF con evidencias |
| **Puntos Extra** | +5 | Herramientas adicionales (Trivy, etc.) |

### Criterios de Éxito

✅ **Para aprobar (70+ puntos):**
- Aplicación funciona localmente
- Pipeline ejecuta sin errores
- SonarCloud muestra análisis
- Documentación básica presente

✅ **Para excelencia (90+ puntos):**
- Código limpio sin vulnerabilidades críticas
- Pipeline completo con múltiples herramientas
- Documentación profesional con análisis

---

## 📝 Documento PDF Requerido (4-6 páginas)

### Estructura Simplificada:
1. **Portada** (0.5 página)
   - Título del proyecto
   - Nombre del estudiante
   - Fecha

2. **Introducción** (0.5 página)
   - Qué hace la aplicación
   - Tecnologías utilizadas

3. **Pipeline DevSecOps** (2 páginas)
   - Descripción del pipeline
   - Herramientas utilizadas
   - Capturas de pantalla del pipeline funcionando

4. **Análisis de Seguridad** (1 página)
   - Resultados de SonarCloud
   - Vulnerabilidades encontradas (si las hay)
   - Cómo se solucionaron

5. **Conclusiones** (1 página)
   - Qué aprendiste
   - Dificultades encontradas
   - Mejoras futuras

---

## 🎯 Lista de Verificación Final

### ✅ **Antes de Entregar:**
- [ ] Aplicación funciona localmente
- [ ] Pipeline ejecuta exitosamente
- [ ] SonarCloud muestra análisis
- [ ] README.md completo
- [ ] Documento PDF de 4-6 páginas
- [ ] Capturas de pantalla incluidas
- [ ] Repositorio público en GitHub

### ✅ **Evidencias Mínimas Requeridas:**
- [ ] Captura del pipeline verde (exitoso)
- [ ] Pantalla de SonarCloud con análisis
- [ ] Aplicación funcionando en navegador
- [ ] Contenedor Docker ejecutándose

---

## 💡 Consejos para el Éxito

### **Errores Comunes a Evitar:**
- No hardcodear contraseñas reales
- Configurar correctamente los secrets de GitHub
- Probar localmente antes de hacer push
- No olvidar crear las carpetas `templates/`

### **Recursos de Ayuda (Todos Gratuitos):**
- **GitHub Actions**: https://docs.github.com/actions (GRATIS)
- **CodeQL**: https://docs.github.com/code-security/code-scanning (GRATIS)
- **GitHub Student Pack**: https://education.github.com/pack (GRATIS para estudiantes)
- **Docker**: https://docs.docker.com/get-started/ (GRATIS)
- **Bandit**: https://bandit.readthedocs.io/ (GRATIS)
- **OWASP Dependency Check**: https://owasp.org/www-project-dependency-check/ (GRATIS)

 