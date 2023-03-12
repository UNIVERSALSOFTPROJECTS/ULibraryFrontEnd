<script>
    import ServerConnection from "./js/server"
    import notify from './js/notify'
    import moment from "moment";

    export let open;
    export let user;
    export let pendingWhitdrawall;

    export let onWithdrawalxOk;
    export let onWithdrawalxError;

    let amount = "";
    
    const closeModal = () => {
        open = false;
    };

    const cashout = async()=>{
        try {
            let resp_withdrawal = null;
            let resp_pending=null;

            try {
                resp_withdrawal = await ServerConnection.wallet.retailWithdrawal(user.token, amount);
                onWithdrawalxOk({type:'withdrawalxok',data:resp_withdrawal})
            } catch (e_withdrawal) {
                if(e_withdrawal.response.data.message != 'RET_PEND') notify.error(e_withdrawal.response.data.message)
                onWithdrawalxError({type:'withdrawalxerror',data:e_withdrawal.response.data})
            }
            try {
                resp_pending = await ServerConnection.wallet.checkPreviewWithdrawal(user.token);
                onWithdrawalxOk({type:'preview_withdrawalxok',data:resp_pending.data})
                if(resp_pending.data.monto) pendingWhitdrawall = resp_pending.data; // si tiene monto quiere decir que tiene un retiro pendiente
            } catch (e_pending) {
                if(e_pending.response.data.errorCode=='OLD_TOKEN') ServerConnection.wallet.duplicateSession();
                onWithdrawalxError({type:'preview_withdrawalxerror',data:e_pending.response.data})
            }
            let resp_blc  = await ServerConnection.user.getBalance(user.agregatorToken);
            onWithdrawalxOk({type:'balance_withdrawalxok',data:resp_blc.data})
            user.balance = resp_blc.data.balance
        } catch (e) {
            e =error.response.data;
            let msg = "Error al hacer retiro";
            if(e.errorCode && e.errorCode != 'OLD_TOKEN') msg = e.message
            else ServerConnection.wallet.duplicateSession();
            notify.error(msg)
            pendingWhitdrawall = null;
        }
    };

    const validateAmount = (event) => {
        let isNumber = /\d/.test(event.key);
        if(event.charCode === 45 || event.charCode === 43){ event.preventDefault(); return}
        let amountNumber = Number(amount);
        amountNumber += event.key;
        if(amountNumber > 2000 ) event.preventDefault();
        if (isNumber && amount.length < 4) amount += event.key;
        else if(isNumber && amount.length >= 4) notify.error("El monto no debe exceder los 2000");
    };

    const validateData = async() =>{
        if(!amount) notify.error("Ingrese el monto a retirar") 
        await cashout();
    }

</script>
<div class="u-main-payments">
    {#if pendingWhitdrawall && pendingWhitdrawall.monto>0}
    <div>
        <div class="u-wrapp-payments">
            <h2 class="w-100 u-title bd">RETIRAR SU SALDO</h2>
            <div class="u-info-retail">
                <div>Usuario :  <span>{user.username}</span></div>
                <div>ID: <span>{user.code}</span></div>   
                <div>Date: <span>{ moment.unix(pendingWhitdrawall.efecha).format("DD/MM/YYYY")}</span></div>   
                <div>Temps: <span>{moment.unix(pendingWhitdrawall.efecha).format("HH:mm")}</span></div>   
            </div>
            <div class="u-info2-retail">
                <p>Código:</p>
                <span>{pendingWhitdrawall.codigo}</span>
                <p>Cantidad:</p>export
                <span>{pendingWhitdrawall.monto}</span>
            </div>
            <div class="w-100">Acercate a nuestras sucursales, para proceder con el retiro.</div>
            <div class="w-100 small-text">Nota: No es necesario imprimir este ticket, solo debe identificar su usuario junto con el código de referencia</div>
        </div>
    </div>

    {:else}

    <div class="u-wrapp-payments">
        <h2 class="u-title">RETIRAR SU SALDO</h2>
        <div class="u-content-info">
            <span>INGRESE EL MONTO A RETIRAR:</span>
            <input class="u-input-pay" bind:value={amount} type="text" on:keypress|preventDefault={(e)=>validateAmount(e)} placeholder="Ingrese el monto">

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
    .u-title.bd, .u-info-retail, .u-info2-retail{
        border-bottom: 1px solid #6d6d6d;
        padding-bottom: 0.5rem;
    }
    .small-text{
        color: #6c757d!important;
        font-size: .875em;
    }
    .w-100{
        width: 100%;
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
        width: auto;
        height: 95%;
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