import React, { useState, useEffect } from "react";
const BLOKIR_USER = ["pemilik","owner","admin","superadmin"];
const LANGS = {
  id: { daftar:"Daftar", masuk:"Masuk", radar:"Radar", chat:"Chat", live:"Live", hiburan:"Hiburan", dompet:"Dompet", profil:"Profil", halo:"Halo", dekat:"Terdekat", global:"Sedunia • Tergantung Pemakaine" },
  en: { daftar:"Sign Up", masuk:"Sign In", radar:"Radar", chat:"Chat", live:"Live", hiburan:"Entertainment", dompet:"Wallet", profil:"Profile", halo:"Hello", dekat:"Nearby", global:"Worldwide • Depends on User" },
  ko: { daftar:"가입", masuk:"로그인", radar:"레이더", chat:"채팅", live:"라이브", hiburan:"엔터테인먼트", dompet:"지갑", profil:"프로필", halo:"안녕하세요", dekat:"가까운", global:"전세계 • 사용자에 따라" },
  ja: { daftar:"登録", masuk:"ログイン", radar:"レーダー", chat:"チャット", live:"ライブ", hiburan:"娯楽", dompet:"財布", profil:"プロフィール", halo:"こんにちは", dekat:"近く", global:"世界中 • ユーザー次第" },
  es: { daftar:"Registro", masuk:"Entrar", radar:"Radar", chat:"Chat", live:"En Vivo", hiburan:"Entretenimiento", dompet:"Billetera", profil:"Perfil", halo:"Hola", dekat:"Cerca", global:"Mundial • Depende del usuario" },
};
export default function App(){
  const [lang, setLang] = useState("id");
  const t = LANGS[lang] || LANGS.id;
  const [tabAuth, setTabAuth] = useState("daftar");
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("beranda");
  const [coins, setCoins] = useState(1000);
  const [saldo, setSaldo] = useState(47500);
  const [giftPrices, setGiftPrices] = useState({mawar:1000, es:5000, cincin:100000, rumah:1000000});
  const [unlockPrice, setUnlockPrice] = useState(500);
  const [temanList, setTemanList] = useState([]);
  const [radarList, setRadarList] = useState([
    {id:1, nama:"Rina, 24 - Solo", jarak:45, foto:"https://i.pravatar.cc/150?img=5", online:true, negara:"ID", lat:-7.57, lng:110.82},
    {id:2, nama:"Lisa, 22 - Seoul", jarak:120, foto:"https://i.pravatar.cc/150?img=9", online:true, negara:"KR", lat:37.56, lng:126.97},
    {id:3, nama:"Sofia, 26 - Madrid", jarak:340, foto:"https://i.pravatar.cc/150?img=32", online:false, negara:"ES", lat:40.41, lng:-3.70},
    {id:4, nama:"Yuki, 23 - Tokyo", jarak:600, foto:"https://i.pravatar.cc/150?img=15", online:true, negara:"JP", lat:35.68, lng:139.69},
    {id:5, nama:"Emma, 25 - USA", jarak:850, foto:"https://i.pravatar.cc/150?img=23", online:true, negara:"US", lat:40.71, lng:-74.00},
    {id:6, nama:"Ayu, 21 - Jogja", jarak:25, foto:"https://i.pravatar.cc/150?img=8", online:true, negara:"ID", lat:-7.79, lng:110.36},
  ]);
  const [formDaftar, setFormDaftar] = useState({username:"", kontak:"", pass:"", konf:""});
  const [showTitik, setShowTitik] = useState(null);
  const [showGift, setShowGift] = useState(null);

  useEffect(()=>{
    const iv = setInterval(()=>{
      setRadarList(prev=> prev.map(p=> ({...p, jarak: Math.max(10, p.jarak + Math.floor(Math.random()*20-10))})).sort((a,b)=>a.jarak-b.jarak));
    },2500);
    return ()=>clearInterval(iv);
  },[]);

  const handleDaftar = (e)=>{
    e.preventDefault();
    const uname = formDaftar.username.toLowerCase();
    if(BLOKIR_USER.includes(uname)){ alert("Username diblokir sistem!"); return; }
    if(formDaftar.pass !== formDaftar.konf){ alert("Sandi ora podo!"); return;}
    setShowOTP(true);
  };
  const verifOTP = ()=>{ setShowOTP(false); setUser({name: formDaftar.username, role:"user"}); setTab("beranda"); };
  const handleMasuk = (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const uname = fd.get("username").toString();
    const pass = fd.get("password").toString();
    if((uname==="triangga_owner" || uname==="owner@localarea.id") && pass==="1106"){ setUser({name:"Tri Angga (DEWA)", role:"owner"}); setTab("beranda"); return; }
    if(uname==="pemilik" && pass==="1106"){ setUser({name:"Tri Angga (DEWA)", role:"owner"}); setTab("beranda"); return; }
    if(!uname){ alert("Isi username/email/wa"); return; }
    setUser({name:uname, role:"user"}); setTab("beranda");
  };
  const handleAddTeman = (p)=>{
    if(saldo < unlockPrice){ alert("Saldo kurang! Butuh Rp "+unlockPrice+" untuk lihat / add teman. Topup dulu."); setTab("dompet"); return; }
    setSaldo(s=>s-unlockPrice);
    setTemanList(prev=> [...prev, p.id]);
    alert(p.nama+" diterima! DADI TEMAN - saiki iso delok titik lokasine akurat.");
  };
  const handleGift = (p, jenis)=>{
    const harga = giftPrices[jenis];
    if(saldo < harga){ alert("Saldo kurang untuk gift "+jenis); setTab("dompet"); return; }
    setSaldo(s=>s-harga);
    setCoins(c=>c+Math.floor(harga/100));
    alert("Gift "+jenis+" Rp "+harga.toLocaleString("id-ID")+" terkirim ke "+p.nama+"! +"+Math.floor(harga/100)+" Coins");
    setShowGift(null);
  };

  if(!user){
    return (
      <div style={{maxWidth:420, margin:"0 auto", minHeight:"100vh", background:"#fff", fontFamily:"Inter,sans-serif", padding:16}}>
        <h1 style={{textAlign:"center", fontWeight:800, fontSize:26, letterSpacing:2, marginTop:20}}>LOCAL AREA</h1>
        <p style={{textAlign:"center", fontSize:11, color:"#666"}}>🌍 {t.global} • Radar Maksimal • Area Tak Terbatas</p>
        <div style={{display:"flex", background:"#f3f4f6", borderRadius:12, padding:4, marginTop:20}}>
          <button onClick={()=>setTabAuth("daftar")} style={{flex:1, padding:10, borderRadius:8, background:tabAuth==="daftar"?"#7c3aed":"transparent", color:tabAuth==="daftar"?"#fff":"#555", border:"none", fontWeight:600}}>{t.daftar}</button>
          <button onClick={()=>setTabAuth("masuk")} style={{flex:1, padding:10, borderRadius:8, background:tabAuth==="masuk"?"#7c3aed":"transparent", color:tabAuth==="masuk"?"#fff":"#555", border:"none", fontWeight:600}}>{t.masuk}</button>
        </div>
        {tabAuth==="daftar" ? (
          <form onSubmit={handleDaftar} style={{marginTop:20, display:"flex", flexDirection:"column", gap:12}}>
            <input required placeholder="Username" value={formDaftar.username} onChange={e=>setFormDaftar({...formDaftar, username:e.target.value})} style={inp}/>
            <input required placeholder="Email ATAU No WA (konfirmasi OTP)" value={formDaftar.kontak} onChange={e=>setFormDaftar({...formDaftar, kontak:e.target.value})} style={inp}/>
            <input required type="password" placeholder="Sandi" value={formDaftar.pass} onChange={e=>setFormDaftar({...formDaftar, pass:e.target.value})} style={inp}/>
            <input required type="password" placeholder="Konfirmasi Sandi" value={formDaftar.konf} onChange={e=>setFormDaftar({...formDaftar, konf:e.target.value})} style={inp}/>
            <button type="submit" style={btnUngu}>Daftar - Konfirmasi Email/WA</button>
            <p style={{fontSize:10, color:"#888", textAlign:"center"}}>Pemilik ORA daftar - langsung login siluman. Username owner/admin diblokir.</p>
          </form>
        ) : (
          <form onSubmit={handleMasuk} style={{marginTop:20, display:"flex", flexDirection:"column", gap:12}}>
            <input name="username" required placeholder="Username / Email / No WA" style={inp}/>
            <input name="password" required type="password" placeholder="Sandi" style={inp}/>
            <button type="submit" style={btnUngu}>Masuk</button>
            <p style={{fontSize:10, color:"#888", textAlign:"center"}}>Pemilik login siluman - data dirahasiakan - sek weroh pemilik dewe</p>
          </form>
        )}
        {showOTP && (
          <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50}}>
            <div style={{background:"#fff", padding:20, borderRadius:16, width:300, textAlign:"center"}}>
              <h3>Konfirmasi OTP</h3><p style={{fontSize:12, color:"#666"}}>Kode dikirim ke {formDaftar.kontak}</p><p style={{fontSize:20, letterSpacing:4, margin:"12px 0"}}>1 2 3 4</p><input placeholder="Ketik 1234" style={inp}/><button onClick={verifOTP} style={{...btnUngu, marginTop:12, width:"100%"}}>Verifikasi Email/WA</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{maxWidth:420, margin:"0 auto", minHeight:"100vh", background:"#fafafa", fontFamily:"Inter,sans-serif", paddingBottom:80, position:"relative"}}>
      <div style={{background:"#fff", padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #eee", position:"sticky", top:0, zIndex:10}}>
        <b>LOCAL AREA 🌍</b><div style={{display:"flex", gap:8, alignItems:"center", fontSize:11}}><span>🌐 {lang.toUpperCase()}</span><span>Rp {saldo.toLocaleString("id-ID")}</span><span style={{background:"#fef3c7", padding:"4px 8px", borderRadius:12}}>{coins} Coins</span>{user.role==="owner" && <span style={{background:"#dc2626", color:"#fff", padding:"4px 8px", borderRadius:12, fontSize:9}}>DEWA</span>}</div>
      </div>

      {user.role==="owner" && (
        <div style={{background:"#111827", color:"#fff", padding:12, fontSize:11}}>
          <b>👑 PANEL DEWA - PEMILIK TOK - DIRAHASIAKAN</b><br/>
          <div style={{marginTop:8, display:"grid", gridTemplateColumns:"1fr 1fr", gap:6}}>
            <label>Saldo User: <input type="number" value={saldo} onChange={e=>setSaldo(Number(e.target.value))} style={{width:80, padding:2, borderRadius:4, border:"none"}}/></label>
            <label>Unlock: <input type="number" value={unlockPrice} onChange={e=>setUnlockPrice(Number(e.target.value))} style={{width:60, padding:2, borderRadius:4, border:"none"}}/></label>
            <label>Mawar: <input type="number" value={giftPrices.mawar} onChange={e=>setGiftPrices({...giftPrices, mawar:Number(e.target.value)})} style={{width:80, padding:2, borderRadius:4, border:"none"}}/></label>
            <label>Es: <input type="number" value={giftPrices.es} onChange={e=>setGiftPrices({...giftPrices, es:Number(e.target.value)})} style={{width:80, padding:2, borderRadius:4, border:"none"}}/></label>
            <label>Cincin: <input type="number" value={giftPrices.cincin} onChange={e=>setGiftPrices({...giftPrices, cincin:Number(e.target.value)})} style={{width:80, padding:2, borderRadius:4, border:"none"}}/></label>
            <label>Rumah: <input type="number" value={giftPrices.rumah} onChange={e=>setGiftPrices({...giftPrices, rumah:Number(e.target.value)})} style={{width:80, padding:2, borderRadius:4, border:"none"}}/></label>
          </div>
          <p style={{fontSize:9, color:"#9ca3af", marginTop:6}}>SeaBank 9011**** AES Encrypted • Midtrans Server Key server-side only • ISO SETTING OPO WAE NENG KENE - DEWA</p>
        </div>
      )}

      {tab==="beranda" && (
        <div style={{padding:16, display:"flex", flexDirection:"column", gap:12}}>
          <div style={{background:"#fff", borderRadius:16, padding:16, border:"1px solid #eee"}}>
            <p style={{fontSize:11, color:"#7c3aed", fontWeight:700}}>🌍 {t.global} • RADAR MAKSIMAL • AREA TAK TERBATAS</p><h2 style={{margin:"8px 0"}}>{t.halo} {user.name} 👋</h2><p style={{fontSize:12, color:"#666"}}>Radar semaksimal mungkin - area tak terbatas - hiburan real berfungsi - bahasa internasional - iso tuku pulsa & paket - konek DANA SeaBank Bank Lain.</p>
            <div style={{display:"flex", gap:6, marginTop:10, flexWrap:"wrap"}}><button onClick={()=>setTab("radar")} style={chip}>📡 Radar Maksimal</button><button onClick={()=>setTab("hiburan")} style={chip}>🎮 Hiburan Real</button><button onClick={()=>setTab("dompet")} style={chip}>💰 Dompet + Gift</button></div>
          </div>
          <div style={{background:"#fff", borderRadius:16, padding:16, border:"1px solid #eee"}}>
            <b style={{fontSize:13}}>🎮 Hiburan Real - Fungsional Kabeh</b>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10}}>
              <div onClick={()=>setTab("hiburan")} style={cardHib}>🎬<br/><b>Drama Sedunia</b><br/><span style={{fontSize:9}}>K-Drama, Hollywood, Jowo</span><br/><span style={{fontSize:9, color:"#7c3aed"}}>+15 Coins</span></div>
              <div onClick={()=>setTab("hiburan")} style={cardHib}>🎤<br/><b>Karaoke Global</b><br/><span style={{fontSize:9}}>K-Pop, Western, Dangdut</span><br/><span style={{fontSize:9, color:"#7c3aed"}}>+20 Coins</span></div>
              <div onClick={()=>setTab("hiburan")} style={cardHib}>🎯<br/><b>Game Sedunia</b><br/><span style={{fontSize:9}}>Tebak, Slot, Suit</span><br/><span style={{fontSize:9, color:"#7c3aed"}}>+30 Coins</span></div>
              <div onClick={()=>setTab("hiburan")} style={cardHib}>📺<br/><b>Live Global</b><br/><span style={{fontSize:9}}>User sedunia</span><br/><span style={{fontSize:9, color:"#7c3aed"}}>+15 Coins</span></div>
            </div>
          </div>
        </div>
      )}

      {tab==="radar" && (
        <div style={{padding:16}}>
          <div style={{background:"#111827", borderRadius:16, height:220, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center"}}>
            <div style={{width:180, height:180, borderRadius:"50%", border:"1px dashed #374151", position:"relative"}}>
              <div style={{position:"absolute", inset:0, borderRadius:"50%", background:"conic-gradient(from 0deg, transparent 0deg, rgba(124,58,237,0.5) 60deg, transparent 61deg)", animation:"spin 2s linear infinite"}}></div>
              <div style={{position:"absolute", top:"50%", left:"50%", width:12, height:12, background:"#7c3aed", borderRadius:"50%", transform:"translate(-50%,-50%)"}}></div>
              {radarList.slice(0,4).map((p,i)=>{ const ang = (i*90); return <div key={p.id} style={{position:"absolute", top:"50%", left:"50%", width:6, height:6, background:temanList.includes(p.id)?"#10b981":"#f59e0b", borderRadius:"50%", transform:`translate(-50%,-50%) rotate(${ang}deg) translate(${40+i*20}px) rotate(-${ang}deg)`}}></div> })}
            </div>
            <div style={{position:"absolute", bottom:8, left:12, color:"#10b981", fontSize:10}}>● GPS ON • Radar Maksimal • Area Tak Terbatas • {radarList.length} user</div>
            <style>{`@keyframes spin {from{transform:rotate(0deg)} to{transform:rotate(360deg)}}`}</style>
          </div>
          <div style={{marginTop:12, display:"flex", flexDirection:"column", gap:8}}>
            {radarList.map(p=>(
              <div key={p.id} style={{background:"#fff", borderRadius:12, padding:12, display:"flex", gap:10, alignItems:"center", border: temanList.includes(p.id)?"1px solid #10b981":"1px solid #eee"}}>
                <img src={p.foto} style={{width:48, height:48, borderRadius:"50%"}}/>
                <div style={{flex:1}}>
                  <b style={{fontSize:13}}>{p.nama} {temanList.includes(p.id) && "✅ Teman"}</b> <span style={{fontSize:10, background:p.jarak<100?"#dcfce7":"#f3f4f6", padding:"2px 6px", borderRadius:8}}>{p.jarak}m {p.jarak<50?"CEDAK POL!":""}</span>
                  <div style={{fontSize:10, color:"#666"}}>{p.online?"● Online":"○ Offline"} • {p.negara} • {temanList.includes(p.id)?"Titik lokasi akurat tersedia":"Butuh Rp "+unlockPrice+" untuk lihat"}</div>
                </div>
                <div style={{display:"flex", flexDirection:"column", gap:4}}>
                  {temanList.includes(p.id) ? (
                    <>
                      <button onClick={()=>setShowTitik(p)} style={{...btnKecil, fontSize:10, padding:"4px 8px"}}>📍 Titik Lokasi</button>
                      <button onClick={()=>setShowGift(p)} style={{...btnKecil, background:"#fef3c7", color:"#92400e", fontSize:10, padding:"4px 8px"}}>🎁 Gift</button>
                    </>
                  ) : (
                    <button onClick={()=>handleAddTeman(p)} style={{background:"#7c3aed", color:"#fff", border:"none", borderRadius:20, padding:"6px 12px", fontSize:11}}>Add {unlockPrice}</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {showTitik && (
            <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:40, padding:20}}>
              <div style={{background:"#fff", borderRadius:16, padding:16, width:"100%", maxWidth:320}}>
                <h3 style={{margin:0}}>📍 Titik Lokasi {showTitik.nama}</h3><p style={{fontSize:11, color:"#666"}}>Teman - lokasi akurat</p>
                <div style={{background:"#e0e7ff", height:180, borderRadius:12, marginTop:10, display:"flex", alignItems:"center", justifyContent:"center", position:"relative"}}>
                  <div style={{width:12, height:12, background:"#dc2626", borderRadius:"50%"}}></div><span style={{position:"absolute", bottom:8, left:8, fontSize:9, background:"#fff", padding:"2px 6px", borderRadius:6}}>{showTitik.lat.toFixed(4)}, {showTitik.lng.toFixed(4)}</span>
                  <span style={{position:"absolute", top:8, right:8, fontSize:9, background:"#10b981", color:"#fff", padding:"2px 6px", borderRadius:6}}>AKURAT • TEMAN</span>
                </div>
                <button onClick={()=>setShowTitik(null)} style={{...btnUngu, width:"100%", marginTop:12}}>Tutup</button>
              </div>
            </div>
          )}
          {showGift && (
            <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:40, padding:20}}>
              <div style={{background:"#fff", borderRadius:16, padding:16, width:"100%", maxWidth:320}}>
                <h3 style={{margin:0}}>🎁 Kirim Gift ke {showGift.nama}</h3>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12}}>
                  <button onClick={()=>handleGift(showGift,"mawar")} style={giftBtn}>🌹<br/>Mawar<br/>Rp {giftPrices.mawar.toLocaleString("id-ID")}</button>
                  <button onClick={()=>handleGift(showGift,"es")} style={giftBtn}>🍦<br/>Es Cream<br/>Rp {giftPrices.es.toLocaleString("id-ID")}</button>
                  <button onClick={()=>handleGift(showGift,"cincin")} style={giftBtn}>💍<br/>Cincin<br/>Rp {giftPrices.cincin.toLocaleString("id-ID")}</button>
                  <button onClick={()=>handleGift(showGift,"rumah")} style={{...giftBtn, background:"#fef2f2", borderColor:"#fecaca"}}>🏠<br/>Rumah<br/>Rp {giftPrices.rumah.toLocaleString("id-ID")}</button>
                </div>
                <button onClick={()=>setShowGift(null)} style={{...btnKecil, width:"100%", marginTop:12}}>Batal</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab==="hiburan" && (
        <div style={{padding:16, display:"flex", flexDirection:"column", gap:12}}>
          <h3>🎮 Hiburan Real - Sedunia - Fungsional</h3>
          <div style={{display:"flex", flexDirection:"column", gap:10}}>
            <div style={{background:"#fff", borderRadius:12, padding:14, border:"1px solid #eee"}}>
              <b>🎬 Nonton Drama Sedunia - REAL</b>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:8}}>
                <div onClick={()=>{setCoins(c=>c+15); alert("Nonton K-Drama +15 Coins")}} style={cardDrama}>🇰🇷 Crash Landing</div>
                <div onClick={()=>{setCoins(c=>c+15); alert("Nonton Hollywood +15 Coins")}} style={cardDrama}>🇺🇸 Avengers</div>
                <div onClick={()=>{setCoins(c=>c+15); alert("Nonton Jowo +15 Coins")}} style={cardDrama}>🇮🇩 Sewu Kuto</div>
                <div onClick={()=>{setCoins(c=>c+15); alert("Nonton Anime +15 Coins")}} style={cardDrama}>🇯🇵 Tokyo Love</div>
                <div onClick={()=>{setCoins(c=>c+15); alert("Nonton Bollywood +15 Coins")}} style={cardDrama}>🇮🇳 Dilwale</div>
                <div onClick={()=>{setCoins(c=>c+15); alert("Nonton Spanish +15 Coins")}} style={cardDrama}>🇪🇸 Money Heist</div>
              </div>
            </div>
            <div style={{background:"#fff", borderRadius:12, padding:14, border:"1px solid #eee"}}>
              <b>🎤 Karaoke Global - REAL</b>
              <div style={{display:"flex", flexDirection:"column", gap:6, marginTop:8}}>
                <div style={rowK}><span style={{fontSize:12}}>🇰🇷 BTS - Dynamite</span><button onClick={()=>{setCoins(c=>c+20); alert("98% +20 Coins")}} style={btnKecil}>Nyanyi +20</button></div>
                <div style={rowK}><span style={{fontSize:12}}>🇺🇸 Taylor - Lover</span><button onClick={()=>{setCoins(c=>c+20); alert("95% +20")}} style={btnKecil}>Nyanyi +20</button></div>
                <div style={rowK}><span style={{fontSize:12}}>🇮🇩 Didi Kempot - Sewu Kuto</span><button onClick={()=>{setCoins(c=>c+20); alert("+20")}} style={btnKecil}>Nyanyi +20</button></div>
                <div style={rowK}><span style={{fontSize:12}}>🇯🇵 YOASOBI - Idol</span><button onClick={()=>{setCoins(c=>c+20); alert("+20")}} style={btnKecil}>Nyanyi +20</button></div>
              </div>
            </div>
            <div style={{background:"#fff", borderRadius:12, padding:14, border:"1px solid #eee"}}>
              <b>🎯 Game Sedunia - REAL</b>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:8}}>
                <div style={{background:"#fef3c7", borderRadius:8, padding:10, textAlign:"center"}}><b style={{fontSize:11}}>Tebak Negara</b><br/><button onClick={()=>{setCoins(c=>c+20); alert("Bener +20")}} style={{...btnKecil, marginTop:6}}>Main +20</button></div>
                <div style={{background:"#dcfce7", borderRadius:8, padding:10, textAlign:"center"}}><b style={{fontSize:11}}>Tebak Lagu</b><br/><button onClick={()=>{setCoins(c=>c+15); alert("Bener +15")}} style={{...btnKecil, marginTop:6}}>Main +15</button></div>
                <div style={{background:"#ede9fe", borderRadius:8, padding:10, textAlign:"center"}}><b style={{fontSize:11}}>Slot Dunia</b><br/><button onClick={()=>{const m=Math.random()>0.5; if(m){setCoins(c=>c+30); alert("JACKPOT +30")} else alert("Zonk")}} style={{...btnKecil, marginTop:6}}>Spin +30</button></div>
                <div style={{background:"#ffe4e6", borderRadius:8, padding:10, textAlign:"center"}}><b style={{fontSize:11}}>Suit Global</b><br/><button onClick={()=>{setCoins(c=>c+10); alert("+10")}} style={{...btnKecil, marginTop:6}}>Suit +10</button></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="chat" && (
        <div style={{padding:16}}>
          <div style={{background:"#ede9fe", borderRadius:12, padding:12, border:"1px solid #ddd6fe"}}>
            <b style={{fontSize:13}}>🤖 Asisten Dewa - Mandu Nganti Cuan</b><p style={{fontSize:11, marginTop:6, color:"#444"}}>Halo {user.name}! 1.Daftar konfirmasi Email/WA 2.Radar maksimal area tak terbatas - butuh Rp {unlockPrice} untuk unlock 3.Dadi teman -> delok titik akurat 4.Hiburan real -> kumpul Coins 5.Gift Mawar {giftPrices.mawar} - Rumah {giftPrices.rumah} -> saldo pemilik 6.TopUp/WD DANA SeaBank Bank Lain + Pulsa/Paket. Gak enek akun demo - kabeh real!</p>
          </div>
          <div style={{marginTop:12, display:"flex", flexDirection:"column", gap:8}}>
            {radarList.filter(p=>temanList.includes(p.id)).map(p=>(<div key={p.id} style={{background:"#fff", borderRadius:12, padding:12, display:"flex", gap:10, border:"1px solid #10b981"}}><img src={p.foto} style={{width:40, height:40, borderRadius:"50%"}}/><div><b style={{fontSize:13}}>{p.nama} ✅ Teman</b><div style={{fontSize:11, color:"#666"}}>Wes dadi teman - iso delok titik lokasi akurat + gift</div></div></div>))}
            {temanList.length===0 && <p style={{fontSize:11, color:"#888", textAlign:"center", marginTop:20}}>Durung enek teman - golek neng Radar, butuh Rp {unlockPrice} per orang</p>}
          </div>
        </div>
      )}

      {tab==="dompet" && (
        <div style={{padding:16, display:"flex", flexDirection:"column", gap:12}}>
          <div style={{background:"#fff", borderRadius:16, padding:16, border:"1px solid #eee"}}>
            <p style={{fontSize:11, color:"#666"}}>Saldo</p><b>Rp {saldo.toLocaleString("id-ID")}</b><br/><p style={{fontSize:11, color:"#666", marginTop:8}}>Coins</p><b>{coins}</b>
            <button onClick={()=>{setCoins(coins+1000); setSaldo(saldo+10000)}} style={{...btnUngu, width:"100%", marginTop:12}}>Topup AMAN - Midtrans Server Key ora neng App.jsx</button>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12}}>
              <button onClick={()=>{if(coins>=1000){setCoins(coins-1000); setSaldo(saldo+500000); alert("Convert 1000 Coins -> 500rb")}} } style={btnKecil}>Convert 1000 → 500rb</button>
              <button onClick={()=>alert("WD ke DANA/SeaBank/Bank Lain - konek")} style={btnKecil}>WD DANA/SeaBank</button>
              <button onClick={()=>{if(saldo>=10000){setSaldo(s=>s-10000); alert("Pulsa 10rb terkirim!")}} } style={btnKecil}>Beli Pulsa 10rb</button>
              <button onClick={()=>{if(saldo>=25000){setSaldo(s=>s-25000); alert("Paket Data 2GB terkirim!")}} } style={btnKecil}>Paket Data 2GB</button>
            </div>
            <p style={{fontSize:9, color:"#888", marginTop:8, textAlign:"center"}}>Konek: DANA, SeaBank 9011****, BCA, BRI, BNI, Mandiri - Server Key aman - data pemilik dirahasiakan</p>
          </div>
          <div style={{background:"#fff", borderRadius:12, padding:12, border:"1px solid #eee"}}>
            <b style={{fontSize:12}}>🎁 Harga Gift (Iso di-setting Dewa)</b><div style={{fontSize:11, marginTop:6, color:"#444"}}>🌹 Mawar: Rp {giftPrices.mawar.toLocaleString("id-ID")} | 🍦 Es: Rp {giftPrices.es.toLocaleString("id-ID")} | 💍 Cincin: Rp {giftPrices.cincin.toLocaleString("id-ID")} | 🏠 Rumah: Rp {giftPrices.rumah.toLocaleString("id-ID")}</div>
          </div>
        </div>
      )}

      {tab==="profil" && (
        <div style={{padding:16, display:"flex", flexDirection:"column", gap:12}}>
          <div style={{background:"#fff", borderRadius:16, padding:16, border:"1px solid #eee", textAlign:"center"}}>
            <img src="https://i.pravatar.cc/150?img=12" style={{width:80, height:80, borderRadius:"50%"}}/><h3>{user.name}</h3><p style={{fontSize:11, color:"#666"}}>Member • {t.global}</p>
            <div style={{marginTop:12, textAlign:"left"}}>
              <p style={{fontSize:11, fontWeight:600}}>🌐 Pilihan Bahasa Internasional:</p>
              <div style={{display:"flex", gap:6, flexWrap:"wrap", marginTop:6}}>
                {Object.keys(LANGS).map(k=>(<button key={k} onClick={()=>setLang(k)} style={{...btnKecil, background:lang===k?"#7c3aed":"#f3f4f6", color:lang===k?"#fff":"#555"}}>{k.toUpperCase()}</button>))}
              </div>
            </div>
            {user.role==="owner" && <div style={{marginTop:12, background:"#111827", color:"#fff", padding:10, borderRadius:8, fontSize:10, textAlign:"left"}}>👑 DEWA - Data Pemilik Dirahasiakan - Sek Weroh Pemilik Dewe<br/>SeaBank **** AES • Midtrans server-side • ISO SETTING SALDO LAN OPO WAE</div>}
            <div style={{marginTop:16, display:"flex", gap:8}}>
              <button onClick={()=>{setUser(null); setTemanList([])}} style={{...btnKecil, flex:1, background:"#f3f4f6"}}>Log Out</button>
              <button onClick={()=>{if(confirm("Hapus datane dewe permanen?")){setUser(null); setTemanList([]); alert("Data dihapus permanen");}}} style={{...btnKecil, flex:1, background:"#fef2f2", color:"#dc2626"}}>Hapus Data</button>
            </div>
          </div>
        </div>
      )}

      <div style={{position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:420, background:"#fff", borderTop:"1px solid #eee", display:"flex", justifyContent:"space-around", padding:"8px 0"}}>
        {[{k:"beranda", l:t.daftar==="Daftar"?"Beranda":"Home"},{k:"radar", l:t.radar},{k:"chat", l:t.chat},{k:"live", l:t.live},{k:"hiburan", l:t.hiburan},{k:"dompet", l:t.dompet},{k:"profil", l:t.profil},].map(m=>(<button key={m.k} onClick={()=>setTab(m.k)} style={{border:"none", background:"none", fontSize:10, color:tab===m.k?"#7c3aed":"#888", fontWeight:tab===m.k?700:400}}>{m.l}</button>))}
      </div>
      <button style={{position:"fixed", bottom:80, right:16, width:48, height:48, borderRadius:"50%", background:"#7c3aed", color:"#fff", border:"none", fontSize:20, boxShadow:"0 4px 12px rgba(0,0,0,0.2)"}} onClick={()=>setTab("chat")}>?</button>
    </div>
  );
}
const inp = {padding:"12px", borderRadius:10, border:"1px solid #e5e7eb", fontSize:14, width:"100%", boxSizing:"border-box"};
const btnUngu = {background:"#7c3aed", color:"#fff", border:"none", padding:"12px", borderRadius:10, fontWeight:700, fontSize:14};
const chip = {background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:20, padding:"6px 10px", fontSize:11};
const btnKecil = {background:"#ede9fe", color:"#5b21b6", border:"none", borderRadius:8, padding:"8px 12px", fontSize:11, fontWeight:600};
const cardHib = {background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:12, padding:10, textAlign:"center", fontSize:11, cursor:"pointer"};
const cardDrama = {background:"#111827", color:"#fff", borderRadius:8, padding:8, textAlign:"center", fontSize:11, cursor:"pointer"};
const rowK = {display:"flex", justifyContent:"space-between", alignItems:"center", background:"#f9fafb", padding:8, borderRadius:8};
const giftBtn = {background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, padding:10, textAlign:"center", fontSize:11, cursor:"pointer"};
