
import Menu from "./Menu.jsx";

function Salvos() {
    
    return (
        <>
            <section className="bg-gradient-to-b from-blue-100 to-purple-100 h-screen w-full  flex flex-col items-center ">
                <Menu />

                <div className="flex flex-col pt-10  h-20 w-85 ">
                    <h2 className="font-bold text-2xl">Frases Salvas</h2>
                    <p className="text-stone-600 ">Suas frases favorita em um só lugar</p>
                </div>

                <div className="bg-zinc-50 w-85 h-80 mt-10 rounded-xl shadow-lg p-6 flex flex-col pt-10">
                   
                    <div className="flex flex-col items-center justify-center h-full">
                        <img className="w-20 h-20 hover:scale-110 cursor-pointer" src="src/assets/img/icon-save-ligth.png" alt="save" />
                        <h3 className="font-semibold text-lg">Nenhuma frase salva ainda</h3>
                        <p className="text-stone-600 text-center mt-2">Quando você salvar frases, elas aparecerão aqui para que você possa acessá-las facilmente.</p>
                        
                    </div>
                </div>


            </section>
        </>
    )
}

export default Salvos