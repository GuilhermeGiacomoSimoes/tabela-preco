obterLentes();
obterConfiguracaoFirebase()

function obterConfiguracaoFirebase() {
	var firebaseConfig = {
		apiKey: "AIzaSyBOb971R81rzDuTvolsFhNDq3-vcd19kYs",
		authDomain: "tabela-preco-5ed67.firebaseapp.com",
		databaseURL: "https://tabela-preco-5ed67.firebaseio.com",
		projectId: "tabela-preco-5ed67",
		storageBucket: "tabela-preco-5ed67.appspot.com",
		messagingSenderId: "743281858698",
		appId: "1:743281858698:web:e3969122ca8dd8d39ef573"
	  };

	 firebase.initializeApp(firebaseConfig);

	var bancoDeDados = firebase.database();
}

function obterLentes() {
	bancoDeDados.ref("lentes")	
}

function gravarLente(lente) {
	bancoDeDados.ref("lentes")	
}


function gerarUUID () {

}
