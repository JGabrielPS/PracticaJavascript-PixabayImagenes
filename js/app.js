const formulario = document.querySelector("#formulario"),
  resultado = document.querySelector("#resultado");
paginacionDiv = document.querySelector("#paginacion");

const registrosPagina = 40;
let totalPaginas = 0;
let iterador = 0;
let paginaActual = 1;

window.onload = () => {
  formulario.addEventListener("submit", validarFormulario);
};

function validarFormulario(e) {
  e.preventDefault();

  const terminoBusqueda = document.querySelector("#termino").value;

  if (terminoBusqueda === "") {
    mostrarAlerta("Agrega un termino de busqueda");
    return;
  }

  buscarImagenes();
}

function mostrarAlerta(mensaje) {
  const alerta = document.querySelector(".bg-red-100");

  if (!alerta) {
    const alerta = document.createElement("p");

    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center"
    );
    alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
    `;
    formulario.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

async function buscarImagenes() {
  const termino = document.querySelector("#termino").value;

  const key = "20182902-d92f887662bffdf3455bc19cf";
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPagina}&page=${paginaActual}`;

  Spinner();

  try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    totalPaginas = mostrarPaginas(resultado.totalHits);
    mostrarImagenes(resultado.hits);
  } catch (error) {
    console.log(error);
  }

  // fetch(url)
  //   .then((response) => response.json())
  //   .then((result) => {
  //     totalPaginas = mostrarPaginas(result.totalHits);
  //     mostrarImagenes(result.hits);
  //   });
}

function Spinner() {
  limpiarHTML();

  const divSpinner = document.createElement("div");
  divSpinner.classList.add("sk-folding-cube");

  divSpinner.innerHTML = `
    <div class="sk-cube1 sk-cube"></div>
    <div class="sk-cube2 sk-cube"></div>
    <div class="sk-cube4 sk-cube"></div>
    <div class="sk-cube3 sk-cube"></div>
	`;

  resultado.appendChild(divSpinner);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarPaginas(total) {
  return parseInt(Math.ceil(total / registrosPagina));
}

function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function mostrarImagenes(imagenes) {
  limpiarHTML();

  imagenes.forEach((imagen) => {
    const { previewURL, likes, views, largeImageURL } = imagen;

    resultado.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
      <div class="bg-white ">
        <img class="w-full" src=${previewURL} alt={tags} />
        <div class="p-4">
          <p class="card-text">${likes} Me Gusta</p>
          <p class="card-text">${views} Vistas </p>

          <a href=${largeImageURL} 
          rel="noopener noreferrer" 
          target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
        </div>
      </div>
    </div>
        `;
  });

  while (paginacionDiv.firstChild) {
    paginacionDiv.removeChild(paginacionDiv.firstChild);
  }

  imprimirPaginador();
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);

  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    const boton = document.createElement("a");
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-4",
      "uppercase",
      "rounded"
    );

    boton.onclick = () => {
      paginaActual = value;
      buscarImagenes();
    };

    paginacionDiv.appendChild(boton);
  }
}
