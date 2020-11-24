var database 		  = obterConfiguracaoFirebase();
var editar            = false;
var uuidLenteEditada  = '';

verificaEdicao();
function verificaEdicao()  {
	const url = window.location.href;
	if (url.indexOf('?') != -1){

		gerarLoading();

		const lenteUUID = url.split('?')[1];
		obterLente(lenteUUID);

		editar   = true;
		uuid     = lenteUUID;
	}
}

function obterLente(uuid) {
	try {
		let ref = database.ref('lentes/' + uuid);
		ref.on('value', snapshot => {
			preencherDadosLente(snapshot.val());
		});
	} catch(Exception){
		console.log('deu ruim');
	}
}

function preencherDadosLente(snapshot) {
	let	edtDescricao	 = document.getElementById('descricao'		);  
	let	edtEmpresa  	 = document.getElementById('empresa'		); 
	let	edtTipo     	 = document.getElementById('tipo'			); 
	let	edtPreco    	 = document.getElementById('preco'			);   
	let	edtMultiplicador = document.getElementById('multiplicador'	);   
	let	edtVenda 		 = document.getElementById('venda'			);   

	let	descricao 	  = snapshot['descricao'];  
	let	empresa   	  = snapshot['empresa']; 
	let	tipo      	  = snapshot['tipo']; 
	let	preco     	  = snapshot['preco']; 
	let	multiplicador = snapshot['multiplicador'];    

	edtDescricao 	  .value = descricao 	 ;	
	edtEmpresa   	  .value = empresa   	 ;	
	edtTipo      	  .value = tipo      	 ;	
	edtPreco     	  .value = preco     	 ;	
	edtMultiplicador  .value = multiplicador ;
	edtVenda 	 	  .value = 	preco * multiplicador;

	pararLoading();
}

function gravarLente(lente) {
	lente.uuid = gerarUUID();
	try {
		database.ref("lentes/" + lente.uuid ).set(lente);	
	}catch (exception) {
		mostrarDialog("Algo deu errado! " + exception);	
	}
	finally {
		setTimeout(_=>{ 
			pararLoading(); 
			if (editar) window.location.href = '../index/index.html';  
			mostrarDialog("Salvo com sucesso");	
		}, 3000);
		
	}
}

function cadastrar() {
	gerarLoading();

	let descricao 		= document.getElementById('descricao')		.value;
	let empresa 		= document.getElementById('empresa')		.value;
	let tipo 			= document.getElementById('tipo')			.value;
	let preco 			= document.getElementById('preco')			.value;
	let multiplicador 	= document.getElementById('multiplicador')	.value;
	let uuid 			= editar ? uuidLenteEditada : gerarUUID();

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
	let modal = document.getElementById("loading");
	modal.style.display = "block";
}

function pararLoading() {
	let modal = document.getElementById("loading");
	modal.style.display = "none";
}

function mostrarDialog(mensagem) {
	let modal = document.getElementById("dialogRetorno");
	modal.style.display = "block";

	document.getElementById("mensagemRetorno").textContent=mensagem;

	let btnFechar = document.getElementsByClassName("close")[0];
	btnFechar.onclick = _=> {
		modal.style.display = "none";
	}

	window.onclick = function(event) {
  		if (event.target == modal) {
    		modal.style.display = "none";
  		}
	}
}

