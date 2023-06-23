<script>
  import ServerConnection from "./js/server";
  import Notifier from "./Notifier.svelte";
  import { onMount } from "svelte";
  import DateThreeSelect from "./Date3Select.svelte";
  //import moment from "moment";
  import momentx from "moment";
  let moment;
  if (!momentx) moment = require("moment");
  else moment = momentx;

  export let dateString = null; //YYYY-MM-DD
  export let logoUrl;
  export let open;
  export let user = {};
  export let userType;
  export let countryCodes;
  export let onOk;
  export let onError;
  export let currencies;
  export let platform;
  //TODO: cargar todas las menedas.
  const CURRENCIES_ = { USD: 3, PEN: 9, ARS: 18 };

  let active_currency = "";
  let notify = { display: false, message: "", type: "success" };
  let active_section = "user";
  let conditions = false;
  let days = [];
  let months = [""];
  let years = [];
  let monthSelected = 1;
  let yearSelected = null;
  let daySelected = 1;
  let currentYear = null;
  let adultYear = null;
  let maxYear = null;

  const getAge = (birthday) => {
    var now = moment();
    var birthday_ = moment(birthday);
    var years = now.diff(birthday_, "year");
    return years;
  };
  const onChangeDate = (mode) => {
    let daysOfMonth = moment(
      `${yearSelected}-${monthSelected}-01`
    ).daysInMonth();
    days = [];
    for (let i = 1; i <= daysOfMonth; i++) {
      days.push(i);
    }
    if (mode != "first") {
      dateString = moment(
        `${yearSelected}-${monthSelected}-${daySelected}`
      ).format("YYYY-MM-DD");
      user.date = dateString;
    }
    //dateString = `${yearSelected}-${monthSelected}-${daySelected}`
    //user.date = dateString;
  };

  onMount(() => {
    currentYear = Number(moment().format("YYYY"));
    adultYear = currentYear - 19;
    maxYear = currentYear - 80;
    for (let i = adultYear; i >= maxYear; i--) {
      //array de años
      years.push(i);
    }

    yearSelected = years[0];
    onChangeDate("first");

    for (let i = 0; i < 12; i++) {
      //array de meses
      let month = moment()
        .localeData("es")
        .months(moment([0, i]), "");
      months.push(month);
    }
    if (dateString && dateString.indexOf("-")) {
      let dates = dateString.split("-");
      yearSelected = Number(dates[0]);
      monthSelected = Number(dates[1]);
      daySelected = Number(dates[2]);
    } else if (dateString && dateString.indexOf("/")) {
      let dates = dateString.split("/");
      yearSelected = dates[2];
      monthSelected = dates[1];
      daySelected = dates[0];
    }
    user.date = dateString;
  });

  const welcome = () => {
    closeModal();
    onOk();
  };

  const emailLow = (e) => {
    user.email = user.email.toLowerCase();
  };

  const register = async () => {
    if (currencies.length == 1) active_currency = currencies[0].code;
    //if( userType=="W" && !codeAgent) return alert("CODIGO AGENTE OBLOGATIRO");
    try {
      //if(userType=="W") user.codeAgent=codeAgent;
      if (userType == "W") {
        user.codeAgent = currencies.find(
          (e) => e.code == active_currency
        ).codeAgent;
      }

      if (!user.codeAgent) return alert("CODIGO AGENTE OBLOGATIRO");
      let { data } = await ServerConnection.user.register(
        user.username,
        user.name,
        user.countryCode,
        user.countryCode + user.phone,
        user.email,
        user.password,
        user.date,
        user.codeAgent,
        user.validateSMS,
        userType,
        platform,
        CURRENCIES_[active_currency]
      );
      console.log("DATAAAAA: ",data)
      if (
        data.message ==
          "{resp=Err, Id=1, Msg=El correo o el Usuario ya Exite}" ||
        data.message == "{resp=Err, Id=2, Msg=El correo o el Usuario ya Exite}"
      ) {
        active_section = "email";
        return showNotify("error", "Este correo ya esta en uso");
      } else if (
        data.message == "{resp=Err, Id=1, Msg=Usuario ya Exite}" ||
        data.message == "{resp=Err, Id=2, Msg=Usuario ya Exite}"
      ) {
        active_section = "user";
        return showNotify("error", "Este nombre de usuario ay existe");
      } else if (data.errorCode == "SMS_CODE_INVALID") {
        active_section = "validateSMS";
        return showNotify("error", "Código SMS incorrecto");
      } else if (
        data.message == "{resp=Err, Id=21, Msg=No existe ese id de grupo}"
      ) {
        active_section = "codeAgent";
        return showNotify("error", "Código de agente incorrecto");
      }
      active_section = "welcome";
    } catch (e) {
      console.log("registermsg", e);
      if(e.response.data.errorCode == "SMS_CODE_INVALID"){active_section = "validateSMS"}
      return showNotify("error", "Error al crear usuario");
    }
  };

  const showNotify = (type, message) => {
    notify = { display: true, type, message };
    setTimeout(() => {
      notify.display = false;
    }, 4000);
  };
  const closeModal = () => {
    document.body.classList.remove("fixed-scroll");
    open = false;
  };
  const nextStepEnterEmail = (e) => {
    if (e.charCode === 13) validateEmail();
  };
  const nextStepEnterName = (e) => {
    if (e.charCode === 13) validateName();
  };
  const nextStepEnterUsername = (e) => {
    if (e.charCode === 13) validateUsername();
  };
  const nextStepEnterPhone = (e) => {
    if (e.charCode === 13) validatePhone();
  };
  const nextStepEnterPassword = (e) => {
    if (e.charCode === 13) validatePassword();
  };
  const nextStepEnterDate = (e) => {
    if (e.charCode === 13) validateDate();
  };
  const nextStepEnterCodeAgent = (e) => {
    if (e.charCode === 13) validateCodeAgent();
  };
  const nextStepEnterValidateSMS = (e) => {
    if (e.charCode === 13) validateSMS();
  };
  const nextStepEnterCurrency = (e) => {
    if (e.charCode === 13) validateCurrency();
  };
  const nextStepEnterCondition = (e) => {
    if (e.charCode === 13) validateCondition();
  };

  const validateSpaceKey = (e) => {
    if (e.charCode === 32) {
      e.preventDefault();
      return showNotify("error", "No se permite espacios en blanco");
    }
  };
  const validateUsername = (e) => {
    if (!user.username)
      return showNotify("error", "Ingrese un nombre de usuario");
    if (!/^[A-Za-z0-9_]+$/.test(user.username))
      return showNotify("error", "Sólo letras, números y guión bajo");
    active_section = "name";
  };

  const validateName = (e) => {
    if (!user.name) return showNotify("error", "Ingrese nombre y apellidos");
    if (!/^[A-Za-zúéáíóüÜÑñÓÍÚÁÉ  ]*$/.test(user.name))
      return showNotify("error", "Ingrese letras solamente");
    if (currencies.length > 1) active_section = "currency";
    else active_section = "phone";
  };

  function phoneOnlyNumber(event) {
    user.phone = user.phone || "";
    if (/\d/.test(event.key) && user.phone.length < 9) user.phone += event.key;
  }

  const validatePhone = () => {
    if (!user.phone)
      return showNotify("error", "Ingrese su numero de telefono");
    else if (user.phone.length < 7)
      return showNotify("error", "Mínimo 7 digitos para el teléfono");
    active_section = "email";
  };

  const validateEmail = async () => {
    let isEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(user.email);
    if (!user.email) return showNotify("error", "Ingrese un correo");
    if (!isEmail) return showNotify("error", "Formato de email incorrecto");
    active_section = "password";
  };

  const validatePassword = () => {
    if (!user.password) return showNotify("error", "Ingrese una contraseña");
    else if (user.password.length < 6)
      return showNotify("error", "Minimo 6 caracteres para la contraseña");
    active_section = "date";
  };

  const validateDate = () => {
    if (!user.date)
      return showNotify("error", "Ingrese su fecha de nacimiento");
    if (getAge(user.date) < 18)
      return showNotify("error", "Debe ser mayor de edad");
    active_section = userType == "X" ? "codeAgent" : "validateSMS";
    
    if (userType == "W") {
      preRegister();
    }

  };

  const preRegister = async () => {
    if (!currencies.length) return showNotify("error", "Moneda no difinida");
    try {
      await ServerConnection.user.preRegister(
        user.username,
        user.email,
        user.countryCode + user.phone,
        platform
      );
      active_section = "validateSMS";
    } catch (e) {
      console.log("errorxxx: ", e);
      let messagge = "Error desconocido en Preregistro";
      if (
        e.response &&
        e.response.data &&
        e.response.data.message == "PHONE_FORMAT_FAILED"
      ) {
        active_section = "phone";
        messagge = "Formato Telefono incorrecto";
      } else if (e.response.data.message == "El telefono ya existe") {
        active_section = "phone";
        messagge = e.response.data.message;
      } else if (e.response.data.message == "El usuario  ya existe") {
        active_section = "user";
        messagge = e.response.data.message;
      } else if (e == "ORG_MANDATORY") {
        messagge = "ORG es obligatorio";
      } else if (e.response.data.message == "El usuario u correo ya existe") {
        active_section = "email";
        messagge = e.response.data.message;
      }
      return showNotify("error", messagge);
    }
  };

  const validateCodeAgent = async () => {
    if (!user.codeAgent) return showNotify("error", "Ingrese el codigo de agente");
    preRegister();
  };

  const validateSMS = () => {
    if (!user.validateSMS) return showNotify("error", "Ingrese el codigo SMS");
    active_section = "conditions";
  };

  const validateCurrency = () => {
    if (!active_currency) return showNotify("error", "Escoja una moneda");
    active_section = "phone";
  };

  const validateCondition = () => {
    if (!conditions)
      return showNotify("error", "Acepte los términos y condiciones");
    register();
  };

  const backToUserSecction = ( ) => {
    active_section = "user";
  }

  const backToNameOrCurrencySecction = ( ) => {
    if(userType == "X") active_section = "name";
    else if(userType == "W") active_section = "currency";
  }

  const backToNameSecctionFromCurrency = ( ) => {
    active_section = "name";
  }

  const backToPhoneSecction = ( ) => {
    active_section = "phone";
  }

  const backToEmailSecction = ( ) => {
    active_section = "email";
  }

  const backToPasswordSecction = ( ) => {
    active_section = "password";
  }

  const backToDateSecction = ( ) => {
    active_section = "date";
  }

  const backToAgentCodeSecction = ( ) => {
    active_section = "codeAgent";
  }

  const backToValidationSecction = ( ) => {
    active_section = "validateSMS";
  }

  const backToCurrencySecction = ( ) => {
    active_section = "currency";
  }


