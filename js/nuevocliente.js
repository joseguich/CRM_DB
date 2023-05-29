(() => {
   document.addEventListener('DOMContentLoaded', () => {
      conexionDB();

      form.addEventListener('submit', validarCliente);
   });


   function validarCliente(e) {
      e.preventDefault();

      //Leer datos de los input
      const nombre = document.querySelector('#nombre').value;
      const email = document.querySelector('#email').value;
      const telefono = document.querySelector('#telefono').value;
      const empresa = document.querySelector('#empresa').value;

      //Validar los campo vacio
      if (nombre.trim() === '' || email.toLowerCase().trim() === '' || telefono.trim() === '' || empresa.trim() === '') {
         showAlert('Todos los campos son obligatorio', 'error');
         return;
      }

      if (!validarEmail(email)) {
         showAlert('Email incorrecto', 'error');
         return;
      }

      const client = {
         nombre,
         email,
         telefono,
         empresa
      }

      //Agregar ID.
      client.id = Date.now();

      createNewClient(client);
   }

   function createNewClient(client) {
      const transaction = DB.transaction(['cliente'], 'readwrite');

      const objectStore = transaction.objectStore('cliente');

      objectStore.add(client);

      transaction.onerror = () => {
         showAlert('Este correo electronico ya esta registrado', 'error');
      }

      transaction.oncomplete = () => {
         cargarSpinner('agregar')
      }
   }



})();

