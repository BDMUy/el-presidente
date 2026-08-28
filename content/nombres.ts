import type { Country } from '@/lib/engine/types';

export const NOMBRES: Record<Country, string[]> = {
  argentina: [
    'Matías', 'Lucas', 'Nahuel', 'Julián', 'Facundo', 'Tomás', 'Agustín', 'Franco',
    'Bruno', 'Emiliano', 'Thiago', 'Valentín', 'Ramiro', 'Joaquín', 'Ignacio', 'Gonzalo',
    'Alan', 'Brian', 'Kevin', 'Maximiliano', 'Rodrigo', 'Santiago', 'Elías', 'Leonel',
  ],
  uruguay: [
    'Rodrigo', 'Nicolás', 'Sebastián', 'Maximiliano', 'Ignacio', 'Martín', 'Diego', 'Federico',
    'Andrés', 'Fernando', 'Gastón', 'Leandro', 'Guillermo', 'Mauricio', 'Marcelo', 'Damián',
    'Cristian', 'Gerónimo', 'Jonathan', 'Guzmán', 'Maicol', 'Rodolfo', 'Braian', 'Rafael',
  ],
  peru: [
    'Jefferson', 'Paolo', 'Christian', 'André', 'Renato', 'Edison', 'Wilder', 'Percy',
    'Gianluca', 'Aldair', 'Yordy', 'Piero', 'Jesús', 'Wilmer', 'Alex', 'Raziel',
    'Adrián', 'Erick', 'Bryan', 'Renzo', 'Junior', 'Nilton', 'Sergio', 'Marco',
  ],
  colombia: [
    'Juan', 'David', 'Mario', 'Arnoldo', 'Óscar', 'Adolfo', 'Antony', 'Luis',
    'Wilmar', 'Jhon', 'Stiven', 'Jáder', 'Yeison', 'Éder', 'Deiver', 'Frank',
    'Wilson', 'Harold', 'Gustavo', 'Camilo', 'Andrés', 'Sergio', 'Iván', 'Fabián',
  ],
  chile: [
    'Mauricio', 'Jean', 'Esteban', 'Humberto', 'Jorge', 'Iván', 'Cristóbal', 'Vicente',
    'Benjamín', 'Darío', 'Osvaldo', 'Patricio', 'Fabián', 'Ángelo', 'Erwin', 'Nicolás',
    'Diego', 'Sebastián', 'Rodrigo', 'Álvaro', 'Felipe', 'Rolando', 'Hugo', 'Ramón',
  ],
  paraguay: [
    'Roque', 'Antolín', 'Justo', 'Óscar', 'Néstor', 'Celso', 'Aureliano', 'Francisco',
    'Diego', 'Édgar', 'Jonathan', 'Cristian', 'Richard', 'Robert', 'Ángel', 'Adalberto',
    'Gustavo', 'Miguel', 'Junior', 'Nelson', 'Fredy', 'Iván', 'Ever', 'Ramón',
  ],
  bolivia: [
    'Marco', 'Joaquín', 'Erwin', 'Julio', 'Milton', 'Ronald', 'Vladimir', 'Jhasmani',
    'Marcelo', 'Wilder', 'Alejandro', 'Diego', 'Henry', 'Raúl', 'Grover', 'Óscar',
    'Rudy', 'Franz', 'Gualberto', 'Freddy', 'Boris', 'Limbert', 'Wálter', 'Edwin',
  ],
  ecuador: [
    'Ángel', 'Cristian', 'Segundo', 'Marlon', 'Édison', 'Iván', 'Ulises', 'Agustín',
    'Álex', 'Antonio', 'Felipe', 'Jefferson', 'Byron', 'Joffre', 'Jairo', 'Néicer',
    'Gonzalo', 'Willian', 'Robert', 'Wilmer', 'Renán', 'Geovanny', 'Kléber', 'Franklin',
  ],
  venezuela: [
    'Stalin', 'Kervin', 'Jhonder', 'Yorman', 'Alixon', 'Junior', 'Anderson', 'Endry',
    'Frank', 'Kelvin', 'Maikel', 'Nervin', 'Osman', 'Yefry', 'Alí', 'Giancarlo',
    'Franklin', 'Grenddy', 'Renny', 'Oswaldo', 'Reinaldo', 'Argenis', 'Elvis', 'Yohan',
  ],
  brasil: [
    'Everton', 'Wendell', 'Emerson', 'Vagner', 'Wallace', 'Anderson', 'Douglas', 'Robson',
    'Elias', 'Rogério', 'Adriano', 'Vanderlei', 'Reinaldo', 'Wilson', 'Edmilson', 'Jefferson',
    'Weverton', 'Renato', 'Fabrício', 'Cleiton', 'Deivid', 'Elano', 'Grafite', 'Luizão',
  ],
};

