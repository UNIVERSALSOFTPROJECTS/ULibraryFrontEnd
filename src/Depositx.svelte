<script>
    import ServerConnection from "./js/server";
    import Notifier from "./Notifier.svelte";
    import util from "./js/util";

    export let open;
    export let user;
    export let onOk;
    export let onError;

    let depositRetailCode = "";
    let active_type_method = "TD";
    let notify = {};

    const closeModal = () => { open = false;}



    const depositRetail = async () => {
        if(!depositRetailCode) {return notify = util.getNotify("error","Ingrese código")}
        try {
            let { data } = await ServerConnection.wallet.depositRetail( user.token, depositRetailCode);
            if (data.resp == "ok") {
                user.balance = data.saldo;
                onOk(data);
            } else onError( data.tipo == "T_NO_ENCONTRADA"? "BAD_CODE": "UNKNOW_ERROR");
        } catch (e) {
            console.log("ERROR", e);
            //e es un JSON que tiene el mensaje de porque no se pudo procesar
            //puedes hacer un IF para mostrar el error de que se trata.
            // alert(`Error al procesar deposito`);
            onError("Error al procesar deposito",e);
        }
    }
    //getPayMethods();
</script>
<Notifier
    bind:display={notify.display}
    bind:message={notify.message}
    bind:type={notify.type}
/>
<div class="u-main-payments">
    <div class="u-wrapp-body">
        <div class="u-headboard">
            <button class="type-method {active_type_method == 'TD'? 'u-type-method': ''}" on:click={() => { active_type_method = "TD";}}>Métodos de pago</button>
            <!--button class="type-method {active_type_method=='TB'?'u-type-method':''}" on:click={()=>{  active_type_method="TB"}}>Transferencias Bancarias</button-->
        </div>

        <div class="u-wrapp-payments">
            <div class="u-wrapp-deposit">
                <p class="u-wrapp-deposit-title"> Ingrese el código de recarga</p>
                <div>
                    <input aria-label="charge-code-txt" class="u-wrapp-deposit-input" type="text" placeholder="Código de recarga" bind:value={depositRetailCode}/>
                    <button class="u-wrapp-deposit-btn" on:click={depositRetail}> Activar</button>
                </div>
                <div>
                    <p> Todos los depósitos serán acreditado a su cuenta en moneda local.</p>
                    <p>
                        Al depositar dinero a su cuenta, usted acepta automáticamente la versión mas reciente de los 
                        <a href="https://assets.apiusoft.com/365fortuna/t&c.pdf" target="_blank" style="color:red;">términos y condiciones</a>
                    </p>
                </div>
                <div>
                    <p class="u-wrapp-deposit-title2">IMPORTANTE</p>
                    <p> Acepto que al enviar el formulario estoy de acuerdo con los términos y condiciones de la Página web</p>
                </div>
            </div>
        </div>
        <!--button class="u-button-pay" on:click={validateData}>DEPOSITAR</button-->
    </div>
    <button class="u-close" on:click={closeModal}>X</button>
</div>

<style>
    button {
        cursor: pointer;
    }
    .u-wrapp-deposit {
        padding: 0.5rem;
    }
    .u-wrapp-deposit-title {
        font-weight: 600;
        font-size: 1rem;
    }
    .u-wrapp-deposit-input {
        height: 2rem;
        border-radius: 0.3rem;
        border: 1px solid #000;
    }
    .u-wrapp-deposit-btn {
        height: 2rem;
        color: #fff;
        border: none;
        background: green;
        border-radius: 5px;
        padding: 0.5rem 1rem;
    }
    .u-wrapp-deposit-title2 {
        color: red;
        font-weight: 600;
        font-size: 0.9rem;
    }
    @media only screen and (max-width: 1200px) {
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

        input:focus-visible {
            outline: 0;
        }
    }
    @media only screen and (min-width: 1200px) {
        .u-wrapp-deposit {
            padding: 1rem;
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

        input:focus-visible {
            outline: 0;
        }
    }
</style>
