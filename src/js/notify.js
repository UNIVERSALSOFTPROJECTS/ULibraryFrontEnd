//import EventManager from "./EventManager";
let EventManager;
export default {
    setEM:(em)=>{
        EventManager = em;
    },    
    success:(msg)=>{
        EventManager.publish("notify",{mode:'success', msg});
    },
    error:(msg, error=null)=>{
        EventManager.publish("notify",{mode:'danger', msg, error}); 
    },
    loading:(show)=>{
        let msg=null;
        if(show==undefined||show==null) show=true;
        if( typeof(show) == 'string' ){ msg=show;}
        if( typeof(show) == 'object' ){ msg=show.msg;}
        EventManager.publish("loading",{show, msg});
    }
}