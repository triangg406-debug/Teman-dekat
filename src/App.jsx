import React, { useState } from 'react'

export default function App(){
  const [tab, setTab] = useState('dekat')
  const [saldo, setSaldo] = useState(47500)
  const [chats, setChats] = useState([
    { id:1, name:'Sari, 21', last:'Haiii 😊', unread:2 },
    { id:2, name:'Bima, 23', last:'Futsal jam 4 ya', unread:0 }
  ])
  const [activeChat, setActiveChat] = useState(null)
  const [pesan, setPesan] = useState('')
  const [messages, setMessages] = useState([{ dari:'dia', text:'Haiii kenal dong' }])

  const users = [
    { id:1, n:'Sari, 21', j:'200m', h:'Cari teman ngopi ☕', v:'https://i.pravatar.cc/150?img=5' },
    { id:2, n:'Ayu, 20', j:'800m', h:'Suka nonton bioskop 🎬', v:'https://i.pravatar.cc/150?img=9' },
    { id:3, n:'Bima, 23', j:'450m', h:'Anak futsal Sukoharjo ⚽', v:'https://i.pravatar.cc/150?img=12' },
  ]

  const videos = [
    { id:1, user:'Sari', url:'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id:2, user:'Ayu', url:'https://www.w3schools.com/html/movie.mp4' },
  ]

  const kirimPesan = () => {
    if(!pesan) return
    setMessages([...messages, { dari:'aku', text:pesan }])
    setPesan('')
    setSaldo(s=>s-500)
  }

  return(
    <div className="min-h-screen bg-[#0f0a1e] text-white flex justify-center">
      <div className="w-full max-w-[420px] bg-[#0f0a1e] min-h-screen flex flex-col">
        {/* HEADER */}
        <div className="p-4 flex justify-between items-center sticky top-0 bg-[#0f0a1e] z-10">
          <h1 className="font-black text-xl">TemanDekat</h1>
          <div className="bg-purple-600 px-3 py-1 rounded-full text-sm">Rp {saldo}</div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-4 pb-20 overflow-y-auto">
          {tab==='dekat' && (
            <div className="space-y-3">
              {users.map(u=>(
                <div key={u.id} className="bg-[#1e1635] p-4 rounded-2xl flex gap-3">
                  <img src={u.v} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <div className="font-bold">{u.n} • {u.j}</div>
                    <div className="text-xs text-zinc-400">{u.h}</div>
                  </div>
                  <button onClick={()=>{setActiveChat(u); setTab('chat-detail')}} className="bg-purple-600 px-4 py-1 rounded-full text-xs h-fit">Chat</button>
                </div>
              ))}
            </div>
          )}

          {tab==='chat' && (
            <div className="space-y-2">
              {chats.map(c=>(
                <div onClick={()=>{setActiveChat(c); setTab('chat-detail')}} key={c.id} className="bg-[#1e1635] p-4 rounded-2xl flex justify-between">
                  <div><div className="font-bold">{c.name}</div><div className="text-xs text-zinc-400">{c.last}</div></div>
                  {c.unread>0 && <div className="bg-red-500 w-5 h-5 rounded-full text-xs flex items-center justify-center">{c.unread}</div>}
                </div>
              ))}
            </div>
          )}

          {tab==='chat-detail' && activeChat && (
            <div className="flex flex-col h-[75vh]">
              <div className="flex gap-2 items-center mb-4"><button onClick={()=>setTab('chat')} className="text-xl">←</button><div className="font-bold">{activeChat.n || activeChat.name}</div></div>
              <div className="flex-1 space-y-2 overflow-y-auto">
                {messages.map((m,i)=>(
                  <div key={i} className={`p-3 rounded-2xl max-w-[70%] ${m.dari==='aku'? 'bg-purple-600 ml-auto' : 'bg-[#1e1635]'}`}>{m.text}</div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input value={pesan} onChange={e=>setPesan(e.target.value)} placeholder="Ketik pesan... (500 koin)" className="flex-1 bg-[#1e1635] rounded-full px-4 py-2 text-sm" />
                <button onClick={kirimPesan} className="bg-purple-600 px-5 rounded-full">➤</button>
              </div>
            </div>
          )}

          {tab==='video' && (
            <div className="space-y-4">
              {videos.map(v=>(
                <div key={v.id} className="bg-black rounded-2xl overflow-hidden">
                  <video src={v.url} controls className="w-full h-[400px] object-cover" />
                  <div className="p-3 flex justify-between"><span>@{v.user}</span><span>❤️ 1.2k</span></div>
                </div>
              ))}
            </div>
          )}

          {tab==='profil' && (
            <div className="text-center space-y-4">
              <img src="https://i.pravatar.cc/150?img=32" className="w-24 h-24 rounded-full mx-auto" />
              <div className="font-bold text-xl">Tri Angga</div>
              <div className="bg-[#1e1635] p-4 rounded-2xl">Saldo: Rp {saldo}<br/>Lokasi: Sukoharjo</div>
            </div>
          )}
        </div>

        {/* NAV */}
        <div className="fixed bottom-0 w-full max-w-[420px] bg-[#1a1330] flex justify-around py-3 rounded-t-2xl">
          <button onClick={()=>setTab('dekat')} className={tab==='dekat'?'text-purple-400':''}>🔍 Dekat</button>
          <button onClick={()=>setTab('chat')} className={tab==='chat'?'text-purple-400':''}>💬 Chat</button>
          <button onClick={()=>setTab('video')} className={tab==='video'?'text-purple-400':''}>▶️ Video</button>
          <button onClick={()=>setTab('profil')} className={tab==='profil'?'text-purple-400':''}>👤 Profil</button>
        </div>
      </div>
    </div>
  )
}
