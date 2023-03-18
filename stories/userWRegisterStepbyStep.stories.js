//import { action } from '@storybook/addon-actions';
import { UserRegisterStepbyStep, ServerConnection } from '../src/index';
//import EventManager from '../src/js/EventManager'
//import { notify } from '../src/index';
let user = {token:"ajsbfjhsgfhjakugilusguwger",balance:12.21,currency:"USD"} ;
ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"GOLD21GOLDENBET4A19028GOLDENBET1",CLIENT_CODE:"GOLD", domain:"goldenbet.pe", currency:user.currency, org:"GB"})

let userType="W";
let open=true;
let logoUrl="https://d2zzz5z45zl95g.cloudfront.net/golden/logo.svg";
let codeAgent = 5263;
let multiCurrency = true;
let active_currency=""
let countryCode ="+51"

const onOk=()=>{
  alert("Registro correcto");
}

export default {title: 'Registro Usuario W',component: UserRegisterStepbyStep,
};

export const userWRegister = () => ({
  Component: UserRegisterStepbyStep,
  props: {logoUrl, open, user, userType,multiCurrency, countryCode,codeAgent,active_currency, onOk }
});

