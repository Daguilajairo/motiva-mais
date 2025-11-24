import { useState } from "react";

function Estado() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="flex items-center gap-1">

        {/* ❤️ FAVORITO */}
        <img
          onClick={() => setLiked(!liked)}
          className="w-5 h-5 hover:scale-110 cursor-pointer"
          src={
            liked
              ? "src/assets/img/icon-favorite-red.png"   
              : "src/assets/img/icon-favorite.png"       
          }
          alt="favorite"
        />
        <p className="pr-4">42</p>

        {/* ⭐ SALVAR */}
        <img
          onClick={() => setSaved(!saved)}
          className="w-5 h-5 hover:scale-110 cursor-pointer"
          src={
            saved
              ? "src/assets/img/icon-save-yellow.png"    
              : "src/assets/img/icon-save.png"           
          }
          alt="save"
        />

      </div>
    </div>
  );
}

export default Estado;
