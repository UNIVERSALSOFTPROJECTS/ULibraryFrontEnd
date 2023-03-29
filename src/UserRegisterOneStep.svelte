<script>
  import ServerConnection from "./js/server";
  import Notifier from "./Notifier.svelte";
  import util from "./js/util";
  import DateThreeSelect from "./Date3Select.svelte";
  export let user = {};
  export let currencies;
  export let platform;
  export let userType;
  export let countryCodes;

  let active_currency = "";
  let active_section="register";
  let confirmPassword;
  let agentCodeOne = "";
  let agentCodeTwo = "";
  user.agentCodeTotal = "";
  let notify = { display: false, message: "", type: "success" };

  const CURRENCIES_ = { USD: 3, PEN: 9, ARS: 18 };
  const showNotify = (type, message) => {
    notify = { display: true, type, message };
    setTimeout(() => {
      notify.display = false;
    }, 4000);
  };

  const validateName = (e) => {
    if (! /^[A-Za-zúéáíóüÜÑñÓÍÚÁÉ ]*$/.test(e.key)) {
      e.preventDefault();
      return showNotify("error", "Sólo letras en mayúscula o minúscula");
    }
  };

  const validateUsername = (e) => {
    if (! /^[A-Za-z0-9úéáíóüÜÑñÓÍÚÁÉ_ ]*$/.test(e.key)) {
      e.preventDefault();
      return showNotify("error", "Sólo letras, números y guión bajo");
    }
  };

  const phoneOnlyNumber = (event) => {
    user.phone = user.phone || "";
    if (/\d/.test(event.key) && user.phone.length < 10) user.phone += event.key;
  };

  const emailLow = () => {
    user.email = user.email.toLowerCase();
  };

  const validateEmail = (e) => {
    if (/^[!#$%^&*ºª´¿()+,=/¡'?"`¨¨€´´:´´~~¬·¨¨{}çÇ|<>]*$/.test(e.key)) e.preventDefault();
  };

  const validateCodeAgent = (e) => {
    console.log("1:", agentCodeOne, "2:", agentCodeTwo, "tOTAL:", user.agentCodeTotal);
    let isNumber = /\d/.test(e.key);
    if (isNumber && agentCodeOne.length < 4) {agentCodeOne += e.key; user.agentCodeTotal = agentCodeOne; return;}
    if (isNumber && agentCodeTwo.length < 4) {agentCodeTwo += e.key; user.agentCodeTotal = agentCodeOne + agentCodeTwo; return;}
  };

  const validateSpaceKey = (e) => {
    if (e.charCode === 32) {
      e.preventDefault();
      return showNotify("error", "No se permiten espacios en blanco");
    }
  };

  const preRegister = async () => {
    if(user.agentCodeTotal == "")  return showNotify("error", "Ingrese el código de agente");
    if (!currencies.length) return showNotify("error", "Moneda no definida");
    if(!countryCodes.length)  return showNotify("error", "Codigo pais no definido");
    if(!platform)  return showNotify("error", "Platform no defindo");
    if (countryCodes.length == 1) user.countryCode = countryCodes[0];
    let element = "sms-code";
    try {
      await ServerConnection.user.preRegister(
        user.username,
        user.email,
        user.countryCode + user.phone,
        platform
      );
      active_section = "validateSMS";
      setTimeout( ()=>{document.getElementById(element).focus();}, 1000);
    } catch (e) {
      console.log("error: ", e);
      let messagge = "Error desconocido en Preregistro";
      if (e.response.data.message == "PHONE_FORMAT_FAILED") {
        element = "phone";
        messagge = "Formato Telefono incorrecto";
      } else if (e.response.data.message == "El telefono ya existe") {
        element = "phone";
        messagge = e.response.data.message;
      } else if (e.response.data.message == "El usuario  ya existe") {
        element = "username";
        messagge = "El nombre de usuario ya existe";
      } else if (e == "ORG_MANDATORY") {
        messagge = "ORG es obligatorio";
      } else if (e.response.data.message == "El usuario u correo ya existe") {
        element = "email";
        messagge = "El correo ya existe";
      }
      document.getElementById(element).focus();
      return showNotify("error", messagge);
    }
  };


  const register = async () => {
    
    if (currencies.length == 1) active_currency = currencies[0].code;
    
    try {

      let {data} = await ServerConnection.user.register(
        user.username,
        user.name,
        user.countryCode,
        user.countryCode + user.phone,
        user.email,
        user.password,
        user.birthday,
        user.agentCodeTotal,
        user.validateSMS,
        userType,
        platform,
        CURRENCIES_[active_currency]
      );
      
    } catch (e) {
      let error = e.response.data || e.message;
      let messageText = "Error al crear usuario";
      
      if ( error.message && /El correo o el Usuario ya Exite/.test(error.message) ) {
        messageText = "Este correo ya está en uso"
      } else if ( error.message && /Usuario ya Exite/.test(error.message) ){ 
        messageText = "Este nombre de usuario ya existe"
      }else if (error.message && /No existe ese id de grupo/.test(error.message) ) {
        messageText = "Codigo de agente incorrecto";
      }
      active_section = "register";

      showNotify("error", messageText);
    }
  };

  const validateData = () => {
    if (!user.name || user.name === "") return showNotify("error", "Ingrese su nombre");
    if (!user.username || user.username === "") return showNotify("error", "Ingrese su nombre de usuario");
    if (!user.phone || user.phone === "") return showNotify("error", "Ingrese su teléfono");
    if (!user.email || user.email === "") return showNotify("error", "Ingrese su correo electrónico");
    if (! /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(user.email)) return showNotify("error", "Formato de e-mail incorrecto");
    if (!user.password || user.password === "") return showNotify("error", "Ingrese su contraseña");
    if (!confirmPassword || confirmPassword === "") return showNotify("error", "Confirme la contraseña");
    if (user.password != confirmPassword) return showNotify("error", "La contraseña no coincide con la confirmación");
    if (!user.birthday || user.birthday === "") return showNotify("error", "Ingrese su fecha de nacimiento");
    preRegister();
  };

</script>

<div class="u-main-conteiner">
  <div class="u-modal-register-header">
    <span class="u-register-title">REGISTRARSE</span>
  </div>

  {#if active_section == "register"}

  <div class="u-modal-register-body">
    <div class="u-item-register">
      <span>NOMBRE COMPLETO</span>
      <input
        type="text"
        maxlength="30"
        bind:value={user.name}
        on:keydown={validateName}
        placeholder="ingrese su nombre"
      />
    </div>
    <div class="u-item-register">
      <span>NOMBRE DE USUARIO</span>
      <input
        type="text"
        id="username"
        maxlength="20"
        bind:value={user.username}
        on:keypress={validateUsername}
        placeholder=" Ingrese su nombre de usuario"
      />
    </div>
    <div class="u-item-register">
      <span>TELÉFONO</span>
      <input
        type="text"
        id="phone"
        bind:value={user.phone}
        on:keypress|preventDefault={(e) => phoneOnlyNumber(e)}
        placeholder="Ingrese su número de teléfono"
      />
    </div>
    <div class="u-item-register">
      <span>CORREO ELECTRÓNICO</span>
      <input
        type="email"
        id="email"
        maxlength="30"
        bind:value={user.email}
        on:input={emailLow}
        on:keypress={validateSpaceKey}
        on:keypress={validateEmail}
        placeholder="Ingrese su correo (ejemplo: alguien@gmail.com)"
      />
    </div>
    <div class="u-item-register">
      <span>CONTRASEÑA</span>
      <input
        type="password"
        maxlength="20"
        bind:value={user.password}
        autocomplete="off"
        on:keypress={validateSpaceKey}
        placeholder="Ingrese su contraseña"
      />
    </div>
    <div class="u-item-register">
      <span>CONFIRMACIÓN DE CONTRASEÑA</span>
      <input
        type="password"
        bind:value={confirmPassword}
        on:keypress={validateSpaceKey}
        placeholder="Ingrese nuevamente su contraseña"
      />
    </div>
    <div class="u-item-register">
      <span>FECHA DE NACIMIENTO</span>
      <DateThreeSelect bind:dateString={user.birthday} />
    </div>
    <div class="u-item-register">
      <span>CODIGO DE AGENTE</span>
      <div class="u-section-code-agent">
        <input
          id="agentCode"
          type="text"
          bind:value={agentCodeOne}
          on:keypress|preventDefault={validateCodeAgent}
        />
        -
        <input
          type="text"
          bind:value={agentCodeTwo}
          on:keypress|preventDefault={validateCodeAgent}
        />
      </div>
    </div>
  </div>
  <div class="u-modal-footer">
    <button class="u-btn-register" on:click={validateData}>REGISTRAR</button>
  </div>

  {:else if active_section == "validateSMS"}
  <div class="u-item-register">
    <span>VALIDACION SMS</span>
    <div class="u-section-code-agent">
      <input
        id="sms-code"
        type="text"
        bind:value={user.validateSMS}
      />
    </div>

    <div class="u-modal-footer">
      <button class="u-btn-register" on:click={register}>CONFIRMAR SMS</button>
    </div>

  </div>
  {/if}

</div>
<Notifier
  bind:display={notify.display}
  bind:message={notify.message}
  bind:type={notify.type}
/>

<style>
  :root{
    --u-userregister-onestep-bg-menu: var(--universal-userregister-onestep-bg-menu,linear-gradient(50deg, #51256b, #110f49));
    --u-userregister-mydata-botton: var( --universal-userregister-mydata-botton, #6c1e98 ) ;
    --u-userregister-stepletter-color: var(--universal-userregister-stepletter-color,#fff) ;
}
  @media only screen and (max-width: 1200px) {
    .u-main-conteiner {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      background: var(--u-userregister-onestep-bg-menu);
      border-radius: 0.5rem;
    }
    .u-modal-register-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    input {
      width: 95%;
      height: 1.5rem;
    }
    input:focus {
      outline: 0;
    }
    .u-register-title {
      font-weight: 800;
    }
    .u-item-register {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .u-modal-footer {
      display: flex;
      justify-content: end;
    }
    .u-btn-register {
      border: none;
      background-color: var(--u-userregister-mydata-botton);
      color: var(--u-userregister-stepletter-color);
      height: 2rem;
      border-radius: 0.3rem;
    }
    span{
      color: var(--u-userregister-stepletter-color);
    }
  }
  /*Estilo Desktop*/

  @media only screen and (min-width: 1200px) {
    .u-main-conteiner {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 1rem;
      background: var(--u-userregister-onestep-bg-menu);
    }
    .u-modal-register-body {
      display: grid;
      grid-template-columns: 49% 49%;
      gap: 1rem;
    }
    input {
      width: 95%;
      height: 2rem;
      border-radius: 0.4rem;
    }
    .u-section-code-agent {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: end;
    }
    input:focus {
      outline: 0;
    }
    .u-register-title {
      font-weight: 800;
    }
    .u-item-register {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .u-modal-footer {
      display: flex;
      justify-content: end;
    }
    .u-btn-register {
      border: none;
      background-color: var(--u-userregister-mydata-botton);
      color: var(--u-userregister-stepletter-color);
      height: 2rem;
      border-radius: 0.3rem;
    }
    span{
      color: var(--u-userregister-stepletter-color);
    }
  }
</style>
