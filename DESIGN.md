# El Presidente — Despacho presidencial

## Identidad

El escritorio del presidente dentro de un palco: el estadio aporta contexto,
tarjetas redondeadas organizan la lectura y los controles permiten decidir.
Anton conserva la identidad de títulos; Newsreader es la voz narrativa;
Chivo etiqueta cifras y controles. Inspirado en el mockup "Presidential
Broadside": prensa deportiva sudamericana con maquetación de app moderna,
no de diario impreso ni de simulación literal de escritorio.

## Paleta

| Token | Noche | Día |
|---|---|---|
| fondo | #0e2418 | #eef1e4 |
| fondo-2 | #163220 | #e0e6d3 |
| fondo-3 | #1d3c2b | #d2dac0 |
| tinta | #eef0e4 | #14251a |
| tinta-2 | #8a9889 | #5b685a |
| tinta-3 | #99a596 | #505e50 |
| corondel | #6a7c6c | #788374 |
| corondel-fuerte | #829182 | #616e60 |
| acento | #f2c94c | #7a5c00 |
| sobre-acento | #1c1204 | #fbf4df |
| alerta | #f07a6b | #b3261e |
| favorable | #9fd48f | #2c6a4c |

Los tokens CSS y las superficies exportadas en lib/color.ts deben coincidir
en fondo y fondo-2 (fondo-3 es solo un tercer nivel de tarjeta, sin
correspondencia en lib/color.ts). lib/paleta.test.ts verifica esa
correspondencia, texto a 4.5:1 y bordes a 3:1; npm run contraste audita
además el peor acento de club contra ambas superficies.
El color de cada club se adapta con tintaDeClub contra la superficie del
tema; los colores originales se reservan para bandas decorativas sin texto
encima. No usar rojo para acciones normales ni recolorear la aplicación
según el club.
El acento es dorado (bronce en la edición de día): la firma visual de la
presidencia — trofeos, decisión principal, selección activa — y el único
tono que no compite con el verde de fondo ni el rojo de alerta.

## Tres niveles

1. Escenario: fondos de palco de día/noche, sin movimiento ambiental.
2. Lectura: tarjetas (`.tarjeta`, `.tarjeta-plana`) sobre fondo, con borde
   sutil, esquina redondeada (`--radio` / `--radio-sm`) y sombra suave
   (`--sombra` / `--sombra-sm`) en vez de bordes gruesos o recuadros
   anidados sin jerarquía.
3. Controles: fondo-2 o fondo-3, borde funcional, selección inequívoca
   (anillo dorado + marca llena) y foco visible.

Cada pantalla de juego es una tarjeta principal; el HUD agrupa sus cinco
cifras en una bandeja redondeada propia: tres columnas hasta 580px y cinco
desde ahí, porque las cinco etiquetas completas no entran antes, ni siquiera
con texto grande. Ninguna etiqueta del HUD se recorta. Evitar apilar tarjeta sobre
tarjeta sin motivo: dentro de una tarjeta, las subdivisiones usan
`fondo-3` o una línea, no otro borde con sombra.

## Composición

Inicio: máximo 70rem. Cabecera y navegación comparten una imagen protegida
por un degradado tonal hacia fondo; el contenido empieza sin hueco intermedio.
El texto de la cabecera usa tinta, incluso la volanta pequeña.

Desde 1024px: columna principal flexible, secundaria de 20rem y espacio de 2rem.
La secundaria usa una línea lateral y no impone altura mínima.
Orden principal: partida guardada compacta, nueva presidencia, ayuda inicial.
Orden secundario: desafío diario, ranking, vitrina.
Privacidad y enlaces cierran la misma superficie.

Debajo de 1024px: una sola columna, 1rem interior más áreas seguras.
Cabecera compacta sin altura rígida. Ranking y vitrina plegables.
Los fondos verticales se usan debajo de 768px.

Ajustes, ayuda y resumen compartido: ancho de lectura máximo 40rem.
La partida llega hasta 70rem, pero su medida de lectura sigue siendo 40rem y la
define el contenedor de fase. Desde 1024px, `.palco-partida` arma dos columnas
—lectura y una secundaria de 20rem— que el HUD repite para alinear con ellas;
ambas pistas encogen para que con texto grande nada desborde. La columna
secundaria es hermana del contenedor de fase, nunca hija: el foco automático
busca dentro de la fase. Debajo de 1024px no se renderiza, para que no caiga
después de la barra de confirmación.
HUD, contenido y confirmación comparten alineaciones y fondo.
HUD sticky arriba; confirmación sticky abajo (con esquinas superiores
redondeadas y sombra hacia arriba) y en el flujo normal para reservar su
espacio. Ninguna decisión puede quedar tapada por ambas barras.

## Tipografía y controles

Escala de espacio: 4, 8, 12, 16, 24 y 32px.
Etiquetas a partir de 0.75rem; controles entre 0.875rem y 1rem;
prosa principal entre 1rem y 1.125rem, medida máxima 66ch.
Usar rem para respetar tamaño de texto. Anton en títulos (peso único: no
combinar con font-bold/font-black, `.font-titular` fuerza weight 400),
Newsreader en relatos y explicaciones, Chivo en etiquetas y cifras
tabulares (`tabular-nums`). Mayúsculas solo en títulos y etiquetas breves,
no en prosa.

