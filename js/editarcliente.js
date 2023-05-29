(() => {
   const inputName = document.querySelector('#nombre');
   const inputEmail = document.querySelector('#email');
   const inputPhone = document.querySelector('#telefono');
   const inputCompany = document.querySelector('#empresa');
   let idCliente;

   document.addEventListener('DOMContentLoaded', () => {
      conexionDB();

      //Verificar la URL del id 
      const URL_Cliente = new URLSearchParams(window.location.search)
      idCliente = URL_Cliente.get('id');


      //Validar si hay un id 
      if (idCliente) {
         setTimeout(() => {
            obtenerClienteEdicion(idCliente);
         }, 150);
      }

      form.addEventListener('submit', validarEdicionCliente);
   });

   function validarEdicionCliente(e) {
      e.preventDefault();
      if (!validarEmail(inputEmail.value)) {
         showAlert('Email incorrecto', 'error');
         return;
      }

      //Validar si editar no esta vacio
      if (inputName.value.trim() === '' || inputEmail.value.trim() === '' || inputPhone.value.trim() === '' || inputCompany.value.trim() === '') {
         showAlert('Todos los campos son obligatorio', 'error');
         return;
      }

      editarCliente();
   }

   function editarCliente() {
      const edicionCliente = {
         nombre: inputName.value,
         email: inputEmail.value,
         telefono: inputPhone.value,
         empresa: inputCompany.value,
         id: Number(idCliente)
      }

      const transaction = DB.transaction(['cliente'], 'readwrite');
      const objectStore = transaction.objectStore('cliente');

      //Actualizar cliente.
      objectStore.put(edicionCliente);

      transaction.onerror = () => {
         showAlert('Hubo un error', 'error')
      }

      transaction.oncomplete = () => {
         cargarSpinner('editar');
      }

   }

   const obtenerClienteEdicion = (id) => {
      //Para manipular la indexDB con transaction y objectStore
      const transaction = DB.transaction('cliente', 'readwrite');
      const objectStore = transaction.objectStore('cliente');

      //Recorrer la base de dato
      const editarCliente = objectStore.openCursor();
      editarCliente.onsuccess = (e) => {
         //Intarciar la base de dato en el cursor 
         const cursor = e.target.result;
         if (cursor) {
            //Validar que solo me llame un por id
            if (cursor.value.id === Number(id)) llenarFormulario(cursor.value);

            cursor.continue();
         }
      }
   }

   function llenarFormulario(editarCliente) {
      const { nombre, email, telefono, empresa } = editarCliente;

      //Llenar los formulario 
      inputName.value = nombre;
      inputEmail.value = email;
      inputPhone.value = telefono;
      inputCompany.value = empresa;

   }


})();