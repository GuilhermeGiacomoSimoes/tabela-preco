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

		editar   		 = true;
		uuidLenteEditada = lenteUUID;
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
	try {
		database.ref("lentes/" + lente.uuid ).set(lente).then( snapshot => {
			pararLoading(); 
			resetarCampos();
			mostrarDialog("Salvo com sucesso", true);

		}).catch(error => {
			mostrarDialog("Algo deu errado! " + error);	
		});	
	}catch (exception) {
	}
	finally {
		setTimeout(_=>{ 
				
		}, 3000);
		
	}
}

function resetarCampos() {
	editar            = false;
	uuidLenteEditada  = '';

	document.getElementById('descricao')    .value="";
	document.getElementById('empresa')      .value="";
	document.getElementById('tipo')			.value="";
	document.getElementById('preco')		.value="";
	document.getElementById('multiplicador').value="";
	document.getElementById('venda')        .value="";
}

function cadastrar() {
	gerarLoading();

	let descricao 		= document.getElementById('descricao')		.value;
	let empresa 		= document.getElementById('empresa')		.value;
	let tipo 			= document.getElementById('tipo')			.value;
	let preco 			= document.getElementById('preco')			.value;
	let multiplicador 	= document.getElementById('multiplicador')	.value;
	let uuid 			= editar ? uuidLenteEditada : gerarUUID();

	let lente = {uuid, descricao, empresa, tipo, preco, multiplicador};
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

function mostrarDialog(mensagem, voltar) {
	let modal = document.getElementById("dialogRetorno");
	modal.style.display = "block";

	document.getElementById("mensagemRetorno").textContent=mensagem;

	let btnFechar = document.getElementsByClassName("close")[0];
	btnFechar.onclick = _=> {
		modal.style.display = "none";

		if (editar) { 
			window.location.href = '../index/index.html';  
		}
	}

	window.onclick = function(event) {
  		if (event.target == modal) {
    		modal.style.display = "none";

			if (voltar) { 
				window.location.href = '../index/index.html';  
			}
  		}
	}
}

