/* Restore only this tab's location after authenticated data has loaded. */
(function(){
  const policy=window.portalSessionPolicy;
  const activityKey='ecompliance.lastActivity', locationKey='ecompliance.tabLocation';
  let active=false, restoring=false, timer, lastWrite=0;
  const read=(key)=>{try{return sessionStorage.getItem(key);}catch{return null;}};
  const write=(key,value)=>{try{sessionStorage.setItem(key,value);}catch{}};
  const clear=()=>{try{sessionStorage.removeItem(activityKey);sessionStorage.removeItem(locationKey);}catch{}};
  function expire(){
    active=false;clearTimeout(timer);clear();
    window.auditWorkspace.reset();
    signOut();
    const err=document.getElementById('loginError');
    err.textContent='You were signed out after 30 minutes without activity. Please log in again.';err.style.display='block';
  }
  function check(){if(active && policy.expired(Number(read(activityKey)))) expire();}
  function touch(){
    if(!active)return;
    if(policy.expired(Number(read(activityKey)))){expire();return;}
    const now=Date.now();if(now-lastWrite<1000)return;
    lastWrite=now;write(activityKey,String(now));clearTimeout(timer);timer=setTimeout(check,policy.IDLE_MS+100);
  }
  window.addEventListener('portal-view',ev=>{if(!restoring)write(locationKey,JSON.stringify(ev.detail));});
  window.addEventListener('portal-entered',()=>{active=true;write(activityKey,String(Date.now()));clearTimeout(timer);timer=setTimeout(check,policy.IDLE_MS+100);});
  window.addEventListener('portal-signed-out',()=>{active=false;clearTimeout(timer);clear();window.auditWorkspace.reset();});
  ['pointerdown','keydown','input','scroll'].forEach(type=>document.addEventListener(type,touch,{passive:true,capture:true}));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
  window.addEventListener('focus',check);
  async function restore(){
    const btn=document.getElementById('loginNextBtn');btn.disabled=true;
    const last=Number(read(activityKey));let location=null;
    try{location=JSON.parse(read(locationKey));}catch{}
    try {
      if(policy.expired(last)){await cloud.signOut();clear();return;}
      const account=await cloud.restoreSession();if(!account){clear();return;}
      currentAccount=account;restoring=true;
      await enterApp(account.firstName+' '+account.surname,account.cnc);
      if(active)window.auditWorkspace.restore(location);
    } catch(error){
      const err=document.getElementById('loginError');err.textContent='Could not reconnect. Check your internet connection and refresh again.';err.style.display='block';
    } finally {restoring=false;btn.disabled=false;}
  }
  restore();
})();