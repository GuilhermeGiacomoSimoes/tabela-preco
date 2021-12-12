var database = obterConfiguracaoFirebase();

if (estamosEmProducao) {
	verificarLogin('index');
}

function logar() {
	loading('carregando');

	const email = document.getElementById("txtLogin").value;
	const senha = document.getElementById("txtSenha").value;

	try {
		firebase.auth().signInWithEmailAndPassword(email, senha)
		  .then((userCredential) => {

				loading('estatico');

				if (estamosEmProducao) {
					verificarLogin('index');
				}
				else {
					telaAtual = 'index';
					verificaRedirecionamento(true);
				}
		  })
		  .catch((error) => {
			  var errorCode = error.code;
			  var errorMessage = error.message;

			  alert('Usuário ou senha inválidos');

			  loading('estatico');
		  });
	}catch (exception) {
		console.log("deu ruim: " + exception);
		loading('estatico');
	}
}

function loading(param) {

	const html = {
		carregando : `<div class="spinner"></div>`,
		estatico : `Entrar` 
	}

	document.getElementById('btnLogar').innerHTML = html[param] || `<button onclick="logar()"> Entrar </button>`;
}
