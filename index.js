/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const { url } = require('inspector')
const { connect } = require('net')


exports.pselRaccoon = (req, res) => {

  var auth = req.headers["psel_key"] == 'psel_2022_05' ? "true" : "false"
  var query = req.url.split('/?action=')[1]
  var infoSec = readJson()
  
  if(auth){

    switch (query){
      case 'cpf':
      {
      	res.status(200).send(JSON.stringify(validArrayCPF(infoSec)))
      	break;
      }
      case 'uf':
      { 
      	res.status(200).send(JSON.stringify(ufCPF()))
      	break;
      }
      case 'ryca':
      { 
      	res.status(200).send(JSON.stringify(salary()))
      	break;
      }
      case 'payroll':
      { 
      	res.status(200).send(JSON.stringify(salarySum()))
      	break;
      }
      case 'stalker':
      { 
      	res.status(200).send(JSON.stringify(stalker()))
      	break;
      }
      case 'batman':
      { 
      	res.status(200).send(JSON.stringify(whoIsBatman()))
      	break;
      }
    }
  }  
  else
    res.status(511).send("ACCESS DENIED")

    function validArrayCPF(arr){
        
        var cont = 0
        for(i = 0; i < arr.length; i++){
            var cpf = arr[i].cpf
            cont += CPFisValid(cpf) == true ? 1 : 0
        }
        function CPFisValid(cpf){
            if (typeof cpf !== 'string') return false 
            cpf = cpf.replace(/[^\d]+/g, '') // Altera caracteres especiais padrões de CPF para campos vazios

            //https://gist.github.com/joaohcrangel/8bd48bcc40b9db63bef7201143303937 peguei de um jeito mais simplificado nesse topico
            if (cpf.length == 11 || !cpf.match(/(\d)\1{10}/)){//Verifica se CPF tem 11 digitos e se possui digitos repetidos({10}) com REGEX
              cpf = cpf.split('').map(el => +el)
                const rest = (count) => (cpf.slice(0, count-12)
                    .reduce( (soma, el, index) => (soma + el * (count-index)), 0 )*10) % 11 % 10 //.reduce faz a soma do array e a arrow function retorna o resto do primeiro e segundo digito verificador
                return rest(10) === cpf[9] && rest(11) === cpf[10] //retorna true se o digito verificador obtido no resto da conta for igual aos dois ultimos digitos do cpf
            }
        }
        return cont
    }
    



  function ufCPF(){
   
    payload = []
    const uf = [
        {'UF': 'RS'}, 
        {'UF': 'DF, GO, MT, MS, TO'}, 
        {'UF': 'AM, PA, RO, AP, AC, RO'}, 
        {'UF': 'CE, PI, MA'},
        {'UF': 'PB, PE, AL, RN'},
        {'UF': 'BH, SE'},
        {'UF': 'MG'},
        {'UF': 'RS, ES'} ,  
        {'UF': 'SP'},
        {'UF': 'PR, SC'}
    ]
    for(i = 0; i < infoSec.length; i++){
        var cpf = infoSec[i].cpf
        var cpf = cpf.replace(/[^\d]+/g, '')        

        payload.push({
            'cpf' : cpf,
            'uf' : uf[cpf[8]].UF
        });
    }
    return payload
  }

    function salary(){
        var arr = []
        for(i = 0; i < infoSec.length; i++)
            arr.push(infoSec[i].salario)
        arr.sort(function(a, b) {
            if(a < b) return -1
            if(a > b) return 1 
            else return 0
            }
        )
        return infoSec.find(function(e) {return e.salario == arr[arr.length - 2]}).nome
    }

  function salarySum(){
    var soma = 0
    for(i = 0; i < infoSec.length; i++)
      soma += infoSec[i].salario
    return soma
  }

  function stalker(){
    var fStalker = infoSec.filter(function(e) {return e.cargo == 'COORDENADOR' && e.estado_civil == 'SOLTEIRO'})
    var stalkerPayload = []

    for(i = 0; i < fStalker.length; i++){
      let payload = {
        'nome': fStalker[i].nome,
        'cpf' : fStalker[i].cpf
      }
      stalkerPayload.push(payload)
    }
    return stalkerPayload
  }

  function whoIsBatman(){
    var batDados = infoSec.find(function(e) {return e.nome == 'Bruce Wayne'})
    var batPayload = {
      'salario' : batDados.salario,
      'cpf' : batDados.cpf
    }
    return batPayload
  }


  function readJson() {

    var fs = require('fs');
    var data = fs.readFileSync('./infosec_processo_seletivo_clt_2022_maio.json', 'utf8');
    try{
      var dados = JSON.parse(data);
      return dados
    }
    catch(e){
      res.status(500).send('JSON is undefined')
    }
  }
}



