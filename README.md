# El Presidente

Un roguelike de navegador donde dirigís un club de fútbol argentino. Ganás la
elección y tenés cuatro mandatos para que no te echen: manejás la caja, la
hinchada, los socios, el plantel y la influencia. Los partidos no los jugás
vos —armás el plantel y el plantel responde— y cada cuatro temporadas la gente
vota.

No hay game over: hay elección perdida, asamblea, quiebra, descenso fatal. Y en
el mejor de los casos, una tribuna con tu nombre.

Pensado para el teléfono y para una partida de diez minutos.

---

## Cómo se corre

```bash
npm install
```

```bash
npm run dev
```

En <http://localhost:3000>. **No hace falta base de datos**: el juego entero
funciona sin configurar nada. Lo único que no aparece sin `DATABASE_URL` es la
tabla de posiciones, porque sus rutas responden 503 y la interfaz las esconde.
Las variables que existen, y para qué sirve cada una, están en
[`.env.example`](.env.example). Para publicarlo alcanza con cualquier hosting
que corra Next: no hay nada propio del proveedor en el código.

| | |
|---|---|
| `npm run dev` | servidor de desarrollo |
| `npm test` | 140 tests, sin DOM |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | eslint |
| `npm run build` | build de producción |

`npm install` además activa `.githooks/pre-commit`, que frena el commit si en
lo que está por entrar hay una cadena de conexión con contraseña, un token de
Neon, AWS, GitHub o Anthropic, un bloque de clave privada, un archivo de
entorno o algo de más de 5 MB. `.gitignore` filtra por nombre; el hook lee el
contenido, que es lo que un nombre no puede ver.

---

## Cómo está hecho

Next 16, React 19, Tailwind v4, TypeScript. Postgres por `DATABASE_URL`, sin
SDK de ningún proveedor.

### El motor es puro y determinista

Una presidencia entera está descrita por cuatro cosas: **semilla, club, modo y
la lista de decisiones**. Nada más. De ahí sale casi todo lo demás:

- **El link para compartir no necesita servidor.** Lleva la partida adentro y
  el destinatario la reconstruye con el mismo motor. Una presidencia completa
  entra en unos setenta caracteres (`lib/share.ts`).
- **El puntaje se verifica en el servidor** reproduciendo la partida. No se
  confía en lo que manda el navegador (`app/api/puntaje/route.ts`).
- **Se puede simular.** Miles de presidencias por segundo, sin navegador, que
  es lo que permite balancear midiendo en vez de adivinando.
- **Los tests corren en Node puro**, sin montar un solo componente.

### El contenido son datos

Los eventos son objetos declarativos tipados. Sumar contenido es agregar un
archivo en `content/events/` y listarlo en su índice: el motor no se toca.

Hoy son **167 cartas** repartidas en doce frentes, **344 clubes** en tres
categorías, 36 títulos y 18 logros. La división entre cartas generales y
condicionales no es estética y está explicada en
[`content/events/index.ts`](content/events/index.ts): solo las generales
arreglan la repetición en una partida larga.

```
lib/engine/    el motor: estado, efectos, eventos, mercado, mesa chica, elecciones
content/       clubes, eventos, títulos, logros, nombres de guiño
components/    la interfaz, mobile-first
app/           páginas y las dos rutas de API
scripts/       las herramientas de medición
db/migrations/ SQL, aplicado con `npm run migrar`
```

### Los cuatro modos

Tres duraciones y una dificultad. Cada uno con su propia tabla de posiciones,
porque el puntaje crece con las temporadas jugadas y una sola tabla mezclaría
juegos distintos.

| | Temporadas | Completan* |
|---|---|---|
| Corta | 8 | 78,8% |
| Normal | 16 | 62,7% |
| Larga | 32 | 46,8% |
| En llamas | 16 | 15,8% |

<sub>* Medido con la política `greedy` de `npm run simulate`, que representa a
alguien que lee las consecuencias antes de elegir.</sub>

**En llamas** recibís el club con 22 millones de deuda —inhibido, no podés
comprar a nadie—, la hinchada por debajo del corte electoral y un plantel
demasiado bueno para lo que el club puede pagar. Venderlo es la única caja que
hay.

---

## Medir antes de decidir

Este proyecto tiene una regla y es la que más veces evitó un error: **cuando
una decisión de diseño se puede medir, se mide.** Varias veces la medición
contradijo la intuición de quien la escribió, y quedó anotado en el código
cuando pasó.

| | |
|---|---|
| `npm run simulate 3000 --modo=todos` | balance: finales, puntajes, cuántas completan |
| `npm run cobertura -- --modo=larga` | qué cartas salen, cuáles nunca, cuáles se repiten |
| `npm run contraste` | contraste de la paleta contra WCAG |
| `npm run cracks` | que los nombres de guiño no se repitan en una partida |
| `npx tsx scripts/llamas.ts` | cuánto más difícil es el modo en llamas y dónde se muere |

Y para leer el contenido con los ojos en vez de con números, `/cartas` —solo en
desarrollo— muestra las 167 cartas renderizadas con el componente de verdad.
Existe porque encontrar una carta puntual jugando es cuestión de suerte, y así
había prosa comiteada que nunca había pasado por una pantalla.

---

## Sobre los nombres

Los clubes son reales; los nombres propios, no. Los dirigentes y los jugadores
que aparecen son juegos de palabras —*Bantiago Sernabéu*, *Mavier Jascherano*—
con una línea editorial explícita en
[`content/parodias.ts`](content/parodias.ts): el chiste es fonético y nunca
insinúa un delito de una persona real. Las cartas de corrupción le pasan al
club de la partida, que es de ficción.

---

## Licencia

Copyright © 2026 Bruno Martínez.

[GNU Affero General Public License v3.0](LICENSE). Podés usar, estudiar,
modificar y compartir esto libremente. La condición es una sola y es la que
distingue a la AGPL de la GPL común: **si publicás una versión modificada en un
servidor, tenés que ofrecerle el código a quien la use.** No alcanza con no
distribuir binarios; que la gente lo juegue por internet ya cuenta.

O sea: cualquiera puede levantar su propia versión, y ninguna puede ser una
caja cerrada. Quien quiera hacer un producto cerrado con esto tiene que pedir
otra licencia.

Los nombres de los clubes son de sus clubes: la licencia cubre el código y los
textos escritos para el juego, no las marcas ajenas que el juego menciona.
