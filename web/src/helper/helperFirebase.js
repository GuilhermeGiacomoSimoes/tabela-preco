var telaAtual = null;

function obterConfiguracaoFirebase() {
	var firebaseConfig = {
		apiKey: "AIzaSyBOb971R81rzDuTvolsFhNDq3-vcd19kYs",
		authDomain: "tabela-preco-5ed67.firebaseapp.com",
		databaseURL: "https://tabela-preco-5ed67.firebaseio.com",
		projectId: "tabela-preco-5ed67",
		storageBucket: "tabela-preco-5ed67.appspot.com",
		messagingSenderId: "743281858698",
		appId: "1:743281858698:web:e3969122ca8dd8d39ef573"
	  };

	firebase.initializeApp(firebaseConfig);
	return firebase.database();
}

function gerarUUID () {
	let x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];	
	let M = [1, 2, 3, 4, 5];
	let N = [8, 9, 'a', 'b'];

	return [[ x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)] ].join(""), 
			[ x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)] ].join(""), 
			[ M[obterNumeroRandomico(0, M.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)] ].join(""), 
			[ N[obterNumeroRandomico(0, N.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)] ].join(""), 
			[ x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)], x[obterNumeroRandomico(0, x.length)] ].join(""), ]
			.join("-");		
}

function obterNumeroRandomico(min, max) {
	min = Math.ceil(min); 
	max = Math.floor(max - 1);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatarParaReal( nmr ) {
	return parseFloat(nmr).toLocaleString('pt-BR',{ style: 'currency', currency: 'BRL' }); 
}

function verificarLogin( telaAtualParam ) {
	telaAtual = telaAtualParam;
	firebase.auth().onAuthStateChanged(function(usuarioLogado) {
		verificaRedirecionamento(usuarioLogado)
	});
}

function verificaRedirecionamento( usuarioLogado ) {
	if ((usuarioLogado && telaAtual == 'index') || ! usuarioLogado && (telaAtual == 'tela_inicial' || telaAtual == 'nova_lente')){
		redirecionar(telaAtual);
	}
}

function redirecionar(telaAtual) {
	let url_redirecionamento = {}; 
	const url = window.location.href; 

	const redirecionarPara = telaAtual == 'index' ? 'tela_inicial' : 'index';
	const stringParaIndex =  url.includes('vercel') ? 'vercel.app' : 'tabela-preco/web' ;
	const tamanhoDoPrefixo =  url.includes('vercel') ? 'vercel.app'.length : 'tabela-preco/web'.length;

	const index = url.indexOf(stringParaIndex);
	const prefixo = url.substr(0, index + tamanhoDoPrefixo);
	
	const urlRedirecionamento = { 
		index : prefixo + '/index.html',
 		tela_inicial : prefixo + '/src/telaInicial/telaInicial.html' 
	}; 

	window.location.href = urlRedirecionamento[redirecionarPara]; 
}
