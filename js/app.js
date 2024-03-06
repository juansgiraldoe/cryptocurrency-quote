const criptoSelect = document.querySelector('#criptomonedas');

//Crear promise.
const obtenerCripto = criptomonedas => new Promise(resolve =>{
  resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', ()=>{
  consultarCripto();
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
