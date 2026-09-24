# Cazadores de Evidencia 🔍

Juego de trivia web sobre la investigación *"Percepción de los pacientes crónicos y de alto costo sobre la entrega de medicamentos: EPS intervenidas y no intervenidas en Medellín, 2024-2026"*.

Hecho por Deisy Tatiana Correa Palacio y Verónica Marcela Henao Jaramillo — IU Digital de Antioquia, Fundamentos de la Investigación.

Es una página estática (HTML + CSS + JavaScript, sin instalaciones ni servidores). Funciona en cualquier navegador y celular, y sirve para publicar gratis en GitHub Pages.

## Archivos

- `index.html` — la página del juego (las pantallas).
- `styles.css` — el diseño y los colores.
- `game.js` — la lógica, las preguntas y el editor.
- `README.md` — este instructivo.

**Los 4 archivos deben subirse juntos.**

---

## Qué puede hacer el juego

- **De 1 a 4 jugadores, sin registro.** Puedes jugar solo (modo práctica) o competir hasta 4. Cada quien escribe solo su nombre (o se deja en blanco y queda "Jugador 1", "Jugador 2"…).
- **Por turnos:** cada pregunta la responden todos los jugadores, uno tras otro. Gana más puntos quien acierta y responde rápido (100 pts + hasta 50 por velocidad).
- **Podio final** con el 🥇🥈🥉 y la tabla completa de resultados.
- **Preguntas en orden aleatorio** cada partida.
- **Editor integrado:** puedes añadir, editar, borrar y reordenar preguntas, cambiar la respuesta correcta y la explicación, ajustar los nombres y colores de las etapas y el tiempo por pregunta. **No necesitas tocar código.**

---

## Cómo probarlo en tu computador

Haz doble clic en `index.html`. Se abre en el navegador. Nada más.

---

## Cómo editar las preguntas y los colores (sin programar)

1. En la pantalla de inicio, arriba a la derecha, haz clic en **✏️ Editar preguntas y colores**.
2. Ahí puedes:
   - **Cambiar nombres y colores** de cada etapa (el color se aplica al instante).
   - **Cambiar los segundos** por pregunta.
   - **Editar** el texto de cualquier pregunta, sus opciones y su explicación.
   - **Marcar la respuesta correcta** con el círculo a la izquierda de cada opción.
   - **Añadir** una pregunta con el botón "+ Añadir pregunta".
   - **Reordenar** con las flechas ▲▼ y **borrar** con la papelera 🗑.
3. Todo se **guarda solo** en tu navegador. Al volver a abrir el juego, tus cambios siguen ahí.

### Guardar una copia / pasarla a otro equipo

- **⬇ Exportar:** descarga un archivo `cazadores-preguntas.json` con todas tus preguntas y colores. Guárdalo como respaldo.
- **⬆ Importar:** carga ese archivo en otro computador o navegador para recuperar exactamente tus preguntas.
- **↺ Restablecer:** vuelve a las 14 preguntas y colores originales (borra tus cambios).

> Nota: los cambios del editor se guardan en el navegador de cada equipo. Si publicas el juego en GitHub Pages y quieres que **todos** vean tus preguntas nuevas por defecto, exporta tu JSON y pídeme que lo deje como banco de preguntas fijo dentro de `game.js` (o reemplaza el bloque `DEFAULT_DATA`).

---

## Cómo publicarlo GRATIS en GitHub Pages

Necesitas una cuenta gratis en https://github.com

### Opción A — Desde la web (la más fácil, sin instalar nada)

1. Entra a https://github.com e inicia sesión.
2. Arriba a la derecha: **+** → **New repository**.
3. Nombre, por ejemplo `cazadores-de-evidencia`. Márcalo **Public** y crea el repositorio.
4. Haz clic en **Add file → Upload files**.
5. Arrastra los **4 archivos** (`index.html`, `styles.css`, `game.js`, `README.md`) y haz **Commit changes**.
6. Ve a **Settings** → menú izquierdo **Pages**.
7. En **Source** elige **Deploy from a branch**; en **Branch** selecciona **main** y carpeta **/ (root)**. Guarda.
8. Espera 1 o 2 minutos y recarga. Verás un enlace como:
   `https://TU-USUARIO.github.io/cazadores-de-evidencia/`
9. ¡Ese es el link para compartir en el aula!

### Opción B — Desde la terminal (si tienes Git)

Dentro de la carpeta `juego-web`, con el repositorio ya creado vacío en GitHub:

```bash
git init
git add index.html styles.css game.js README.md
git commit -m "Juego Cazadores de Evidencia"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/cazadores-de-evidencia.git
git push -u origin main
```

Luego activa Pages (pasos 6 a 8 de la Opción A).

---

## Cómo usarlo en la clase

1. Proyecta la pantalla de inicio y lee la historia de Don Gustavo.
2. Elige cuántos juegan (2 a 4) y escriban sus nombres.
3. Jueguen las preguntas por turnos: cada quien responde en su turno.
4. Al final aparece el podio con el ganador. Comparen los puntajes.

## Notas técnicas

- No usa librerías externas: funciona incluso sin internet una vez cargado.
- Puntaje: 100 puntos por acierto + hasta 50 extra por rapidez.
- Los datos del editor se guardan con `localStorage` bajo la clave `cazadores_data_v1`.
