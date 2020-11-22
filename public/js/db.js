const dbPromised = idb.open('teams_database', 1, upgradedDb => {
  if (!upgradedDb.objectStoreNames.contains('myFavoritClub')) {
      upgradedDb.createObjectStore("myFavoritClub", {keyPath: "id"});
  }
});

/*cek apakah id club adalah favorit atau bukan */
function checkData(id) {   // detaildata.html
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
          var transaction = db.transaction("myFavoritClub", "readonly");
          return transaction.objectStore("myFavoritClub").get(id);
      })
      .then(function (data) {
          if (data != undefined) {
              resolve(data)
          } else {
              reject("Bukan club favorit :( ")
          }
      });
  });
}


function simpanFavoritClub(favclub) {
  detailData = {
      id: favclub.id,
      name: favclub.name,
      shortName: favclub.shortName,
      tla: favclub.tla,
      crestUrl: favclub.crestUrl,
      address: favclub.address,
      phone: favclub.phone,
      website: favclub.website,
      email: favclub.email,
      founded: favclub.founded,
      clubColors: favclub.clubColors,
      venue: favclub.venue,
      squad: favclub.squad
  }
  dbPromised
    .then(function(db) {
      var transaction = db.transaction("myFavoritClub", "readwrite");
      var store = transaction.objectStore("myFavoritClub");
      store.put(detailData);
      return transaction.complete;
    })
    .then(function() {
      console.log("berhasil save Favourite team .");
      document.getElementById("icon_Fav").innerHTML = "favorite";
      document.getElementById("text_Fav").innerHTML = " HAPUS DARI FAVORIT";
      M.toast({
        html: `Tim Favoritmu ${favclub.name} berhasil disimpan!`
      });
      // notif
      const title = 'PWA Notification';
      const options = {
          'body': `Tim Favoritmu ${favclub.name} berhasil disimpan`,
          'icon': 'assets/image/icon-512.png'
      };
      navigator.serviceWorker.getRegistration().then(function (reg) {
          reg.showNotification(title, options);
      });
    });
}

function deleteFavoritClub(id, name) {
  dbPromised.then(function (db) {
      var transaction = db.transaction("myFavoritClub", 'readwrite');
      var store = transaction.objectStore("myFavoritClub");
      store.delete(id);
      return transaction.complete;
  }).then(function () {
      console.log('Item telah dihapus');
      document.getElementById("icon_Fav").innerHTML = "favorite_border";
      document.getElementById("text_Fav").innerHTML = " SIMPAN KE FAVORIT";
      M.toast({
          html: `${name} berhasil dihapus dari Favorit!`
      });
      // notif
      const title = 'PWA Notification';
      const options = {
          'body': `${name} berhasil dihapus dari Favorit!`,
          'icon': 'assets/image/icon-512.png'
      };
      navigator.serviceWorker.getRegistration().then(function (reg) {
          reg.showNotification(title, options);
      });
  });
}

function getSavedDataById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = Number(urlParams.get("id"));
  var dataSquadHTML = ''
  var tableSquadHTML = ''
  getTeamById(idParam).then(function (team) {
      resultTeamDetail(team);
      team.squad.forEach(function (squad, index) {
          dataSquadHTML += `
          <tr>
              <td>${index+1}. </td>
              <td>${squad.name}</td>
              <td>${squad.role} - ${squad.position}</td>
              <td>${squad.nationality}</td>
              <td>${squad.countryOfBirth}, ${tgl_lahir}</td>
          </tr>`
      });
      tableSquadHTML += `
        <table class="responsive-table striped" >
            <thead>
            <tr>
                <th>No</th>
                <th>Nama Pemain</th>
                <th>Posisi</th>
                <th>Kewarganegaraan</th>
                <th>Kelahiran</th>
            </tr>
            </thead>
            <tbody>${dataSquadHTML}</tbody>
        </table>`
      document.getElementById("squad_list").innerHTML = tableSquadHTML;
  })
}

function getTeamById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
          var transaction = db.transaction("myFavoritClub", "readonly");
          return transaction.objectStore("myFavoritClub").get(id);
      })
      .then(function (data) {
          resolve(data);
      });
  });
}

function getAllTeam() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
          var transaction = db.transaction("myFavoritClub", "readonly");
          return transaction.objectStore("myFavoritClub").getAll();
      })
      .then(function (data) {
          console.log(data);
          resolve(data);
      });
  });
}

function getDataFavorit() {
  getAllTeam().then(function (data) {
    resultFavoritClub(data);
  });    
}
