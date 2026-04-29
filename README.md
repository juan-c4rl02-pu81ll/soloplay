# 🎮 SoloPlay — Aprende programación con IA

> Juego educativo que genera preguntas automáticas basadas en el repositorio de tu profe, usando la API gratuita de Google Gemini.

---

## ¿Cuántos alumnos pueden jugar?

**Ilimitados.** Cada alumno usa su propia API key gratuita — los límites son por persona, no compartidos.

| Plan gratuito de Gemini (por alumno) | Límite |
|--------------------------------------|--------|
| Requests por minuto | 15 |
| Requests por día | 1.500 |
| **Preguntas de juego por día** | **~1.500** (el juego genera 12 por llamada, así que en la práctica son miles de preguntas) |

---

## 🚀 Cómo publicar el juego en GitHub Pages (una sola vez, lo hace el profe)

### Paso 1 — Subir el archivo al repo

1. Descargá `soloplay_github.html` de este repo
2. Subilo a tu repositorio de GitHub (puede ser el mismo repo de la clase o uno nuevo)
3. Si querés, renombralo a `index.html` para que sea la página principal

### Paso 2 — Activar GitHub Pages

1. En tu repositorio, andá a **Settings** (⚙️)
2. En el menú izquierdo, hacé clic en **Pages**
3. En *Source*, seleccioná **Deploy from a branch**
4. Elegí la rama `main` y la carpeta `/ (root)`
5. Hacé clic en **Save**
6. Esperá 1-2 minutos y GitHub te va a mostrar la URL

Tu URL va a ser algo así:
```
https://TU-USUARIO.github.io/TU-REPO/soloplay_github.html
```

### Paso 3 — Compartir con los alumnos

Compartí esa URL por el grupo/aula. Los alumnos solo necesitan abrirla en el navegador del celular o PC — **no instalan nada**.

---

## 📱 Cómo se configura cada alumno (una sola vez)

Al abrir el juego por primera vez, cada alumno completa 4 pasos:

### Paso 1 — API Key de Gemini (gratis)

1. Entrar a 👉 **https://aistudio.google.com/apikey**
2. Iniciar sesión con cualquier cuenta de Google
3. Hacer clic en **"Create API Key"**
4. Copiar la clave y pegarla en el juego

> ⚠️ La API key se guarda en el navegador del alumno. Nadie más la ve — ni el profe ni GitHub.

### Paso 2 — Nombre

Escribir su nombre o apodo. Se usa para personalizar el juego.

### Paso 3 — Repositorio del profe

Pegar la URL del repositorio o escribir `usuario/repo`:

```
https://github.com/aguscarrera77/Programaci-n-2026
```
o simplemente:
```
aguscarrera77/Programaci-n-2026
```

> ✅ El juego acepta ambos formatos automáticamente.

### Paso 4 — Reglas del juego

Leer las reglas y tocar **¡Comenzar a Jugar!**

**La configuración queda guardada.** La próxima vez que el alumno abra el juego, va directo a elegir tema.

---

## ⚙️ Cambiar la configuración después

Desde el juego, el alumno puede tocar el ícono de ajustes (⚙️) para:

- **Cambiar tema** — elegir otra carpeta del repo para practicar
- **Cambiar API Key** — si la key dejó de funcionar o quiere usar otra
- **Cambiar repo** — si el profe cambia de repositorio
- **Reiniciar Onboarding** — volver a configurar todo desde cero
- **Borrar todos los datos** — limpia la config del navegador

---

## 🎯 Cómo funciona el juego

```
Alumno abre la URL
        ↓
Lee el repositorio del profe (automático)
        ↓
Elige un tema para practicar:
  🌐 Todo el repositorio
  📂 Clase 1 - Variables
  📂 Clase 2 - Funciones   ← NUEVO (si el profe subió algo nuevo)
  📂 Clase 3 - POO
        ↓
La IA genera 12 preguntas de golpe (1 sola llamada a Gemini)
        ↓
El alumno las responde de a una
        ↓
Al llegar a la pregunta 10, ya genera las próximas 12 en segundo plano
```

### Sistema de dificultad automático

El juego sube la dificultad solo según el rendimiento:

| Nivel | Condición |
|-------|-----------|
| Básico | Al empezar |
| Intermedio | 5 respuestas correctas seguidas |
| Avanzado | 5 correctas más |
| Experto | 5 correctas más |

---

## 🔄 ¿Qué pasa cuando el profe sube código nuevo?

Automáticamente. Cada vez que un alumno abre el juego:

1. El juego verifica si hubo commits nuevos en el repo
2. Si hay cambios, reconstruye el índice de temas
3. Los temas nuevos aparecen con badge **NUEVO**
4. Las próximas preguntas incluyen el contenido nuevo

**El alumno no hace nada** — simplemente abre el juego y ya ve los temas actualizados.

---

## ❓ Preguntas frecuentes

**¿El juego funciona sin internet?**
No. Necesita internet para leer el repo de GitHub y llamar a la API de Gemini. Funciona con cualquier conexión de celular.

**¿La API key del alumno es segura?**
Sí. Se guarda solo en el navegador del alumno (localStorage), nunca se sube a ningún servidor.

**¿Qué pasa si se acaba el límite diario?**
El juego avisa con un mensaje claro y sugiere esperar unos minutos o el día siguiente. Con 12 preguntas por llamada, un alumno normal tarda varios días en llegar al límite.

**¿El juego funciona si lo descargo y abro con doble clic?**
No. Debe abrirse desde una URL `https://` (GitHub Pages, por ejemplo). Si se abre como `file://` los navegadores bloquean las llamadas a internet por seguridad.

**¿Puedo usar el mismo repo donde está el juego?**
Sí. Podés poner `soloplay_github.html` en el mismo repo que tiene el código de la clase.

**¿El profe necesita cuenta de Gemini?**
No. Solo los alumnos necesitan su propia key gratuita.

---

## 🛠️ Para desarrollo local (profe o alumnos avanzados)

Si querés probar el juego sin subirlo a GitHub Pages, usá VS Code con la extensión **Live Server**:

1. Instalá la extensión **Live Server** en VS Code
2. Clic derecho en `soloplay_github.html`
3. Seleccioná **"Open with Live Server"**
4. Se abre en `http://localhost:5500` — funciona perfectamente

---

## 📁 Estructura recomendada del repo de la clase

El juego detecta las carpetas como temas automáticamente. Cuanto más organizado esté el repo, mejor:

```
Programacion-2026/
├── soloplay_github.html     ← el juego
├── README.md                ← este archivo
├── clase01-variables/
│   ├── ejercicio1.js
│   └── ejercicio2.js
├── clase02-funciones/
│   ├── funciones.js
│   └── practica.js
├── clase03-arrays/
│   └── arrays.js
└── clase04-POO/
    ├── clases.js
    └── herencia.js
```

Cada carpeta = un tema en el selector del juego. Cuando el profe agrega `clase05-promesas/`, aparece automáticamente con badge **NUEVO** la próxima vez que los alumnos abran el juego.

---

*Creado para aprender programación de forma interactiva 🚀*
