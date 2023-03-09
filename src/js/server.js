import axios from "axios"

let conf
let headers = {}

const ServerConnection = (() => {

    const setConfig=(config)=>{
        conf = config;
        headers = {"Content-Type":"application/json;charset=UTF-8", "clientAuth":conf.CLIENT_AUTH, "client":conf.CLIENT_CODE}
    }
    
    const wallet = {
        checkPreviewWithdrawal:(token)=>{
            var url=conf.API+`/checkRetailWithdrawal/${token}`;
            return axios.get(url,{headers});
        },
        retailWithdrawal:(token, amount)=>{
            var url=conf.API+"/retailWithdrawal";
            var payload = {token, amount}
            return axios.post( url,JSON.stringify(payload),{headers} );

        },
        depositRetail:(token, cod)=>{
            var url=conf.API+"/wallet/depositRetail";
            var payload = {token, cod}
            return axios.post( url,JSON.stringify(payload),{headers} );
        },
        withdrawal_w :(token, amount, bank, account, info)=>{
            let payload = {token, amount, bank, account, info}
            let url = conf.API+"/withdrawal";
            return axios.post( url,JSON.stringify(payload),{headers} );
        },
        bankDeposit:(token,bankDeposit )=>{
            let payload = {...bankDeposit, token}
            let url = conf.API+"/wallet/bankDeposit";
            return axios.post( url,JSON.stringify(payload),{headers} );
        }
    }
    const user = {
        getBalance:(userToken)=>{
            let url = conf.API+`/balance/${userToken}`;
            return axios.get(url,{headers}) ;
        }
    }
    const game = {
        getBrandList:(category)=>{
            let mode = util.isMoble()?"mb":"wb";
            var url=conf.API+`/brands?m=${mode}`;
            url += category != "all" ? "&c="+category : "" 
            //https://lobby-test.apiusoft.com/brands?c=slot
            return new Promise( (result, reject)=>{ fetch(url, {method:"GET",headers} )
                .then(response => response.json())
                .then( data =>{result(data)})   
                .catch( (e)=>{ reject(e) } )
            } )
        }
    }
    return {setConfig, wallet,user }
    
})()

export default ServerConnection