var database 		  = obterConfiguracaoFirebase();
var editar            = false;
var uuidLenteEditada  = '';
var arr 			  = [];
var msgErro			  = '';

limparCampos(); 
obterLentes(); 

if( window.location.href.includes('vercel') ){
	verificarLogin('nova_lente');
}

function verificaEdicao() {
	const url = window.location.href;

	if (url.indexOf('?') != -1){
		const lenteUUID = url.split('?')[1];
		const lente = obterLente(lenteUUID);

		editar   		 = true;
		uuidLenteEditada = lenteUUID;

		preencherOsDadosParaEditarAlente(lente);
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

function preencherOsDadosParaEditarAlente(snapshot) {
	let	edtDescricao = document.getElementById('descricao');
	let	edtEmpresa = document.getElementById('empresa'); 
	let	edtTipo = document.getElementById('tipo'); 
	let	edtPreco = document.getElementById('preco');   
	let	edtMultiplicador = document.getElementById('multiplicador');   
	let	edtVenda = document.getElementById('venda');   
	let	cbPromocao = document.getElementById('promocao');   
	let	edtPrecoPromocional = document.getElementById('precoPromocional');   
	let	edtPorcentagemDesconto = document.getElementById('porcentagemDoDesconto');   
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
	let diametro      = snapshot['diametro'];    
	let venda         = snapshot['venda'];    

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
	edtVenda 	 	  .value = doubleParaDinheiro(venda);
	edtiCilindrico 	  .value = cilindrico;
	edtEsferico 	  .value = esferico;
	edtIndice 	 	  .value = indice;
	edtDiametro       .value = diametro;

}

function verificaIrregularidades(lente){
	let msg = '';

	if ( lente.descricao == null || lente.descricao  == undefined || lente.descricao  == "" || lente.descricao.length > 50 ) {
		msg += '** revise a descrição da lente';
	} 
	if (lente.empresa  == null || lente.empresa  == undefined || lente.empresa  == "" || lente.empresa.length > 20 )  {
		msg += ' ** revise o nome da empresa';
	} 
	if (lente.tipo == null || lente.tipo == undefined || lente.tipo == "" || lente.tipo.length > 40 )  {
		msg += '** revise o tipo';
	} 
	if (Number.isNaN(lente.preco) || lente.preco == null || lente.preco == undefined || lente.preco <= 0 || ''+lente.preco.length > 7 )  {
		msg += ' ** revise o preço da lente';
	} 
	if (Number.isNaN(lente.multiplicador) || lente.multiplicador == null || lente.multiplicador == undefined || lente.multiplicador <= 0 || ''+lente.multiplicador.length > 1 )  {
		msg += '** revise o multiplicador do preço ';
	} 
	if (lente.promocao) {
		if (Number.isNaN(lente.precoPromocional) || lente.precoPromocional == null || lente.precoPromocional == undefined || lente.precoPromocional <= 0 || ''+lente.precoPromocional.length > 7)  {
			msg += '** revise o preço promocional ';
		} 
		if (Number.isNaN(lente.porcentagemDesconto) || lente.porcentagemDesconto == null || lente.porcentagemDesconto == undefined || lente.porcentagemDesconto <= 0 || ''+lente.porcentagemDesconto.length > 2)  {
			msg += '** revise a porcentagem de desconto ';
		} 
		if(lente.venda != (lente.precoPromocional * lente.multiplicador)) {
			msg += '** o calculo de preco de venda não está correto por algum motivo';
		}
	} else {
		if(lente.venda != (lente.preco * lente.multiplicador)) {
			msg += '** o calculo de preco de venda não está correto por algum motivo';
		}
	}

	return msg;
}

function salvarLenteNoBanco(lente) {
	let msg = verificaIrregularidades(lente);

	if (msg != '') {
		mostrarDialog(msg, false);
		return false;
	}

	gerarLoading();

	try {
		database.ref(`lentes/${lente.empresa}/${lente.uuid}`).set(lente).then( snapshot => {
			pararLoading(); 
			limparCampos();
			mostrarDialog("Salvo com sucesso", editar);
			editar = false;
		}).catch(error => {
			pararLoading(); 
			msgErro = error;
			document.getElementById('erro_dialog').style.display = 'block';
		});	

	}catch (exception) {
		mostrarDialog("Algo deu errado! " + exception, editar);	
	}

	return true;
}

function limparCampos() {
	uuidLenteEditada  = '';

	document.getElementById('descricao').value="";
	document.getElementById('empresa').value="";
	document.getElementById('tipo').value="";
	document.getElementById('preco').value="";
	document.getElementById('multiplicador').value="";
	document.getElementById('venda').value="";
	document.getElementById('promocao').checked=false;
	document.getElementById('precoPromocional').value="";
	document.getElementById('porcentagemDoDesconto').value = '';
	document.getElementById('indice').value = '';
	document.getElementById('cilindrico').value = '';
	document.getElementById('esferico').value = '';
	document.getElementById('diametro').value = '';
}

function montarObjetoLente () {
	let descricao 		= document.getElementById('descricao').value.toUpperCase();
	let empresa 		= document.getElementById('empresa').value.toUpperCase();
	let tipo 			= document.getElementById('tipo').value.toUpperCase();
	let preco 			= document.getElementById('preco').value;
	let multiplicador 	= document.getElementById('multiplicador').value;
	let uuid 			= editar ? uuidLenteEditada : gerarUUID();
	let promocao        = document.getElementById('promocao').checked;
	let	esferico 		= document.getElementById('esferico').value || "";
	let	cilindrico  	= document.getElementById('cilindrico').value || "";   
	let	indice 			= document.getElementById('indice').value || "";   
	let	diametro 		= document.getElementById('diametro').value || "";

	let precoPromocional    = null; 
    let porcentagemDesconto = null;

	preco = dinheiroParaDouble(preco);
	let venda = preco * multiplicador;

	if (promocao) {
		precoPromocional     = document.getElementById('precoPromocional').value;
		porcentagemDesconto  = document.getElementById('porcentagemDoDesconto').value;
		precoPromocional = dinheiroParaDouble(precoPromocional);
		venda = precoPromocional * multiplicador;
	}

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
		indice : parseFloat(indice) || 0, 
		diametro : parseInt(diametro) || 0
	};

	return lente;
}

function cadastrar() {
	const lente = montarObjetoLente();
	salvarLenteNoBanco(lente);
}

function mudouMultiplicador() {
	let multiplicadorInput = document.getElementById('multiplicador');
	let multiplicador 	= multiplicadorInput.value;  
	let preco 			= document.getElementById('preco').value;

	if ( document.getElementById('promocao').checked ){
		preco = document.getElementById('precoPromocional').value;
	}

	preco = dinheiroParaDouble(preco);

	let venda	 		= (preco * multiplicador).toFixed(2);
	document.getElementById('venda').value = doubleParaDinheiro(venda);
} 

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
	let preco = document.getElementById('preco').value;
	let multiplicador = document.getElementById('multiplicador').value;

	preco = dinheiroParaDouble(preco);
	let precoVenda = preco * multiplicador; 

	document.getElementById('flagPromocaoAtivada').style.display = 'none';

	if (promocao) {
		document.getElementById('flagPromocaoAtivada').style.display = 'block';
		precoPromocional = document.getElementById('precoPromocional').value;
		preco = dinheiroParaDouble(precoPromocional);
		precoVenda = preco * multiplicador; 
	}

	document.getElementById('venda').value = doubleParaDinheiro(precoVenda);
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

	if (preco) {
		let porcentagem = (1 - (precoPromocional / preco ))  * 100 ;	
		let precoVenda  = precoPromocional * document.getElementById('multiplicador').value; 
		document.getElementById('porcentagemDoDesconto').value = Number(porcentagem).toFixed(2);
		document.getElementById('venda').value = doubleParaDinheiro(precoVenda);	
	}
}

function mudaPorcentagemPromocao() {
	let porcentagem = document.getElementById('porcentagemDoDesconto').value;
	let preco       = document.getElementById('preco').value;
    preco           = dinheiroParaDouble(preco)

	if (porcentagem && preco) {
		let precoPromocional = preco - (preco * ( porcentagem / 100 ));
		let precoVenda  = precoPromocional * document.getElementById('multiplicador').value; 
		document.getElementById('precoPromocional').value = doubleParaDinheiro(precoPromocional);	
		document.getElementById('venda').value = doubleParaDinheiro(precoVenda);	
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
	return param.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).toLocaleString(); 
}

function enviarEmailErro(){
	var link = "mailto:trintaeoitogc@gmail.com"
             + "?cc=modelo.montagem@hotmail.com"
             + "&subject=" + escape("inseto")
             + "&body=" + msgErro 

    window.location.href = link;
}

function mudandoPrecoOriginal() {
	mudaPrecoPromocional();
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
