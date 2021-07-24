var database = obterConfiguracaoFirebase();

if (window.location.href.includes('vercel')) {
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

				if (window.location.href.includes('vercel')) {
					verificarLogin('index');
				}
				else {
					param = 'index';
					verificaRedirecionamento(true);
				}
		  })
		  .catch((error) => {
			 var errorCode = error.code;
			 var errorMessage = error.message;

			  console.log(errorCode + ": " + errorMessage);

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
