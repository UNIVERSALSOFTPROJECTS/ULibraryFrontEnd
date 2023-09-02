import { action } from '@storybook/addon-actions';
import { DepositBank } from '../src/index';
//import ServerConnection from '../src/js/server'
//ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT"})

let user = {token:"461fe101f3f24f7a6d94a3ecfd3102ef272f5a448f0ffe727bfb274afcda2f39",balance:12.21} ;
let assetsUrl ="https://assets.apiusoft.com";
let maxAmount = 6000;
let minAmount=50;
export default {
  title: 'Deposit Bank',
  component: DepositBank,
};

const onOk=()=>{
  alert('ok');
}
const onError=()=>{
  alert('Error');
}

export const DepositBanK = () => ({
  Component: DepositBank,
  props: { user, open:true, onOk,onError,assetsUrl,maxAmount, minAmount }
});


