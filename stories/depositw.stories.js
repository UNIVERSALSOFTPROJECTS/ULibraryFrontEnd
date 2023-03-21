import { action } from '@storybook/addon-actions';
import { Depositw } from '../src/index';
//import ServerConnection from '../src/js/server'
//ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT"})

let user = {token:"461fe101f3f24f7a6d94a3ecfd3102ef272f5a448f0ffe727bfb274afcda2f39",balance:12.21} ;
let assetsUrl ="https://d2zzz5z45zl95g.cloudfront.net";
let maxAmount = 6000;
export default {
  title: 'Deposit W',
  component: Depositw,
};

const onOk=()=>{
  alert('ok');
}
const onError=()=>{
  alert('Error');
}

export const DepositX = () => ({
  Component: Depositw,
  props: { user, open:true, onOk,onError,assetsUrl,maxAmount }
});

