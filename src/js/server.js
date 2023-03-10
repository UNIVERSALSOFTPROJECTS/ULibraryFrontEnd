import axios from "axios"
import utils from './util'

let conf
let headers = {}

const ServerConnection = (() => {

    const setConfig=(config)=>{
        conf = config;
        headers = {"Content-Type":"application/json;charset=UTF-8", "clientAuth":conf.CLIENT_AUTH, "client":conf.CLIENT_CODE}
    }
    
    const wallet = {
        checkPreviewWithdrawal:async(token)=>{
            var url=conf.API+`/checkRetailWithdrawal/${token}`;
            return await axios.get(url,{headers});
        },
        duplicateSession:()=>{
            alert("SESION ABIERTA EN OTRO DISPOSITIVO");
            location.reload();
            return ;
        },
        retailWithdrawal:async(token, amount)=>{
            var url=conf.API+"/retailWithdrawal";
            var payload = {token, amount}
            return await axios.post( url,JSON.stringify(payload),{headers} );            
        },
        depositRetail:async(token, cod)=>{
            var url=conf.API+"/wallet/depositRetail";
            var payload = {token, cod}
            return axios.post( url,JSON.stringify(payload),{headers} );
        },
        withdrawal_w :async(token, amount, bank, account, info)=>{
            let payload = {token, amount, bank, account, info}
            let url = conf.API+"/withdrawal";
            return await axios.post( url,JSON.stringify(payload),{headers} );
        },
        bankDeposit:async (token,bankDeposit )=>{
            let payload = {...bankDeposit, token}
            let url = conf.API+"/wallet/bankDeposit";
            return await axios.post( url,JSON.stringify(payload),{headers} );
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
            let mode = utils.isMobile()?"mb":"wb";
            var url=conf.API+`/brands?m=${mode}`;
            url += category != "all" ? "&c="+category : "" 
            return axios.get(url,{headers}) ;
        }
    }
    return {setConfig, wallet,user,game }
    
})()

export default ServerConnection