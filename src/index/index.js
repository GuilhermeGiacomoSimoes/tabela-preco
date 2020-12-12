var database       = obterConfiguracaoFirebase();
var uuid           = undefined; 
var todasAsLentes  = {};
var lentesVisiveis = {}; 

obterLentes();

function obterLentes() {
	gerarLoading();

	try {
		var listaDeLentes = database.ref("lentes").orderByChild('descricao');	
		listaDeLentes.on('value', snapshot => {
			todasAsLentes = snapshot.val(); 
			construirTabelaDeLentes(todasAsLentes);
			pararLoading();
			document.getElementById('switchLentesPromocionais').checked = false;
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
						<span class="description" style="margin-left: 6%; width: 5%"> R$ ${lente['venda']} </span>
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
	filtrar();
}

function filtrar() {
	let lentesFiltradas = {};
	const valorSwitch   = document.getElementById('switchLentesPromocionais').checked;
	const texto         = document.getElementById("busca").value;	

	if (texto != "" && texto != undefined && texto != null) {
		for (let key in todasAsLentes) {
			let lente = todasAsLentes[key];
			let add   = false;

			for (let keyLente in lente) {
				let valor = ""+lente[keyLente];

				if (valor.indexOf(texto) != -1) {
					add = true;
					break;
				}
			}

			if(valorSwitch && lente['promocao'] && add) {
				add = true;
			}
			else if(valorSwitch && !lente['promocao']) {
				add = false; 
			}
			else if (!valorSwitch && add) {
				add = true;
			}

			if (add) {
				lentesFiltradas[lente.uuid] = lente;	
			}
		}
	}

	else {
		for (let key in todasAsLentes) {
			let lente = todasAsLentes[key];

			if (valorSwitch && lente['promocao']) {
				lentesFiltradas[lente.uuid] = lente;
			}	
			else if (!valorSwitch) {
				lentesFiltradas[lente.uuid] = lente;
			}
		}	
	}
		
	construirTabelaDeLentes(lentesFiltradas);
}

function gerarLoading() {
	let modal = document.getElementById("loading");
	if (modal){
		modal.style.display = "block";
	}
}

function pararLoading() {
	let modal = document.getElementById("loading");
	if (modal){
		modal.style.display = "none";
	}
}

function mostrarEsconderLentesNaoPromocionais() {
	let valor = document.getElementById('switchLentesPromocionais').checked;
	filtrar();
}
