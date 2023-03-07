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
            return axios.post( url,payload,{headers} );

        },
        depositRetail:(token, cod)=>{
            var url=conf.API+"/wallet/depositRetail";
            var payload = {token, cod}
            return axios.post( url,payload,{headers} );
        }

    }
   
    return {setConfig, wallet }
    
})()

export default ServerConnection