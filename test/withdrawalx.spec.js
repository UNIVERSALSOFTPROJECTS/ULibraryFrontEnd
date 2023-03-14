// NOTE: original code from https://testing-library.com/docs/svelte-testing-library/example
// NOTE: jest-dom adds handy assertions to Jest and it is recommended, but not required.
import '@testing-library/jest-dom/extend-expect'
// import ServerConnection from "../src/js/server"
// import axios from "axios"

import { render, fireEvent } from '@testing-library/svelte'

import Withdrawalx from '../src/Withdrawalx.svelte'

// jest.mock("axios")

describe('Withdawalx', () => {
  it('Check amount withdrwalx input', async() => {
    let user = {"balance":0,"username":"fortunatest001","currency":"ARS","currency_id":18,"bono":0,"code":1138137,"token":"e247f3c51baa96eedb0c266d2935e2315131f36a7997e78f4227ff8be6ea83b5","serial":"8068160578275","agregatorToken":"637e8b1b1c90de353e98880e74f0ed41a168b1a9aa3ab1c77e0ddbf38242d0b32a01758cda6c446949ab654c00d2834bf113ac56bd0213ce8e850dd2b5af2abc","expireToken":1678480673923};
    // axios.get.mockResolvedValueOnce();
    const onOk=()=>{
      alert('ok');
    }
    const onError=()=>{
      alert('Error');
    }
    let open =true
    let minAmount =2000
    let pendingWhitdrawall=null

    const { getByTestId } = render(Withdrawalx, { open,user,onOk,onError,minAmount,pendingWhitdrawall })
    const input = getByTestId('amount_input')
    // await fireEvent.input(input, { target: { value: '50' } }); // simular un evento de entrada en el input con un valor válido
    // expect(input.value).toBe('50'); // verificar que el valor haya cambiado
    // await fireEvent.input(input, { target: { value: '5000' } }); // simular un evento de entrada en el input con un valor válido
    // console.log("-- ",input.value);
    // expect(input.value).toBe('50'); // verificar que el valor haya cambiado

    // Using await when firing events is unique to the svelte testing library because
    // we have to wait for the next `tick` so that Svelte flushes all pending state changes.

    // await fireEvent.keyPress(input,{target:{key:"1"}})

    fireEvent.keyPress(input, {key: '1000000000'})

    console.log("-- ",input.value);
    expect(input.value).toBe('1'); // verificar que el valor haya cambiado

    // await fireEvent.keyDown(input,{target:{key:"76875"}})

    // await expect(input).toHaveTextContent('')

    // Withdrawalx.validateAmount();
    // expect(button).toHaveTextContent('Button Clicked')
  });
});