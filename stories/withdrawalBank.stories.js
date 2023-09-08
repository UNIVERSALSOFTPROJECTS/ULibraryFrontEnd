import { action } from '@storybook/addon-actions';
import { WithdrawalBank } from '../src/index';
//import ServerConnection from '../src/js/server'
//ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT"})
let minAmount = 50;
let maxAmount = 2000;
let pendingWhitdrawall=null
let user = {currencyISO:"PEN",platformId:"58dc8282-ab26-4e2d-9235-be4a3e2be91d",trxType:"WITHDRAW",currency:"PEN",playerId:'W-8ec54a8e-6f93-4ef5-83c2-3a37cd94f2b9',token:"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYWthbm9tYWxkaXRvMTIiLCJpYXQiOjE2OTQxMzEzMDIsImV4cCI6MTY5NDEzNDkwMn0.WyWCHWfLa2jvQmyiztdEmGjRqYa6Ka1H66ET20TIetQtJ3gulUgWfP_YdLlUEgi2t2Y6b_hsUrHWRXajdErTLA"} ;

export default {
  title: 'Withdrawal Bank',
  component: WithdrawalBank, 
};

const onOK=()=>{
  alert('ok');
}
const onError=()=>{
  alert('Error');
}

export const withdrawalbank = () => ({
  Component: WithdrawalBank,
  props: { user, open:true, pendingWhitdrawall, minAmount, maxAmount,onOK,onError}
});






