(() => {

   const listadoCliente = document.querySelector('#listado-clientes');
   let DB;

   document.addEventListener('DOMContentLoaded', () => {
      createDataBase();

      if (indexedDB.open('empresa', 1)) {
         obtenerDatosClientes();
      }

      listadoCliente.addEventListener('click', eliminarCliente);

   });


   const eliminarCliente = (e) => {
      if (e.target.classList.contains('remove-client')) {

         //Extraer el id con dataset para eliminar
         const idCliente = Number(e.target.dataset.cliente);

         swal({
            title: "¿Estas Seguro?",
            text: "Que quieres eliminar este cliente",
            icon: "warning",
            buttons: true,
            dangerMode: true,
         })
            .then((willDelete) => {
               if (willDelete) {
                  const transaction = DB.transaction(['cliente'], 'readwrite');
                  const objectStore = transaction.objectStore('cliente');

                  objectStore.delete(idCliente);

                  transaction.onerror = () => {
                     console.error('Hubo al eliminar el cliente')
                  }

                  transaction.oncomplete = () => {

                     e.target.parentElement.parentElement.remove();

                     swal({
                        title: "Cliente eliminado",
                        icon: "success",
                     });
                  }

               } else {

                  swal("Eliminacion Cancelada", {
                     icon: "error",

                  });
               }
            });
      }
   }

   const createDataBase = () => {
      const dataBase = indexedDB.open('empresa', 1);

      dataBase.onerror = function () {
         console.error('Hubo un error al crear la base de datos');
      }

      dataBase.onsuccess = function () {
         console.log('Base de datos creada');

         //Instanciar el reseultado de la base de datos
         DB = dataBase.result;
      }

      dataBase.onupgradeneeded = function (e) {
         const db = e.target.result;

         const objectStore = db.createObjectStore('cliente', {
            keyPath: 'id',
            autoIncrement: true
         });

         objectStore.createIndex('nombre', 'nombre', { unique: false });
         objectStore.createIndex('email', 'email', { unique: true });
         objectStore.createIndex('telefono', 'telefono', { unique: false });
         objectStore.createIndex('empresa', 'empresa', { unique: false });
         objectStore.createIndex('id', 'id', { unique: true });

         console.log('Columna creada correctamente');
      }
   }

   const obtenerDatosClientes = () => {
      const conexionDB = indexedDB.open('empresa', 1);

      conexionDB.onerror = () => {
         console.error('Hubo un error en la conexion para obtener datos del cliente');
      }

      conexionDB.onsuccess = () => {
         DB = conexionDB.result;

         //Crear objectStore para obtener los datos o habilitarlo
         const transaction = DB.transaction(['cliente'], 'readwrite')
         const objectStore = transaction.objectStore('cliente');

         //Recorrer la DB con openCursor

         objectStore.openCursor().onsuccess = (e) => {
            const cursor = e.target.result;

            if (cursor) {

               const { nombre, email, telefono, empresa, id } = cursor.value;

               listadoCliente.innerHTML +=
                  ` <tr>
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                  <p class="text-sm leading-10 text-gray-700"> ${email} </p>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                  <p class="text-gray-700">${telefono}</p>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                  <p class="text-gray-600">${empresa}</p>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                  <a href="editar-cliente.html?id=${id}" class="text-teal-600 bg-blue-200 py-2 px-4 mt-2 rounded hover:text-teal-900 mr-5">Editar</a>
                  <a href="#" data-cliente="${id}" class="text-red-700 bg-red-200 py-2 px-4 mt-2 rounded hover:text-red-900 remove-client">Eliminar</a>
              </td>
            </tr>`;

               cursor.continue();
            } else {
               console.log('No hay mas datos');
            }
         }

      }
   }

})();
