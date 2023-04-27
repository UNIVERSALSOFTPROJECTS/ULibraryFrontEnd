// npx jest depositX.spec.js
import '@testing-library/jest-dom/extend-expect'
import axios from "axios"
import { render, fireEvent, screen , waitFor} from '@testing-library/svelte'
import UserRegisterStepbyStep from '../../src/UserRegisterStepbyStep.svelte'
import ServerConnection from '../../src/js/server'
jest.mock('axios');
jest.mock("moment", () => {
  return (...args) => {
      if (args.length > 0) {
          return jest.requireActual("moment")(...args);
      }
      return jest.requireActual("moment")("11.02.2023 10:10", "DD.MM.YYYY HH:mm");
  }
});

ServerConnection.setConfig({API:".",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT", domain:"365fortuna.com", currency:"ARS", org:"FO"})
let logoUrl="https://d2zzz5z45zl95g.cloudfront.net/golden/logo.svg";
let open=true;
let userType="W";
let user = {};
let countryCodes = ["51","1","113"];
let currencies = [{code:"ARS", codeAgent:5070}];
let platform = "365Fortuna";


describe('FO user register step by step', () => {

  it('WHEN no username RETURN error', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    const activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Ingrese un nombre de usuario") ).toBeInTheDocument();
  });

  it('WHEN invalid username RETURN ERROR', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"SalvaÇ¡:+*>" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("Sólo letras, números y guión bajo") ).toBeInTheDocument();
  });

  it('WHEN enter username GO TO NEXT STEP', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
  });

  it('WHEN no name RETURN error', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("Ingrese nombre y apellidos") ).toBeInTheDocument();
  });

  it('WHEN invalid name RETURN ERROR', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salva23?¿!"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("Ingrese letras solamente") ).toBeInTheDocument();
  });
  
  it('WHEN enter name GO TO NEXT STEP', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NUMERO DE TELEFONO") ).toBeInTheDocument();
  });

  it('WHEN no select phone RETURN error', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("Ingrese su numero de telefono") ).toBeInTheDocument();
  });

  it('WHEN no valid phone RETURN error', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"94021"} }); //minimo 6 digitos
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("Mínimo 6 digitos para el teléfono") ).toBeInTheDocument();
  });

  it('WHEN valid phone GO TO NEXT STEP', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); //minimo 6 digitos
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CORREO ELECTRONICO") ).toBeInTheDocument();
  });

  it('WHEN no email RETURN error', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("Ingrese un correo") ).toBeInTheDocument();
  });

  it('WHEN invalid email RETURN error', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"3211-´´`+"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("Formato de email incorrecto") ).toBeInTheDocument();
  });

  it('WHEN valid email GO TO NEST STEP', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CONTRASEÑA") ).toBeInTheDocument();
  });

  it('WHEN no password RETURN ERROR', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("Ingrese una contraseña") ).toBeInTheDocument();
  });

  it('WHEN invalid password RETURN ERROR', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"12345"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("Minimo 6 caracteres para la contraseña") ).toBeInTheDocument();
  });

  it('WHEN password ok GO TO NEXT STEP', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"123456"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("FECHA DE NACIMIENTO") ).toBeInTheDocument();
  });

  it('WHEN birthday ok RETURN NEXT STEP', async() => {
    const netSuccess = {response:{data:{phone:"+519402142", email:"salvaTest01@gmail.com",userId:66, platform:"GoldenBet", smscode:"719353"}}}
    axios.post.mockResolvedValueOnce(netSuccess);
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"9402142"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"123456"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let yearSelect = screen.getByLabelText("birthday-year");
    await fireEvent.change(yearSelect, { target: { value:2000 } });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("VALIDACION SMS") ).toBeInTheDocument();
  });

  it('WHEN no enter validation code RETURN error', async() => {
    const netSucces = {response:{data:{phone:"+51940212", email:"salvaTest01@gmail.com",userId:66, platform:"GoldenBet", smscode:"719353"}}}
    axios.post.mockResolvedValueOnce(netSucces);
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"123456"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let yearSelect = screen.getByLabelText("birthday-year");
    await fireEvent.change(yearSelect, { target: { value:2000 } });
    activateBtn = screen.getByText("CONTINUAR"); 
    await fireEvent.click(activateBtn);
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    await waitFor( async()=>{
      expect( screen.getByText("Ingrese el codigo SMS") ).toBeInTheDocument();
    });
  });

  it('WHEN validation code ok RETURN NEXT STEP', async() => {
    const netSucces = {response:{data:{phone:"+51940212", email:"salvaTest01@gmail.com",userId:66, platform:"GoldenBet", smscode:"719353"}}}
    axios.post.mockResolvedValueOnce(netSucces);
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"123456"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let yearSelect = screen.getByLabelText("birthday-year");
    await fireEvent.change(yearSelect, { target: { value:2000 } });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputValidation = screen.getByLabelText("validation");
    await fireEvent.input(inputValidation, { target: { value:"719353"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    await waitFor( async()=>{
      expect( screen.getByText("CONFIRMAR TÉRMINOS Y CONDICIONES") ).toBeInTheDocument();
    });
  });

  it('WHEN no accept terms RETURN NEXT STEP', async() => {
    const netSucces = {response:{data:{phone:"+51940212", email:"salvaTest01@gmail.com",userId:66, platform:"GoldenBet", smscode:"719353"}}}
    axios.post.mockResolvedValueOnce(netSucces);
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"123456"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let yearSelect = screen.getByLabelText("birthday-year");
    await fireEvent.change(yearSelect, { target: { value:2000 } });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputValidation = screen.getByLabelText("validation");
    await fireEvent.input(inputValidation, { target: { value:"719353"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    await waitFor( async()=>{
      expect( screen.getByText("CONFIRMAR TÉRMINOS Y CONDICIONES") ).toBeInTheDocument();
    });
    activateBtn = screen.getByText("ACEPTAR Y REGISTRAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("Acepte los términos y condiciones") ).toBeInTheDocument();
  });

  it('WHEN accepted terms RETURN USER CREATED', async() => {
    const netSucces = {response:{data:{phone:"+51940212", email:"salvaTest01@gmail.com",userId:66, platform:"GoldenBet", smscode:"719353"}}}
    axios.post.mockResolvedValueOnce(netSucces);
    const registerOk = {data: {resp:"Ok", Id:"1156677", Msg:"Usuario Creado"}}
    axios.post.mockResolvedValueOnce(registerOk);
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"123456"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let yearSelect = screen.getByLabelText("birthday-year");
    await fireEvent.change(yearSelect, { target: { value:2000 } });
    activateBtn = screen.getByText("CONTINUAR"); 
    await fireEvent.click(activateBtn);
    let inputValidation = screen.getByLabelText("validation");
    await fireEvent.input(inputValidation, { target: { value:"719353"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    let conditionsAndTerms = screen.getByLabelText("terms")
    await fireEvent.click(conditionsAndTerms);
    let activateBtnTerms = screen.getByText("ACEPTAR Y REGISTRAR");
    await fireEvent.click(activateBtnTerms);
    await waitFor( async()=>{
      expect( screen.getByText("BIENVENID@ A LA PLATAFORMA") ).toBeInTheDocument();
    });
    //expect(true).toEqual(true);
    //screen.debug(undefined, Infinity)
  });

});