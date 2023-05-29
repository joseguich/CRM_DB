//Seleccionar elemento del HTML
const spinner = document.querySelector('#spinner');

const form = document.querySelector('#formulario');

let DB;

//conexcion a la base de datos
const conexionDB = () => {
   const conexion = indexedDB.open('empresa', 1);

   conexion.onerror = () => {
      console.error('Hubo un error en la conexcion de la DB');
   }

   conexion.onsuccess = () => {
      DB = conexion.result;
   }
}

//Validacion del email
function validarEmail(email) {
   const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
   const validacion = regex.test(email);
   return validacion;
}

//Mostrar alerta
function showAlert(message, type) {

   const removeAlert = document.querySelector('.remove-alert');
   if (!removeAlert) {
      const messageAlert = document.createElement('div');
      messageAlert.classList.add('remove-alert', 'text-center', 'py-3', 'px-3', 'mt-6', 'border', 'mx-auto', 'max-w-lg', 'rounded-3')

      if (type === 'error') {
         messageAlert.classList.add('text-red-700', 'bg-red-100', 'border-red-200');
      } else {
         messageAlert.classList.add('text-green-700', 'border-green-400', 'bg-green-100');
      }

      messageAlert.textContent = message;

      //Insert alert en el HTML
      form.appendChild(messageAlert);

      setTimeout(() => {
         messageAlert.remove();
      }, 3000)
   }
}

//Mostrar spinner
function cargarSpinner(modificar) {
   spinner.classList.add('flex');
   spinner.classList.remove('hidden')

   setTimeout(() => {
      if (modificar === 'agregar') {
         showAlert('Cliente agregado correctamente');

      } else if (modificar === 'editar') {
         showAlert('Cliente editado correctamente');
      }

      spinner.classList.add('hidden');
      spinner.classList.remove('flex');

      setTimeout(() => {
         window.location.href = 'index.html'
      }, 1000)

      form.reset();
   }, 3000);
}