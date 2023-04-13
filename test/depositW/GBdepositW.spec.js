// npx jest depositW.spec.js -t 'no date'
import '@testing-library/jest-dom/extend-expect'
import axios from "axios"
import { render, waitFor ,fireEvent, screen  } from '@testing-library/svelte'
import Depositw from '../../src/Depositw.svelte'
import Test from "../../src/Test.svelte"
import ServerConnection from '../../src/js/server'
import moment from 'moment'
jest.mock('axios');

ServerConnection.setConfig({API:".",CLIENT_AUTH:"GOLD21GOLDENBET4A19028GOLDENBET1",CLIENT_CODE:"GOLD", domain:"goldenbet.com.pe", currency:"USD"})
let user = {"balance":10,"username":"GoldenBetTest1","currency":"ARS","currency_id":18,"bono":0,"code":1138137,"token":"e247f3c51baa96eedb0c266d2935e2315131f36a7997e78f4227ff8be6ea83b5","serial":"8068160578275","agregatorToken":"637e8b1b1c90de353e98880e74f0ed41a168b1a9aa3ab1c77e0ddbf38242d0b32a01758cda6c446949ab654c00d2834bf113ac56bd0213ce8e850dd2b5af2abc","expireToken":1678480673923};
let assetsUrl = "https://assets.apiusoft.com";
let minAmount = 10;
let maxAmount = 2000;

// Return a fixed timestamp when moment().format() is called
jest.mock('moment', () => () => ({format: () => '2023–04–11T12:34:56+00:00'}));

let banks = [
  {
      "id": 208,
      "nombre": "DEVIN Y ASOCIADOS SAC - 20550351642",
      "cta": "N.- Cuenta: 194-2682364-0-84  CCI: 00219400268236408497",
      "banco": "BCP",
      "id_moneda": 9,
      "pais": "51",
      "min": 20,
      "max": 6000,
      "muestra": true,
      "retiro_min": 50,
      "activo": true,
      "id_banca": 2918,
      "id_server": 1010,
      "nota": null,
      "iso": "PEN",
      "id_credencial": 1,
      "pasarela": 1,
      "retiro_max": 0,
      "virtual": 0,
      "orden": 4
  },
  {
      "id": 231,
      "nombre": "DEVIN Y ASOCIADOS SAC - 20550351642",
      "cta": "N- Cuenta 009-3001039543  CCI: 003-009-003001039543-89",
      "banco": "Interbank",
      "id_moneda": 9,
      "pais": "51",
      "min": 20,
      "max": 6000,
      "muestra": false,
      "retiro_min": 50,
      "activo": true,
      "id_banca": 2918,
      "id_server": 1010,
      "nota": null,
      "iso": "PEN",
      "id_credencial": 1,
      "pasarela": 1,
      "retiro_max": 0,
      "virtual": 0,
      "orden": 4
  },
  {
      "id": 232,
      "nombre": "DEVIN Y ASOCIADOS SAC - 20550351642",
      "cta": "N- Cuenta 0011-0175-0100077968-74 CCI: 011-175-000100077968-74",
      "banco": "BBVA",
      "id_moneda": 9,
      "pais": "51",
      "min": 20,
      "max": 6000,
      "muestra": false,
      "retiro_min": 50,
      "activo": true,
      "id_banca": 2918,
      "id_server": 1010,
      "nota": null,
      "iso": "PEN",
      "id_credencial": 1,
      "pasarela": 1,
      "retiro_max": 0,
      "virtual": 0,
      "orden": 4
  }
]

