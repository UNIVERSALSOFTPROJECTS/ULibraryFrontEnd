//import { action } from '@storybook/addon-actions';
import { UserRegisterStepbyStep, ServerConnection } from '../src/index';
//import EventManager from '../src/js/EventManager'
//import { notify } from '../src/index';
let user = {token:"ajsbfjhsgfhjakugilusguwger",balance:12.21,currency:"USD"} ;
//ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"GOLD21GOLDENBET4A19028GOLDENBET1",CLIENT_CODE:"GOLD", domain:"goldenbet.pe", currency:user.currency, org:"GB"})

let logoUrl="https://d2zzz5z45zl95g.cloudfront.net/golden/logo.svg";
let open=true;
let userType="W";
let countryCode ="+51"
let currencies1=[{code:"USD", codeAgent:5664},{code:"PEN", codeAgent:5263}];
let currencies2=[{code:"PEN", codeAgent:5263}];
let countryCodes1 = ["51"];
let countryCodes2 = ["51","1","113"];
let platform = "GoldenBet";

const onOk=()=>{
  alert("Registro correcto");
}

export default {title: 'Registro Usuario W',component: UserRegisterStepbyStep,
};

export const userWRegister1Currency = () => ({
  Component: UserRegisterStepbyStep,
  props: {logoUrl, open, user, userType,currencies:currencies2,  countryCodes:countryCodes1, onOk, platform}
});

export const userWRegister2Currencies = () => ({
  Component: UserRegisterStepbyStep,
  props: {logoUrl, open, user, userType,currencies:currencies1, countryCodes:countryCodes1, onOk, platform}
});

export const userWRegister1CountryCode = () => ({
  Component: UserRegisterStepbyStep,
  props: {logoUrl, open, user, userType,currencies:currencies1, countryCodes:countryCodes1, onOk, platform}
});

export const userWRegister2CountryCode = () => ({
  Component: UserRegisterStepbyStep,
  props: {logoUrl, open, user, userType,currencies:currencies1, countryCodes:countryCodes2, onOk, platform}
});
