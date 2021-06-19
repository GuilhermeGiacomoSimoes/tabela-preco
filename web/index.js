var database = obterConfiguracaoFirebase();

verificarLogin('index');

function logar() {
	const email = document.getElementById("txtLogin").value;
	const senha = document.getElementById("txtSenha").value;

	try {
		firebase.auth().signInWithEmailAndPassword(email, senha)
		  .then((userCredential) => {
				verificarLogin('index');
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

