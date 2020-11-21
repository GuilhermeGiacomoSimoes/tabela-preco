database = obterConfiguracaoFirebase();
//gravarLente({
//	uuid       : gerarUUID()	,
//	descricao : 'zeiss solamax'	,
//	empresa   : 'zeiss'
//});

obterLentes();

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

function obterLentes() {
	try {
		var listaDeLentes = database.ref("lentes").orderByChild('descricao');	
		listaDeLentes.on('value', snapshot => {
			JSONParaArray(snapshot);	
		});
	}catch (exception) {
		console.log("deu ruim: " + exception);
	}
}

function JSONParaArray(json) {
	let JSONString 			= JSON.stringify(json.val());
	let arrayDeStringJSONs 	= JSONString.split("},");
	let arrayDeJSONs 		= [];

	for (let i=0; i<arrayDeStringJSONs.length; i ++) {
		let string = arrayDeStringJSONs[i]; 

		if (i==0) {
			string = string + "}}";
		}
		else if (i==arrayDeStringJSONs.length - 1) {
			string = "{" + string;
		}
		else {
			string = "{" + string + "}}";
		}

		let json = JSON.parse(string);	
		arrayDeJSONs.push(json);
	} 

	construirTabelaDeLentes(arrayDeJSONs);
}


function construirTabelaDeLentes(array){

}

function gravarLente(lente) {
	try {
		database.ref("lentes/" + lente.uuid ).set(lente);	
	}catch (exception) {
		console.log("deu ruim: " + exception);
	}
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
