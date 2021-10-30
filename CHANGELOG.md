# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0]


## [1.0.1] - 03-10-2021
### Added
- Añadida pequeña descripción al poner el raton encima del campo descripción 
- Añadido botón para ver nuevo usuario en pestaña de usuarios
- Añadido botón para ver nuevo seminario en pestaña de seminarios

### Changed
- Aunmentado el tamaño de las descripciones de seminarios y usuarios de 250 a 700 
- Aunmentado el tamaño de las preguntas de 255 a 500 
- Cuando nuevo seminario esta abierto se oculta el detalle de un seminario y viceversa
- Cambiada la redacción del correo enviado a los nuevos usuarios a la indicada arriba 
- Los campos descripción ahora incluyen la descripción antigua para poder ser editadas por el usuario, no desaparecen al escribir 

### Fixed
- Arreglada mala ordenación de la tabla usuarios al no actualizar


## [1.0.2] - 05-10-2021
### Fixed
- Arreglado temporizador de ponencia, ahora muestra el tiempo elegido al crearla
- Arreglado invitaciones a un seminario, ahora lleva a la url de azure


## [1.1.0] - 10-10-2021
### Added
- Añadido opción de eliminar seminarios de la lista
  
### Changed
- A los usuarios no admin ya no se les muestra el rol de cada usuario en el ranking de asistente
- Al acceder a la app los usuarios llegan primero a la lista de espera
- Al votar/desvotar una pregunta solo se suma/resta un punto
- Cambiado el correo de registro de usuario para que incluya link a la pagina de interAppctua
- Cambiado  el campo votos en preguntas por un emoji de un corazón verde
- Cambiada la interfaz de navegación para agrupar las opciones y hacerlo más legible
- Cambiado nomenclatura de los votos a las preguntas, ahora son likes
- Cambiado texto al pedir ser ponente para que quede mejor redactado
  
### Fixed
- Arreglado el boton cancelar en quitar like, antes lo quitaba aunque le dieras a cancelar
- Arreglado que pedir ponente se siguiera pudiendo pulsar al acceder a la lista
- Arreglado que no se sumaran los puntos al ponente tras su ponencia

## [1.2.0] - 12-10-2021
### Added
- Añadido resetear contraseña

### Fixed
- Arreglado que la tabla de asistentes se desordene al actualizar la página
- Arreglado que la tabla de ponentes se desordene al actualizar la página
- Arreglado que la tabla de preguntas se desordene al actualizar la página

## [1.2.1] - 27-10-2021
### Added
- Añadido scroll automatico al pulsar varias opciones de las tablas

### Changed
- Ahora al terminar la ponencia se abre la página de ponentes en vez de la de usuarios

## [1.2.2] - 30-10-2021
### Added
- Añadido boton de actualizar usuarios para admins

### Changed
- Ahora al terminar la ponencia se abre la página de asistentes de nuevo
- Cambiado logaritmo de puntuación al hacer ponencia para que premie más cuanto más cerca se este de agotar el tiempo
