import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu.jsx";
import Estado from "./Estado.jsx";

function Populares() {
    const [selected] = useState("populares");
    const navigate = useNavigate();
    return (
        <>
            <section className="bg-gradient-to-b from-blue-100 to-purple-100 h-screen w-full  flex flex-col items-center ">
                <Menu/>

                <div className="flex items-center justify-between h-20 w-85 ">
                    <h2 className="font-bold text-2xl">Feed</h2>
                    <div className="flex">
                        <p onClick={() => navigate("/feed")} className={`px-4 py-2 rounded-full cursor-pointer ${selected === "recentes" ? "bg-purple-500 text-white" : selected === "" ? "hover:bg-purple-400 hover:text-white" : ""}`}>Recentes</p>
                        <p
                            onClick={() => navigate("/populares")}
                            className={`px-4 py-2 rounded-full cursor-pointer ${selected === "populares" ? "bg-purple-500 text-white" : selected === "" ? "hover:bg-purple-400 hover:text-white" : ""}`}>Populares</p>
                    </div>
                </div>

                <div className="bg-zinc-50 w-85 h-80 mt-4 rounded-xl shadow-lg p-6 flex flex-col pt-10">
                    <div className="flex gap-2">
                            <img className="w-12 h-12 hover:scale-110 cursor-pointer" src="src/assets/img/icon-avatar.png" alt="avatar" />
                    <div>
                    <h1 className="font-bold text-base">Jessica D'aguila</h1>
                    <p className="text-sm text-stone-500">Há 2h</p>
                    </div>
                    </div>

                    <div className="mt-4">
                    <p className="text-base">Acredite em si mesmo e tudo será possível.</p>
                    </div>

            
                    <div className="flex mt-4 gap-2 text-purple-500">
                        <p>#autoconfiança</p>
                        <p>#positividade</p>  
                    </div>


                    <Estado/>
                </div>


            </section>
        </>
    )
}

export default Populares