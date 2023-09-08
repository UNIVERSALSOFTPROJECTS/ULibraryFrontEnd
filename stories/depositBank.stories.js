import { action } from '@storybook/addon-actions';
import { DepositBank } from '../src/index';
//import ServerConnection from '../src/js/server'
//ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT"})

let user = {currency:"PEN",playerId:'W-e9d847b4-5cc1-453a-9030-d51fe17a85fe',token:"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYWthbm9tYWxkaXRvMTIiLCJpYXQiOjE2OTQyMTU5MjQsImV4cCI6MTY5NDIxOTUyNH0.LNk8ogvexWNGrSjU4U1VwIOu3MWG2ejJxLY36jzlrYkAgSA9PXl2Ni0y4oVbnJFvqi2mFGsSzKjSJPDm7K1AQw",balance:12.21} ;

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
  props: { user, open:true, onOk,onError }
});