describe('GB DepositW', () => {

  it('WHEN no Bank RETURN error', async() => {
    axios.post.mockResolvedValue({data:banks});
    render(Depositw, { open: true, user, assetsUrl, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ }})
    const activateBtn = screen.getByText("DEPOSITAR");
    await fireEvent.click(activateBtn)
    expect( screen.getByText("Seleccione el banco receptor") ).toBeInTheDocument();
  });

  it('WHEN no date selected RETURN error', async() => {
    await axios.get.mockResolvedValue({data:banks});
    render(Depositw, { open: true, user, assetsUrl, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ }})
    await waitFor( async()=>{
      let select = screen.getByLabelText("bankSelected");
      let options = screen.getAllByLabelText("bankOption");
      await fireEvent.change(select, { target: { value:"208" } });
      let date = screen.getByLabelText("trxDate");
      await fireEvent.input(date, { target: { value:null } });
      const activateBtn = screen.getByText("DEPOSITAR");
      await fireEvent.click(activateBtn)
      console.log("date: ",date);
      expect(options[0].selected).toBeTruthy();
      expect( screen.getByText("Ingrese una fecha válida") ).toBeInTheDocument();
    } )
  });

  it('WHEN no reference RETURN error', async() => {
    await axios.get.mockResolvedValue({data:banks});
    render(Depositw, { open: true, user, assetsUrl, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ }})
    await waitFor( async()=>{
      let select = screen.getByLabelText("bankSelected");
      let options = screen.getAllByLabelText("bankOption");
      //console.log("seleccion: ",options);
      await fireEvent.change(select, { target: { value:"208" } });
      const activateBtn = screen.getByText("DEPOSITAR");
      await fireEvent.click(activateBtn)
      expect(options[0].selected).toBeTruthy();
      expect( screen.getByText("Ingrese el número de referencia") ).toBeInTheDocument();
      //screen.debug(undefined, Infinity)
    } )
  });

  it('WHEN no enter amount RETURN error', async() => {
    await axios.get.mockResolvedValue({data:banks});
    render(Depositw, { open: true, user, assetsUrl, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ }})
    await waitFor( async()=>{
      let select = screen.getByLabelText("bankSelected");
      let options = screen.getAllByLabelText("bankOption");
      await fireEvent.change(select, { target: { value:"208" } });
      let reference = screen.getByLabelText("refNumber")
      await fireEvent.input(reference, { target: { value:"5241" } });
      let amount = screen.getByLabelText("amountNumber")
      await fireEvent.input(amount, { target: { value: null} });
      const activateBtn = screen.getByText("DEPOSITAR");
      await fireEvent.click(activateBtn)
      expect(options[0].selected).toBeTruthy();
      expect( screen.getByText("Ingrese el monto a depositar") ).toBeInTheDocument();
    } )
  });

  it('WHEN no valid amount RETURN error', async() => {
    await axios.get.mockResolvedValue({data:banks});
    render(Depositw, { open: true, user, assetsUrl, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ }})
    await waitFor( async()=>{
      let select = screen.getByLabelText("bankSelected");
      let options = screen.getAllByLabelText("bankOption");
      await fireEvent.change(select, { target: { value:"208" } });
      let reference = screen.getByLabelText("refNumber")
      await fireEvent.input(reference, { target: { value:"5241" } });
      let amount = screen.getByLabelText("amountNumber")
      await fireEvent.input(amount, { target: { value: "2001"} });
      const activateBtn = screen.getByText("DEPOSITAR");
      await fireEvent.click(activateBtn)
      expect(options[0].selected).toBeTruthy();
      expect( screen.getByText(`El monto debe estar entre ${minAmount} y ${maxAmount}`) ).toBeInTheDocument();
    } )
  });

  it('WHEN no acount number RETURN error', async() => {
    await axios.get.mockResolvedValue({data:banks});
    render(Depositw, { open: true, user, assetsUrl, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ }})
    await waitFor( async()=>{
      let select = screen.getByLabelText("bankSelected");
      let options = screen.getAllByLabelText("bankOption");
      await fireEvent.change(select, { target: { value:"208" } });
      let reference = screen.getByLabelText("refNumber")
      await fireEvent.input(reference, { target: { value:"5241" } });
      const activateBtn = screen.getByText("DEPOSITAR");
      await fireEvent.click(activateBtn)
      expect(options[0].selected).toBeTruthy();
      expect( screen.getByText("Ingrese el número de cuenta") ).toBeInTheDocument();
    } )
  });

  it('WHEN no enter your bank RETURN error', async() => {
    await axios.get.mockResolvedValue({data:banks});
    render(Depositw, { open: true, user, assetsUrl, minAmount, maxAmount, onOk:(r)=>{ }, onError:(e)=>{ }})
    await waitFor( async()=>{
      let select = screen.getByLabelText("bankSelected");
      let options = screen.getAllByLabelText("bankOption");
      await fireEvent.change(select, { target: { value:"208" } });
      let reference = screen.getByLabelText("refNumber")
      await fireEvent.input(reference, { target: { value:"5241" } });
      let acountNumber = screen.getByLabelText("acountNumber")
      await fireEvent.input(acountNumber, { target: { value:"52413421" } });
      const activateBtn = screen.getByText("DEPOSITAR");
      await fireEvent.click(activateBtn)
      expect(options[0].selected).toBeTruthy();
      expect( screen.getByText("Ingrese el número de cuenta") ).toBeInTheDocument();
    } )
  });

/*
  it('WHEN no valid code RETURN error', async() => {
    let chargeCode="RA123";
    axios.post.mockResolvedValue({data:{error:2 }});
    render(Depositx, { open: true, user,
       onOk:()=>{},
       onError:(e)=>{ expect(e).toEqual('UNKNOW_ERROR') } 
    })
    const input = screen.getByLabelText("charge-code-txt");
    await fireEvent.input(input, { target: { value:chargeCode } });
    const activateBtn = screen.getByText("Activar");
    await fireEvent.click(activateBtn)
  });

  it('WHEN valid code RETURN ok', async() => {
    let chargeCode="RA123";
    let chargeBalance = 20.00;
    axios.post.mockResolvedValue({data:{resp:'ok', saldo:chargeBalance }});
    render(Depositx, { open: true, user,
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