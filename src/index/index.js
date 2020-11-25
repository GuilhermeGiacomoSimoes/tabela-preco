var database = obterConfiguracaoFirebase();
obterLentes();
var uuid = undefined; 

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

function confirmarDelecaoLente(uuidParametro) {
	uuid = uuidParametro;	
	let modal = document.getElementById('confirmaExclusao');
	modal.style.display = 'block';
}

function fecharModal() {
	uuid = undefined; 
	let modal = document.getElementById('confirmaExclusao');
	modal.style.display = 'none';
}

function deletaLente() {
	try {
		let uuid = this.uuid; 
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
						<button class="danger" style="margin-left: 5%; width: 10%; height: 5%;" onclick="confirmarDelecaoLente(\'${lente['uuid']}\')">
							<img src="../../resources/trash.png" style="width: 20%; height: 200%; margin-right: 2%"/> 
							Excluir
						</button>
						<button class="positive" style="margin-left: 1%; width: 10%; height: 5%;" onclick="editClient(\'${lente['uuid']}\')">
							<img src="../../resources/edit.png" style="width: 20%; height: 200%; margin-right: 2%"/> 
							Editar
						</button>
						<hr style="margin-left: 10%; margin-right: 10%; opacity: 0.5">`;

			document.getElementById('container_lentes').innerHTML += html;
	}
}




