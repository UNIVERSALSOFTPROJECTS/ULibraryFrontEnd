<script>
    import ServerConnection from "./js/server";
    import Notifier from "./Notifier.svelte";
    import util from "./js/util";
    import { onMount } from "svelte";

    export let open;
    export let user;
    export let minAmount;
    export let maxAmount;
    export let pendingWhitdrawall;
    export let onOk;
    export let onError;

    let amount = "";
    let accountNumber="";
    let info=".";
    let bankName="";
    let name="";
    let document="";
    let notify = {};
    
    const closeModal = () => {
        console.log("cerrando modal");
        open = false;
    }

    onMount(()=>{
        pendingWhitdrawall = false;
    })

    const cashout = async()=>{
        try {
            let data = await ServerConnection.wallet.withdrawal_w(user.token, amount, bankName, accountNumber, info );
            notify = util.getNotify("success",data.MSG);
            data = await ServerConnection.user.getBalance(user.agregatorToken);
            user.balance = data.balance;
        } catch (error) {
            //onError(error);
            let msg = "Error al hacer retiro";
            if(error.errorCode && error.errorCode == 'PENDING_WITHDRAWAL' ) {
                msg = error.message
                console.log("ERRORX", msg);
                notify = util.getNotify("error",msg)
            }    
        }
    }

    const validateAmount = (event) => {
        let isNumber = /\d/.test(event.key);
        if(event.charCode === 45 || event.charCode === 43){ event.preventDefault(); return}
        if (isNumber && amount.length < 4) amount += event.key;
        else if(isNumber && amount.length >= 4) return notify = util.getNotify("error","Alcanzó el límite de cifras");
    }
    
    const validateName = (e) => {
        let validatePatternName = /^[A-Za-zúéáíóüÜÑñÓÍÚÁÉ ]*$/.test(e.key);
        if(!validatePatternName) e.preventDefault();
        if(name.length >= 40) return notify = util.getNotify("error","Máximo 40 caracteres");
    }

    const validateDocument = (event) => {
        let isNumber = /\d/.test(event.key);
        if (isNumber && document.length < 12) document += event.key;
        else if (isNumber && document.length >= 12) return notify = util.getNotify("error","12 dígitos como máximo");
    }

    const validateBankName = (e) => {
        let validatePatternBankName = /^[A-Za-zúéáíóüÜÑñÓÍÚÁÉ ]*$/.test(e.key);
        if(! validatePatternBankName) e.preventDefault();
        if(bankName.length >= 40) return notify = util.getNotify("error","40 caracteres como máximo");
    }

    const validateAccountNumber = (event) => {
        let isNumber = /\d/.test(event.key);
        if (isNumber && accountNumber.length < 20) accountNumber += event.key;
        else if(isNumber && accountNumber.length >= 20) return notify = util.getNotify("error","40 caracteres como máximo");
    }

    const validateData = () =>{
        let amount_= Number(amount);
        let msg = "Retiro exitoso";
        if(!accountNumber)  {msg = "Ingrese el número de cuenta";}
        if(!bankName)       {msg = "Ingrese el nombre del banco";}
        if(!document)       {msg = "Ingrese su documento de identidad";}
        if(!name)           {msg = "Ingrese su nombre";}
        if(amount_ < minAmount || amount_ > maxAmount)  msg = "Monto mínimo " +minAmount +" "+ user.currency + ", máximo " +maxAmount+" " + user.currency;
        if(!amount || amount ==='') msg = "Ingrese el monto";
        if(msg !== "Retiro exitoso") {return notify = util.getNotify("error", msg);
        }else {cashout();}
    }

</script>

<Notifier
    bind:display={notify.display}
    bind:message={notify.message}
    bind:type={notify.type}
/>

