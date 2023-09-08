<script>
    import ServerConnection from "./js/server";
    import { onMount } from "svelte";
    import util from "./js/util";
    import Notifier from "./Notifier.svelte";
    //de esta forma para funcionar en Jest
    import momentx from "moment";
    let moment;
    if (!momentx) moment = require("moment");
    else moment=momentx;
    

    export let open;
    export let user;
    export let onOk;
    export let onError;
    let bankDeposit = {};
    bankDeposit.reference = "";
    bankDeposit.amount = "";
    bankDeposit.account = "";
    bankDeposit.targetBankId;
  
    let bankAccounts = [];
    let appPaymethods = [];
    let notify = {};
  
    const closeModal = () => { open = false; };
    
    onMount(async () => {
      bankDeposit={};
      console.log("motando");
      await listBankAccounts();
      bankDeposit.date = moment().format('YYYY-MM-DD');

    })
    
    const listBankAccounts = async () => {
      try {
        let {data} = await ServerConnection.u_wallet.listBankAccounts(user.token);
        console.log(data.list);
        bankAccounts = data.list.filter((e) => e.type == 'BANK');
        appPaymethods = data.list.filter((e) => e.type == 'CASH');
      } catch (error) {
        console.error(error);
        notify = util.getNotify("error","Error al conseguir metodos de pago")
      }
    }

 
    const deposit = async () => {

      let amount_ = Number(bankDeposit.amount);
      try {
        bankDeposit.playerId=user.playerId;
        bankDeposit.currency=user.currency;
        let {data} = await ServerConnection.u_wallet.bankDeposit(user.token, bankDeposit);
        closeModal();
        onOk(data)
        notify = util.getNotify("success",data.msg)
      } catch (error) {
        onError(error);
      }
    }
  
  </script>
  
  <div class="u-main-payments">
    <div class="u-wrapp-body">
      <div class="u-headboard">
        <button
          class="type-method u-type-method">Transferencias Directas</button>
        <!--button class="type-method {active_type_method=='TB'?'u-type-method':''}" on:click={()=>{  active_type_method="TB"}}>Transferencias Bancarias</button-->
      </div>
  
      <div class="u-wrapp-payments">

          <div class="u-general-body">
           <p>Envianos los datos del deposito bancario que realizaste para confirmarlo e ingresar el dinero del deposito a tu cuenta.</p>
                <div>
                  <table style="width:100%">
                    <thead>
                        <tr>
                          <th style="width: 40%;">BANCO</th>
                          <th style="width: 20%;">CUENTA</th>
                          <th style="width: 20%;">MIN</th>
                          <th style="width: 20%;">MAX</th>
                        </tr>
                    </thead>
                    <tbody>
                      {#each bankAccounts as account}
                      <tr style={ bankDeposit.targetBankAccountId==account.bankId?'background:#ccc':''}>
                        <td>
                          <button on:click={()=>{ bankDeposit.targetBankAccountId=account.bankId; } } >
                            <div class="u-pay-pay">
                              <span>{account.bank}</span>
                            </div>
                          </button>
                        </td>
                        <td style="text-align: center;">
                          {account.number}
                        </td>
                        <td style="text-align: center;">
                          {account.amountMin}
                        </td>
                        <td style="text-align: center;">
                          {account.amountMax}
                        </td>
                      </tr>
                    {/each}
                    </tbody>
                  </table>
                </div>
             
            <div>
              <h4 class="gb-title-data-deposit">REGISTRO DE DATOS</h4>
            </div>
            <div class="u-form-data">
              
              <div class="u-sub-form">
                <span>Fecha Transferencia</span>
                <input
                  class="u-content-data"
                  type="date"
                  bind:value={bankDeposit.date}
                />
              </div>
              <div class="u-sub-form">
                <span>Cod.Operacion</span>
                <input
                  class="u-content-data"
                  aria-label="refNumber"
                  type="text"
                  bind:value={bankDeposit.reference}
                />
              </div>
              <div class="u-sub-form">
                <span>Monto</span>
                <input
                  class="u-content-data"
                  type="text"
                  bind:value={bankDeposit.amount}
                />
              </div>
              
            </div>
          </div>
       
      </div>
      <button class="u-button-pay" on:click={deposit}>DEPOSITAR</button>
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
  