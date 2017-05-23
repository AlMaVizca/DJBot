Djbot
======

¿Qué es?
-------



DJBot es una aplicación web especialmente diseñada para la orquestación de salas de computadoras. Su nombre viene de la contracción entre “DJ”, del inglés *disc jockey*, o persona que crea su propia composición musical a partir de la combinación artística de múltiples discos; y “Bot”, de robot, o máquina que realiza tareas automáticas en lugar de una persona. Nuestro DJ hace de director de orquesta, y administra los bots para crear su propia composición de sistemas.

¿Cómo funciona?
---------------

El funcionamiento de DJBot es posible gracias a la integración de las cuatro herramientas antes descriptas y otras secundarias. En la capa inferior, Ansible brinda el soporte para la ejecución de las tareas de administración. Para este fin, se alimenta de la base de datos gestionada por SQLAlchemy. En la capa superior, los usuarios interactúan con la aplicación a través de la interfaz web desarrollada con React. El intercambio que tiene lugar entre los dos extremos es controlado por Flask. Así, se establece un flujo de trabajo bidireccional entre Flask y las demás herramientas de DJBot.
