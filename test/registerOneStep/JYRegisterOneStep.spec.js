// npx jest depositX.spec.js
import '@testing-library/jest-dom/extend-expect'
import axios from "axios"
import { render, fireEvent, screen , waitFor} from '@testing-library/svelte'
import UserRegisterOneStep from '../../src/UserRegisterOneStep.svelte'
import ServerConnection from '../../src/js/server'
jest.mock('axios');
jest.mock('moment', () => {
  return () => jest.requireActual('moment')('2022-12-31T19:00:00-05:00');
});

ServerConnection.setConfig({API:".",CLIENT_AUTH:"LAJO43766091DIAMONDPLAY",CLIENT_CODE:"LAJO", domain:"lajoya.club", currency:"USD", org:"JY"})
let user = {"balance":10,"username":"lajoyatest001","currency":"ARS","currency_id":18,"bono":0,"code":1138137,"token":"e247f3c51baa96eedb0c266d2935e2315131f36a7997e78f4227ff8be6ea83b5","serial":"8068160578275","agregatorToken":"637e8b1b1c90de353e98880e74f0ed41a168b1a9aa3ab1c77e0ddbf38242d0b32a01758cda6c446949ab654c00d2834bf113ac56bd0213ce8e850dd2b5af2abc","expireToken":1678480673923};
let userType="X";
let currencies = [{code:"PEN", codeAgent:5263}];
let countryCodes = ["51"];
let platform = "LaJoya";


describe('JY user register one step', () => {

  it('WHEN no name RETURN error', async() => {
    render(UserRegisterOneStep, {user, userType, currencies, countryCodes, platform, onOk:(r)=>{ }, onError:(e)=>{ } })
    const activateBtn = screen.getByText("REGISTRAR");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Ingrese su nombre") ).toBeInTheDocument();
  });

  it('WHEN no username RETURN error', async() => {
    render(UserRegisterOneStep, {user, userType, currencies, countryCodes, platform, onOk:(r)=>{ }, onError:(e)=>{ } })
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salva" } });
    const activateBtn = screen.getByText("REGISTRAR");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Ingrese su nombre de usuario") ).toBeInTheDocument();
  });

  it('WHEN no phone RETURN error', async() => {
    render(UserRegisterOneStep, {user, userType, currencies, countryCodes, platform, onOk:(r)=>{ }, onError:(e)=>{ } })
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salva" } });
    let inputUserName = screen.getByLabelText("username")
    await fireEvent.input(inputUserName, { target: { value:"Salva23" } });
    const activateBtn = screen.getByText("REGISTRAR");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Ingrese su teléfono") ).toBeInTheDocument();
  });

  it('WHEN no email RETURN error', async() => {
    render(UserRegisterOneStep, {user, userType, currencies, countryCodes, platform, onOk:(r)=>{ }, onError:(e)=>{ } })
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salva" } });
    let inputUserName = screen.getByLabelText("username")
    await fireEvent.input(inputUserName, { target: { value:"Salva23" } });
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"980765847" } });
    const activateBtn = screen.getByText("REGISTRAR");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Ingrese su correo electrónico") ).toBeInTheDocument();
  });

  it('WHEN no password RETURN error', async() => {
    render(UserRegisterOneStep, {user, userType, currencies, countryCodes, platform, onOk:(r)=>{ }, onError:(e)=>{ } })
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salva" } });
    let inputUserName = screen.getByLabelText("username")
    await fireEvent.input(inputUserName, { target: { value:"Salva23" } });
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"980765847" } });
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salva01@gmail.com" } });
    const activateBtn = screen.getByText("REGISTRAR");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Ingrese su contraseña") ).toBeInTheDocument();
  });

  it('WHEN no confirm password RETURN error', async() => {
    render(UserRegisterOneStep, {user, userType, currencies, countryCodes, platform, onOk:(r)=>{ }, onError:(e)=>{ } })
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salva" } });
    let inputUserName = screen.getByLabelText("username")
    await fireEvent.input(inputUserName, { target: { value:"Salva23" } });
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"980765847" } });
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salva01@gmail.com" } });
    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"123321" } });
    const activateBtn = screen.getByText("REGISTRAR");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Confirme la contraseña") ).toBeInTheDocument();
  });

  it("WHEN passwords don't match RETURN error", async() => {
    render(UserRegisterOneStep, {user, userType, currencies, countryCodes, platform, onOk:(r)=>{ }, onError:(e)=>{ } })
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salva" } });
    let inputUserName = screen.getByLabelText("username")
    await fireEvent.input(inputUserName, { target: { value:"Salva23" } });
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"980765847" } });
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salva01@gmail.com" } });
    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"123321" } });
    let inputConfirmPass= screen.getByLabelText("confirmpassword")
    await fireEvent.input(inputConfirmPass, { target: { value:"123" } });
    const activateBtn = screen.getByText("REGISTRAR");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("La contraseña no coincide con la confirmación") ).toBeInTheDocument();
  });
  
  it("WHEN no agentCode RETURN error", async() => {
    render(UserRegisterOneStep, {user, userType, currencies, countryCodes, platform, onOk:(r)=>{ }, onError:(e)=>{ } })
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salva" } });
    let inputUserName = screen.getByLabelText("username")
    await fireEvent.input(inputUserName, { target: { value:"Salva23" } });
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"980765847" } });
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salva01@gmail.com" } });
    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"123321" } });
    let inputConfirmPass= screen.getByLabelText("confirmpassword")
    await fireEvent.input(inputConfirmPass, { target: { value:"123321" } });
    const activateBtn = screen.getByText("REGISTRAR");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Ingrese el código de agente") ).toBeInTheDocument();
  });
  
  //AUN NO PASAAA TMRE
  it("WHEN bad phone format RETURN error", async() => {
    const netError = {errorCode:"353465",message:"PHONE_FORMAT_FAILED", notify:"Formato teléfono incorrecto"}
    axios.post.mockRejectedValueOnce(netError);
  
    render(UserRegisterOneStep, {user, userType, currencies, countryCodes, platform, onOk:(r)=>{ }, onError:async (e)=>{ } })
    let inputName = screen.getByLabelText("name")
    await fireEvent.input(inputName, { target: { value:"Salva" } });
    let inputUserName = screen.getByLabelText("username")
    await fireEvent.input(inputUserName, { target: { value:"Salva23" } });
    let inputPhone = screen.getByLabelText("phone")
    await fireEvent.input(inputPhone, { target: { value:"980765" } }); //minimo 8 digitos para telefono
    let inputEmail = screen.getByLabelText("email")
    await fireEvent.input(inputEmail, { target: { value:"salva01@gmail.com" } });
    let inputPassword = screen.getByLabelText("password")
    await fireEvent.input(inputPassword, { target: { value:"123321" } });
    let inputConfirmPass= screen.getByLabelText("confirmpassword")
    await fireEvent.input(inputConfirmPass, { target: { value:"123321" } });
    let inputAgentCode= screen.getByLabelText("agentcodeone")
    await fireEvent.input(inputAgentCode, { target: { value:"1234" } });
    const activateBtn = screen.getByText("REGISTRAR");
    await fireEvent.click(activateBtn);
    //expect(true).toEqual(true);
    await waitFor( async()=>{
      expect( screen.getByText("Formato teléfono incorrecto")).toBeInTheDocument();
      //screen.debug(undefined, Infinity);
    });
  });

});