const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const objBusqueda = {
  moneda: '',
  criptomoneda: '',
}

//Crear promise.
const obtenerCripto = criptomonedas => new Promise(resolve =>{
  resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', ()=>{
  consultarCripto();
  criptoSelect.addEventListener('change', leerValor)
  monedaSelect.addEventListener('change', leerValor)
  formulario.addEventListener('submit', submitForm)
});

function consultarCripto() {
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD`;
  fetch(url)
    .then(res => res.json())
    .then(res => obtenerCripto(res.Data))
    .then( criptomonedas => selectCripto(criptomonedas));
};

function selectCripto(criptomonedas) {
  criptomonedas.forEach(cripto => {
    const {FullName, Name} = cripto.CoinInfo;
    const option = document.createElement('OPTION');
    option.value = Name;
    option.textContent = FullName;
    criptoSelect.appendChild(option)
  });
};

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
};

function submitForm(e) {
  e.preventDefault();

  //Validación
  const {moneda, criptomoneda} = objBusqueda
  if (moneda === ''|| criptomoneda === '') {
    imprimirAlerta('Ambos campos son obligatorios');
    return;
  };

  consultarAPI();
  formulario.reset();
};

function imprimirAlerta(msg) {
  const divMensaje =  document.createElement('DIV');
  const classError = document.querySelector('.error');
  if (!classError) {
    divMensaje.classList.add('error');
    divMensaje.textContent = msg;
    formulario.appendChild(divMensaje);
    setTimeout(() => {
      divMensaje.remove();
    }, 2000);
  };
};

function consultarAPI() {
  const {moneda, criptomoneda} = objBusqueda;
  const url =`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  fetch(url)
    .then(res => res.json())
    .then(cotizacion => {
      mostrarCorizacion(cotizacion.DISPLAY[criptomoneda][moneda])
    });
};

function mostrarCorizacion(cotizacion) {
  limpiarhtml(resultado)
  const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
  const precio = document.createElement('P');
  precio.classList.add('precio');
  precio.innerHTML = `El precio es: <span>${PRICE}</span>`;
  
  const precioAlto = document.createElement('P');
  precioAlto.innerHTML = `<p>Precio mas alto del dia: <span>${HIGHDAY}</span></p>`
  const precioBajo = document.createElement('P');
  precioBajo.innerHTML = `<p>Precio mas bajo del dia: <span>${LOWDAY}</span></p>`
  const ultimasHoras = document.createElement('P');
  ultimasHoras.innerHTML = `<p>Variación las ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`
  const actualizacion = document.createElement('P');
  actualizacion.innerHTML = `<p>Ultima actualización:<span>${LASTUPDATE}</span></p>`
  
  
  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(actualizacion);
};

function limpiarhtml(selector) {
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild);
  };
};