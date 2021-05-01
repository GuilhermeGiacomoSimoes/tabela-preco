var database       = obterConfiguracaoFirebase();
var uuid           = undefined;
var empresa        = undefined; 
var todasAsLentes  = {};
var lentesVisiveis = {};
var msgErro 	   = "";

obterLentes();

function obterLentes() {
	gerarLoading();

	try {
		var listaDeLentes = database.ref("lentes");	
		listaDeLentes.on('value', snapshot => {
			todasAsLentes = snapshot.val(); 
			construirTabelaDeLentes(todasAsLentes);
			document.getElementById('switchLentesPromocionais').checked = false;
			montarDocumentoParaImpressao(todasAsLentes);
			pararLoading();
		}, err => {
			msgErro = err;
			document.getElementById('erro_dialog').style.display = 'block';
		});
	}catch (exception) {
		
		console.log("deu ruim: " + exception);
	}
}

function montarDocumentoParaImpressao( empresas ) {
	let html = '';
	for (let key in empresas){

		html += `
			<tr class="row" style="background-color: #b8cce4; height: 7%; margin-bottom: 1%">
				<td><span style="margin: 4%"> ${key} </span></td>
				<td><span style="margin: 4%"> Esférico </span></td>
				<td><span style="margin: 4%"> Cilindicro </span></td>
				<td><span style="margin: 4%"> Índice </span></td>
				<td><span style="margin: 4%"> Diâmetro </span></td>
				<td><span style="margin: 4%"> Preço </span></td>
			</tr>
		`;

		let empresa = empresas[key];
		for (let uuidLente in empresa) {
			let lente = empresa[uuidLente];
			let color = "#000000";
			let preco = lente.preco;
			if (lente['promocao']) {
				color = "#FF0000";
				preco = lente['precoPromocional']; 
			}

			let venda = "R$ " + ( preco * lente['multiplicador'] );

			html += `
				<tr class="row" style="background-color: #fff; height: 7%; margin-bottom: 1%">
					<td><span style="color: #000; margin: 4%"> ${lente.descricao} </span></td>
					<td><span style="color: #000; margin: 4%"> ${lente.esferico} </span></td>
					<td><span style="color: #000; margin: 4%"> ${lente.cilindrico} </span></td>
					<td><span style="color: #000; margin: 4%"> ${lente.indice} </span></td>
					<td><span style="color: #000; margin: 4%"> ${lente.diametro} </span></td>
					<td><span style="color: ${color}; margin: 4%"> ${venda} </span></td>
				</tr>
			`;
		}
	}

	document.getElementById('source-html').innerHTML += html; 
}

function confirmarDelecaoLente(uuidParametro, empresaParametro) {
	uuid = uuidParametro;
	empresa = empresaParametro;
	let modal = document.getElementById('confirmaExclusao');
	modal.style.display = 'block';
}

function fecharModal(id) {
	uuid = undefined; 
	let modal = document.getElementById(id);
	modal.style.display = 'none';
}

function deletaLente() {
	try {
		let uuid = this.uuid; 
		let empresa = this.empresa;
		let lenteRef = this.database.ref(`lentes/${empresa}/${uuid}`);
		lenteRef.remove().then( _=> {

		}).catch( err =>{
			msgErro = err;
			document.getElementById('erro_dialog').style.display = 'block';
		});

		location.reload();
	}catch (exception) {
		console.log("deu ruim: " + exception);
	}
}

function editClient( uuid ) {
	window.location.href = `../novaLente/novaLente.html?${uuid}`;
}

function construirTabelaDeLentes(empresas){
	document.getElementById('container_lentes').innerHTML = "";
	var index = 0;
	
	for (let key in empresas){
		let empresa = empresas[key];
		for (let uuidLente in empresa){
			let lente       = empresa[uuidLente];
			let promocional = lente['promocao'];
			let color       = '#808080'; 
			let preco       = lente['preco'];
			index ++;	

			let background_line = ( index % 2 != 0 ) ? "#e5e4e2" : "#ffffff"; 

			if (promocional) {
				color = "#FF0000";
				preco = lente['precoPromocional']; 
			}

			let venda = preco * lente['multiplicador'];

			const html = `
			<div class="row align-items-center" style="background-color: ${background_line}; height: 50px; margin-bottom: 1%">
				<span class="description col-md-2"> ${lente['descricao']} </span>
				<span class="description col-md-2"> ${lente['empresa']} </span>
				<span class="description col-md-2"> ${lente['tipo']} </span>
				<span class="description col-md-2" style="color: ${color}"> R$ ${lente['preco']} </span>
				<span class="description col-md-1" style="color: ${color}"> R$ ${venda} </span>
				<button class="btn btn-danger col-md-1" onclick="confirmarDelecaoLente(\'${lente['uuid']}\', \'${lente['empresa']}\')" style="width: 120px; height: 50px; margin-right: 0.5%">
					<center>
						<img src="../../resources/trash.png" class="image-buttons"/> 
						Excluir
					</center>
				</button>
				<button class="btn btn-primary col-md-1" onclick="editClient(\'${lente['uuid']}\')" style="width: 120px; height: 50px;">
					<center>
						<img src="../../resources/edit.png" class="image-buttons"/> 
						Editar
					</center>
				</button>
			</div>`;

			document.getElementById('container_lentes').innerHTML += html;
		}
	}
}

function busca() {
	filtrar();
}

function filtrar() {
	let lentesFiltradas = {};
	const valorSwitch   = document.getElementById('switchLentesPromocionais').checked;
	const texto         = document.getElementById("busca").value.toUpperCase();	

	if (texto != "" && texto != undefined && texto != null) {
		for (let key_empresa in todasAsLentes) {
			let empresa = todasAsLentes[key_empresa];

			for (let uuidLente in empresa){

				let lente = empresa[uuidLente];
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
					if(lentesFiltradas[key_empresa]) {
						lentesFiltradas[key_empresa][uuidLente] = lente;
					}
					else {
						lentesFiltradas[key_empresa] = {}; 
						lentesFiltradas[key_empresa][uuidLente] = lente;
					}
				}
			}
		}
	}

	else {
		for (let key in todasAsLentes) {
			let empresa = todasAsLentes[key];

			for (let uuidLente in empresa){
				let lente = empresa[uuidLente];

				if (valorSwitch && lente['promocao']) {
					if(lentesFiltradas[key]) {
						lentesFiltradas[key][uuidLente] = lente;
					}
					else {
						lentesFiltradas[key] = {};
						lentesFiltradas[key][uuidLente] = lente;
					}
				}	
				else if (!valorSwitch) {
					if(lentesFiltradas[key]) {
						lentesFiltradas[key][uuidLente] = lente;
					}
					else {
						lentesFiltradas[key] = {};
						lentesFiltradas[key][uuidLente] = lente;
					}
				}
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
	filtrar();
}

function exportHTML(){
	html2canvas(document.getElementById("source-html"), {
		onrendered : function(canvas) {
			var imgData = canvas.toDataURL('image/jpeg');
            var doc = new window.jspdf.jsPDF({orientation : 'landscape'});
            doc.addImage(imgData, 'jpeg', 10, 20);
            doc.save('sample.pdf');
		}
	});
}

function enviarEmail(msg){
	
	if ( ! msg ) {
		msg = document.getElementById('corpo_email').value;
	}

	var link = "mailto:trintaeoitogc@gmail.com"
             + "?cc=modelo.montagem@hotmail.com"
             + "&subject=" + escape("inseto")
             + "&body=" + msg 

    window.location.href = link;
}

function enviarEmailErro(){
	enviarEmail(msgErro);	
}
