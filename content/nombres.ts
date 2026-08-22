import type { Country } from '@/lib/engine/types';

export const NOMBRES: Record<Country, string[]> = {
  argentina: [
    'Matías', 'Lucas', 'Nahuel', 'Julián', 'Facundo', 'Tomás', 'Agustín', 'Franco',
    'Bruno', 'Emiliano', 'Thiago', 'Valentín', 'Ramiro', 'Joaquín', 'Ignacio', 'Gonzalo',
    'Alan', 'Brian', 'Kevin', 'Maximiliano', 'Rodrigo', 'Santiago', 'Elías', 'Lautaro',
  ],
  uruguay: [
    'Rodrigo', 'Nicolás', 'Sebastián', 'Maximiliano', 'Ignacio', 'Martín', 'Diego', 'Federico',
    'Andrés', 'Fernando', 'Gastón', 'Leandro', 'Guillermo', 'Mauricio', 'Marcelo', 'Damián',
    'Cristian', 'Gerónimo', 'Jonathan', 'Guzmán', 'Maicol', 'Rodolfo', 'Braian', 'Nahitan',
  ],
};

export const APELLIDOS: Record<Country, string[]> = {
  argentina: [
    'Ferreyra', 'Quiroga', 'Bustamante', 'Ledesma', 'Ojeda', 'Sosa', 'Villalba', 'Cáceres',
    'Maidana', 'Peralta', 'Aguirre', 'Coronel', 'Barrios', 'Zárate', 'Bogado', 'Insúa',
    'Mansilla', 'Verón', 'Cabral', 'Rolón', 'Arce', 'Chávez', 'Godoy', 'Almirón',
    'Escalante', 'Rivarola', 'Toledo', 'Miranda', 'Alderete', 'Paredes',
  ],
  uruguay: [
    'Rodríguez', 'Pereira', 'Silva', 'Machado', 'Olivera', 'Methol', 'Bentancur', 'Suárez',
    'Núñez', 'Techera', 'Píriz', 'Correa', 'Larrosa', 'Ferreira', 'Pintos', 'Rivero',
    'Acosta', 'Reyes', 'Corbo', 'Nández', 'Laxalt', 'Coates', 'Cardozo', 'Damonte',
    'Recalde', 'Zunino', 'Viña', 'Ripa', 'Aguerre', 'Barreto',
  ],
};
