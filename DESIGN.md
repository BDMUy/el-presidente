# El Presidente — Palco editorial

## Identidad

El escritorio del presidente dentro de un palco: el estadio aporta contexto,
la superficie editorial organiza la lectura y los controles permiten decidir.
Archivo conserva la identidad de títulos y controles; Newsreader es la voz narrativa.
No es un dashboard de tarjetas ni una simulación literal de escritorio.

## Paleta

| Token | Noche | Día |
|---|---|---|
| fondo | #0e2418 | #eef1e4 |
| fondo-2 | #163220 | #e0e6d3 |
| tinta | #eef0e4 | #14251a |
| tinta-2 | #8a9889 | #5b685a |
| tinta-3 | #99a596 | #505e50 |
| corondel | #6a7c6c | #788374 |
| corondel-fuerte | #829182 | #616e60 |
| acento | #7ec8e3 | #0d5f7c |
| sobre-acento | #05202b | #f3f6ec |
| alerta | #f07a6b | #b3261e |
| favorable | #9fd48f | #2c6a4c |

Los tokens CSS y las superficies exportadas en lib/color.ts deben coincidir.
lib/paleta.test.ts verifica esa correspondencia, texto a 4.5:1 y bordes a 3:1.
El color de cada club se adapta con tintaDeClub contra la superficie del tema;
los colores originales se reservan para bandas decorativas sin texto encima.
No usar rojo para acciones normales ni recolorear la aplicación según el club.
El acento es celeste: el único color frío de la pantalla, para que la acción no se
confunda con el verde del fondo ni con el rojo de alerta.

## Tres niveles

1. Escenario: fondos de palco de día/noche, sin movimiento ambiental.
2. Lectura: superficie continua fondo, sin transparencias detrás de decisiones.
3. Controles: fondo-2, borde funcional, selección inequívoca y foco visible.

Las secciones se separan con espacio o líneas, no con cajas anidadas.
Recuadro organiza el contenido y su entrada; no añade otra tarjeta.
No usar perforaciones de tickets, diagonales ornamentales, glassmorphism,
sombras por tarjeta ni bordes superiores gruesos repetidos.

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

Partida, ajustes, ayuda y resumen compartido: ancho de lectura máximo 40rem.
HUD, contenido y confirmación comparten alineaciones y fondo.
HUD sticky arriba; confirmación sticky abajo y en el flujo normal para reservar
su espacio. Ninguna decisión puede quedar tapada por ambas barras.

## Tipografía y controles

Escala de espacio: 4, 8, 12, 16, 24 y 32px.
Etiquetas a partir de 0.75rem; controles entre 0.875rem y 1rem;
prosa principal entre 1rem y 1.125rem, medida máxima 66ch.
Usar rem para respetar tamaño de texto. Archivo condensada en títulos,
Newsreader en relatos y explicaciones; cifras con tabular-nums.
Mayúsculas solo en títulos y etiquetas breves, no en prosa.

Controles táctiles de al menos 44px. Texto largo envuelve; no truncar decisiones.
Acción principal con acento sólido. Al azar y continuar partida guardada
usan borde y texto de acento. Personalizar conserva icono, descripción y
expansión entre separadores, sin otra tarjeta dorada.

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

Las opciones narrativas muestran consecuencias graduadas, como HINCHADA ++.
Las operaciones de mercado y mesa chica muestran cifras exactas antes de firmar.
En el mercado se marcan varias operaciones y se firman juntas, hasta el tope de
la ventana; la barra muestra el neto de caja, plantel y hinchada de todo lo
marcado. Queda bloqueado lo que dejaría la caja en el umbral de inhibición, con
el motivo escrito en la tarjeta; una venta en la misma tanda vuelve a habilitar
la compra.
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
