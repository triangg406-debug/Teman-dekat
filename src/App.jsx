import React, { useState } from 'react'
export default function App(){
  const [saldo,setSaldo]=useState(47500)
  const [tab,setTab]=useState('dekat')
  const users=[
    { id:1, n:'Sari, 21', j:'200m', h:'Cari teman ngopi', i:'S' },
    { id:2, n:'Bima, 23', j:'450m', h:'Futsal sore ini', i:'B' },
    { id:3, n:'Riko, 22', j:'1.2km', h:'Mabar ML', i:'R' },
    { id:4, n:'Ayu, 20', j:'800m', h:'Nonton bioskop', i:'A' },
  ]
  return(
    <div className="min-h-screen bg-[#0f0a1e] text-white flex justify-center">
      <div className="w-full max-w-[420px] bg-[#0f0a1e] min-h-screen">
        <div className="p-4 flex justify-between">
          <h1 className="font-black">TemanDekat</h1>
          <div className="bg-purple-600 px-3 py-1 rounded-full text-sm">Rp {saldo}</div>
        </div>
        <div className="p-4 space-y-3">
          {users.map(u=>(
            <div key={u.id} className="bg-[#1e1635] p-4 rounded-xl flex justify-between">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">{u.i}</div>
                <div><div className="font-bold">{u.n} • {u.j}</div><div className="text-xs text-zinc-400">{u.h}</div></div>
              </div>
              <button onClick={()=>setSaldo(s=>s+500)} className="bg-purple-600 px-3 py-1 rounded-full text-xs">Sapa</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
