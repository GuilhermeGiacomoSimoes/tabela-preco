var database = obterConfiguracaoFirebase();
obterLentes();
var uuid = undefined; 
var todasAsLentes = {};

function obterLentes() {
	try {
		var listaDeLentes = database.ref("lentes").orderByChild('descricao');	
		listaDeLentes.on('value', snapshot => {
			todasAsLentes = snapshot.val(); 
			construirTabelaDeLentes(todasAsLentes);
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
	document.getElementById('container_lentes').innerHTML = "";

	for (let key in array){
			let lente = array[key];

			const html = `<span class="description"style="margin-left: 10%; width: 15%"> ${lente['descricao']}</span>
						<span class="description" style="margin-left: 4%; width: 2%"> ${lente['empresa']} </span>
						<span class="description" style="margin-left: 8%; width: 2%"> ${lente['tipo']} </span>
						<span class="description" style="margin-left: 8%; width: 4%"> R$ ${lente['preco']} </span>
						<span class="description" style="margin-left: 6%; width: 1%"> R$ ${lente['venda']} </span>
						<button class="danger" style="margin-left: 5%; width: 120px; height: 50px;" onclick="confirmarDelecaoLente(\'${lente['uuid']}\')">
							<center>
								<img src="../../resources/trash.png" style="width: 20px; height: 20px;"/> 
								Excluir
							</center>
						</button>
						<button class="positive" style="margin-left: 1%; width: 120px; height: 50px;" onclick="editClient(\'${lente['uuid']}\')">
							<center>
								<img src="../../resources/edit.png" style="width: 20px; height: 20px;"/> 
								Editar
							</center>
						</button>
						<hr style="margin-left: 10%; margin-right: 20%; opacity: 0.5">`;

			document.getElementById('container_lentes').innerHTML += html;
	}
}

function busca() {
	const textoBusca = document.getElementById("busca").value;	

	if (textoBusca) {
		filtrar(textoBusca);
	} else {
		construirTabelaDeLentes(todasAsLentes);
	}
}

function filtrar(texto) {
	let lentesFiltradas = {};

	for (let key in todasAsLentes) {
		let lente = todasAsLentes[key];

		for (let keyLente in lente) {
			let valor = ""+lente[keyLente];

			if (valor.indexOf(texto) != -1) {
				lentesFiltradas[lente.uuid] = lente;	
				break;
			}
		}
	}	

	construirTabelaDeLentes(lentesFiltradas);
}