<div class="u-main-payments">
    <div class="u-wrapp-payments">
        <h2 class="u-title">RETIRAR SU SALDO</h2>
        <div class="u-content-info">
            <span>INGRESE EL MONTO A RETIRAR:</span>
            <input aria-label="amountLabel" class="u-input-pay" bind:value={amount} type="text"  max="2000" on:keypress|preventDefault={(e)=>validateAmount(e)} placeholder="Ingrese el monto">
            <span>Saldo Disponible: {user.balance} {user.currency}</span>
            <span>Retiro mínimo de 50 {user.currency} y máximo de 2000 {user.currency}</span>

        </div>
        <div class="g-data-bank-wrapp">
            <div class="g-data-bank">
                <div class="u-info u-destination-account">
                    <span>Nombre completo:</span>
                    <input aria-label="nameLabel" type="text" maxlength="40" bind:value={name} on:keypress={validateName} placeholder="Ingrese su nombre">
                </div>
                <div class="u-info u-destination-account">
                    <span>Documento de identidad:</span>
                    <input aria-label="documentLabel" type="text" bind:value={document} on:keypress|preventDefault={(e)=>validateDocument(e)} placeholder="Ingrese su documento de identidad">
                </div>
                <div class="u-info u-input-bank">
                    <span>Nombre de Banco:</span>
                    <input aria-label="bankNameLabel" type="text" maxlength="40" bind:value={bankName} on:keypress={validateBankName} placeholder="Ingrese el nombre de su banco (BCP, BBVA, Etc.)">
                </div>
                <div class="u-info u-destination-account">
                    <span>Número de cuenta:</span>
                    <input aria-label="accountLabel" type="text" maxlength="20" bind:value={accountNumber} on:keypress|preventDefault={(e)=>validateAccountNumber(e)} placeholder="Ingrese el número de cuenta">
                </div>
                <div class="u-info u-info-txt">
                    <span>Información adicional</span>
                    <input aria-label="infoLabel" type="text" bind:value={info} placeholder="Ingrese información adicional">
                </div>
            </div>
        </div>
        <div class="gb-process">
            <span>Horario de retiro: Lunes a Viernes de 09:00am a 05:00pm </span>
            <span>Al solicitar su retiro usted esta aceptando los términos y condiciones</span>
            <button class="u-button-pay" on:click={validateData}>SOLICITAR RETIRO</button>
        </div>
    </div>
    <button class="u-close" on:click={closeModal} >X</button>
</div>

<style>
@media only screen and (max-width: 1200px) {
    .u-main-payments{
        display: flex;
        gap: 0.2rem;
        height: 85vh;  
    }
    .u-title{
        padding: 0;
        margin: 0;
    }
    .u-close{
        position: absolute;
        left:90%;
        background: #BD992A;
        color: black;
        width: 40px;
        height: auto;
        font-size: 22px;
        font-weight: 800;
        border-radius: 0.5rem;
    }
    .u-wrapp-payments{
        background: white;
        width: 100%;
        height: 100%;
        color: black;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        padding: 0.5rem;
        gap: 0.5rem;
    }
    .u-content-info{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-weight: 600;
    }
    input{
        width: 95%;
        height: 1.2rem;
    }
    .u-info{
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .g-data-bank-wrapp{
        width: 100%;
        height: 20vh;
        overflow-y: scroll;
        padding: 1rem;
    }
    .g-data-bank{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        width: 100%;
    }
    input:focus-visible{
        outline: 0;
    }
    .u-input-pay{
        height: 1.5rem;
        border-radius: 0.5rem;
        border: 1px solid #000;
        padding: 0.5rem;
    }
    .gb-process{
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 11px;
    }
    .u-button-pay{
        background: #ffff00;
        border: none;
        height: 1.5rem;
        width: 100%;
        border-radius: 0.2rem;
        font-size: 1rem;
        font-weight: 600;
        padding: 0.2rem;
    }
}
@media only screen and (min-width: 1200px) {

    input{
        height: 1.8rem;
    }
    .u-main-payments{
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
        gap: 0.5rem;
        height: 100%;
    }
    .u-close{
        background: #BD992A;
        color: black;
        width: auto;
        text-align: center;
        height:auto;
        font-size: 28px;
        font-weight: 800;
        border: 1px solid white;
        border-radius: 0.5rem;
        cursor: pointer;
    }
    .u-wrapp-payments{
        background: white;
        width: 100%;
        color: black;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        padding: 1rem;
        gap: 1rem;
    }
    .u-content-info{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-weight: 600;
    }
    input:focus-visible{
        outline: 0;
    }
    .u-input-pay{
        width: 15rem;
        height: 2rem;
        border-radius: 0.5rem;
        border: 1px solid #000;
        padding: 0.2rem;
        padding-left: 0.5rem;
        font-size: 1rem;
        text-align: center;
    }
    .g-data-bank-wrapp{
        width: 100%;
        height: 30vh;
        overflow-y: scroll;
        padding: 1rem;
    }
    .g-data-bank{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        width: 100%;
    }
    .u-destination-account{
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .u-info-txt{
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .u-input-bank{
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .gb-process{
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 12px;
    }
    .u-button-pay{
        background: #dead1a;
        border: none;
        height: 2rem;
        width: 100%;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
    }
}
</style>
