//import { action } from '@storybook/addon-actions';
import { UserRegisterStepbyStep } from '../src/index';
//import EventManager from '../src/js/EventManager'
//import { notify } from '../src/index';
let user = {token:"ajsbfjhsgfhjakugilusguwger",balance:12.21,currency:"USD"} ;
let userType="W";
let open=true;
let logoUrl="https://d2zzz5z45zl95g.cloudfront.net/golden/logo.svg";
let codeAgent = 5263;

const onRegisterOk=()=>{
  alert("Registro correcto");
}

export default {title: 'Registro Usuario W',component: UserRegisterStepbyStep,
};

export const userWRegister = () => ({
  Component: UserRegisterStepbyStep,
  props: { open, user, userType, logoUrl, codeAgent, onRegisterOk }
});

