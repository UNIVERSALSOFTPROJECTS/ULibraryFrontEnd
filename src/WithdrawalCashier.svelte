<script>
    import ServerConnection from "./js/server"
    import moment from "moment";
    import { onMount } from "svelte";
    import Notifier from "./Notifier.svelte";
    import util from "./js/util";

    export let open;
    export let minAmount;
    export let maxAmount;
    export let user;
    export let pendingWhitdrawall;
    export let onOk;
    export let onError;

    let amount = "";
    let notify = {};
    
    onMount(()=>{
        getPendingWithdrawal(user.token);
    })

    const closeModal = () => {
        console.log("Cerrando Modal.");
        open = false;
    };
    const getPendingWithdrawal = async(token) => {
        let resp_pending = await ServerConnection.u_wallet.checkPendingWithdrawal(token);
        if(resp_pending.data.monto) pendingWhitdrawall = resp_pending.data; // si tiene monto quiere decir que tiene un retiro pendiente
    };

    const cashout = async()=>{
        pendingWhitdrawall=null;
        try {
            let resp_withdrawal = null;
            await getPendingWithdrawal(user.token);
            if(!pendingWhitdrawall ){
                resp_withdrawal = await ServerConnection.wallet.retailWithdrawal(user.token, amount);
                await getPendingWithdrawal(user.token);
                onOk(resp_withdrawal?resp_withdrawal:pendingWhitdrawall);
            }else{
                onError("PENDING_WITHDRAWAL");
            }
            let { data } = await ServerConnection.user.getBalance(user.agregatorToken);
            user.balance = data.balance;
        } catch (e_withdrawal) {
            console.log("e_withdrawal: ", e_withdrawal)
            if(e_withdrawal.response.data.errorCode=='OLD_TOKEN') onError("DUPLICATE_SESSION"); 
            else if(e_withdrawal.response.data.message != 'RET_PEND') onError(e_withdrawal.response.data.message);
            else onError(e_withdrawal.response.data)
        }
    };

    const validateAmount = (event) => {
        if(!/\d/.test(event.key)) return;
        if(event.charCode === 45 || event.charCode === 43){ event.preventDefault(); return}
        if (amount.length < 4) amount += event.key;
       // else if(amount.length >= 4) return notify = util.getNotify("error","Alcanzó el limite de cifras" )
    };

    const copyCodeWhitdrawall = () => {
        const copyUser = "Usuario: " + user.username + ", ";
        const copyId = "Id: " + user.code + ", ";
        const copyCode = "Codigo Retiro: " + pendingWhitdrawall.codigo;
        const finalMessage = copyUser + copyId + copyCode;
        navigator.clipboard.writeText(finalMessage);
    };

    const validateData = () => {
        let msg = "-"
        if(!amount || amount ==='') msg = "Ingrese el monto";
        else if(amount < minAmount || amount > maxAmount)  msg = "Monto mínimo " +minAmount +" "+ user.currency + ", máximo " + maxAmount+" "+user.currency;
        if(msg !== "-") {return notify = util.getNotify("error",msg);}
        else{ cashout();}
    }

    

</script>

<Notifier
    bind:display={notify.display}
    bind:message={notify.message}
    bind:type={notify.type}
/>

