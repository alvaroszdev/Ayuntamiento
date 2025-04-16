// DOM Elements
const steps = document.querySelectorAll('.calendar-step');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const monthGrid = document.querySelector('.month-grid');
const dayGrid = document.getElementById('day-grid');
const timeSlots = document.getElementById('time-slots');
const resumoReserva = document.getElementById('resumo-reserva');
const form = document.getElementById('booking-form');

// Datos seleccionados
let selectedMonth = null;
let selectedDay = null;
let selectedTime = null;

// Meses
const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Horas disponibles
const horas = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
];

// Paso actual
let currentStep = 0;

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle('active', i === index);
  });
  btnPrev.disabled = index === 0;
  btnNext.style.display = index === steps.length - 1 ? 'none' : 'inline-block';
}

// Generar meses
function generarMeses() {
  meses.forEach((mes, index) => {
    const div = document.createElement('div');
    div.textContent = mes;
    div.addEventListener('click', () => {
      selectedMonth = index;
      avanzarPaso();
    });
    monthGrid.appendChild(div);
  });
}

// Generar días del mes
function generarDias() {
  dayGrid.innerHTML = '';
  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const div = document.createElement('div');
    div.textContent = i;
    div.addEventListener('click', () => {
      selectedDay = i;
      avanzarPaso();
    });
    dayGrid.appendChild(div);
  }
}

// Generar horas
function generarHoras() {
  timeSlots.innerHTML = '';
  horas.forEach(hora => {
    const div = document.createElement('div');
    div.textContent = hora;
    div.addEventListener('click', () => {
      selectedTime = hora;
      avanzarPaso();
    });
    timeSlots.appendChild(div);
  });
}

// Resumen de reserva
function mostrarResumen() {
  const fecha = `${selectedDay} de ${meses[selectedMonth]} a las ${selectedTime}`;
  resumoReserva.innerHTML = `<p><strong>Reserva:</strong> ${fecha}</p>`;
}

// Ir al siguiente paso
function avanzarPaso() {
  if (currentStep === 0 && selectedMonth !== null) {
    generarDias();
  }
  if (currentStep === 1 && selectedDay !== null) {
    generarHoras();
  }
  if (currentStep === 2 && selectedTime !== null) {
    mostrarResumen();
  }

  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

// Ir al paso anterior
function retrocederPaso() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

// Eventos de navegación
btnNext.addEventListener('click', avanzarPaso);
btnPrev.addEventListener('click', retrocederPaso);

// Envío del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (selectedMonth !== null && selectedDay !== null && selectedTime !== null) {
    // Si hay valores seleccionados, realizamos la reserva
    const reserva = {
      nombre: document.getElementById('name').value,
      email: document.getElementById('email').value,
      fecha: `${selectedDay} de ${meses[selectedMonth]}`,
      hora: selectedTime
    };

    // Log para depurar la reserva antes de enviarla
    console.log('Reserva a enviar:', reserva);

    // Llamamos a la función para enviar la reserva al servidor
    reservar(reserva);
  } else {
    alert('Por favor, completa todos los pasos de la reserva.');
  }
});

// Función para enviar la reserva al servidor
const reservar = async (reserva) => {
  try {
    const response = await fetch('http://localhost:3000/reservas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reserva) // Enviamos los datos de la reserva como JSON
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Reserva guardada correctamente:', result);
      alert('Reserva realizada con éxito');
      form.reset();
    
    } else {
      console.error('Error al guardar la reserva');
      alert('Hubo un error al realizar la reserva');
    }
  } catch (error) {
    console.error('Error al conectar con el servidor:', error);
    alert('Hubo un problema al conectar con el servidor.');
  }
};

// Inicializar
generarMeses();
showStep(currentStep);
