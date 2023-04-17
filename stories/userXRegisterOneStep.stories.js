import { UserRegisterOneStep, ServerConnection } from '../src/index';

let user={};
ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"LAJO43766091DIAMONDPLAY",CLIENT_CODE:"LAJO", domain:"lajoya.club", currency:"USD", org:"JY"});

let userType="X";
let currencies2=[{code:"PEN", codeAgent:5263}];
let countryCodes1 = ["51"];
let platform = "LaJoya";

const onOk=()=>{
  alert("Registro correcto");
}

const onError=()=>{
  alert('Error');
}

export default {title: 'Registro Usuario X One Step',component: UserRegisterOneStep,
};

export const userXRegister = () => ({
  Component: UserRegisterOneStep,
  props: { user, userType,currencies:currencies2, countryCodes:countryCodes1, platform, onOk, onError}
});