<div class="u-main-payments">
    {#if pendingWhitdrawall && pendingWhitdrawall.monto>0}
    <div>
        <div class="u-wrapp-payments">
            <span class="u-title bd">RETIRO PENDIENTE</span>
            <div class="u-info-retail">
                <div>Usuario :  <span>{user.username}</span></div>
                <div>ID: <span>{user.code}</span></div>   
                <div>Date: <span>{ moment.unix(pendingWhitdrawall.efecha).format("DD/MM/YYYY")}</span></div>   
                <div>Temps: <span>{moment.unix(pendingWhitdrawall.efecha).format("HH:mm")}</span></div>   
            </div>
            <div class="u-info2-retail">
                <p>Código:</p>
                <div class="u-section-code">
                    <span>{pendingWhitdrawall.codigo}</span>
                    <button title="Copiar Código" class="u-copyCode" on:click={copyCodeWhitdrawall}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                        </svg>
                    </button>
                </div>
                <p>Monto:</p>
                <span>{pendingWhitdrawall.monto}</span>
            </div>
            <div class="w-100">Acercate a nuestras sucursales, para proceder con el retiro.</div>
            <div class="w-100 small-text">Nota: No es necesario imprimir este ticket, solo debe identificar su usuario junto con el código de referencia</div>
        </div>
    </div>

    {:else}

    <div class="u-wrapp-payments">
        <span class="u-title">RETIRAR SU SALDO</span>
        <div class="u-content-info">
            <span>INGRESE EL MONTO A RETIRAR:</span>
            <input aria-label="amount" class="u-input-pay" bind:value={amount} type="text" on:keypress|preventDefault={(e)=>validateAmount(e)} placeholder="Ingrese el monto a retirar">

        </div>
        <div class="gb-process">
            <span>Al solicitar su retiro usted esta aceptando los términos y condiciones</span>
            <button class="u-button-pay" on:click={validateData}>SOLICITAR RETIRO</button>
        </div>
    </div>
    {/if}
    <button class="u-close" on:click={closeModal} >X</button>
</div>

<style>
    :root{
        --button-close-bg:#BD992A;
        --button-close-cl:black;
        --button-close-border-cl:white;
    }
    /**/
    .u-title, .bd, .u-info-retail, .u-info2-retail{
        border-bottom: 1px solid #f7f5f5;
        padding-bottom: 0.5rem;
        font-size: 1.2rem;
    }
    .small-text{
        color: #6c757d!important;
        font-size: .875em;
    }
    .u-info-retail{
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
    }
    .u-info2-retail{
        display: grid;
        grid-template-columns: 40% 60%;
        text-align: center;
        padding-top: 1rem;
        font-weight: bold;
        text-transform: uppercase;
        width: 100%;
    }
    .u-info2-retail p{
        margin:0;
    }
@media only screen and (max-width: 1200px) {
    /*Retirar Saldo sin saldo pendiente*/
    .u-main-payments{
        display: grid;
        grid-template-columns: 80% 9%;
        align-items: flex-start;
        justify-content: center;
        gap: 0.5rem;
        height: 100%;
    }
    .u-close{
        background: var(--button-close-bg);
        color: var(--button-close-cl);
        width: auto;
        text-align: center;
        height:auto;
        font-size: 28px;
        font-weight: 800;
        border: 1px solid var(--button-close-border-cl);
        border-radius: 0.5rem;
        cursor: pointer;
    }
    .u-wrapp-payments{
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        background-color: white;
        border-radius: 0.5rem;
        width: 100%;
        gap: 1rem;
        padding: 0.8rem;
        color: black;
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
    .u-section-code{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap:  0.5rem;
    }
    .u-copyCode{
        border: none;
        cursor: pointer;
        background-color: transparent;
        border-radius: 0.3rem;
    }
    .u-copyCode:hover{
        background-color: rgb(202, 202, 202);
    }
}

@media only screen and (min-width: 1200px) {
    /*Retirar Saldo sin saldo pendiente*/
    .u-main-payments{
        display: grid;
        grid-template-columns: 80% 9%;
        align-items: flex-start;
        justify-content: center;
        gap: 0.5rem;
        height: 100%;
    }
    .u-close{
        background: var(--button-close-bg);
        color: var(--button-close-cl);
        width: auto;
        text-align: center;
        height:auto;
        font-size: 28px;
        font-weight: 800;
        border: 1px solid var(--button-close-border-cl);
        border-radius: 0.5rem;
        cursor: pointer;
    }
    .u-wrapp-payments{
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        background-color: white;
        border-radius: 0.5rem;
        width: 100%;
        gap: 1rem;
        padding: 0.8rem;
        color: black;
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
    .u-section-code{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap:  0.5rem;
    }
    .u-copyCode{
        border: none;
        cursor: pointer;
        background-color: transparent;
        border-radius: 0.3rem;
    }
    .u-copyCode:hover{
        background-color: rgb(202, 202, 202);
    }
}
</style>