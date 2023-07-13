import { action } from '@storybook/addon-actions';
import { LoginTypeBabieca } from '../src/index';
//import ServerConnection from '../src/js/server'
//ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT"})

let user = {token:"ajsbfjhsgfhjakugilusguwger",balance:12.21};
export default {
  title: 'LoginTypeBabieca',
  component: LoginTypeBabieca,
};

const onLoginOk=()=>{
  alert('ok');
}
const onLoginError=(error)=>{
  console.log("ERRRO",error);
  alert('Error');
}

export const LoginTypeBabiecaTest = () => ({
  Component: LoginTypeBabieca,
  props: { onLoginOk, onLoginError }
});

