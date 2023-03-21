<script>
    import ServerConnection from "./js/server"
    import moment from "moment";

    export let open;
    export let minAmount;
    export let user;
    export let pendingWhitdrawall;

    export let onOk;
    export let onError;

    let amount = "";
    
    const closeModal = () => {
        open = false;
    };
    const setPreview = async(token) => {
        let resp_pending = await ServerConnection.wallet.checkPreviewWithdrawal(token);
        if(resp_pending.data.monto) pendingWhitdrawall = resp_pending.data; // si tiene monto quiere decir que tiene un retiro pendiente
    };
    const duplicateSession=()=>{
        alert("SESION ABIERTA EN OTRO DISPOSITIVO");
        location.reload();
        return ;
    };

    const cashout = async()=>{
        if(!amount) return onError("INVALID_AMOUNT")
        try {
            let resp_withdrawal = null;
            await setPreview(user.token)
            if(!pendingWhitdrawall){
                resp_withdrawal = await ServerConnection.wallet.retailWithdrawal(user.token, amount);
                await setPreview(user.token)
            }
            let { data } = await ServerConnection.user.getBalance(user.agregatorToken);
            user.balance = data.balance
            onOk({type:'withdrawalxok',data:resp_withdrawal?resp_withdrawal:pendingWhitdrawall})
        } catch (e_withdrawal) {
            if(e_withdrawal.response.data.message != 'RET_PEND') onError(e_withdrawal.response.data.message)
            else if(e_pending.response.data.errorCode=='OLD_TOKEN') duplicateSession()
            else onError(e_withdrawal.response.data)
        }
        pendingWhitdrawall=null
    };

    const validateAmount = (event) => {
        let isNumber = /\d/.test(event.key);
        console.log("-========= ",isNumber);
        if(event.charCode === 45 || event.charCode === 43){ event.preventDefault(); return}
        let amountNumber = Number(amount);
        amountNumber += event.key;
        console.log("-========= ",Number(amountNumber));
        if(Number(amountNumber) > minAmount ) event.preventDefault();
        else amount += event.key;
        // if (isNumber && amount.length < amountMin.length) amount += event.key;
        // else if(isNumber && amount.length >= 4) onError("LOW_AMOUNT");
    };

</script>
<div class="u-main-payments">
    {#if pendingWhitdrawall && pendingWhitdrawall.monto>0}
    <div>
        <div class="u-wrapp-payments">
            <span class="u-title bd">RETIRAR SU SALDO</span>
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
        <span class="u-title">RETIRAR SU SALDO</span>
        <div class="u-content-info">
            <span>INGRESE EL MONTO A RETIRAR:</span>
            <input data-testid="amount_input" class="u-input-pay" bind:value={amount} type="text" on:keypress|preventDefault={(e)=>validateAmount(e)} placeholder="Ingrese el monto a retirar">

        </div>
        <div class="gb-process">
            <span>Al solicitar su retiro usted esta aceptando los términos y condiciones</span>
            <button class="u-button-pay" on:click={cashout}>SOLICITAR RETIRO</button>
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


@media only screen and (min-width: 1200px) {
    /*Retirar Saldo sin saldo pendiente*/
    .u-main-payments{
        display: grid;
        grid-template-columns: 30% 3%;
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
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        width: 100%;
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