import { UserRegisterOneStep, ServerConnection } from '../src/index';
let user = {token:"ajsbfjhsgfhjakugilusguwger",balance:12.21,currency:"USD"} ;
ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"GOLD21GOLDENBET4A19028GOLDENBET1",CLIENT_CODE:"GOLD", domain:"goldenbet.pe", currency:user.currency, org:"GB"})

let userType="W";
let currencies2=[{code:"PEN", codeAgent:5263}];
let countryCodes1 = ["51"];
let platform = "GoldenBet";

const onOk=()=>{
  alert("Registro correcto");
}

export default {title: 'Registro Usuario X One Step',component: UserRegisterOneStep,
};

export const userXRegister = () => ({
  Component: UserRegisterOneStep,
  props: { user, userType,currencies:currencies2, countryCodes:countryCodes1, onOk, platform}
});