</script>

<div class="u-userregister-stepbystep u-main-content-general">
  <div class="u-content-logo"><img class="logo" src={logoUrl} alt="" /></div>
  <div class="u-main-general">
    <div class="u-content-info">
      <div class="u-info">
        <div class="u-text-title">
          <span>Pagamos tus Ganancias</span>
          <span>con la velcidad de la luz</span>
        </div>
        <div class="u-wrapp-progress">
          <div class="progress vertical">
            <div
              class="u-circle u-star {user.username ? 'u-category-select' : ''}"
            />
            <label class="form-check-label" for="flexCheckDefault"
              >Nombre de usuario</label
            >
          </div>
          <div class="progress vertical">
            <div class="u-circle {user.name ? 'u-category-select' : ''}" />
            <label class="form-check-label" for="flexCheckDefault"
              >Nombre y apellidos</label
            >
          </div>
          {#if currencies.length > 1}
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
            <div class="u-circle {user.phone ? 'u-category-select' : ''}" />
            <label class="form-check-label" for="flexCheckDefault"
              >Número de télefono</label
            >
          </div>
          <div class="progress vertical">
            <div class="u-circle {user.email ? 'u-category-select' : ''}" />
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
            <div class="u-circle {user.date ? 'u-category-select' : ''}" />
            <label class="form-check-label" for="flexCheckDefault"
              >Fecha de nacimiento</label
            >
          </div>
          {#if userType == "X"}
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
            <div
              class="u-circle-final {active_section == 'welcome'
                ? 'u-category-select-final'
                : ''}"
            />
            <label class="form-check-label" for="flexCheckDefault"
              >Bienvenido</label
            >
          </div>
        </div>
      </div>
      {#if active_section == "user"}
        <!--Componente de user-->
        <div class="u-date-new">
          <div class="u-header"><span>NOMBRE DE USUARIO</span></div>
          <div class="u-body">
            <input
              aria-label="username"
              class="u-input-email"
              type="text"
              maxlength="20"
              bind:value={user.username}
              on:keypress={nextStepEnterUsername}
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
              on:click={validateUsername}>CONTINUAR</button
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
          <button on:click={backToUserSecction} class="u-back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              class="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
              />
            </svg>
          </button>
          <div class="u-body">
            <input
              aria-label="name"
              class="u-input-email"
              type="text"
              bind:value={user.name}
              on:keypress={nextStepEnterName}
              placeholder="Ingrese nombre y apellidos"
            />
            <span>El nombre y apellidos obligatorio</span>
          </div>
          <div class="u-button-control">
            <button
              class="u-button {user.name ? 'u-active-button' : ''}"
              on:click={validateName}>CONTINUAR</button
            >
          </div>
        </div>
        <!--Fin de componente user-->
      {/if}
      {#if active_section == "phone"}
        <!--Componente de user-->
        <div class="u-date-new">
          <div class="u-header"><span>NUMERO DE TELEFONO</span></div>
          <button on:click={backToNameOrCurrencySecction} class="u-back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              class="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
              />
            </svg>
          </button>
          <div class="u-body">
            <div style="display:flex;align-items: flex-end;">
              <select
                class="u-input-email"
                style="margin-right:0.5rem;color:#909090"
                bind:value={user.countryCode}
              >
                {#each countryCodes as code}
                  <option>+{code}</option>
                {/each}
              </select>
              <input
                aria-label="phone"
                class="u-input-email"
                bind:value={user.phone}
                on:keypress|preventDefault={(e) => phoneOnlyNumber(e)}
                on:keypress={nextStepEnterPhone}
                placeholder="Ingrese número de teléfono"
                maxlength="10"
              />
            </div>
            <span>El número celular es obligatorio</span>
          </div>
          <div class="u-button-control">
            <button
              class="u-button {user.phone ? 'u-active-button' : ''}"
              on:click={validatePhone}>CONTINUAR</button
            >
          </div>
        </div>
        <!--Fin de componente user-->
      {/if}
      {#if active_section == "email"}
        <!--Componente de correo-->
        <div class="u-date-new">
          <div class="u-header"><span>CORREO ELECTRONICO</span></div>
          <button on:click={backToPhoneSecction} class="u-back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              class="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
              />
            </svg>
          </button>
          <div class="u-body">
            <input
              aria-label="email"
              class="u-input-email u-input-tall"
              type="email"
              maxlength="30"
              bind:value={user.email}
              on:keypress={nextStepEnterEmail}
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
          <button on:click={backToEmailSecction} class="u-back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              class="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
              />
            </svg>
          </button>
          <div class="u-body">
            <input
              aria-label="password"
              class="u-input-email u-input-tall"
              type="password"
              maxlength="20"
              bind:value={user.password}
              on:keypress={nextStepEnterPassword}
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
          <!--DateThreeSelect bind:dateString={user.birthday} /-->
          <button on:click={backToPasswordSecction} class="u-back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              class="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
              />
            </svg>
          </button>
          <div class="select-date u-body">
            <select
              aria-label="daySelected"
              bind:value={daySelected}
              on:change={onChangeDate}
            >
              {#each days as day}
                <option aria-label="dayOption">{day}</option>
              {/each}
            </select>
            <select bind:value={monthSelected} on:change={onChangeDate}>
              {#each months as month, i (i)}
                <option value={i} disabled={i == 0}>{month}</option>
              {/each}
            </select>
            <select
              aria-label="birthday-year"
              bind:value={yearSelected}
              on:change={onChangeDate}
            >
              {#each years as year}
                <option aria-label="birthday-year-option">{year}</option>
              {/each}
            </select>
          </div>
          <div class="u-button-control">
            <button
              class="u-button {user.date ? 'u-active-button' : ''}"
              on:click={validateDate}
              on:keypress={nextStepEnterDate}
            >
              CONTINUAR
            </button>
          </div>
        </div>
        <!--Fin de componente correo-->
      {/if}
      {#if userType == "X" && active_section == "codeAgent"}
        <!--Componente de user-->
        <div class="u-date-new">
          <div class="u-header">
            <span>CODIGO DE AGENTE</span>
          </div>
          <button on:click={backToDateSecction} class="u-back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              class="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
              />
            </svg>
          </button>
          <div class="u-body">
            <input
              class="u-input-email"
              type="number"
              maxlength="8"
              bind:value={user.codeAgent}
              on:keypress={nextStepEnterCodeAgent}
              placeholder="Ingresar código de agente"
            />
            <span>El código de agente es obligatorio</span>
          </div>
          <div class="u-button-control">
            <button
              class="u-button {user.codeAgent ? 'u-active-button' : ''}"
              on:click={validateCodeAgent}>CONTINUAR</button
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
          <button on:click={backToAgentCodeSecction} class="u-back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              class="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
              />
            </svg>
          </button>
          <div class="u-body">
            <input
              class="u-input-email"
              aria-label="validation"
              type="number"
              maxlength="6"
              bind:value={user.validateSMS}
              on:keypress={nextStepEnterValidateSMS}
              placeholder="Ingresar código SMS"
            />
            <span>El código SMS es obligatorio</span>
          </div>
          <div class="u-button-control">
            <button
              class="u-button {user.validateSMS ? 'u-active-button' : ''}"
              on:click={validateSMS}>CONTINUAR</button
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
          <button on:click={backToNameSecctionFromCurrency} class="u-back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              class="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
              />
            </svg>
          </button>
          <div class="u-body u-currency">
            <span>Monedas sugeridas</span>
            <div class="u-coins" on:keypress={nextStepEnterCurrency}>
              {#each currencies as currency}
                <button
                  class="u-button-coins {active_currency == currency.code
                    ? 'u-opt-select'
                    : ''}"
                  on:click={() => {
                    active_currency = currency.code;
                  }}>{currency.code}</button
                >
              {/each}
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
          <button on:click={backToValidationSecction} class="u-back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              class="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
              />
            </svg>
          </button>
          <div class="u-terms-and-conditions u-body">
            <input
              aria-label="terms"
              class="form-check-input"
              type="checkbox"
              bind:checked={conditions}
              on:keypress={nextStepEnterCondition}
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
          <div class="u-welcome u-body">
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

<Notifier
  bind:display={notify.display}
  bind:message={notify.message}
  bind:type={notify.type}
/>

<style>
  :root {
    --u-userregister-stepbystep-bg-menu: var(
      --universal-userregister-stepbystep-bg-menu,
      #000
    );
    --u-userregister-stepbystep-bg-menu-title-principal: var(
      --universal-userregister-stepbystep-bg-menu-title-principal,
      #f1bf00
    );
    --u-userregister-mydata-title: var(
      --universal-userregister-mydata-title,
      rgb(198, 194, 195)
    );
    --u-userregister-stepprogress-subtitle-color: var(
      --universal-userregister-stepprogress-subtitle-color,
      #fff
    );
    --u-userregister-databydata-bg-menu: var(
      --universal-userregister-databydata-bg-menu,
      #fff
    );
  }
  .u-input-email:focus-visible {
    outline: 0;
  }
  @media only screen and (max-width: 1200px) {
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
    .u-content-logo {
      height: 80px;
    }
    .logo {
      width: 100%;
      height: 100%;
    }
    .u-info {
      display: none;
    }
    .u-text-title {
      display: flex;
      flex-direction: column;
      color: var(--u-userregister-stepbystep-bg-menu-title-principal);
      font-weight: 600;
      font-family: montserrat;
      padding: 0.5rem;
    }
    .u-wrapp-progress {
      font-size: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      height: 100%;
      gap: 0.4rem;
    }
    .progress {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding-bottom: 0.5rem;
    }
    .u-circle {
      width: 20px;
      height: 20px;
      border-radius: 1rem;
      border: 1px solid white;
    }
    .u-star {
      background-color: white;
    }
    .u-circle-final {
      width: 20px;
      height: 20px;
      border-radius: 1rem;
      border: 1px solid #f1bf00;
    }
    /*Estilos lado de la data*/
    .u-date-new {
      display: flex;
      flex-direction: column;
      background-color: var(--u-userregister-databydata-bg-menu);
      width: 100%;
      height: 100%;
      border-bottom-right-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      border-top-left-radius: 0.5rem;
      border: 1px solid var(--u-userregister-mydata-title);
    }
    .u-header {
      color: black;
      padding: 0.5rem;
      font-weight: 700;
      border-top-right-radius: 0.5rem;
      border-top-left-radius: 0.5rem;
      background-color: var(--u-userregister-mydata-title);
    }
    .u-body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 0.5rem;
      height: 70%;
    }
    .u-currency {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }
    .u-input-email {
      border: none;
      font-size: 1rem;
      letter-spacing: -1px;
      border-bottom: 1px solid #727272;
      font-weight: 800;
    }
    .u-input-tall {
      width: 100%;
    }
    .select-date {
      display: grid;
      grid-template-columns: 31% 31% 31%;
      align-items: center;
      gap: 0.5rem;
    }
    select {
      height: 2.8em;
      border-radius: 0.4rem;
    }
    .u-terms-and-conditions {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: black;
    }
    .u-welcome {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
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
      margin-bottom: 0.5rem;
    }
    .u-active-button {
      background-color: #f1bf00;
    }
    .u-close {
      margin-left: 0.5rem;
      text-align: center;
      border: none;
      background: #bd992a;
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
    .u-back {
      width: 10%;
      background-color: transparent;
      border: none;
      margin-top: 0.5rem;
      margin-left: 0.3rem;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  @media only screen and (min-width: 1200px) {
    input:focus-visible {
      outline: 0;
    }
    .u-main-content-general {
      display: grid;
      justify-items: center;
    }
    .u-main-general {
      display: flex;
    }
    .u-content-logo {
      height: 80px;
    }
    .logo {
      width: 100%;
      height: 100%;
    }
    .u-content-info {
      display: grid;
      grid-template-columns: 46% 54%;
      align-items: center;
      width: 40rem;
    }
    .u-info {
      display: grid;
      background-color: var(--u-userregister-stepbystep-bg-menu);
      color: var(--u-userregister-stepprogress-subtitle-color);
      padding: 1rem;
      border-radius: 10px 0 0 10px;
    }
    .u-text-title {
      display: grid;
      color: var(--u-userregister-stepbystep-bg-menu-title-principal);
      font-weight: 600;
      font-family: montserrat;
      font-size: 1.1rem;
    }
    .u-wrapp-progress {
      display: grid;
      gap: 0.75rem;
      padding: 1rem 0;
    }
    .progress {
      display: grid;
      gap: 0.5rem;
      grid-template-columns: 2rem 1fr;
      align-items: center;
    }
    .u-circle {
      width: 20px;
      height: 20px;
      border-radius: 1rem;
      border: 1px solid white;
    }
    .u-star {
      background-color: white;
    }
    .u-circle-final {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 1rem;
      border: 1px solid #f1bf00;
    }
    /*Estilos lado de la data*/
    .u-date-new {
      display: flex;
      background-color: var(--u-userregister-databydata-bg-menu);
      height: 100%;
      border-bottom-right-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      border: 1px solid var(--u-userregister-mydata-title);
      flex-direction: column;
    }
    .u-header {
      color: black;
      padding: 0.5rem;
      font-weight: 700;
      border-top-right-radius: 0.5rem;
      background-color: var(--u-userregister-mydata-title);
    }
    .u-body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 0.5rem;
      height: 70%;
    }
    .u-currency {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }
    .u-input-email {
      border: none;
      font-size: 1rem;
      letter-spacing: -1px;
      border-bottom: 1px solid #727272;
      font-weight: 800;
    }
    .u-input-tall {
      width: 100%;
    }
    .select-date {
      display: grid;
      grid-template-columns: 31% 31% 31%;
      align-items: center;
      gap: 0.5rem;
    }
    select {
      height: 2.8em;
      border-radius: 0.4rem;
    }
    .u-terms-and-conditions {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: black;
    }
    .u-welcome {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
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

    .u-button-control {
      /*display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;*/
    }
    .u-button {
      width: -webkit-fill-available;
      border: none;
      height: 2.25rem;
      border-radius: 0.2rem;
      background-color: white;
      font-weight: 700;
      cursor: pointer;
      margin: 1rem;
    }
    .u-active-button {
      background-color: #f1bf00;
    }
    .u-close {
      margin-left: 0.5rem;
      text-align: center;
      border: none;
      background: #bd992a;
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
    .u-back {
      background-color: transparent;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      width: max-content;
    }
  }
</style>