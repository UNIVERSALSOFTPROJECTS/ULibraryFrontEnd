// npx jest depositX.spec.js
import '@testing-library/jest-dom/extend-expect'
import axios from "axios"
import { render, fireEvent, screen, waitFor  } from '@testing-library/svelte'
import Withdrawalx from '../../src/Withdrawalx.svelte'
import ServerConnection from '../../src/js/server'
jest.mock('axios');

ServerConnection.setConfig({API:".",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT", domain:"365fortuna.com", currency:"USD"})
let user = {"balance":10,"username":"fortunatest001","currency":"ARS","currency_id":18,"bono":0,"code":1138137,"token":"45ab3d4462f663cece3bf838ec78140294fe1c849b79f69a6f33d35d9610873d","serial":"8068160578275","agregatorToken":"ba903bde88ad54f0d6b979c1a9a1651edd5646ccc1c55715d6809257bb22d16049088a06d2951ff4011e53d7435806f73f28c34a9420d6155d9cee1f3dc7be33","expireToken":1682723751190};
export let minAmount = 10;
export let maxAmount = 2000;

describe('FO WithdrwalX', () => {

  it('WHEN no amount RETURN error', async() => {
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ } })
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Ingrese el monto") ).toBeInTheDocument();
  });
  
  it('WHEN low amount RETURN error', async() => {
    let amount=9;
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