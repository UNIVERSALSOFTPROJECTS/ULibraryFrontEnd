import { action } from '@storybook/addon-actions';
import { Withdrawalw } from '../src/index';
import ServerConnection from '../src/js/server'

ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT"})

let user = {token:"ajsbfjhsgfhjakugilusguwger",balance:12.21,currency:"USD"} ;
export default {
  title: 'Withdrawal-w',
  component: Withdrawalw,
};

const onOK=()=>{
  alert('ok');
}
const onError=()=>{
  alert('Error');
}

export const withdrawal = () => ({
  Component: Withdrawalw,
  props: { user, open:true, onOK,onError }
});

