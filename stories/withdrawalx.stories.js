import { Withdrawalx } from '../src/index';

import EventManager from '../src/js/EventManager'
import notify from '../src/js/notify'
import ServerConnection from '../src/js/server'
//ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT"})
ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"LAJO43766091DIAMONDPLAY",CLIENT_CODE:"LAJO", domain:"lajoya.club", currency:"USD"})

notify.setEM(EventManager)
let user = {"balance":0,"username":"fortunatest1","currency":"ARS","currency_id":18,"bono":0,"code":1138137,"token":"e247f3c51baa96eedb0c266d2935e2315131f36a7997e78f4227ff8be6ea83b5","serial":"8068160578275","agregatorToken":"637e8b1b1c90de353e98880e74f0ed41a168b1a9aa3ab1c77e0ddbf38242d0b32a01758cda6c446949ab654c00d2834bf113ac56bd0213ce8e850dd2b5af2abc","expireToken":1678480673923};

const onOk=()=>{
  alert('ok');
}
const onError=()=>{
  alert('Error');
}
let pendingWhitdrawall=null

export default {
  title: 'Withdrawal-x',
  component: Withdrawalx,
};


export const withdrawal = () => ({
  Component: Withdrawalx,
  props: { user, open:true ,onOk,onError,pendingWhitdrawall}
});

