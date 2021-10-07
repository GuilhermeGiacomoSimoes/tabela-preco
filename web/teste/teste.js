testarGeracaoUUID();
testarCadastroComPrecoCalculadoErrado();
testarNumeroRandomico();
testarConfiguracoesFirebase();
testeDinheiroParaDouble();
testeDoubleParaDinheiro(); 

function criarStringTeste( nomeTeste, deuCerto ) {
	const testesDiv = document.getElementById('testes');

	const colors = {
		true : '#007F00',
		false : '#ff0000'
	};

	const simbolos = {
		true : '✓',
		false : 'X'
	};

	const color = colors[deuCerto];
	const simbolo = simbolos[deuCerto];

	const html = `
		<div style="color:${color}"> ${simbolo} ## ${nomeTeste} </div>
	`;

	testesDiv.innerHTML += html;
}

function testarGeracaoUUID() {
	const uuid = gerarUUID();
	criarStringTeste('tamanho do uuid', uuid.length == 36)
}

function testarCadastroComPrecoCalculadoErrado() {
	let uuid = gerarUUID();
	let descricao = "solamax";
	let empresa = "ZEISS"; 
	let tipo = "lente";
	let preco = 123.30;
	let multiplicador = 2;
	let promocao = false;
	let precoPromocional = 0; 
	let porcentagemDesconto = 0; 
	let venda = preco * multiplicador;
	let esferico = '+4,00 A +2.00';
	let cilindrico = '-0,25 A -4,00';
	let indice = 1.49;
	let diametro = 70;

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

	const lenteComPrecoErrado = lente;
	lenteComPrecoErrado.venda += 1;
	const msgPrecoVendaErrado = verificaIrregularidades(lenteComPrecoErrado);
	criarStringTeste('cadastro com preço calculado errado',  msgPrecoVendaErrado != ''); 

	const lenteComDescricaoErrada = lente;
	lenteComDescricaoErrada.descricao = '';
	const msgComDescricaoErrada = verificaIrregularidades(lenteComDescricaoErrada);
	criarStringTeste('cadastro sem descricao',  msgComDescricaoErrada != ''); 

	const lenteComDescricaoMaiorQueOEsperado = lente;
	lenteComDescricaoMaiorQueOEsperado.descricao = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
	const msgComDescricaoMaiorQueOEsperado = verificaIrregularidades(lenteComDescricaoMaiorQueOEsperado);
	criarStringTeste('cadastro com descricao maior que o esperado',  msgComDescricaoMaiorQueOEsperado != ''); 

	const lenteComDescricaoNull = lente;
	lenteComDescricaoNull.descricao = null;
	const msgComDescricaoNull = verificaIrregularidades(lenteComDescricaoNull);
	criarStringTeste('cadastro com descricao null',  msgComDescricaoNull != ''); 

	const lenteComEmpresaVazia = lente;
	lenteComEmpresaVazia.empresa = '';
	const msgComEmpresaVazia = verificaIrregularidades(lenteComEmpresaVazia);
	criarStringTeste('cadastro sem empresa',  msgComEmpresaVazia != ''); 

	const lenteComEmpresaMaiorQueOEsperado = lente;
	lenteComEmpresaMaiorQueOEsperado.empresa = 'aaaaaaaaaaaaaaaaaaaaaab';
	const msgComEmpresaMaiorQuerOEsperado = verificaIrregularidades(lenteComEmpresaMaiorQueOEsperado);
	criarStringTeste('cadastro com empresa maior que o esperado',  msgComEmpresaMaiorQuerOEsperado != ''); 

	const lenteComEmpresaNull = lente;
	lenteComEmpresaNull.empresa = null;
	const msgComEmpresaNull = verificaIrregularidades(lenteComEmpresaNull);
	criarStringTeste('cadastro com empresa == null',  msgComEmpresaNull != ''); 

	const lenteComFlagPromocionalSemPrecoPromocional = lente;
	lenteComFlagPromocionalSemPrecoPromocional.promocao = true;
	lenteComFlagPromocionalSemPrecoPromocional.precoPromocional = null;
	const msgComLenteComFlagPromocionalSemProcePromocional = verificaIrregularidades(lenteComFlagPromocionalSemPrecoPromocional);
	criarStringTeste('cadastro com promocao == true mas sem preco promocional',  msgComLenteComFlagPromocionalSemProcePromocional != ''); 

	const lenteComPrecoDeVendaCalculadoErradoComPrecoProcional = lente;
	lenteComPrecoDeVendaCalculadoErradoComPrecoProcional.precoPromocional += 1;
	const msgComPrecoDeVendaCalculadoErradoComPrecoPromocional = verificaIrregularidades(lenteComPrecoDeVendaCalculadoErradoComPrecoProcional);
	criarStringTeste('cadastro com preço de venda calculado errado e com preco promocional',  msgComPrecoDeVendaCalculadoErradoComPrecoPromocional != ''); 
}

function testarNumeroRandomico() {
	const numero = obterNumeroRandomico(50, 100);
	criarStringTeste( 'testar se o numero foi gerado', numero != null ); 
	criarStringTeste( 'testar se o numero gerado está dentro do intervalo', numero >= 50 && numero <= 100 ); 
}

function testarConfiguracoesFirebase() {
	const conf = obterConfiguracaoFirebase();
	criarStringTeste( 'testar se as configurações estão retornado corretamente ', conf != null ); 
}

function testeDinheiroParaDouble() {
	let retorno = dinheiroParaDouble("R$ 30,56"); 
	criarStringTeste("teste dinheiro para double", retorno == 30.56)
}

function testeDoubleParaDinheiro() {
	let retorno = doubleParaDinheiro(30.56); 
	let deuCerto = retorno == "R$ 30,56"; 
	criarStringTeste("teste double para dinheiro ", deuCerto); 
}
