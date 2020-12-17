var database 		  = obterConfiguracaoFirebase();
var editar            = false;
var uuidLenteEditada  = '';
resetarCampos()

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
	let	cbPromocao       = document.getElementById('promocao'	    );   
	let	edtPrecoPromocional    = document.getElementById('precoPromocional' );   
	let	edtPorcentagemDesconto = document.getElementById('porcentagemDoDesconto' );   

	let	descricao 	  = snapshot['descricao'];  
	let	empresa   	  = snapshot['empresa']; 
	let	tipo      	  = snapshot['tipo']; 
	let	preco     	  = snapshot['preco']; 
	let	multiplicador = snapshot['multiplicador'];    
	let	promocao      = snapshot['promocao'];    

	if (promocao) {
		cbPromocao.checked = true;

		let	porcentagemDesconto = snapshot['porcentagemDesconto'];    
		let	precoPromocao       = snapshot['precoPromocional'];    

		edtPrecoPromocional.value = precoPromocao; 
		edtPorcentagemDesconto.value = porcentagemDesconto;

		flagPromocao()
	}

	edtDescricao 	  .value = descricao			 ;	
	edtEmpresa   	  .value = empresa				 ;	
	edtTipo      	  .value = tipo					 ;	
	edtPreco     	  .value = preco				 ;	
	edtMultiplicador  .value = multiplicador		 ;
	edtVenda 	 	  .value = 	preco * multiplicador;

	pararLoading();
}

function gravarLente(lente) {
	if (verificaIrregularidades(lente)) {
		return false;
	}

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

	return true;
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
	document.getElementById('promocao') .checked=false;
	document.getElementById('precoPromocional').value="";
	document.getElementById('porcentagemDoDesconto').value = '';
}

function cadastrar() {
	gerarLoading();

	let descricao 		= document.getElementById('descricao')		.value;
	let empresa 		= document.getElementById('empresa')		.value;
	let tipo 			= document.getElementById('tipo')			.value;
	let preco 			= document.getElementById('preco')			.value;
	let multiplicador 	= document.getElementById('multiplicador')	.value;
	let uuid 			= editar ? uuidLenteEditada : gerarUUID();
	let promocao        = document.getElementById('promocao').checked;
	let venda          = preco * multiplicador;

	let precoPromocional    = null; 
    let porcentagemDesconto = null;

	if (promocao) {
		precoPromocional     = document.getElementById('precoPromocional').value;
		porcentagemDesconto  = document.getElementById('porcentagemDoDesconto').value;
	}

	let lente = {uuid, descricao, empresa, tipo, preco, multiplicador, promocao, precoPromocional, porcentagemDesconto, venda};
	gravarLente(lente);
}

let multiplicadorInput = document.getElementById('multiplicador');
multiplicadorInput.addEventListener('change', _=> {
	let multiplicador 	= multiplicadorInput.value;  
	let preco 			= document.getElementById('preco').value;
	let venda	 		= (preco * multiplicador).toFixed(2);
	document.getElementById('venda').value = venda;
});

let precoInput = document.getElementById('preco');
precoInput.addEventListener('change', _=> {
	let preco 	       = precoInput.value;  
	let multiplicador = document.getElementById('multiplicador').value;
	let venda	 	   = (preco * multiplicador).toFixed(2);
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


function flagPromocao() {
	let promocao = document.getElementById('promocao').checked;

	if (promocao) {
		document.getElementById('flagPromocaoAtivada').style.display = 'block';
	}
	else {
		document.getElementById('flagPromocaoAtivada').style.display = 'none';
	}
}

function mudaPrecoPromocional() {
	let precoPromocional     = document.getElementById('precoPromocional').value;
	let preco                = document.getElementById('preco').value;

	if (precoPromocional != "" && preco != "") {
		let porcentagem = (1 - (precoPromocional / preco ))  * 100 ;	
		document.getElementById('porcentagemDoDesconto').value = Number(porcentagem).toFixed(2);
	}

}

function mudaPorcentagemPromocao() {
	let porcentagem = document.getElementById('porcentagemDoDesconto').value;
	let preco       = document.getElementById('preco').value;

	if (porcentagem != "" && preco != "") {
		let precoPromocional = preco - (preco * ( porcentagem / 100 ));
		document.getElementById('precoPromocional').value = precoPromocional;	
	}

}
