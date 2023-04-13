// npx jest depositX.spec.js
import '@testing-library/jest-dom/extend-expect'
import axios from "axios"
import { render, fireEvent, screen  } from '@testing-library/svelte'
import Withdrawalx from '../../src/Withdrawalx.svelte'
import ServerConnection from '../../src/js/server'
jest.mock('axios');

ServerConnection.setConfig({API:".",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT", domain:"365fortuna.com", currency:"USD"})
let user = {"balance":10,"username":"fortunatest001","currency":"ARS","currency_id":18,"bono":0,"code":1138137,"token":"e247f3c51baa96eedb0c266d2935e2315131f36a7997e78f4227ff8be6ea83b5","serial":"8068160578275","agregatorToken":"637e8b1b1c90de353e98880e74f0ed41a168b1a9aa3ab1c77e0ddbf38242d0b32a01758cda6c446949ab654c00d2834bf113ac56bd0213ce8e850dd2b5af2abc","expireToken":1678480673923};
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
    let message = `Monto mínimo: ${minAmount}`;
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ } })
    const input = screen.getByLabelText("amount_value");
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.input(input, { target: { value:amount } });
    await fireEvent.click(activateBtn)
    expect( screen.getByText(message) ).toBeInTheDocument();
  });

  it('WHEN amount exceeds the limit RETURN error', async() => {
    let amount=2001;
    let message = `El monto máximo es de: ${maxAmount}`;
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ } })
    const input = screen.getByLabelText("amount_value");
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.input(input, { target: { value:amount } });
    await fireEvent.click(activateBtn)
    expect( screen.getByText(message) ).toBeInTheDocument();
  });
 
  /*
  it('WHEN pendiNg withdrawal RETURN error', async() => {
    let amount=20;
    axios.post.mockResolvedValue({resp_withdrawal:{errorCode:"6C54PWQFE7", message:"PENDING_WITHDRAWAL"}});
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:true, minAmount, maxAmount,
      onOk:()=>{},
      onError:(e_withdrawal)=>{ expect(e_withdrawal.response.data.message).toEqual('PENDING_WITHDRAWAL') } 
    });
    const input = screen.getByLabelText("amount_value");
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.input(input, { target: { value:amount } });
    await fireEvent.click(activateBtn)
  });
  
  it('WHEN valid amount RETURN ok', async() => {
    let amount = 20.00;
    console.log("balance previo" + user.balance);
    user.balance += user.balance + amount;
    axios.post.mockResolvedValue({data:{resp:'ok'}});
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount,
       onOk:(data)=>{ expect(user.balance).toEqual(data.saldo) },
       onError:()=>{ } 
    })
    const input = screen.getByLabelText("amount_value");
    await fireEvent.input(input, { target: { value:amount } });
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.click(activateBtn)
    console.log("saldo actual" + data.saldo);
  });
  */
});