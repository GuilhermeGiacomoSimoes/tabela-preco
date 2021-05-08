# Documentação oficial da tabela de preço

## Seções 

* [Abrindo tabela de preço](#abrindo-tabela-de-preço)
* [Instalação App](#instalação-app)
* [Tabela de preço](#tabela-preço)
* [Nova lente](#nova-lente)

### Abrindo tabela de preço
   Esse aplicativo de tabela é uma adaptação feita por mim de uma página web rodando localmente, portanto, ela vai abrir no seu navegador padrão.
   Para abrir, basta acessar o diretório (no diretório raiz do projeto): web/src/index  e dar dois cliques em index.html 
   ele vai abrir a página inicial da tabela de preço, e vc pode salva-la nos seus favoritos :)

### Instalação App 
   O apk pra instalação está dentro no caminho App/tabela_preco.apk
 
   Você conecta o telefone ao computador e seleciona, no telefone, a opção "Transferência de arquivos".

   Depois disso vc pode simplesmente mover o apk pro diretório raiz do Android.
   <img src="./web/resources/mover_apk.gif" />	<br>


   Agora no telefone, acesse o gerenciador de arquvos, e no diretório raiz, vc vai ver o apk, clique nele: 
   <img src="./web/resources/apk_diretorio.jpg" width="100"/>	<br>


   Depois clique em instalar  
   <img src="./web/resources/instalar_botao.jpg" />	<br>

   Ele vai dizer que bloqueou a instalação porque vem de fonte desconhecida, mas você pode clicar em "instalar mesmo assim" 
   <img src="./web/resources/instalar_mesmo_assim.jpg" />	<br>

   Depois de instalado ele vai pedir pra enviar o App pra revisão do google, mas não tem necessidade.  
   <img src="./web/resources/nao_enviar.jpg" />	<br>

   Depois de instalado você pode procurar o app da tabela de preços nos seus aplicativos, e você verá algo como isso
   <img src="./web/resources/tela_inicial_app.jpg" /> <br>

  O App é muito simples, temos a tabela de preço ja amostra na primeira tela, e caso queira ver mais detalhes de uma determinada lente, é só clicar em cima dela. 
  Os preços em vermelho são os preços promocionais.


### Tabela de preço
   A tabela de preço contém todas as suas lentes cadastradas. 

   Você pode pode fazer uma pesquisa como vc quiser: <br>
   <img src="./web/resources/exemplo_pesquisa.png" />	<br>
   Na barra de pesquisa você pode buscar o que vc quiser: Empresa, nome, preço... 




   Você pode querer exibir somente lentes promocionais:
   <img src="./web/resources/somente_promocionais.png" />	<br>
   Esse switch caso você o habilite vai filtrar a lista de lentes somente com preço promocional. <br>



   Caso você tenha algum problema, além de me mandar mensagem, outra coisa que pode te auxiliar é o botão de envio de email: <br>
   <img src="./web/resources/botao_envio_email.png" />	<br>



   Esse botão vai abrir uma caixa de diálogo onde você pode digitar o que está ocasionando seu problema:  <br>
   <img src="./web/resources/modal_email.png" />	<br>


   O botão de exportar PDF vai pegar toda a sua tabela de preço e transformar em um arquivo PDF:  <br>
   <img src="./web/resources/exportar_pdf.png" />	<br>


   Este é um exemplo de PDF: <br>
   <img src="./web/resources/exemplo_pdf.png" />	<br>


   Os botões de **excluir** e de **editar** já são autoexplicativos. 


### Nova lente
   Esse é um exemplo do cadastro de uma nova lente preenchido: <br>
   <img src="./web/resources/exemplo_cadastro.png" />	<br>


   Vamos ver alguns detalhes...

   Os campos **Esférico** e **Cilíndrico** devem ser preenchidos da seguinte forma: <br>
   <img src="./web/resources/esferico_cilindrico.png" />	<br>


   O campo **Preço de venda** você não vai conseguir preencher, o que vc deve fazer é colocar um Multiplicador no campo a cima. Ele vai calcular o preço de venda altomaticamente.

   Todos os campos que você preencher vão ser cadastrados com letra maiúscula, mesmo que você cadastre com letras minúscula. 

   **É extremamente importante que você acerto o nome da Empresa, é isso que vai determinar de qual empresa aquela lente pertence**
   Caso você cadastre com um nome de empresa errado, por exmplo:\ Hooyalux (com dois 'O's) ele vai assumir que Hooyalux é uma empresa diferente da Hoyalux.

   Seção da promoção <br>
   <img src="./web/resources/secao_promocao.png" />	<br>
   
   Essa seção é exibida quando você seleciona o check_box [x] 
   Agora você tem duas opções, ou coloca uma porcentagem de desconto (como '15' por cento) ou coloca um preço promocioal.
   **Atente-se de que você não deve colocar o simbolo de porcentagem % , somente o valor numérico**

   Independente do qual vc colocar ele vai calcular o outro automaticamente. Por exemplo, se você colocar 10 por cento de desconto em uma lente com preço de 100,00 reais, ele vai calcular, sozinho, o preço promocional (no caso, 90,00). O inverse também é verdade.
