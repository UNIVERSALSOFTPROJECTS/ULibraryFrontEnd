<script>
    import ServerConnection from "../js/server";

    let showPassword = false;

     let username = "";
     let password = "";
    export let onLoginOk;
    export let onLoginError;

  
    function dataPassword(event) {
      password = event.target.value;
    }
  
    function togglePasswordHide() {
      showPassword = !showPassword;
    }

    const loginEnter = e => {
    if(e.charCode === 13) login();
  };

  const login = async () => {
   
    try {
        if( !username || !password ) throw('EMPTY_PARAMS');
        const {data}= await ServerConnection.user.login(username,password);
        console.log("PASO LOGIN");
        if (!data.username || data.username == "") {throw "USER_NOT_FOUND"};
        let user_ = {
        balance: data.balance,
        username: data.username,
        currency: data.currency,
        currency_id: data.currency_id,
        bono: data.bonus, 
        code: data.id,
        token: data.token,
        serial: data.serial,
        agregatorToken: data.agregatorToken,
      };
      onLoginOk(user_);
    } catch (error) {
        //console.log("catch error", error);
        onLoginError(error);
    }
  };  
  </script>
  <div class="modal-body">
    <div class="login__title">Bienvenido a</div>
      <img class="login__logo" src="" alt="">
      <div class="login__form">
          <!--div class="login__title">Bienvenido a {conf.PAGE}</div-->
          <div> </div>
          <input type="text" class="ipt" placeholder="Usuario" bind:value={username}>
          <div class="login__ipt--pass">
              <input bind:value={password}  placeholder="Contraseña">
              <button on:click={togglePasswordHide} class="btn {showPassword ? 'no-eye' : 'eye'}"></button>
          </div>
          <button class="btn singup" on:click={login}>Ingresar</button>
          <div class="link">¿Olvidaste tu contraseña?</div>
      </div>
  </div>

