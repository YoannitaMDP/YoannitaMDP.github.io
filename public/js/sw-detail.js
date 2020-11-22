document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible.expandable');
    var instances = M.Collapsible.init(elems, {
        accordion: false
    });
});

// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
    navigator.serviceWorker
        .register("/service-worker.js")
        .then(function() {
        console.log("OK> Pendaftaran ServiceWorker berhasil");
        })
        .catch(function() {
        console.log("GAGAL> Pendaftaran ServiceWorker gagal");
        });
    });
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}


// atur FAVORIT
document.addEventListener("DOMContentLoaded", function() {
var urlParams = new URLSearchParams(window.location.search);
var id = Number(urlParams.get("id"));
var isFavorit = false;

// cek yg mau ditampilin di button adl tulisan Hapus atau Tambah:
checkData(id).then((msg) => {
    console.log("statusData: Resolve = " + msg);
    document.getElementById("icon_Fav").innerHTML = "favorite";
    document.getElementById("text_Fav").innerHTML = " Hapus Dari Favorit"
    getSavedDataById()
    isFavorit = true
}).catch((msg) => {
    console.log("statusData: Reject = " + msg);
    document.getElementById("icon_Fav").innerHTML = "favorite_border";
    document.getElementById("text_Fav").innerHTML = " SIMPAN KE FAVORIT"
    getDetailTeamById()
    isFavorit = false
})

// Cek kalau button diklik berarti save / delete
var btnFavorit = document.getElementById("btnFavorit");
btnFavorit.onclick = function () {
    console.log("button Favorit dipilih(tambah/hapus)");
    if (isFavorit) {
        console.log("hapus fav");
        var team_name = document.getElementById("detail_name").innerHTML;
        deleteFavoritClub(id, team_name);  // db.js
        isFavorit = false
    } else {
        console.log("save fav");               
        items = getDetailTeamById();
        // console.log(items);
        items.then(function (team) {
            simpanFavoritClub(team);
        });
        isFavorit = true
    }

};
});
