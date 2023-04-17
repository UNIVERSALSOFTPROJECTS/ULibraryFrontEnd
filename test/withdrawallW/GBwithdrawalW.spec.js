// npx jest depositW.spec.js -t 'no date'
import '@testing-library/jest-dom/extend-expect'
import axios from "axios"
import { render, waitFor ,fireEvent, screen  } from '@testing-library/svelte'
import Withdrawalw from '../../src/Withdrawalw.svelte'
import ServerConnection from '../../src/js/server'
jest.mock('axios');

ServerConnection.setConfig({API:".",CLIENT_AUTH:"GOLD21GOLDENBET4A19028GOLDENBET1",CLIENT_CODE:"GOLD", domain:"goldenbet.com.pe", currency:"USD"})
let user = {"balance":10,"username":"GoldenBetTest1","currency":"ARS","currency_id":18,"bono":0,"code":1138137,"token":"e247f3c51baa96eedb0c266d2935e2315131f36a7997e78f4227ff8be6ea83b5","serial":"8068160578275","agregatorToken":"637e8b1b1c90de353e98880e74f0ed41a168b1a9aa3ab1c77e0ddbf38242d0b32a01758cda6c446949ab654c00d2834bf113ac56bd0213ce8e850dd2b5af2abc","expireToken":1678480673923};
let assetsUrl = "https://assets.apiusoft.com";
let minAmount = 50;
let maxAmount = 2000;

