// npx jest depositX.spec.js
import '@testing-library/jest-dom/extend-expect'
import axios from "axios"
import { render, fireEvent, screen , waitFor} from '@testing-library/svelte'
import UserRegisterStepbyStep from '../../src/UserRegisterStepbyStep.svelte'
import ServerConnection from '../../src/js/server'
jest.mock('axios');
jest.mock('moment', () => {
  return () => jest.requireActual('moment')('2022-12-31T19:00:00-05:00');
});

ServerConnection.setConfig({API:".",CLIENT_AUTH:"LAJO43766091DIAMONDPLAY",CLIENT_CODE:"LAJO", domain:"lajoya.club", currency:"USD", org:"GB"})
let logoUrl="https://d2zzz5z45zl95g.cloudfront.net/golden/logo.svg";
let open=true;
let userType="W";
let user = {};
let countryCodes = ["51","1","113"];
let onOk;
let currencies = [{code:"USD", codeAgent:5664},{code:"PEN", codeAgent:5263}];
let platform = "GoldenBet";

let days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

describe('GB user register Step by step', () => {

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
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
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
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
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
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();
  });

  it('WHEN no select currency RETURN error', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();

    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("Escoja una moneda") ).toBeInTheDocument();
  });

  it('WHEN selected currency GO TO NEXT STEP', async() => {
    await axios.get.mockResolvedValue({data:currencies});
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();

    let selectCurrency = screen.getByText("USD")
    await fireEvent.click(selectCurrency);

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
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();

    let selectCurrency = screen.getByText("USD")
    await fireEvent.click(selectCurrency);

    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NUMERO DE TELEFONO") ).toBeInTheDocument();

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
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();

    let selectCurrency = screen.getByText("USD")
    await fireEvent.click(selectCurrency);

    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NUMERO DE TELEFONO") ).toBeInTheDocument();

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
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();

    let selectCurrency = screen.getByText("USD")
    await fireEvent.click(selectCurrency);

    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NUMERO DE TELEFONO") ).toBeInTheDocument();

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
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();

    let selectCurrency = screen.getByText("USD")
    await fireEvent.click(selectCurrency);

    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NUMERO DE TELEFONO") ).toBeInTheDocument();

    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CORREO ELECTRONICO") ).toBeInTheDocument();

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
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();

    let selectCurrency = screen.getByText("USD")
    await fireEvent.click(selectCurrency);

    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NUMERO DE TELEFONO") ).toBeInTheDocument();

    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CORREO ELECTRONICO") ).toBeInTheDocument();

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
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();

    let selectCurrency = screen.getByText("USD")
    await fireEvent.click(selectCurrency);

    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NUMERO DE TELEFONO") ).toBeInTheDocument();

    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CORREO ELECTRONICO") ).toBeInTheDocument();

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
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();

    let selectCurrency = screen.getByText("USD")
    await fireEvent.click(selectCurrency);

    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NUMERO DE TELEFONO") ).toBeInTheDocument();

    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CORREO ELECTRONICO") ).toBeInTheDocument();

    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CONTRASEÑA") ).toBeInTheDocument();

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
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();

    let selectCurrency = screen.getByText("USD")
    await fireEvent.click(selectCurrency);

    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NUMERO DE TELEFONO") ).toBeInTheDocument();

    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CORREO ELECTRONICO") ).toBeInTheDocument();

    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CONTRASEÑA") ).toBeInTheDocument();

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
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();

    let selectCurrency = screen.getByText("USD")
    await fireEvent.click(selectCurrency);

    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NUMERO DE TELEFONO") ).toBeInTheDocument();

    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CORREO ELECTRONICO") ).toBeInTheDocument();

    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CONTRASEÑA") ).toBeInTheDocument();

    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"123456"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("FECHA DE NACIMIENTO") ).toBeInTheDocument();
  });

  it('WHEN select birthday GO TO NEXT STEP', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();

    let selectCurrency = screen.getByText("USD")
    await fireEvent.click(selectCurrency);

    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NUMERO DE TELEFONO") ).toBeInTheDocument();

    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CORREO ELECTRONICO") ).toBeInTheDocument();

    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CONTRASEÑA") ).toBeInTheDocument();

    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"123456"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("FECHA DE NACIMIENTO") ).toBeInTheDocument();

    await waitFor( async()=>{
      let daySelect = screen.getByLabelText("daySelected");
      let dayOptions = screen.getAllByLabelText("dayOption");
      await fireEvent.change(daySelect, { target: { value:2 } });
      await fireEvent.click(activateBtn);
      activateBtn = screen.getByText("CONTINUAR");
      expect(dayOptions[1].selected).toBeTruthy();
    })
  });

  it('WHEN no validation sms RETURN error', async() => {
    render(UserRegisterStepbyStep, {logoUrl, user, open, userType, currencies, countryCodes, platform, onOk:(r)=>{ }})
    let inputUsername = screen.getByLabelText("username")
    await fireEvent.input(inputUsername, { target: { value:"Salva23" } });
    let activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NOMBRE Y APELLIDOS") ).toBeInTheDocument();
    
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salvador"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("ESTABLECER MONEDA") ).toBeInTheDocument();

    let selectCurrency = screen.getByText("USD")
    await fireEvent.click(selectCurrency);

    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("NUMERO DE TELEFONO") ).toBeInTheDocument();

    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"940212"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CORREO ELECTRONICO") ).toBeInTheDocument();

    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salvaTest01@gmail.com"} }); 
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("CONTRASEÑA") ).toBeInTheDocument();

    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"123456"} });
    activateBtn = screen.getByText("CONTINUAR");
    await fireEvent.click(activateBtn);
    expect( screen.getByText("FECHA DE NACIMIENTO") ).toBeInTheDocument();

    //await waitFor( async()=>{
      let daySelect = screen.getByLabelText("daySelected");
      let dayOptions = screen.getAllByLabelText("dayOption");
      await fireEvent.change(daySelect, { target: { value:2 } });
      activateBtn = screen.getByText("CONTINUAR");
      await fireEvent.click(activateBtn);
      expect( screen.getByText("VALIDACION SMS") ).toBeInTheDocument();
      expect(dayOptions[1].selected).toBeTruthy();
      
      activateBtn = screen.getByText("CONTINUAR");
      await fireEvent.click(activateBtn);
      expect( screen.getByText("Ingrese el codigo SMS") ).toBeInTheDocument();
    //})


  });



});