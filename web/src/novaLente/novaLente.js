var database 		  = obterConfiguracaoFirebase();
var editar            = false;
var uuidLenteEditada  = '';
var arr 			  = [];
var msgErro			  = '';

resetarCampos(); 
obterLentes(); 

if( window.location.href.includes('vercel') ){
	verificarLogin('nova_lente');
}

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
	for (let key in arr){
		let empresa = arr[key];
		for (let uuidLente in empresa){
			if (uuidLente == uuid){
				return empresa[uuid]; 
			}
		}
	}

	return null;
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
			msgErro = err;
			document.getElementById('erro_dialog').style.display = 'block';
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

		edtPrecoPromocional.value = doubleParaDinheiro(precoPromocao); 
		edtPorcentagemDesconto.value = porcentagemDesconto;

		flagPromocao();
	}

	edtDescricao 	  .value = descricao;	
	edtEmpresa   	  .value = empresa;	
	edtTipo      	  .value = tipo;	
	edtPreco     	  .value = doubleParaDinheiro(preco);	
	edtMultiplicador  .value = multiplicador;
	edtVenda 	 	  .value = preco * multiplicador;
	edtiCilindrico 	  .value = cilindrico;
	edtEsferico 	  .value = esferico;
	edtIndice 	 	  .value = indice;
	edtDiametro       .value = diametro;

}

function verificaIrregularidades(lente){
	let msg = '';

	if ( lente.descricao == null || lente.descricao  == undefined || lente.descricao  == "" || lente.descricao.length > 50 )  {
		msg += '** revise a descrição da lente';
	} 
	if (lente.empresa  == null || lente.empresa  == undefined || lente.empresa  == "" || lente.empresa.length > 20 )  {
		msg += ' ** revise o nome da empresa';
	} 
	if (lente.tipo == null || lente.tipo == undefined || lente.tipo == "" || lente.tipo.length > 10 )  {
		msg += '** revise o tipo';
	} 
	if (lente.preco == null || lente.preco == undefined || lente.preco <= 0 || ''+lente.preco.length > 7 )  {
		msg += ' ** revise o preço da lente';
	} 
	if (lente.multiplicador == null || lente.multiplicador == undefined || lente.multiplicador <= 0 || ''+lente.multiplicador.length > 1 )  {
		msg += '** revise o multiplicador do preço ';
	} 
	if (lente.promocao)  {
		if (lente.precoPromocional == null || lente.precoPromocional == undefined || lente.precoPromocional <= 0 || ''+lente.precoPromocional.length > 7)  {
			msg += '** revise o preço promocional ';
		} 
		if (lente.porcentagemDesconto == null || lente.porcentagemDesconto == undefined || lente.porcentagemDesconto <= 0 || ''+lente.porcentagemDesconto.length > 2)  {
			msg += '** revise a porcentagem de desconto ';
		} 
	} 

	return msg;
}

function gravarLente(lente) {
	let msg = verificaIrregularidades(lente);

	if (msg != '') {
		mostrarDialog(msg, false);
		return false;
	}

	gerarLoading();

	try {
		database.ref(`lentes/${lente.empresa}/${lente.uuid}`).set(lente).then( snapshot => {
			pararLoading(); 
			resetarCampos();
			mostrarDialog("Salvo com sucesso", editar);
			editar = false;
		}).catch(error => {
			msgErro = error;
			document.getElementById('erro_dialog').style.display = 'block';
		});	

	}catch (exception) {
		mostrarDialog("Algo deu errado! " + exception, editar);	
	}

	return true;
}

function resetarCampos() {
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

		precoPromocional = dinheiroParaDouble(precoPromocional);

		venda = precoPromocional * multiplicador;
	}

	preco = dinheiroParaDouble(preco);

	let lente = {
		uuid, 
		descricao, 
		empresa, 
		tipo, 
		preco: parseFloat(preco), 
		multiplicador: parseInt(multiplicador), 
		promocao, 
		precoPromocional : parseFloat(precoPromocional) || 0, 
		porcentagemDesconto : parseInt(porcentagemDesconto) || 0, 
		venda : parseFloat(venda), 
		esferico, 
		cilindrico, 
		indice : parseFloat(indice), 
		diametro : parseInt(diametro) || 0
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

		if (voltar) { 
			window.location.href = '../telaInicial/telaInicial.html';  
		}
	}

	window.onclick = function(event) {
  		if (event.target == modal) {
    		modal.style.display = "none";

			if (voltar) { 
				window.location.href = '../telaInicial/telaInicial.html';  
			}
  		}
	}
}


function flagPromocao() {
	let promocao = document.getElementById('promocao').checked;

	document.getElementById('flagPromocaoAtivada').style.display = 'none';

	if (promocao) {
		document.getElementById('flagPromocaoAtivada').style.display = 'block';
	}
}

function verificarPrecoPromocional() {

	let precoPromocional     = document.getElementById('precoPromocional').value;
	let preco                = document.getElementById('preco').value;

    precoPromocional = dinheiroParaDouble(precoPromocional);
    preco            = dinheiroParaDouble(preco)

	if ( precoPromocional >= preco )	{
		precoPromocional = preco - 1;
		document.getElementById('precoPromocional').value = doubleParaDinheiro(precoPromocional);
	}

	return precoPromocional;
}

function mudaPrecoPromocional() {
	verificarPrecoPromocional();

	let precoPromocional     = document.getElementById('precoPromocional').value;
	let preco                = document.getElementById('preco').value;

    precoPromocional = dinheiroParaDouble(precoPromocional);
    preco            = dinheiroParaDouble(preco)

	if (precoPromocional && preco) {
		let porcentagem = (1 - (precoPromocional / preco ))  * 100 ;	
		document.getElementById('porcentagemDoDesconto').value = Number(porcentagem).toFixed(2);
	}
}

function mudaPorcentagemPromocao() {
	let porcentagem = document.getElementById('porcentagemDoDesconto').value;
	let preco       = document.getElementById('preco').value;

    precoPromocional = dinheiroParaDouble(precoPromocional);
    preco            = dinheiroParaDouble(preco)

	if (porcentagem && preco) {
		let precoPromocional = preco - (preco * ( porcentagem / 100 ));
		document.getElementById('precoPromocional').value = doubleParaDinheiro(precoPromocional);	
	}
}

function dinheiroParaDouble( param ) {
	let somenteValorEmNumero = param;

	if(param.includes('R$')) {
		let arrParam = param.split('R$');
		somenteValorEmNumero = arrParam[1];
	}

	if ( somenteValorEmNumero.includes('.')) {
		somenteValorEmNumero = somenteValorEmNumero.replace('.', ''); 
	}
	if( somenteValorEmNumero.includes(',')){
		somenteValorEmNumero = somenteValorEmNumero.replace(',', '.'); 
	}

	return Number(somenteValorEmNumero);
}

function doubleParaDinheiro( param ) {
	param = param.toString().replace('.', ',') 
	return `R$ ${param}`; 
}

function enviarEmailErro(){
	var link = "mailto:trintaeoitogc@gmail.com"
             + "?cc=modelo.montagem@hotmail.com"
             + "&subject=" + escape("inseto")
             + "&body=" + msgErro 

    window.location.href = link;
}

$(function(){
   $(".mascaraDinheiro").maskMoney({
	   allowZero:false, 
	   allowNegative:true, 
	   defaultZero:false, 
       prefix: 'R$ ',
       thousands: '.',
       decimal: ','
   });
});