describe('GB DepositW', () => {

  it('WHEN no amount RETURN error', async() => {
    render(Withdrawalw, { open: true, user, assetsUrl, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ }})
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Ingrese el monto") ).toBeInTheDocument();
  });

  it('WHEN low amount RETURN error', async() => {
    let amount=45;
    let message = "Monto mínimo " +minAmount +" "+ user.currency + ", máximo " +maxAmount+" " + user.currency;
    render(Withdrawalw, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ } })
    const input = screen.getByLabelText("amountLabel");
    await fireEvent.input(input, { target: { value:amount } });
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.click(activateBtn)
    expect( screen.getByText(message) ).toBeInTheDocument();
  });

  it('WHEN exceeds amount RETURN error', async() => {
    let amount=2002;
    let message = "Monto mínimo " +minAmount +" "+ user.currency + ", máximo " +maxAmount+" " + user.currency;
    render(Withdrawalw, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ } })
    const input = screen.getByLabelText("amountLabel");
    await fireEvent.input(input, { target: { value:amount } });
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.click(activateBtn)
    expect( screen.getByText(message) ).toBeInTheDocument();
  });

  it('WHEN no enter name RETURN error', async() => {
    render(Withdrawalw, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ }})
    let validAmount = 50;
    let message = "Ingrese su nombre";
    let amountInput = screen.getByLabelText("amountLabel");
    await fireEvent.input(amountInput, { target: { value: validAmount } });
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.click(activateBtn)
    expect( screen.getByText(message) ).toBeInTheDocument();
  });

  it('WHEN no enter document RETURN error', async() => {
    render(Withdrawalw, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ }})
    await waitFor( async()=>{
      let validAmount = 50;
      let nameValue = "Juan";
      let message = "Ingrese su documento de identidad";
      let amount = screen.getByLabelText("amountLabel");
      await fireEvent.input(amount, { target: { value: validAmount } });
      let inputName = screen.getByLabelText("nameLabel");
      await fireEvent.input(inputName, { target: { value: nameValue } });
      const activateBtn = screen.getByText("SOLICITAR RETIRO");
      await fireEvent.click(activateBtn)
      expect( screen.getByText(message) ).toBeInTheDocument();
    })
  });

  it('WHEN no enter bankName RETURN error', async() => {
    render(Withdrawalw, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ }})
    let validAmount = 50; 
    let validName = "Juan"; 
    let validDocument=714632782;
    let message = "Ingrese el nombre del banco";
    let inputAmount = screen.getByLabelText("amountLabel");
    await fireEvent.input(inputAmount, { target: { value: validAmount } });
    let inputName = screen.getByLabelText("nameLabel");
    await fireEvent.input(inputName, { target: { value: validName } });
    let inputDocument = screen.getByLabelText("documentLabel");
    await fireEvent.input(inputDocument, { target: { value: validDocument } });
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.click(activateBtn)
    expect( screen.getByText(message) ).toBeInTheDocument();
  });

  it('WHEN no enter accountNumber RETURN error', async() => {
    render(Withdrawalw, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ }})
    let validAmount = 50; 
    let validName = "Juan"; 
    let validDocument=7146327821;
    let validBankName= "BCP";
    let message = "Ingrese el número de cuenta";
    let inputAmount = screen.getByLabelText("amountLabel");
    await fireEvent.input(inputAmount, { target: { value: validAmount } });
    let inputName = screen.getByLabelText("nameLabel");
    await fireEvent.input(inputName, { target: { value: validName } });
    let inputDocument = screen.getByLabelText("documentLabel");
    await fireEvent.input(inputDocument, { target: { value: validDocument } });
    let inputBankName = screen.getByLabelText("bankNameLabel");
    await fireEvent.input(inputBankName, { target: { value: validBankName } });
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.click(activateBtn)
    expect( screen.getByText(message) ).toBeInTheDocument();
  });

  it('WHEN pending withdrawall RETURN error', async() => {
    //const networkError = new Error('sssss');
    const networkError = {errorCode: "PENDING_WITHDRAWAL", message:"retiro pendiente"};
    axios.post.mockRejectedValueOnce(networkError);

    render(Withdrawalw, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError: async (e)=>{ 
      //expect(e.errorCode).toEqual('PENDING_WITHDRAWAL') ;
    }});
      let validAmount = 50; 
      let validName = "Juan"; 
      let validDocument=7146327821;
      let validBankName= "BCP";
      let validAccount = 45221664383828121;
      let inputAmount = screen.getByLabelText("amountLabel");
      await fireEvent.input(inputAmount, { target: { value: validAmount } });
      let inputName = screen.getByLabelText("nameLabel");
      await fireEvent.input(inputName, { target: { value: validName } });
      let inputDocument = screen.getByLabelText("documentLabel");
      await fireEvent.input(inputDocument, { target: { value: validDocument } });
      let inputBankName = screen.getByLabelText("bankNameLabel");
      await fireEvent.input(inputBankName, { target: { value: validBankName } });
      let inputAccount = screen.getByLabelText("accountLabel");
      await fireEvent.input(inputAccount, { target: { value: validAccount} });
      const activateBtn = screen.getByText("SOLICITAR RETIRO");
      await fireEvent.click(activateBtn);

      await waitFor (async ()=>{
        //screen.debug(undefined, Infinity);   //PARA VER EL HTML
        expect( screen.getByText("retiro pendiente") ).toBeInTheDocument();
      })
      
  });

  /*
  it('WHEN all is ok RETURN ok', async() => {
    const successResponse = {message:"deposito correcto"};
    axios.post.mockResolvedValueOnce(successResponse);
    render(Withdrawalw, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError: async (e)=>{  }});
      let validAmount = 50; 
      let validName = "Juan"; 
      let validDocument=7146327821;
      let validBankName= "BCP";
      let validAccount = 45221664383828121;
      let inputAmount = screen.getByLabelText("amountLabel");
      await fireEvent.input(inputAmount, { target: { value: validAmount } });
      let inputName = screen.getByLabelText("nameLabel");
      await fireEvent.input(inputName, { target: { value: validName } });
      let inputDocument = screen.getByLabelText("documentLabel");
      await fireEvent.input(inputDocument, { target: { value: validDocument } });
      let inputBankName = screen.getByLabelText("bankNameLabel");
      await fireEvent.input(inputBankName, { target: { value: validBankName } });
      let inputAccount = screen.getByLabelText("accountLabel");
      await fireEvent.input(inputAccount, { target: { value: validAccount} });
      const activateBtn = screen.getByText("SOLICITAR RETIRO");
      await fireEvent.click(activateBtn);
      await waitFor (async ()=>{
        expect( screen.getByText("deposito correcto") ).toBeInTheDocument();
      })
  });
*/
  

});