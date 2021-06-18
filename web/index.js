var database = obterConfiguracaoFirebase();

verificarLogin('index');

function logar() {
	const email = document.getElementById("txtLogin").value;
	const senha = document.getElementById("txtSenha").value;

	try {
		firebase.auth().signInWithEmailAndPassword(email, senha)
		  .then((userCredential) => {
			// Signed in
				console.log(userCredential.refreshToken)
			  	localStorage.setItem('token_tabela_preco', userCredential.refreshToken); 
				verificarLogin('index');
			// ...
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