Controles táctiles de al menos 44px. Texto largo envuelve; no truncar decisiones.
Acción principal con acento dorado sólido (`.boton-jugar`). Al azar y
continuar partida guardada usan borde y texto de acento. Personalizar
conserva icono, descripción y expansión dentro de una tarjeta propia.

El botón de la barra de decisión lleva debajo, en Chivo y sin mayúsculas, la
cifra que se mueve al firmar. La barra se marca con una banda superior de
alerta (`.barra-decision[data-urgente]`) solo cuando lo que se firma saca algo
del club o cierra la ventana; la nota que la acompaña va en tinta-2, nunca en
rojo. Los cupos que se gastan se cuentan en puntos llenos de acento sobre
puntos vacíos (`Cupos`), con el número disponible para lectores de pantalla.

País, liga y club permanecen visibles en secuencia vertical.
El campo de país lleva a la izquierda la bandera del país elegido, con borde
propio para que las bandas blancas no se pierdan contra la superficie, y el
rodillo del sorteo gira con la bandera de cada país. Donde el navegador soporta
appearance: base-select, la lista desplegada repite la bandera por fila como
fondo del option; donde no, cae al desplegable del sistema, solo con texto.
Sorteo jerárquico con rodillos de 750ms y pasos de 800ms.
Revelar saltea el efecto sin cambiar el resultado.
No duplicar debajo el destino ya mostrado en los controles.

## Narrativa y datos

El acta de asunción se lee como documento: número de acta y folio en la
volanta, sello de asumido (`.sello-acta`, rotado con `rotate` porque
`.entrar-nota` deja fijado el `transform`), designación del presidente sobre
`tarjeta-plana` y declaración en conferencia de prensa antes de abrir el
mercado. Las declaraciones salen de `content/declaraciones.ts` por semilla y
modo, como el nombre y el retrato.

El evento se lee como expediente: volanta con su número, lugar y hora de
entrada bajo el titular —de `content/expedientes.ts`, por id de carta— y los
montos y las frases textuales del relato marcados con peso y filete
(`.termino-clave`), nunca con color, hasta tres por relato.

Cada opción declara su carácter con una etiqueta de un vocabulario cerrado de
seis tonos (`TONO_LABEL`), en Chivo sobre el título de la opción. Los tonos se
distinguen por la palabra, nunca por color.

Las opciones narrativas se presentan como tarjetas seleccionables con
marca de radio (`.fila-opcion` / `.marca-radio`). La asimetría es deliberada:
la opción narrativa no anticipa números, solo su pista en prosa al
seleccionarse; el mercado y la mesa chica sí muestran cifras exactas antes de
firmar, porque son contratos y no decisiones políticas.
En el mercado se marcan varias operaciones y se firman juntas, hasta el tope de
la ventana; el botón lleva el neto de caja y la barra, el saldo que queda más
plantel y hinchada. Queda bloqueado lo que dejaría la caja en el umbral de inhibición, con
el motivo escrito en la tarjeta; una venta en la misma tanda vuelve a habilitar
la compra.
Cada oferta lleva edad, arquetipo y el comentario del jugador en la tarjeta, y
una etiqueta de tipo donde el color marca la dirección (entra, entra gratis,
sale) y el borde punteado marca lo temporal: préstamo y cesión. La barra de
firma solo agrega lo que la tarjeta no dice.
Nunca sustituir cifras contractuales por señales vagas.
El riesgo de un pase dice qué pasa si sale: cuánto suma el jugador lesionado
frente a lo prometido. Cuando ocurre, el juego lo avisa con nombre en la
pantalla siguiente, junto a los avisos de préstamos que vuelven.

Las ilustraciones marcan contexto: objetos pequeños junto a encabezados,
escenas panorámicas compactas. Son decorativas, con alt vacío y dimensiones
reservadas; las etiquetas y números siguen siendo texto real.
No rellenar espacios vacíos con imágenes ni interponerlas entre decisión y firma.
Originales y variantes -v1 intactos; procedencia en docs/asset-manifest.json.

## Movimiento

Feedback de controles entre 160 y 220ms; cambios de contenido entre 200 y 280ms.
Preferir transform y opacity. Cambio de tema con fundido de 240ms.
Hover solo donde esté disponible. Press táctil breve.
Celebraciones únicamente ante hitos; nada parpadea permanentemente.
Con prefers-reduced-motion: sorteo inmediato, sin desplazamientos decorativos,
manteniendo selección, mensajes y foco.

## Verificación

Revisar 375, 768, 1280 y 1440px en ambos temas, texto grande y zoom 200%.
Cubrir inicio, guardado, sorteo, ranking vacío/no disponible, vitrina, evento,
mercado, mesa chica, temporada, elección, final y resumen compartido.
Revisar teclado, áreas seguras, textos largos y ausencia de desborde horizontal.
Ejecutar npm test, npm run typecheck, npm run lint, npm run build y npm run contraste.
Conservar motor, almacenamiento, enlaces, contenido y endpoints sin cambios.
