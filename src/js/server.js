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
        },
        preRegister:(username, email, phone, platform)=>{
            var url=conf.API+"/user/preRegister";
            if(!conf.org) throw "ORG_MANDATORY";
            var payload = {username,email,phone, org:conf.org, platform}
            return axios.post( url,payload,{headers} );
        },
        register: (username, name,country, phone, email, password, date, operatorId,smscode,usertype, platform, currency=conf.currency)=>{
            if(!conf.currency) throw "CURRENCY_MANDATORY";
            if(!conf.domain) throw "DOMAIN_MANDATORY";
            var url=conf.API+"/user";
            var payload = {username, name, phone:phone, email, currency, password, date, smscode,country, operatorId, doctype:"", document:"", birthday:date, domain:conf.domain, usertype, platform, org:conf.org}
            return axios.post( url,payload,{headers} );
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