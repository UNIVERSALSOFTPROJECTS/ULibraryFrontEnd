// npx jest depositX.spec.js
import '@testing-library/jest-dom/extend-expect'
import axios from "axios"
import { render, fireEvent, screen  } from '@testing-library/svelte'
import Withdrawalx from '../../src/Withdrawalx.svelte'
import ServerConnection from '../../src/js/server'
jest.mock('axios');

ServerConnection.setConfig({API:".",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT", domain:"365fortuna.com", currency:"USD"})
let user = {"balance":10,"username":"fortunatest001","currency":"ARS","currency_id":18,"bono":0,"code":1138137,"token":"e247f3c51baa96eedb0c266d2935e2315131f36a7997e78f4227ff8be6ea83b5","serial":"8068160578275","agregatorToken":"637e8b1b1c90de353e98880e74f0ed41a168b1a9aa3ab1c77e0ddbf38242d0b32a01758cda6c446949ab654c00d2834bf113ac56bd0213ce8e850dd2b5af2abc","expireToken":1678480673923};
export let minAmount;
export let maxAmount;

describe('FO WithdrwalX', () => {
  it('WHEN no amount RETURN error', async() => {
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ } })
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Ingrese el monto") ).toBeInTheDocument();
  });

  /*
  it('WHEN low amount RETURN error', async() => {
    let minAmount=9;
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ } })
    const activateBtn = screen.getByText("SOLICITAR RETIRO");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Monto mínimo: ") ).toBeInTheDocument();
  });

  it('WHEN low amount RETURN error', async() => {
    
    render(Withdrawalx, { open: true, user, pendingWhitdrawall:false, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ } })
    console.log("Monto ingresado :", amount);
    const input = screen.getByLabelText("u-input-pay");
    await fireEvent.input(input, { target: { value:chargeCode } });
    const activateBtn = screen.getByText("Activar");
    await fireEvent.click(activateBtn)
  });

  it('WHEN valid code RETURN ok', async() => {
    let chargeCode="RA123";
    let chargeBalance = 20.00;
    axios.post.mockResolvedValue({data:{resp:'ok', saldo:chargeBalance }});
    render(Depositx, { open: true, user,tan abajonajo
       onOk:(data)=>{ expect(user.balance).toEqual(data.saldo) },
       onError:()=>{ } 
    })
    const input = screen.getByLabelText("charge-code-txt");
    await fireEvent.input(input, { target: { value:chargeCode } });
    const activateBtn = screen.getByText("Activar");
    await fireEvent.click(activateBtn)
  });
  */
});