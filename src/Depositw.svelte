<script>
    import ServerConnection from "./js/server";
    import { onMount } from "svelte";
    import util from "./js/util";
    import Notifier from "./Notifier.svelte";
    //import moment from "moment";

    import momentx from "moment";
    let moment;
    if (!momentx) moment = require("moment");
    else moment=momentx;
    

    export let open;
    export let user;
    export let onOk;
    export let onError;
    export let assetsUrl;
    export let maxAmount;
    export let minAmount;
    let amount = "";
    let bankDeposit = {};
    bankDeposit.reference = "";
    bankDeposit.amount = "";
    bankDeposit.account = "";
    bankDeposit.targetBankId;
  
    let paymentLink;
    let bankPaymethods = [];
    let appPaymethods = [];
    let yape_id = 200;
    let active_method = {};
    let active_type_method = "TD";
    let notify = {};
  
    const closeModal = () => {
      open = false;
    };
    
    onMount(async () => {
      await getPayMethods();
      bankDeposit.date = moment().format('YYYY-MM-DD');

    })
    
    const getPayMethods = async () => {
      try {
        let {data} = await ServerConnection.wallet.getPayMethods(user.token);
        bankPaymethods = data.filter((e) => e.virtual == 0);
        appPaymethods = data.filter((e) => e.virtual == 1);
      } catch (error) {
        notify = util.getNotify("error","Error al conseguir metodos de pago")
      }
    }
   
    const deposit = async () => {
      if (active_type_method == "TD") {
        await makeBankDeposit();
      } else {
        paymentLink = await ServerConnection.wallet.getPayLink(
          user.token,
          amount,
          active_method.cta
        );
        window.open(paymentLink.link, "_blank");
        closeModal();
        onOk(paymentLink)
      }
    };
  
    const makeBankDeposit = async () => {
      try {
        bankDeposit.originBank = bankDeposit.targetBankId;
        bankDeposit.aditional = "empty";
        bankDeposit.imageUrl = "";
        let {data} = await ServerConnection.wallet.bankDeposit(user.token, bankDeposit);
        closeModal();
        onOk(data)
        notify = util.getNotify("success",data.message)
      } catch (error) {
        console.log("data msg here: ", "si llega al catch de make deposit")
        notify = util.getNotify("error","Hay un depósito en curso")
      }
    }
  
    const getUlrImage = (method) => {
      let logo = method.banco;
      if (method.banco == "Transferencia Safe Pay") logo = "t_safepay";
      else if (method.banco == "Efectivo Safe Pay") logo = "e_safepay";
      else if (method.banco == "Tarjetas, Transferencias, Efectivo")
        logo = "card";
      return `${assetsUrl}/payment_methods/${logo}.png`;
    }
  
    const validateReferenceNumber = (e) => {
      if(!/\d/.test(e.key)) return notify = util.getNotify("error","Ingrese numeros")
      if(bankDeposit.reference.length >= 15) return notify = util.getNotify("error","15 dígitos como máximo")
      bankDeposit.reference += e.key        
    }
  
    const validateAmount = (e) => {
      if(!/\d/.test(e.key)) return notify = util.getNotify("error","Ingrese numeros")
      if ( Number(bankDeposit.amount) > maxAmount) return notify = util.getNotify("error",`El monto máximo es de ${maxAmount}`);
      bankDeposit.amount += e.key;
    }

    const validateAccountNumber = (e) => {
      if(!/\d/.test(e.key)) return notify = util.getNotify("error","Ingrese numeros")
      if(bankDeposit.account.length >= 15) return notify = util.getNotify("error","15 dígitos como máximo")
      bankDeposit.account += e.key;      
    }
  
    const validateData = () => {
      let amount_ = Number(bankDeposit.amount);
      if (!bankDeposit.targetBankId || bankDeposit.targetBankId === "" ) return notify = util.getNotify("error","Seleccione el banco receptor");
      if (!bankDeposit.date ) {console.log(bankDeposit.date); return notify = util.getNotify("error","Ingrese una fecha válida");}
      if (!amount_) return notify = util.getNotify("error","Ingrese el monto a depositar");
      if (!bankDeposit.reference || bankDeposit.reference === "") {return notify = util.getNotify("error","Ingrese el número de referencia");}
      if (amount_ < minAmount || amount_ > maxAmount) return notify = util.getNotify("error",`El monto debe estar entre ${minAmount} y ${maxAmount}`);
      if (!bankDeposit.account || bankDeposit.account === "") return notify = util.getNotify("error","Ingrese el número de cuenta");
      deposit();
    }
  
  </script>
  
  <div class="u-main-payments">
    <div class="u-wrapp-body">
      <div class="u-headboard">
        <button
          class="type-method {active_type_method == 'TD' ? 'u-type-method' : ''}"
          on:click={() => {
            active_type_method = "TD";
          }}>Transferencias Directas</button>
        <!--button class="type-method {active_type_method=='TB'?'u-type-method':''}" on:click={()=>{  active_type_method="TB"}}>Transferencias Bancarias</button-->
      </div>
  
      <div class="u-wrapp-payments">
        {#if active_type_method == "TD"}
          <div class="u-general-body">
            <div class="u-show-data">
              <div class="u-show-method">
                <h4>BANCO</h4>
                <div class="u-method-pay-dir">
                  {#each bankPaymethods as method}
                    <button
                      class="u-pay {active_method == method
                        ? 'u-act-method'
                        : ''}"
                    >
                      <div class="u-pay-pay">
                        <img src={getUlrImage(method)} alt={method.banco} />
                        <span class="in-mobile">{method.nombre}</span>
                      </div>
                    </button>
                  {/each}
                </div>
              </div>
              <div class="in-desktop">
                <h4>NOMBRE</h4>
                <div class="u-name">
                  {#each bankPaymethods as method}
                    <span>{method.nombre}</span>
                  {/each}
                </div>
              </div>
              <div>
                <h4>CUENTA</h4>
                <div class="u-cta">
                  {#each bankPaymethods as method}
                    <span>{method.cta}</span>
                  {/each}
                </div>
              </div>
              <div>
                <h4>MIN</h4>
                <div class="u-min">
                  {#each bankPaymethods as method}
                    <span>{method.min}</span>
                  {/each}
                </div>
              </div>
              <div class="">
                <h4>MAX</h4>
                <div class="u-max">
                  {#each bankPaymethods as method}
                    <span>{method.max}</span>
                  {/each}
                </div>
              </div>
            </div>
            <div>
              <h4 class="gb-title-data-deposit">REGISTRO DE DATOS</h4>
            </div>
            <div class="u-form-data">
              <div class="u-sub-form">
                <span>Banco Receptor</span>
                <select aria-label="bankSelected" class="u-select" bind:value={bankDeposit.targetBankId}>
                  {#each bankPaymethods as method}
                    <option aria-label="bankOption" value={method.id}>{method.banco}</option>
                  {/each}
                </select>
              </div>
              <div class="u-sub-form">
                <span>Fecha Transferencia</span>
                <input
                  aria-label="trxDate"
                  class="u-content-data"
                  type="date"
                  bind:value={bankDeposit.date}
                />
              </div>
              <div class="u-sub-form">
                <span
                  >{bankDeposit.targetBankId == yape_id ? "Hora" : "Nro"} de Referencia</span
                >
                <input
                  class="u-content-data"
                  aria-label="refNumber"
                  type="text"
                  bind:value={bankDeposit.reference}
                  on:keypress|preventDefault={validateReferenceNumber}
                />
              </div>
              <div class="u-sub-form">
                <span>Monto</span>
                <input
                  class="u-content-data"
                  aria-label="amountNumber"
                  type="text"
                  bind:value={bankDeposit.amount}
                  on:keypress|preventDefault={validateAmount}
                />
              </div>
              <div class="u-sub-form">
                <span
                  >{bankDeposit.targetBankId == yape_id
                    ? "Depositante"
                    : "Nro Cuenta"}:</span
                >
                <input
                  class="u-content-data"
                  aria-label="acountNumber"
                  type="text"
                  bind:value={bankDeposit.account}
                  on:keypress|preventDefault={validateAccountNumber}
                />
              </div>
              <div class="u-sub-form">
                <span>Su Banco:</span>
                <select
                  class="u-select"
                  aria-label="yourBank"
                  bind:value={bankDeposit.targetBankId}
                  disabled
                >
                  {#each bankPaymethods as method}
                    <option value={method.id}>{method.banco}</option>
                  {/each}
                </select>
              </div>
            </div>
          </div>
        {/if}
        {#if active_type_method == "TB"}
          <span>MONTO A DEPOSITAR:</span>
          <input class="u-input-pay" type="number" bind:value={amount} />
          <div class="u-method-pay">
            {#each appPaymethods as method}
              <button
                class="u-pay {active_method == method ? 'u-act-method' : ''}"
                on:click={() => {
                  active_method = method;
                }}
              >
                <span>{method.banco}</span>
                <div class="u-pay-pay">
                  <img src={getUlrImage(method)} alt={method.banco} />
                  <span>Min:{method.min}</span>
                  <span>Max:{method.max}</span>
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
      <button class="u-button-pay" on:click={validateData}>DEPOSITAR</button>
    </div>
    <button class="u-close" on:click={closeModal}>X</button>
  </div>
  <Notifier
    bind:display={notify.display}
    bind:message={notify.message}
    bind:type={notify.type}
    />
  <style>
    button {
      cursor: pointer;
    }
    @media only screen and (max-width: 1200px) {
      .in-desktop {
        display: none;
      }
      .in-mobile {
        font-size: 0.5rem;
      }
      .u-main-payments {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-around;
        font-size: 0.8rem;
        overflow: scroll;
      }
      .u-close {
        position: absolute;
        left: 90%;
        background: #bd992a;
        color: black;
        height: 32px;
        font-size: 22px;
        font-weight: 800;
        border-radius: 0.5rem;
        text-align: center;
      }
      .u-wrapp-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding-bottom: 0.5rem;
        background: white;
        width: 100%;
      }
      .u-wrapp-payments {
        color: black;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        height: 100%;
        width: 100%;
        border-radius: 0.5rem;
        gap: 0.2rem;
        font-size: 0.8rem;
      }
      .u-input-pay {
        width: 15rem;
        height: 2rem;
        border-radius: 0.5rem;
        border: 1px solid #000;
        padding: 0.2rem;
        padding-left: 0.5rem;
        font-size: 1rem;
      }
      .u-button-pay {
        background: #dead1a;
        border: none;
        height: 2rem;
        width: 90%;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
      }
      .u-act-method {
        background-color: #dead1a;
      }
      .u-headboard {
        width: 100%;
        background-color: #bd992a;
        height: 2rem;
      }
      .type-method {
        background-color: transparent;
        border: none;
        height: 100%;
      }
      .u-type-method {
        background-color: #ffbf00;
      }
      .u-show-data {
        display: grid;
        grid-template-columns: 40% 35% 10% 10%;
        align-items: flex-start;
        justify-content: center;
        width: 100%;
        text-align: center;
      }
      .u-method-pay-dir {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.2rem;
      }
      .u-name,
      .u-cta,
      .u-min,
      .u-max {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 0.5rem;
      }
      .u-pay {
        border: none;
        width: 100%;
        cursor: pointer;
        background-color: transparent;
      }
      .u-pay-pay {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.2rem;
      }
      .u-form-data {
        display: grid;
        grid-template-columns: 47% 47%;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 0.5rem;
      }
      .u-sub-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 0.5rem;
        height: 100%;
      }
      .u-select {
        border: none;
        width: 100%;
        height: 2rem;
        border-radius: 0.5rem;
        border: 1px solid #000;
        padding: 0.2rem;
        padding-left: 0.5rem;
        font-size: 1rem;
      }
      .u-content-data {
        width: 95%;
        height: 1.5rem;
        border-radius: 0.5rem;
        border: 1px solid #000;
        padding: 0.2rem;
        padding-left: 0.5rem;
        font-size: 1rem;
      }
      input:focus-visible {
        outline: 0;
      }
      select:focus-visible {
        outline: 0;
      }
      .u-pay-pay img {
        border-radius: 0.5rem;
        width: 100px;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }
    @media only screen and (min-width: 1200px) {
      .in-mobile {
        display: none;
      }
      .gb-title-data-deposit {
        padding-left: 1.5rem;
      }
      .u-show-method {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .u-main-payments {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-around;
        gap: 0.5rem;
        height: 100%;
      }
      .u-close {
        background: #bd992a;
        color: black;
        width: 40px;
        height: 44px;
        font-size: 28px;
        font-weight: 800;
        border-radius: 0.5rem;
        cursor: pointer;
      }
      .u-wrapp-body {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
        background: white;
        padding-bottom: 2rem;
        width: 100%;
      }
      .u-headboard {
        width: 100%;
        background-color: #bd992a;
        height: 2rem;
      }
      .type-method {
        background-color: transparent;
        border: none;
        height: 100%;
      }
      .u-type-method {
        background-color: #ffbf00;
      }
      .u-wrapp-payments {
        color: black;
        height: 100%;
        border-radius: 0.5rem;
        width: 100%;
      }
      .u-show-data {
        display: grid;
        grid-template-columns: 20% 28% 30% 10% 10%;
        align-items: flex-start;
        width: 100%;
        text-align: center;
      }
      .u-method-pay-dir {
        gap: 0.2rem;
        width: 100px;
      }
      .u-name,
      .u-cta,
      .u-min,
      .u-max {
        display: flex;
        flex-direction: column;
      }
      .u-pay {
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        padding: 0;
      }
      .u-form-data {
        display: grid;
        grid-template-columns: 47% 47%;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 0.5rem;
      }
      .u-sub-form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 0.5rem;
        height: 100%;
      }
      .u-select {
        border: none;
        width: 100%;
        height: 2rem;
        border-radius: 0.5rem;
        border: 1px solid #000;
        padding: 0.2rem;
        padding-left: 0.5rem;
        font-size: 1rem;
      }
      .u-content-data {
        width: 95%;
        height: 1.5rem;
        border-radius: 0.5rem;
        border: 1px solid #000;
        padding: 0.2rem;
        padding-left: 0.5rem;
        font-size: 1rem;
      }
      input:focus-visible {
        outline: 0;
      }
      select:focus-visible {
        outline: 0;
      }
      .u-input-pay {
        width: 15rem;
        height: 2rem;
        border-radius: 0.5rem;
        border: 1px solid #000;
        padding: 0.2rem;
        padding-left: 0.5rem;
        font-size: 1rem;
      }
      .u-button-pay {
        background: #dead1a;
        border: none;
        height: 2rem;
        width: 95%;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
      }
      .u-pay-pay img {
        border-radius: 0.5rem;
        width: 100px;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .u-act-method {
        background-color: #dead1a;
      }
    }
  </style>
  