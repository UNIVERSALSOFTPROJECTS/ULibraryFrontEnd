import { Withdrawalx } from '../src/index';
import EventManager from '../src/js/EventManager'
import notify from '../src/js/notify'
import ServerConnection from '../src/js/server'
ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT"})
//ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"LAJO43766091DIAMONDPLAY",CLIENT_CODE:"LAJO", domain:"lajoya.club", currency:"USD", org:"JY"})

let minAmount=10;
let maxAmount=2000;
let pendingWhitdrawall=null

notify.setEM(EventManager)

/*let user = {
  "balance": 1328.88,
  "username": "LaJoya",
  "currency": "ARS",
  "currency_id": 18,
  "bono": 0,
  "code": 1134900,
  "token": "8af92f6552617428281fa8acadfd48297a1557287d30f30bed56f9afb387af9d",
  "serial": "7042031078562",
  "agregatorToken": "64339a511180630c90066fc23c0418deae94d3c7e0e60c0b6af093410169c8bb18d0145ba111a56619fd3225857cf74ad41adb0b7a894bcd5ef7f57facb7f5a5",
  "expireToken": 1680799800069
}*/

let user = {
  "balance": 9865,
  "username": "salva007",
  "currency": "ARS",
  "currency_id": 18,
  "bono": 0,
  "code": 1146414,
  "token": "42c7b6ccef28bf7eca88a34edde4e5c9187c1056336c0dcfdc58c4630f7776f6",
  "serial": "2776020563475",
  "agregatorToken": "ee2090c3b2f26ca046917a79f791ab161f0216f44428122c7080b3bc0efa78b18b70bc2536245080cce55025d44550378d5682c85b080ca962a68f430ac54e8f",
  "expireToken": 1680798374251,
  "org":"JY"
}

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
  props: { user, open:true ,onOk,onError, minAmount, maxAmount, pendingWhitdrawall}
});

