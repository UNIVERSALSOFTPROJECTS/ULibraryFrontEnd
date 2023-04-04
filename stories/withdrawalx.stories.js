import { Withdrawalx } from '../src/index';

import EventManager from '../src/js/EventManager'
import notify from '../src/js/notify'
import ServerConnection from '../src/js/server'
//ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT"})
ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"LAJO43766091DIAMONDPLAY",CLIENT_CODE:"LAJO", domain:"lajoya.club", currency:"USD"})

notify.setEM(EventManager)
let user = {"balance":9900,"username":"salva007","currency":"ARS","currency_id":18,"bono":0,"code":1138137,"token":"2ecc654b5432a87c105317a175b739262cfc44e5433babec5df7e2ba1b53bf1a","serial":"2776020563475","agregatorToken":"42aba320887f94b427f9fe63f6a2bac0fddd96e5f213b66ab9d1184407cd5bfc40d13352936797281614a4864699d95e262f1babe1ff1923076c29d4d9d66ad4","expireToken":1678480673923};
let pendingWhitdrawall=null

const onOk=()=>{
  alert('ok');
}
const onError=()=>{
  alert('Error');
}

export default {
  title: 'Withdrawal-x',
  component: Withdrawalx,
};

 
export const withdrawal = () => ({
  Component: Withdrawalx,
  props: { user, open:true ,onOk,onError,pendingWhitdrawall}
});

