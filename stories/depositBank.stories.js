import { action } from '@storybook/addon-actions';
import { DepositBank } from '../src/index';
//import ServerConnection from '../src/js/server'
//ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT"})

let user = {currency:"PEN",playerId:'W-e9d847b4-5cc1-453a-9030-d51fe17a85fe',token:"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYWthbm9tYWxkaXRvMTIiLCJpYXQiOjE2OTQxMzEzMDIsImV4cCI6MTY5NDEzNDkwMn0.WyWCHWfLa2jvQmyiztdEmGjRqYa6Ka1H66ET20TIetQtJ3gulUgWfP_YdLlUEgi2t2Y6b_hsUrHWRXajdErTLA",balance:12.21} ;
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


