var database = obterConfiguracaoFirebase();

if (window.location.href.includes('vercel')) {
	verificarLogin('index');
}

function logar() {
	const email = document.getElementById("txtLogin").value;
	const senha = document.getElementById("txtSenha").value;

	try {
		firebase.auth().signInWithEmailAndPassword(email, senha)
		  .then((userCredential) => {
				if (window.location.href.includes('vercel')) {
					verificarLogin('index');
				}
				else {
					verificaRedirecionamento(true);
				}
		  })
		  .catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;

			  console.log(errorCode + ": " + errorMessage);
		  });
	}catch (exception) {
		console.log("deu ruim: " + exception);
	}
}

