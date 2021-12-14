const purchaseButton = document.querySelector('.continuar')
purchaseButton.addEventListener('click', GuardarOrdenDB);
function GuardarOrdenDB() {
    const email = document.getElementById('emailUsuario').value;
    const carritoCompras = localStorage.getItem('carrito');
    console.log(carritoCompras)
  
    const dataToSend = {
      email: email,
      items: JSON.parse(carritoCompras),
    };
    console.log(JSON.stringify(dataToSend));
  
    fetch(`http://localhost:5000/orden`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
      
    })
      .then(function (result) {
        return result.json();
      })
      .then((res) => console.log(res))
      .then(localStorage.clear());
  }


