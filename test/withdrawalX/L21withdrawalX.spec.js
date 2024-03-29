// npx jest depositX.spec.js
import '@testing-library/jest-dom/extend-expect'
import axios from "axios"
import { render, fireEvent, screen  } from '@testing-library/svelte'
import Withdrawalx from '../../src/Withdrawalx.svelte'
import ServerConnection from '../../src/js/server'
jest.mock('axios');

ServerConnection.setConfig({API:".",CLIENT_AUTH:"LATILATINSPORT213073LS212023USOFT",CLIENT_CODE:"LATI", domain:"latinsport21.net", currency:"USD"})
let user = {"balance":10,"username":"latintest001","currency":"ARS","currency_id":18,"bono":0,"code":1138137,"token":"e247f3c51baa96eedb0c266d2935e2315131f36a7997e78f4227ff8be6ea83b5","serial":"8068160578275","agregatorToken":"637e8b1b1c90de353e98880e74f0ed41a168b1a9aa3ab1c77e0ddbf38242d0b32a01758cda6c446949ab654c00d2834bf113ac56bd0213ce8e850dd2b5af2abc","expireToken":1678480673923};

export let minAmount = 1;
export let maxAmount = 2000;

describe('L21 WithdrwalX', () => {

  it('WHEN no amount RETURN error', async() => {
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ } })
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Ingrese el monto") ).toBeInTheDocument();
  });
  
  it('WHEN low amount RETURN error', async() => {
    let amount=0;
    let message = "Monto mínimo " +minAmount +" "+ user.currency + ", máximo " + maxAmount+" "+user.currency;
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ } })
    const input = screen.getByLabelText("amount");
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.input(input, { target: { value:amount } });
    await fireEvent.click(activateBtn)
    expect( screen.getByText(message) ).toBeInTheDocument();
  });

  it('WHEN amount exceeds the limit RETURN error', async() => {
    let amount=2001;
    let message = "Monto mínimo " +minAmount +" "+ user.currency + ", máximo " + maxAmount+" "+user.currency;
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ } })
    const input = screen.getByLabelText("amount");
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.input(input, { target: { value:amount } });
    await fireEvent.click(activateBtn)
    expect( screen.getByText(message) ).toBeInTheDocument();
  });
 
  it('WHEN pending withdrawal RETURN error', async() => {
    let amount=50;
    axios.get.mockRejectedValue({response:{data: {errorCode:"6C54PWQFE7", message:"PENDING_WITHDRAWAL"}}});
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:true, minAmount, maxAmount,
      onOk:()=>{},
      onError:(e_withdrawal)=>{ 
        expect(e_withdrawal).toEqual('PENDING_WITHDRAWAL') 
    }});
    const input = screen.getByLabelText("amount");
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.input(input, { target: { value:amount } });
    await fireEvent.click(activateBtn)
  });

  it('WHEN old token withdrawal RETURN error', async() => {
    let amount=50;
    axios.get.mockResolvedValue({data:{resp:'ok'}});
    axios.post.mockRejectedValue({response:{data: {errorCode:"OLD_TOKEN"}}});
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:true, minAmount, maxAmount,
      onOk:()=>{},
      onError:(e_withdrawal)=>{ 
        expect(e_withdrawal).toEqual('DUPLICATE_SESSION') 
    }});
    const input = screen.getByLabelText("amount");
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.input(input, { target: { value:amount } });
    await fireEvent.click(activateBtn)
    //screen.debug(undefined, Infinity)
  });

  it('WHEN unknowed error message at withdrawal RETURN error', async() => {
    let amount=50;
    let message="mensaje de error desconocido al retirar";
    axios.get.mockResolvedValue({data:{resp:'ok'}});
    axios.post.mockRejectedValue({response:{data: {message:message}}});
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:true, minAmount, maxAmount,
      onOk:()=>{},
      onError:(e_withdrawal)=>{ 
        expect(e_withdrawal).toEqual(message) 
    }});
    const input = screen.getByLabelText("amount");
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.input(input, { target: { value:amount } });
    await fireEvent.click(activateBtn)
  });

  it('WHEN unknowed error at withdrawal RETURN error', async() => {
    let amount=50;
    let message="error al realizar retiro";
    axios.get.mockResolvedValue({data:{resp:'ok'}});
    axios.post.mockRejectedValue({response:{data: {message}}});
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:true, minAmount, maxAmount,
      onOk:()=>{},
      onError:(e_withdrawal)=>{ 
        expect(e_withdrawal).toEqual(message) 
    }});
    const input = screen.getByLabelText("amount");
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.input(input, { target: { value:amount } });
    await fireEvent.click(activateBtn)
  });

  it('WHEN all is ok RETURN ok', async() => {
    let amount=50;
    axios.get.mockResolvedValue({data:{resp:'ok'}});
    axios.post.mockResolvedValue({data:{resp:'ok'}});
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:true, minAmount, maxAmount,
      onOk:(withdrawalOk)=>{
        expect(withdrawalOk.data.resp).toEqual('ok') },
      onError:()=>{ }});
    const input = screen.getByLabelText("amount");
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.input(input, { target: { value:amount } });
    await fireEvent.click(activateBtn)
  });
  
});