import { action } from '@storybook/addon-actions';
import { DepositBank } from '../src/index';
//import ServerConnection from '../src/js/server'
//ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT"})

let user = {currency:"PEN",playerId:'W-8ec54a8e-6f93-4ef5-83c2-3a37cd94f2b9',token:"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYWthbm9tYWxkaXRvMTIiLCJpYXQiOjE2OTQwMzQ4OTcsImV4cCI6MTY5NDAzODQ5N30.pDJWzH767r3cylljxjKG45KpiVs7kZjHxFqKKRRi3heaFWCAOG7xaJXIsHWcK2ALh2Okrxbqqc56np79yieuaw",balance:12.21} ;
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


