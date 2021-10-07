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

## [1.1.0] - 05-10-2021
### Added
- Añadido link al correo de bienvenida
  
### Changed
- Al acceder a la app los usuarios llegan primero a la lista de espera
- Cambiado nomenclatura de los votos a las preguntas, ahora son likes
- Cambiado  el campo votos en preguntas por un emoji de un corazón verde
- Cambiado texto al pedir ser ponente para que quede mejor redactado
  
### Fixed
- Arreglado que pedir ponente se siguiera pudiendo pulsar al acceder a la lista
- Arreglado que no se sumaran los puntos al ponente tras su ponencia