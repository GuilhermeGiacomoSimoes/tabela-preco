function gravarLente(lente) {
	lente.uuid = gerarUUID();
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
