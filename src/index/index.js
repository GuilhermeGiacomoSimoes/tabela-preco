var database = obterConfiguracaoFirebase();
obterLentes();

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

function deletaLente( uuid ) {
	try {
		let lenteRef = this.database.ref("lentes/" + uuid);
		lenteRef.remove();

		location.reload();
	}catch (exception) {
		console.log("deu ruim: " + exception);
	}
	
}

function editClient( uuid ) {
	window.location.href = `../novaLente/novaLente.html?${uuid}`;
}

function construirTabelaDeLentes(array){
	for (let key in array){
			let lente = array[key];
			let vista = lente['preco'] * lente['multiplicador'];

			const html = `<span class="description"style="margin-left: 10%; width: 15%"> ${lente['descricao']}</span>
						<span class="description" style="margin-left: 4%; width: 5%"> ${lente['empresa']} </span>
						<span class="description" style="margin-left: 8%; width: 3%"> ${lente['tipo']} </span>
						<span class="description" style="margin-left: 8%; width: 5%"> ${lente['preco']} </span>
						<span class="description" style="margin-left: 6%; width: 4%"> ${vista} </span>
						<button class="danger" style="margin-left: 8%;" onclick="deletaLente(\'${lente['uuid']}\')">Excluir</button>
						<button class="positive" style="margin-left: 1%" onclick="editClient(\'${lente['uuid']}\')">Editar</button>
						<hr style="margin-left: 10%; margin-right: 10%; opacity: 0.5">`;

			document.getElementById('container_lentes').innerHTML += html;
	}
}



