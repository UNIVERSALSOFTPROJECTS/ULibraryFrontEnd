import { action } from '@storybook/addon-actions';
import { Depositx } from '../src/index';
import ServerConnection from '../src/js/server'

ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT"})

let user = {token:"ajsbfjhsgfhjakugilusguwger",balance:12.21} ;
export default {
  title: 'Deposit X',
  component: Depositx,
};

const onDepositoOK=()=>{
  alert('ok');
}
const onDepositoError=()=>{
  alert('Error');
}

export const DepositX = () => ({
  Component: Depositx,
  props: { user, open:true, onDepositoOK,onDepositoError }
});

