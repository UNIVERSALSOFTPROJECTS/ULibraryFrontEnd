<script>
  import ServerConnection from "./js/server";
  import Notifier from "./Notifier.svelte";
  import moment from "moment";
  
  export let logoUrl;
  export let open;
  export let user = {};
  export let userType;
  export let multiCurrency=false;
  export let countryCode="+51";
  export let codeAgent=null;
  export let onOk;
  
  let active_currency = "";

  let notify={display:false, message:"",type:"success"};

  let active_section = "user";
  
  let conditions = false;

  const getAge = (birthday) => {
	var now = moment();
	var birthday_ = moment(birthday);
	var years = now.diff(birthday_, 'year');
  return years;
  }

  const welcome = () => {
    closeModal();
    onOk();
  };

  const emailLow = (e) =>{
    user.email = user.email.toLowerCase();
  };

  const register = async () => {
    if( userType=="W" && !codeAgent) return alert("CODIGO AGENTE OBLOGATIRO");
    try {
      if(userType=="W") user.codeAgent=codeAgent;
      let {data} = await ServerConnection.user.register(
        user.username,
        user.name,
        countryCode,
        countryCode+user.phone,
        user.email,
        user.password,
        user.date,
        user.codeAgent,
        user.validateSMS,
        userType,
        active_currency,
      );  
      console.log(data);
      if (data.message == "{resp=Err, Id=1, Msg=El correo o el Usuario ya Exite}" || data.message == "{resp=Err, Id=2, Msg=El correo o el Usuario ya Exite}"){
        active_section = "email";
        return showNotify('error',"Este correo ya esta en uso");
      }else if(data.message == "{resp=Err, Id=1, Msg=Usuario ya Exite}" || data.message == "{resp=Err, Id=2, Msg=Usuario ya Exite}"){
        active_section = "user";
        return showNotify('error',"Este nombre de usuario ay existe");
      }
      else if(data.errorCode=='SMS_CODE_INVALID'){
        active_section = "validateSMS";
        return showNotify('error',"Código SMS incorrecto");
      }else if(data.errorCode=='CREATE_USER_FAILED'){
        active_section = "codeAgent";
        return showNotify('error',"Código de agente incorrecto");
      }
        active_section = "welcome";

    } catch (e) {
      console.log("registermsg",e);
      return showNotify('error',"Error al crear usuario");
    }
  };

  const showNotify = (type, message) => {
    notify={display:true,type,message};
    setTimeout( ()=>{ notify.display=false },4000)
  }

  const closeModal = () => {
    document.body.classList.remove("fixed-scroll");
    open = false;
  }
  const NextStepEnterEmail = (e) => {if (e.charCode === 13) validateEmail();}
  const NextStepEnterName = (e) => {if (e.charCode === 13) validateName();}
  const NextStepEnterUsername = (e) => { if (e.charCode === 13)  validateUsername(); }
  const NextStepEnterPhone = (e) => {if (e.charCode === 13)  validatePhone();}
  const NextStepEnterPassword = (e) => { if (e.charCode === 13) validatePassword();}
  const NextStepEnterDate = (e) => {if (e.charCode === 13) validateDate();}
  const NextStepEnterCodeAgent = (e) => {if (e.charCode === 13) validateCodeAgent();}
  const NextStepEnterValidateSMS = (e) => { if (e.charCode === 13) validateSMS();}
  const NextStepEnterCurrency = (e) => {if (e.charCode === 13) validateCurrency();}
  const NextStepEnterCondition = (e) => {if (e.charCode === 13) validateCondition();}

  const validateSpaceKey = (e) => {
    if (e.charCode === 32) {
      e.preventDefault();
      return showNotify('error',"No se permite espacios en blanco");
    }
  }
  const validateUsername = async (e) => {
    if (!user.username) return showNotify('error',"Ingrese un nombre de usuario"); 
    else if(!/^[A-Za-z0-9_]+$/.test(user.username)) return showNotify('error',"Sólo letras, números y guión bajo")
    
    active_section = "name";
  }

  const validateName = () => {
    if (!user.name) return showNotify('error',"Ingrese nombre y apellidos");
    if(multiCurrency) active_section = "currency";
    else {active_section = "phone"}
  }

  function phoneOnlyNumber(event) {
    user.phone=user.phone||'';
    if (/\d/.test(event.key) && user.phone.length < 9) user.phone += event.key;
  }

  const validatePhone = () => {
    if (!user.phone) return showNotify('error',"Ingrese su numero de telefono");
    else if(user.phone.length <6) return showNotify('error',"Telefono mayor a 6 digitos");
    active_section = "email";
  };

  const validateEmail = async () => {
    let isEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(user.email);
    if(!user.email)  return showNotify('error',"Ingrese un correo"); 
    if(!isEmail) return showNotify('error',"Formato de email incorrecto"); 
    active_section = "password";
  };

  const validatePassword = () => {
    if (!user.password) return showNotify('error',"Ingrese una contraseña"); 
    else if (user.password.length < 6) return showNotify('error',"Minimo 6 caracteres");
    active_section = "date";
  };

  const validateDate = () => {
    if (!user.date) return showNotify('error',"Ingrese su fecha de nacimiento");
    if(getAge(user.date) < 18) return showNotify('error',"Debe ser mayor de edad");
    active_section = userType=="X"?"codeAgent":"validateSMS";
    if( userType=="W" ){ preRegister() }
  };

  const preRegister=async()=>{
    try {
      await ServerConnection.user.preRegister(user.username,user.email,countryCode+user.phone);
      active_section = "validateSMS";
    } catch (e) {
      console.log("error: ",e);
      let messagge = "Error desconocido en Preregistro";
      if(e.response.data.message=='PHONE_FORMAT_FAILED'){
        active_section = "phone";
        messagge="Formato Telefono incorrecto";
      } 
      else if(e.response.data.message=='El telefono ya existe'){
        active_section = "phone";
        messagge=e.response.data.message;
      }
      else if(e.response.data.message=='El usuario  ya existe'){
        active_section = "user";
        messagge=e.response.data.message;
      }else if(e=="ORG_MANDATORY"){
        messagge="ORG es obligatorio";
      }
      else if(e.response.data.message=='El usuario u correo ya existe'){
        active_section = "email";
        messagge=e.response.data.message;
      }

      return showNotify('error',messagge); 
     
    }
  }

  const validateCodeAgent = async() => {
    if (!user.codeAgent) return showNotify('error',"Ingrese el codigo de agente");
    preRegister();
  };
  const validateSMS = () => {
    if (!user.validateSMS) return showNotify('error',"Ingrese el codogo SMS");
    active_section = "conditions"
  };

  const validateCurrency = () => {
    if (!active_currency) return showNotify('error',"Escoja una moneda");
    active_section = "phone";
  };

  const validateCondition = () => {
    if (!conditions) return showNotify('error',"Acepte los términos y condiciones");
    register();
  };

