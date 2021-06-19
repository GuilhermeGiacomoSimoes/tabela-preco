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

function verificarLogin( local) {
	param = local;
	verificaLoginFirebase();
}

function verificaRedirecionamento( logado ) {
	if ((logado && param == 'index') || ! logado && (param == 'tela_inicial' || param == 'nova_lente')){
		redirecionar(param);
	}
}

function redirecionar(param) {
	let url_redirecionamento = {}; 
	const url = window.location.href; 

	const redirecionar_para = 
		param == 'index' 
		? 'tela_inicial' 
		: 'index';

	if ( url.includes('vercel') ) {
		url_redirecionamento = { 
			index : 'https://tabelapreco.vercel.app/',
			tela_inicial : 'https://tabelapreco.vercel.app/src/telaInicial/telaInicial.html' 
		}; 
	}
	else {
		var index = url.indexOf('tabela-preco');
		const prefix = url.substring(0, index + 12); 

		url_redirecionamento = { 
			tela_inicial : prefix + '/web/src/telaInicial/telaInicial.html',
			index : prefix + '/web/index.html' 
		};
	}

	window.location.href = url_redirecionamento[redirecionar_para]; 
}

function verificaLoginFirebase(){
	firebase.auth().onAuthStateChanged(function(user) {
		verificaRedirecionamento(user)
	});
}