export const APELLIDOS: Record<Country, string[]> = {
  argentina: [
    'Ferreyra', 'Quiroga', 'Bustamante', 'Ledesma', 'Ojeda', 'Sosa', 'Villalba', 'Cáceres',
    'Maidana', 'Peralta', 'Aguirre', 'Coronel', 'Barrios', 'Bogado', 'Insúa', 'Mansilla',
    'Cabral', 'Rolón', 'Arce', 'Chávez', 'Godoy', 'Escalante', 'Rivarola', 'Toledo',
    'Miranda', 'Alderete', 'Paredes', 'Benítez', 'Medina', 'Vega',
  ],
  uruguay: [
    'Rodríguez', 'Pereira', 'Silva', 'Machado', 'Olivera', 'Methol', 'Techera', 'Píriz',
    'Correa', 'Larrosa', 'Ferreira', 'Pintos', 'Rivero', 'Acosta', 'Reyes', 'Corbo',
    'Damonte', 'Recalde', 'Zunino', 'Viña', 'Ripa', 'Aguerre', 'Barreto', 'Cabrera',
    'Duarte', 'Bermúdez', 'Fagúndez', 'Estévez', 'Fariña', 'Bordón',
  ],
  peru: [
    'Cartagena', 'Corzo', 'Vílchez', 'Quispe', 'Mendoza', 'Rivera', 'Vargas', 'Balbín',
    'Peña', 'Carrillo', 'Injante', 'Palacios', 'Guevara', 'Rentería', 'Bazán', 'Loayza',
    'Huamán', 'Cárdenas', 'Solano', 'Aliaga', 'Zevallos', 'Ramos', 'Salazar', 'Ojeda',
  ],
  colombia: [
    'Ángel', 'Ortiz', 'Valencia', 'Ávila', 'Gómez', 'Muñoz', 'Mosquera', 'Perea',
    'Borja', 'Rojas', 'Cárdenas', 'Vargas', 'Salazar', 'Bermúdez', 'Restrepo', 'Salcedo',
    'Trujillo', 'Cifuentes', 'Aguilar', 'Cadavid', 'Ramírez', 'Toro', 'Marín', 'Quintero',
  ],
  chile: [
    'Paredes', 'Suazo', 'Fernández', 'Salas', 'Fuentes', 'Contreras', 'Rojas', 'Muñoz',
    'Fuenzalida', 'Orellana', 'Toro', 'Mena', 'Bustos', 'Aravena', 'Cárcamo', 'Yáñez',
    'Vergara', 'Sepúlveda', 'Ibacache',
  ],
  paraguay: [
    'Villar', 'Torres', 'Cardozo', 'González', 'Gómez', 'Alcaraz', 'Ayala', 'Arce',
    'Barreto', 'Santana', 'Riveros', 'Ortiz', 'Romero', 'Román', 'Duarte', 'Ríos',
    'Vera', 'Rojas', 'Insfrán', 'Recalde', 'Franco', 'Bareiro', 'Meza', 'Ovelar',
  ],
  bolivia: [
    'Sánchez', 'Sandy', 'Trucco', 'Soria', 'Campos', 'Terrazas', 'Chumacero', 'Wayar',
    'Vaca', 'Mamani', 'Quispe', 'Choque', 'Condori', 'Flores', 'Justiniano', 'Peña',
    'Melgar', 'Zambrana', 'Áñez', 'Ustariz', 'Pinto', 'Rivero', 'Egüez', 'Céspedes',
  ],
  ecuador: [
    'Hurtado', 'Delgado', 'Aguinaga', 'Méndez', 'Spencer', 'Benítez', 'Montero', 'Guagua',
    'Castillo', 'Reasco', 'Ayoví', 'Cevallos', 'Campos', 'Bolaños', 'Guerrón', 'Urrutia',
    'Pacho', 'Preciado', 'Domínguez', 'Arboleda', 'Quiñónez', 'Angulo', 'Nazareno', 'Segura',
  ],
  venezuela: [
    'Vega', 'Rey', 'Cichero', 'Rosales', 'Arango', 'Rivas', 'Orozco', 'Guerra',
    'Maldonado', 'Fedor', 'Dolgetta', 'Savarese', 'Moreno', 'Perozo', 'Seijas', 'Lucena',
    'Romo', 'Osorio', 'Chancellor', 'Herrera', 'Pacheco', 'Zambrano', 'Salcedo', 'Bermúdez',
  ],
  brasil: [
    'Silva', 'Souza', 'Oliveira', 'Santos', 'Pereira', 'Costa', 'Rodrigues', 'Almeida',
    'Nascimento', 'Carvalho', 'Gomes', 'Martins', 'Araújo', 'Ribeiro', 'Barbosa', 'Freitas',
    'Barros', 'Mendes', 'Cardoso', 'Nunes', 'Correia', 'Teixeira', 'Fonseca', 'Moreira',
  ],
};