</script>

<div class="u-main-content-general">
  <div class="u-content-logo">
    <img class="logo" src="{logoUrl}" alt="" />
  </div>
  <div class="u-main-general">
    <div class="u-content-info">
      <div class="u-info">
        <div class="u-text-title">
          <span>Pagamos tus Ganancias</span>
          <span>con la velcidad de la luz</span>
        </div>
        <div class="u-wrapp-progress">
          <div class="progress vertical">
            <div class="u-circle u-star {user.username ? 'u-category-select' : ''}" />
            <label class="form-check-label" for="flexCheckDefault"
              >Nombre de usuario</label
            >
          </div>
          <div class="progress vertical">
            <div
              class="u-circle {user.name ? 'u-category-select' : ''}"
            />
            <label class="form-check-label" for="flexCheckDefault"
              >Nombre y apellidos</label
            >
          </div>
          {#if multiCurrency}
          <div class="progress vertical">
            <div
              class="u-circle {active_currency ? 'u-category-select' : ''}"
            />
            <label class="form-check-label" for="flexCheckDefault"
              >Establece tu moneda</label
            >
          </div>
          {/if}
          <div class="progress vertical">
            <div
              class="u-circle {user.phone ? 'u-category-select' : ''}"
            />
            <label class="form-check-label" for="flexCheckDefault"
              >Número de télefono</label
            >
          </div>
          <div class="progress vertical">
            <div
              class="u-circle {user.email ? 'u-category-select' : ''}"
            />
            <label class="form-check-label" for="flexCheckDefault"
              >Ingresa tu correo</label
            >
          </div>

          <div class="progress vertical">
            <div class="u-circle {user.password ? 'u-category-select' : ''}" />
            <label class="form-check-label" for="flexCheckDefault"
              >Crea tu contraseña</label
            >
          </div>
          <div class="progress vertical">
            <div
              class="u-circle {user.date ? 'u-category-select' : ''}"
            />
            <label class="form-check-label" for="flexCheckDefault"
              >Fecha de nacimiento</label
            >
          </div>
          {#if userType=="X"}
          <div class="progress vertical">
            <div
              class="u-circle {user.codeAgent ? 'u-category-select' : ''}"
            />
            <label class="form-check-label" for="flexCheckDefault"
              >Código de Agente</label
            >
          </div>
          {/if}
          <div class="progress vertical">
            <div
              class="u-circle {user.validateSMS ? 'u-category-select' : ''}"
            />
            <label class="form-check-label" for="flexCheckDefault"
              >Validación SMS</label
            >
          </div>
          
          <div class="progress vertical">
            <div
              class="u-circle {conditions == true ? 'u-category-select' : ''}"
            />
            <label class="form-check-label" for="flexCheckDefault"
              >Términos y condiciones</label
            >
          </div>
          <div class="progress vertical">
            <div class="u-circle-final {active_section == 'welcome' ? 'u-category-select-final': ''}"/>
            <label class="form-check-label" for="flexCheckDefault"
              >Bienvenido</label>
          </div>
        </div>
      </div>
        {#if active_section == "user"}
        <!--Componente de user-->
        <div class="u-date-new">
          <div class="u-header">
            <span>NOMBRE DE USUARIO</span>
          </div>
          <div class="u-body">
            <input
              class="u-input-email"
              type="text"
              maxlength="20"
              bind:value={user.username}
              on:keypress={NextStepEnterUsername}
              on:keypress={validateSpaceKey}
              placeholder="Crear nombre de usuario"
              />
            <span>El nombre de usuario es obligatorio</span>
            <span>Ejemplo: G4nadorDea</span>
            <span>Máximo 20 caracteres</span>
          </div>
          <div class="u-button-control">
            <button
              class="u-button {user.username ? 'u-active-button' : ''}"
              on:click={validateUsername} >CONTINUAR</button
            >
          </div>
        </div>
        <!--Fin de componente user-->
      {/if}
      {#if active_section == "name"}
        <!--Componente de user-->
        <div class="u-date-new">
          <div class="u-header">
            <span>NOMBRE Y APELLIDOS</span>
          </div>
          <div class="u-body">
            <input
              class="u-input-email"
              type="text"
              bind:value={user.name}
              on:keypress={NextStepEnterName}
              placeholder="Ingrese nombre y apellidos"
              />
            <span>El nombre y apellidos obligatorio</span>
          </div>
          <div class="u-button-control">
            <button
              class="u-button {user.name ? 'u-active-button' : ''}"
              on:click={validateName} >CONTINUAR</button
            >
          </div>
        </div>
        <!--Fin de componente user-->
      {/if}
      {#if active_section == "phone"}
        <!--Componente de user-->
        <div class="u-date-new">
          <div class="u-header">
            <span>NUMERO DE TELEFONO</span>
          </div>
          <div class="u-body">
            <div style="display:flex;align-items: flex-end;">
              <div class="u-input-email" style="margin-right:0.5rem;color:#909090">{countryCode}</div>
              <input
                class="u-input-email"
                bind:value={user.phone}
                on:keypress|preventDefault={(e)=>phoneOnlyNumber(e)}
                on:keypress={NextStepEnterPhone}
                placeholder="Ingrese número de teléfono"
                maxlength="10"
                />
            </div>
            <span>El número celular es obligatorio</span>
          </div>
          <div class="u-button-control">
            <button
              class="u-button {user.phone ? 'u-active-button' : ''}"
              on:click={validatePhone} >CONTINUAR</button
            >
          </div>
        </div>
        <!--Fin de componente user-->
      {/if}
      {#if active_section == "email"}
        <!--Componente de correo-->
        <div class="u-date-new">
          <div class="u-header"><span>CORREO ELECTRONICO</span></div>
          <div class="u-body">
            <input
              class="u-input-email"
              type="email"
              maxlength="30"
              bind:value={user.email}
              on:keypress={NextStepEnterEmail}
              on:keypress={validateSpaceKey}
              on:input={emailLow}
              placeholder="Ingrese su correo electrónico"
            />
            <span>El correo electrónico es obligatorio</span>
            <span>Ejemplo: usuario44@gmail.com</span>
            <span>Máximo 30 caracteres</span>
          </div>
          <div class="u-button-control">
            <button
              class="u-button {user.email ? 'u-active-button' : ''}"
              on:click={validateEmail}
            >
              CONTINUAR</button
            >
          </div>
        </div>
        <!--Fin de componente correo-->
      {/if}
      {#if active_section == "password"}
        <!--Componente de contraseña-->
        <div class="u-date-new">
          <div class="u-header">
            <span>CONTRASEÑA</span>
          </div>
          <div class="u-body">
            <input
              class="u-input-email"
              type="password"
              maxlength="20"
              bind:value={user.password}
              on:keypress={NextStepEnterPassword}
              on:keypress={validateSpaceKey}
              placeholder="Contraseña"
            />
            <span>La contraseña es obligatoria</span>
            <span>Minimo 6 caracteres</span>
            <span>Máximo 15 caracteres</span>
          </div>
          <div class="u-button-control">
            <button
              class="u-button {user.password ? 'u-active-button' : ''}"
              on:click={validatePassword}>CONTINUAR</button
            >
          </div>
        </div>
        <!--Fin de componente contraseña-->
      {/if}

      {#if active_section == "date"}
        <!--Componente de correo-->
        <div class="u-date-new">
          <div class="u-header"><span>FECHA DE NACIMIENTO</span></div>
          <div class="u-body" style="width: 386px;align-items: center;">
            <input
              class="u-input-email"
              type="date"
              bind:value={user.date}
              on:keypress={NextStepEnterDate}
              placeholder="Ingresa tu fecha de nacimiento"
            />

          </div>
          <div class="u-button-control">
            <button
              class="u-button {user.date ? 'u-active-button' : ''}"
              on:click={validateDate}
            >
              CONTINUAR</button
            >
          </div>
        </div>
        <!--Fin de componente correo-->
      {/if}
      {#if userType=="X" && active_section == "codeAgent"}
        <!--Componente de user-->
        <div class="u-date-new">
          <div class="u-header">
            <span>CODIGO DE AGENTE</span>
          </div>
          <div class="u-body">
              <input
                class="u-input-email"
                type="number"
                maxlength="8"
                bind:value={user.codeAgent}
                on:keypress={NextStepEnterCodeAgent}
                placeholder="Ingresar código de agente"
                />
            <span>El código de agente es obligatorio</span>
          </div>
          <div class="u-button-control">
            <button
              class="u-button {user.codeAgent ? 'u-active-button' : ''}"
              on:click={validateCodeAgent} >CONTINUAR</button
            >
          </div>
        </div>
        <!--Fin de componente user-->
      {/if}
      {#if active_section == "validateSMS"}
      <!--Componente de user-->
      <div class="u-date-new">
        <div class="u-header">
          <span>VALIDACION SMS</span>
        </div>
        <div class="u-body">
            <input
              class="u-input-email"
              type="number"
              maxlength="6"
              bind:value={user.validateSMS}
              on:keypress={NextStepEnterValidateSMS}
              placeholder="Ingresar código SMS"
              />
          <span>El código SMS es obligatorio</span>
        </div>
        <div class="u-button-control">
          <button 
            class="u-button {user.validateSMS ? 'u-active-button' : ''}"
            on:click={validateSMS} >CONTINUAR</button
          >
        </div>
      </div>
      <!--Fin de componente user-->
    {/if}

    {#if active_section == "currency"}
        <!--Componente de moneda-->
        <div class="u-date-new">
          <div class="u-header">
            <span>ESTABLECER MONEDA</span>
          </div>
          <div class="u-body u-currency">
            <span>Monedas sugeridas</span>
            <div class="u-coins" on:keypress={NextStepEnterCurrency}>
              <button
                class="u-button-coins {active_currency == '3'
                  ? 'u-opt-select'
                  : ''}"
                on:click={() => {
                  active_currency = "3";
                }}>USD</button
              >
              <button class="u-button-coins {active_currency == '9'? 'u-opt-select': ''}"on:click={() => {active_currency = "9";}}>PEN</button>
            </div>
          </div>
          <div class="u-button-control">
            <button
              class="u-button {active_currency ? 'u-active-button' : ''}"
              on:click={validateCurrency}>CONTINUAR</button
            >
          </div>
        </div>
        <!--Fin de componente moneda-->
      {/if}

      {#if active_section == "conditions"}
        <!--Componente terminos-->
        <div class="u-date-new">
          <div class="u-header">
            <span>CONFIRMAR TÉRMINOS Y CONDICIONES</span>
          </div>
          <div class="u-terms-and-conditions">
            <input
              class="form-check-input"
              type="checkbox"
              bind:checked={conditions}
              on:keypress={NextStepEnterCondition}
            />
            <span
              >Para convertirme en cliente, acepto los términos y condiciones</span
            >
          </div>
          <div class="u-button-control">
            <button
              class="u-button {conditions == true ? 'u-active-button' : ''}"
              on:click={validateCondition}>ACEPTAR Y REGISTRAR</button
            >
          </div>
        </div>
        <!--Fin de componente terminos-->
      {/if}
      {#if active_section == "welcome"}
        <!--Componente welcome-->
        <div class="u-date-new">
          <div class="u-header">
            <span>BIENVENID@ A LA PLATAFORMA</span>
          </div>
          <div class="u-welcome">
            <span>¡BIENVENID@!</span>
            <span>{user.username}</span>
          </div>
          <div class="u-button-control">
            <button class="u-button u-active-button" on:click={welcome}
              >BIENVENID@!</button
            >
          </div>
        </div>
        <!--Fin de componente welcomw-->
      {/if}
    </div>
    <div class="u-button-close">
      <button class="u-close" on:click={closeModal}>X</button>
    </div>
  </div>
</div>

<Notifier bind:display={notify.display} bind:message={notify.message} bind:type={notify.type}/>

<style>
  .u-wrapp-progress { color:white;}
  @media only screen and (max-width: 1200px) {
    .u-content-logo {
      display: none;
    }
    input:focus-visible {
      outline: 0;
    }
    .u-main-general {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
    .u-content-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .u-info {
      display: none;
    }
    .u-text-title {
      display: flex;
      flex-direction: column;
      color: #f1bf00;
      font-weight: 300;
      font-family: montserrat;
      font-size: 0.8rem;
      width: 7rem;
    }
    .u-date-new {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: rgb(255, 255, 255);
      height: 100%;
      padding-bottom: 1rem;
      width: 100%;
      border-bottom-left-radius: 0.5rem;
      border-top-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      margin-top: 1.5rem;
    }
    .u-header {
      display: flex;
      justify-content: center;
      background-color: #dcd9d9;
      width: 95%;
      border-top-right-radius: 0.5rem;
      border-top-left-radius: 0.5rem;
      padding: 0.5rem;
      color: black;
    }
    .u-body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      height: 40%;
      width: 90%;
    }
    .u-currency {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      height: 100%;
      gap: 1rem;
    }
    .u-terms-and-conditions {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      height: 100%;
      text-align: center;
      color: black;
    }
    .u-welcome {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      height: 100%;
      font-size: 1rem;
      font-weight: 700;
      text-align: center;
      color: rgb(122, 122, 122);
    }
    .u-coins {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 3rem;
      gap: 1rem;
    }
    .u-button-coins {
      background-color: #f1f6f9;
      border: none;
      height: 100%;
      width: 6rem;
    }
    .u-body span {
      color: #9a9797;
      font-size: 0.5rem;
    }
    .u-input-email {
      height: 2rem;
      margin-bottom: 0.5rem;
      border: none;
      font-size: 1rem;
      letter-spacing: -1px;
      border-bottom: 1px solid #727272;
    }

    .logo {
      position: absolute;
      left: 40%;
      top: -20%;
      width: 120px;
      height: 80px;
    }
    .u-button-control {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .u-button {
      width: 40%;
      border: none;
      height: 2rem;
      border-radius: 0.2rem;
      background-color: #f1bf00;
      color: black;
      font-weight: 700;
      cursor: pointer;
    }
    .u-button-close {
      position: absolute;
      left: 90%;
      top: 2%;
    }
    .u-close {
      text-align: center;
      border: none;
      background: #BD992A;
    color: black;
    width: 24px;
    height: 27px;
    font-size: 28px;
    font-weight: 800;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 2px;
      cursor: pointer;
    }
    .u-opt-select {
      background-color: #f1bf00;
    }
    .u-category-select {
      background-color: white;
    }
    .u-category-select-final {
      background-color: rgb(231, 238, 28);
    }
  }
  @media only screen and (min-width: 1200px) {
    input:focus-visible {
      outline: 0;
    }
    .u-main-content-general {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .u-main-general {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
    .u-content-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 60vh;
      margin-top: 1rem;
    }
    .u-info {
      background-color: black;
      width: 80%;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
      border-bottom-left-radius: 0.5rem;
      border-top-left-radius: 0.5rem;
    }
    .progress {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .u-circle {
      width: 25px;
      height: 25px;
      border-radius: 1rem;
      border: 1px solid white;
    }
    .u-star {
      background-color: white;
    }
    .u-circle-final {
      width: 25px;
      height: 25px;
      border-radius: 1rem;
      border: 1px solid #f1bf00;
    }
    .u-text-title {
      display: flex;
      flex-direction: column;
      color: #f1bf00;
      font-weight: 600;
      font-family: montserrat;
    }
    .u-date-new {
      display: flex;
      flex-direction: column;
      background-color: rgb(255, 255, 255);
      width: 100%;
      height: 103%;
      padding-bottom: 1rem;
      border-bottom-right-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }
    .u-header {
      display: flex;
      justify-content: center;
      background-color: #dcd9d9;
      padding: 0.5rem;
      font-weight: 700;
      color: black;
      border-top-right-radius: 0.5rem;
    }
    .u-body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 1rem;
      height: 100%;
    }
    .u-currency {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      height: 100%;
      gap: 1rem;
    }
    .u-terms-and-conditions {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      height: 100%;
      text-align: center;
      color: black;
    }
    .u-welcome {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      height: 100%;
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      color: rgb(122, 122, 122);
    }
    .u-coins {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 80%;
      height: 3rem;
      gap: 1rem;
    }
    .u-button-coins {
      background-color: #f1f6f9;
      border: none;
      height: 100%;
      width: 6rem;
      border-radius: 0.3rem;
    }
    .u-body span {
      color: #9a9797;
      font-size: 1rem;
    }
    .u-input-email {
      height: 2.5rem;
      margin-bottom: 1rem;
      border: none;
      font-size: 1.5rem;
      letter-spacing: -1px;
      border-bottom: 1px solid #727272;
      font-weight: 800;
    }
    .u-content-logo {
      width: 200px;
      height: 120px;
    }
    .logo {
      width: 100%;
      height: 100%;
    }
    .u-wrapp-progress {
      font-size: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      height: 100%;
      gap: 0.5rem;
    }

    .u-button-control {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .u-button {
      width: 90%;
      border: none;
      height: 2rem;
      border-radius: 0.2rem;
      background-color: white;
      color: black;
      font-weight: 700;
      cursor: pointer;
    }
    .u-active-button {
      background-color: #f1bf00;
    }
    .u-close {
      margin-left: 0.5rem;
      text-align: center;
      border: none;
      background: #BD992A;
    color: black;
    width: 24px;
    height: 27px;
    font-size: 28px;
    font-weight: 800;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 2px;
      cursor: pointer;
    }
    .u-opt-select {
      background-color: #f1bf00;
    }
    .u-category-select {
      background-color: white;
    }
    .u-category-select-final {
      background-color: rgb(231, 238, 28);
    }
  }
</style>
