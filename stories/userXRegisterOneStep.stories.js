import { UserRegisterOneStep, ServerConnection } from '../src/index';
let user = {token:"ajsbfjhsgfhjakugilusguwger",balance:50.00,currency:"USD"} ;
ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"LAJO43766091DIAMONDPLAY",CLIENT_CODE:"LAJO", domain:"lajoya.club", currency:user.currency, org:"JY"})

let logoUrl="https://assets.apiusoft.com/golden/logo.svg";
let open=true;
let userType="W";
let countryCode ="+51"
let currencies1=[{code:"USD", codeAgent:5664},{code:"PEN", codeAgent:5263}];
let currencies2=[{code:"PEN", codeAgent:5263}];
let countryCodes1 = ["51"];
let countryCodes2 = ["51","1","113"];
let platform = "LaJoya";

const onOk=()=>{
  alert("Registro correcto");
}

export default {title: 'Registro Usuario W One Step',component: UserRegisterOneStep,
};

export const userWRegister1Currency = () => ({
  Component: UserRegisterStepbyStep,
  props: {logoUrl, open, user, userType,currencies:currencies1, countryCodes:countryCodes1, onOk, platform}
});

