var database 		  = obterConfiguracaoFirebase();
var editar            = false;
var uuidLenteEditada  = '';
var arr 			  = [];

resetarCampos(); 
obterLentes(); 

function verificaEdicao()  {
	const url = window.location.href;
	if (url.indexOf('?') != -1){

		const lenteUUID = url.split('?')[1];
		const lente = obterLente(lenteUUID);

		editar   		 = true;
		uuidLenteEditada = lenteUUID;

		preencherDadosLente(lente);
	}
}

function obterLente(uuid) {
	let lente = {};
	for (let key in arr){
		let empresa = arr[key];
		for (let uuidLente in empresa){
			lente = empresa[uuidLente];
		}
	}	

	return lente;
}

function obterLentes() {
	gerarLoading(); 
	try {
		let ref = database.ref('lentes');
		ref.on('value', snapshot => {
			arr = snapshot.val();
			verificaEdicao();
			pararLoading();
		}, err => {
			mostrarDialog("Algo deu errado! " + err);	
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
	let	edtiCilindrico = document.getElementById('cilindrico');   
	let	edtEsferico= document.getElementById('esferico');   
	let	edtIndice= document.getElementById('indice');   
	let	edtDiametro = document.getElementById('diametro');   

	let	descricao 	  = snapshot['descricao'];  
	let	empresa   	  = snapshot['empresa']; 
	let	tipo      	  = snapshot['tipo']; 
	let	preco     	  = snapshot['preco']; 
	let	multiplicador = snapshot['multiplicador'];    
	let	promocao      = snapshot['promocao'];    
	let	cilindrico    = snapshot['cilindrico'];    
	let	esferico      = snapshot['esferico'];    
	let indice        = snapshot['indice'];    
	let diametro        = snapshot['diametro'];    

	if (promocao) {
		cbPromocao.checked = true;

		let	porcentagemDesconto = snapshot['porcentagemDesconto'];    
		let	precoPromocao       = snapshot['precoPromocional'];    

		edtPrecoPromocional.value = precoPromocao; 
		edtPorcentagemDesconto.value = porcentagemDesconto;

		flagPromocao();
	}

	edtDescricao 	  .value = descricao			 ;	
	edtEmpresa   	  .value = empresa				 ;	
	edtTipo      	  .value = tipo					 ;	
	edtPreco     	  .value = preco				 ;	
	edtMultiplicador  .value = multiplicador		 ;
	edtVenda 	 	  .value = preco * multiplicador;
	edtiCilindrico 	  .value = cilindrico;
	edtEsferico 	  .value = esferico;
	edtIndice 	 	  .value = indice;
	edtDiametro       .value = diametro;

}

function verificaIrregularidades(lente){
	if ( lente.descricao == null || lente.descricao  == undefined || lente.descricao  == "" || lente.descricao.length > 50 )  {
		return true;
	} 
	if (lente.empresa  == null || lente.empresa  == undefined || lente.empresa  == "" || lente.empresa.length > 20 )  {
		return true;
	} 
	if (lente.tipo == null || lente.tipo == undefined || lente.tipo == "" || lente.tipo.length > 10 )  {
		return true;
	} 
	if (lente.preco == null || lente.preco == undefined || lente.preco <= 0 || ''+lente.preco.length > 7 )  {
		return true;
	} 
	if (lente.multiplicador == null || lente.multiplicador == undefined || lente.multiplicador <= 0 || ''+lente.multiplicador.length > 1 )  {
		return true;
	} 
	if (lente.promocao)  {
		if (lente.precoPromocional == null || lente.precoPromocional == undefined || lente.precoPromocional <= 0 || ''+lente.precoPromocional.length > 7)  {
			return true;
		} 
		if (lente.porcentagemDesconto == null || lente.porcentagemDesconto == undefined || lente.porcentagemDesconto <= 0 || ''+lente.porcentagemDesconto.length > 2)  {
			return true;
		} 
		if (lente.venda == null || lente.venda == undefined || lente.venda == "" || lente.venda.length > 50 )  {
			return true;
		} 
	} 

	return false;
}

function gravarLente(lente) {
	if (verificaIrregularidades(lente)) {
		mostrarDialog("Preencha todos os campos corretamente", false);
		return false;
	}

	gerarLoading();

	try {
		database.ref(`lentes/${lente.empresa}/${lente.uuid}`).set(lente).then( snapshot => {
			pararLoading(); 
			resetarCampos();
			mostrarDialog("Salvo com sucesso", true);
		}).catch(error => {
			mostrarDialog("Algo deu errado! " + error);	
		});	

	}catch (exception) {
		mostrarDialog("Algo deu errado! " + exception);	
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
	document.getElementById('indice').value = '';
	document.getElementById('cilindrico').value = '';
	document.getElementById('esferico').value = '';
	document.getElementById('diametro').value = '';
}

function cadastrar() {
	let descricao 		= document.getElementById('descricao').value.toUpperCase();
	let empresa 		= document.getElementById('empresa').value.toUpperCase();
	let tipo 			= document.getElementById('tipo').value.toUpperCase();
	let preco 			= document.getElementById('preco').value;
	let multiplicador 	= document.getElementById('multiplicador').value;
	let uuid 			= editar ? uuidLenteEditada : gerarUUID();
	let promocao        = document.getElementById('promocao').checked;
	let venda           = preco * multiplicador;
	let	esferico 		= document.getElementById('esferico').value;   
	let	cilindrico  	= document.getElementById('cilindrico').value;   
	let	indice 			= document.getElementById('indice').value;   
	let	diametro 		= document.getElementById('diametro').value;   

	let precoPromocional    = null; 
    let porcentagemDesconto = null;

	if (promocao) {
		precoPromocional     = document.getElementById('precoPromocional').value;
		porcentagemDesconto  = document.getElementById('porcentagemDoDesconto').value;
	}

	let lente = {
		uuid, 
		descricao, 
		empresa, 
		tipo, 
		preco, 
		multiplicador, 
		promocao, 
		precoPromocional, 
		porcentagemDesconto, 
		venda, 
		esferico, 
		cilindrico, 
		indice, 
		diametro
	};

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
