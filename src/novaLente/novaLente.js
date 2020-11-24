var database = obterConfiguracaoFirebase();

function gravarLente(lente) {
	lente.uuid = gerarUUID();
	try {
		database.ref("lentes/" + lente.uuid ).set(lente);	
	}catch (exception) {
		console.log("deu ruim: " + exception);
	}
	finally {
		setTimeout(_=>{ pararLoading(); }, 3000);
	}
}

function cadastrar() {
	gerarLoading();

	let descricao 		= document.getElementById('descricao')		.value;
	let empresa 		= document.getElementById('empresa')		.value;
	let tipo 			= document.getElementById('tipo')			.value;
	let preco 			= document.getElementById('preco')			.value;
	let multiplicador 	= document.getElementById('multiplicador')	.value;
	let uuid 			= gerarUUID();

	let lente = {descricao, empresa, tipo, preco, multiplicador};
	gravarLente(lente);
}

let input = document.getElementById('multiplicador');
input.addEventListener('change', _=> {
	let multiplicador 	= input.value;  
	let preco 			= document.getElementById('preco').value;
	let venda	 		= (preco * multiplicador).toFixed(2);
	document.getElementById('venda').value = venda;
});

function gerarLoading() {
	var modal = document.getElementById("loading");
	modal.style.display = "block";
}

function pararLoading() {
	var modal = document.getElementById("loading");
	modal.style.display = "none";
}

