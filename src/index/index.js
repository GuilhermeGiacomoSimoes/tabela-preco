database = obterConfiguracaoFirebase();
obterLentes();

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
	return firebase.database();
}

function obterLentes() {
	try {
		var listaDeLentes = database.ref("lentes").orderByChild('descricao');	
		listaDeLentes.on('value', snapshot => {
			construirTabelaDeLentes(snapshot.val());
		});
	}catch (exception) {
		console.log("deu ruim: " + exception);
	}
}

function construirTabelaDeLentes(array){
	for (let key in array){
			let lente = array[key];
			const html = `<span class="description"style="margin-left: 10%; width: 18%"> ${lente['descricao']}</span>
						<span class="description" style="margin-left: 4%; width: 2%"> ${lente['empresa']} </span>
						<span class="description"style="margin-left: 8%; width: 2%"> ${lente['tipo']} </span>
						<span class="description"style="margin-left: 8%; width: 5%"> ${lente['custo']} </span>
						<span class="description"style="margin-left: 6%; width: 4%"> ${lente['venda']} </span>
						<button class="danger" style="margin-left: 8%;" onclick="deleteClient(${lente['uuid']})">Excluir</button>
						<button class="positive" style="margin-left: 1%" onclick="editClient(${lente['uuid']})">Editar</button>
						<hr style="margin-left: 10%; margin-right: 10%; opacity: 0.5">`;

			document.getElementById('container_lentes').innerHTML += html;
	}
}


