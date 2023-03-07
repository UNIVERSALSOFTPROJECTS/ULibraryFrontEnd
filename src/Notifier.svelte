<script>
    // import EventManager from "../../../js/EventManager";
    export let EventManager;
    let display = false
    //let errorCode
    let message
    let type

    EventManager.subscribe("notify", (event) => {
        //errorCode = event.errorCode
        message = event.msg
        type = event.mode||'success'
        display = true
        setTimeout( ()=>{ display=false },4000)

    })

    function toggleDisplay() {
        display = false
    }
</script>
{#if display}
<div class="u-notify u-notify-{type}">
    <div class="notify-content">{message}</div>
    <button class="u-close-notify" on:click={toggleDisplay}>x</button>
</div>
{/if}

<style>
     .u-notify-success::before{
        content:"✔";
    }
    .u-notify-error::before{
        content:"❗";
    }
    .u-notify-warning::before{
        content:"⚠";
    }
    .u-notify::before{
        position:absolute;
        left:5px;
        top:8px;
    }
    .u-notify{
        position:relative;
    }
    .notify-content{
        margin-left: 10px;
    }
@media only screen and (max-width: 1200px) {
    .u-notify{
    position: fixed;
    top:1rem;
    z-index: 100;
    padding:10px;
    font-size: 1em;
    background: #fafafa;
    color:#333;
    display:flex;
    justify-content: space-between;
    cursor:pointer;
    box-shadow: 1px 1px 5px #000;
    border-radius: 5px;
    }
    .u-close-notify{
    font-weight: bold;
    margin:0 0 0 10px ;
    border-radius: 50%;
    background: #ccc;
    padding:1px 5px;
    }
}
@media only screen and (min-width: 1200px) {
    .u-notify{
        position: fixed;
        top:1rem;
        z-index: 100;
        padding:10px;
        font-size: 1em;
        background: #fafafa;
        color:#333;
        display:flex;
        justify-content: space-between;
        cursor:pointer;
        box-shadow: 1px 1px 5px #000;
        border-radius: 5px;
    }
    .u-close-notify{
        font-weight: bold;
        margin:0 0 0 10px ;
        border-radius: 50%;
        background: #cecece;
        padding:1px 5px;
        cursor: pointer;
    }
}
</style>