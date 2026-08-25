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
  peru: [
    'Jefferson', 'Paolo', 'Christian', 'André', 'Renato', 'Yoshimar', 'Edison', 'Wilder',
    'Percy', 'Gianluca', 'Josepmir', 'Aldair', 'Yordy', 'Piero', 'Jhilmar', 'Jesús',
    'Wilmer', 'Alex', 'Kluivert', 'Raziel', 'Adrián', 'Erick', 'Josimar', 'Bryan',
  ],
  colombia: [
    'Radamel', 'James', 'Juan', 'David', 'Mario', 'Willington', 'Arnoldo', 'Óscar',
    'Adolfo', 'Antony', 'Luis', 'Yerry', 'Duván', 'Wilmar', 'Jhon', 'Stiven',
    'Jáder', 'Yeison', 'Éder', 'Deiver', 'Frank', 'Wilson', 'Harold', 'Gustavo',
  ],
  chile: [
    'Arturo', 'Alexis', 'Claudio', 'Gary', 'Eduardo', 'Charles', 'Mauricio', 'Jean',
    'Esteban', 'Humberto', 'Jorge', 'Iván', 'Cristóbal', 'Vicente', 'Benjamín', 'Darío',
    'Osvaldo', 'Patricio', 'Fabián', 'Ángelo', 'Erwin', 'Nicolás', 'Diego', 'Sebastián',
  ],
  paraguay: [
    'Derlis', 'Roque', 'Antolín', 'Justo', 'Óscar', 'Néstor', 'Celso', 'Aureliano',
    'Francisco', 'Diego', 'Édgar', 'Jonathan', 'Cristian', 'Richard', 'Robert', 'Ángel',
    'Adalberto', 'Gustavo', 'Miguel', 'Junior', 'Nelson', 'Fredy', 'Iván', 'Ever',
  ],
  bolivia: [
    'Marco', 'Joaquín', 'Erwin', 'Julio', 'Milton', 'Ronald', 'Vladimir', 'Jhasmani',
    'Marcelo', 'Wilder', 'Alejandro', 'Diego', 'Henry', 'Raúl', 'Grover', 'Óscar',
    'Rudy', 'Franz', 'Gualberto', 'Freddy', 'Boris', 'Limbert', 'Wálter', 'Edwin',
  ],
  ecuador: [
    'Ángel', 'Cristian', 'Segundo', 'Marlon', 'Édison', 'Iván', 'Ulises', 'Agustín',
    'Álex', 'Antonio', 'Felipe', 'Jefferson', 'Byron', 'Joffre', 'Jairo', 'Néicer',
    'Gonzalo', 'Kendry', 'Pervis', 'Piero', 'Willian', 'Robert', 'Moisés', 'Enner',
  ],
  venezuela: [
    'Yohandry', 'Stalin', 'Telasco', 'Kervin', 'Jhonder', 'Deyna', 'Wuilker', 'Yorman',
    'Alixon', 'Junior', 'Anderson', 'Endry', 'Frank', 'Kelvin', 'Maikel', 'Nervin',
    'Osman', 'Yefry', 'Alí', 'Giancarlo', 'Franklin', 'Grenddy', 'Renny', 'Oswaldo',
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
  peru: [
    'Farfán', 'Guerrero', 'Cueva', 'Advíncula', 'Trauco', 'Abram', 'Zambrano', 'Tapia',
    'Yotún', 'Ruidíaz', 'Carrillo', 'Peña', 'Lapadula', 'Cartagena', 'Gallese', 'Corzo',
    'Callens', 'Vílchez', 'Quispe', 'Mendoza', 'Rivera', 'Vargas', 'Chumpitaz', 'Balbín',
  ],
  colombia: [
    'Valderrama', 'Higuita', 'Asprilla', 'Rincón', 'Córdoba', 'Falcao', 'Bacca', 'Cuadrado',
    'Ospina', 'Escobar', 'Yepes', 'Ángel', 'Ortiz', 'Iguarán', 'Valencia', 'Ávila',
    'Díaz', 'Lerma', 'Gómez', 'Muñoz', 'Zapata', 'Mosquera', 'Perea', 'Borja',
  ],
  chile: [
    'Vidal', 'Sánchez', 'Bravo', 'Medel', 'Vargas', 'Aránguiz', 'Isla', 'Díaz',
    'Beausejour', 'Paredes', 'Suazo', 'Fernández', 'Valdivia', 'Zamorano', 'Salas', 'Fuentes',
    'Contreras', 'Rojas', 'Muñoz', 'Fuenzalida', 'Orellana', 'Toro', 'Pizarro', 'Mena',
  ],
  paraguay: [
    'Villar', 'Gamarra', 'Caniza', 'Torres', 'Cardozo', 'González', 'Almirón', 'Gómez',
    'Alcaraz', 'Ayala', 'Arce', 'Barreto', 'Santana', 'Riveros', 'Ortiz', 'Romero',
    'Román', 'Duarte', 'Ríos', 'Vera', 'Rojas', 'Insfrán', 'Recalde', 'Franco',
  ],
  bolivia: [
    'Sánchez', 'Sandy', 'Trucco', 'Soria', 'Campos', 'Terrazas', 'Chumacero', 'Wayar',
    'Vaca', 'Mamani', 'Quispe', 'Choque', 'Condori', 'Flores', 'Justiniano', 'Peña',
    'Melgar', 'Zambrana', 'Áñez', 'Ustariz', 'Pinto', 'Rivero', 'Egüez', 'Céspedes',
  ],
  ecuador: [
    'Hurtado', 'Delgado', 'Aguinaga', 'Méndez', 'Spencer', 'Benítez', 'Valencia', 'Caicedo',
    'Montero', 'Guagua', 'Castillo', 'Reasco', 'Ayoví', 'Cevallos', 'Campos', 'Bolaños',
    'Guerrón', 'Urrutia', 'Hincapié', 'Estupiñán', 'Pacho', 'Preciado', 'Domínguez', 'Arboleda',
  ],
  venezuela: [
    'Dudamel', 'Vega', 'Rey', 'Vizcarrondo', 'Cichero', 'Rosales', 'Amorebieta', 'Arango',
    'Rincón', 'Rivas', 'Orozco', 'Guerra', 'Maldonado', 'Fedor', 'Dolgetta', 'Savarese',
    'Moreno', 'Perozo', 'Seijas', 'Lucena', 'Romo', 'Osorio', 'Chancellor', 'Herrera',
  ],
};
