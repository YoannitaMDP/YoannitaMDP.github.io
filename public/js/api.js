var base_url = "https://api.football-data.org/v2/";

// ambil token, daftar di https://www.football-data.org/client/register
let api_token = '0b1d2abf7a554516b3a5c02b0d2b0745'; 

var id_liga = 2014;

var endpoint_standings = `${base_url}competitions/${id_liga}/standings?standingType=TOTAL`;
var endpoint_competitions = `${base_url}competitions/${id_liga}/matches?status=SCHEDULED`; // ambil yg akan berlangsung
var endpoint_team = `${base_url}teams/`;

var fetchAPIData = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': api_token
        }
    });
}

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
}

function getStandings() {
  return new Promise(function (resolve, reject) {
    if ("caches" in window) {
      caches.match(endpoint_standings).then(function(response) {
        if (response) {
          response.json().then(function(data) {
            resultStanding(data);
            resolve(data);
          });
        }
      });
    }

    fetchAPIData(endpoint_standings)
      .then(status)
      .then(json)
      .then(function(data) {
        resultStanding(data);  // html
        resolve(data);
      })
      .catch(error);
  });
}

function resultStanding(data) {
  let seasonStart = new Date(data.season.startDate).toLocaleDateString("id-IN", {
      day: '2-digit', month: 'long', year: 'numeric'
    }).replace(/ /g, ' ')
  let seasonEnd = new Date(data.season.endDate).toLocaleDateString("id-IN", {
      day: '2-digit', month: 'long', year: 'numeric'
    }).replace(/ /g, ' ')
  let lastUpdated = new Date(data.competition.lastUpdated).toLocaleDateString("id-IN", {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit',minute: '2-digit'
    }).replace(/ /g, ' ').replaceAll('.', ':')

  standingHeader = `
  <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
        <table class="bordered centered highlight striped responsive-table">
        <thead>
            <tr>
                <th>Nama Liga</th>     
                <th>Area</th>                      
                <th>Tanggal Mulai</th>
                <th>Tanggal Selesai</th>
                <th>Update Terakhir</th>
            </tr>
        </thead>
        <tbody id="standings">
            <tr>
                <td>${data.competition.name} (${data.competition.code})</td>      
                <td>${data.competition.area.name}</td>                         
                <td>${seasonStart}</td>
                <td>${seasonEnd}</td>
                <td>${lastUpdated}</td>
            </tr>
        </tbody>
        </table>

    </div>

  <h4 class="a-font-bold center-align"><b> ${data.competition.name}</b></h4>
  <h6 class="a-font-bold center-align"><b>Tanggal : ${seasonStart} s.d. ${seasonEnd}</b></h6>
  `

  var standingDataHTML = ''
  var standingDetail = ''
   
    data.standings[0].table.forEach(function (club) {  
      club = JSON.parse(JSON.stringify(club).replace(/http:/g, 'https:'));
      standingDetail += `<tr>
          <td class="center-align">${club.position}</td>

          <td class="center-align">
          <a href="./detaildata.html?id=${club.team.id}">
              <p class="hide-on-small-only">
                  <img class ="show-on-medium-and-up show-on-medium-and-down" 
                  style="width:22px;height:22px;float:left" src=${club.team.crestUrl}  alt="logo">
                  ${club.team.name}
              </p>
              <p class="hide-on-med-and-up">
                  <img src=${club.team.crestUrl}  alt="logo" style="float:left;width:22px;height:22px;">
              </p>
          </a>
          </td>

          <td class="center-align">${club.playedGames}</td>
          <td class="center-align">${club.won}</td>
          <td class="center-align">${club.draw}</td>
          <td class="center-align">${club.lost}</td>
          <td class="center-align">${club.goalsFor}</td>
          <td class="center-align">${club.goalsAgainst}</td>
          <td class="center-align">${club.goalDifference}</td>
          <td class="center-align"><b>${club.points}</b></td>
          <td class="center-align">${club.form}</td>
      </tr>`
  })

  standingDataHTML += `
  <div class="card">
      <div class="card-content">
         
          <table class="responsive-table striped" >
              <thead>
              <tr>
                  <th class="center-align">Posisi</th>
                  <th>Nama Tim</th>
                  <th class="center-align">Total bermain</th>
                  <th class="center-align">Menang</th>
                  <th class="center-align">Seri</th>
                  <th class="center-align">Kalah</th>
                  <th class="center-align">Gol yg dicetak</th>
                  <th class="center-align">Gol kebobolan</th>
                  <th class="center-align">Selisih Gol</th>
                  <th class="center-align">Poin</th>
                  <th class="center-align">Form</th>
              </tr>
              </thead>
              <tbody>` + standingDetail + `</tbody>
          </table>
      </div>
  </div>`
 // });

  document.getElementById("league_standing").innerHTML = standingHeader + standingDataHTML;
}


function getJadwalPertandingan() {
  if ("caches" in window) {
    caches.match(endpoint_competitions).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          dataPertandingan(data);  // html
        });
      }
    });
  }

  fetchAPIData(endpoint_competitions)
    .then(status)
    .then(json)
    .then(function(data) {
      dataPertandingan(data);
    })
    .catch(error);
}

function dataPertandingan(data) {
  
  // last update 
  let lastUpdated = new Date(data.competition.lastUpdated).toLocaleDateString("id-IN", {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).replace(/ /g, ' ').replaceAll('.', ':')
  matchHeader = `<h7 class="center-align"><i>Terakhir diperbarui ${lastUpdated}</i></h7> <br/><br/>`

  // data pertandingan 
  let tanggalPertandingan = ''
  var groupMatchHTML = ''
  data.matches.forEach(function (pertandingan) {

      tanggalPertandingan = new Date(pertandingan.utcDate).toLocaleDateString("id-IN", {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit',minute: '2-digit'
        }).replace(/ /g, ' ').replaceAll('.', ':')

      groupMatchHTML += `
        <div class="col s12 m6 l6">
        <div class="card">

          <div class="card-image teal lighten-1">
              <div class="row s12 truncate center-align">
                  <h6> <b>${tanggalPertandingan}</b> </h6>
              </div>
          </div>

          <div class="row s12">

            <div class="col s5">
                <a href="./detaildata.html?id=${pertandingan.homeTeam.id}">
                  <span class="orange-text text-darken-2 ">${pertandingan.homeTeam.name}  </span>
                </a>
              </div>


              <div class="col s2">
                <span  class="blue-text">VS</span>
              </div>
            

              <div class="col s5">
                  <a href="./detaildata.html?id=${pertandingan.awayTeam.id}">
                    <span class="orange-text text-darken-2 ">${pertandingan.awayTeam.name}  </span>
                  </a>
              </div>
              
          </div>
           
        </div>
      </div>`
  });
  document.getElementById("jadwaltanding").innerHTML = matchHeader + groupMatchHTML;  // ganti loading circle dgn isi di atas
}

function getDetailTeamById() {
  return new Promise(function (resolve, reject) {
      var urlParams = new URLSearchParams(window.location.search);
      var idParam = urlParams.get("id");
      console.log( "idParam=", idParam);
      var dataSquadHTML = ''
      var tableSquadHTML = ''
      if ("caches" in window) {
          caches.match(endpoint_team + idParam).then(function (response) {
              if (response) {
                  response.json().then(function (data) {
                    resultTeamDetail(data)
                    data.squad.forEach(function (squad, index) {
                        dataSquadHTML += `
                        <tr>
                            <td>${index+1}. </td>
                            <td>${squad.name}</td>
                            <td>${squad.nationality}</td>
                            <td>${squad.position}</td>
                        </tr>`
                    });
                    
                    tableSquadHTML = `
                    <table class="responsive-table striped" >
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Pemain</th>
                            <th>Kewarganegaraan</th>
                            <th>Posisi</th>
                        </tr>
                        </thead>
                        <tbody>${dataSquadHTML}</tbody>
                    </table>`
        
                    document.getElementById("squad_list").innerHTML = tableSquadHTML;
                    resolve(data);
                  });
              }
          });
      }

      fetchAPIData(endpoint_team + idParam)
          .then(status)
          .then(json)
          .then(function (data) {
              resultTeamDetail(data)
              dataSquadHTML = ''
              var tgl_lahir = '';

              data.squad.forEach(function (squad, index) {

                tgl_lahir = new Date(squad.dateOfBirth).toLocaleDateString("id-IN", {
                  day: '2-digit', month: 'long', year: 'numeric'
                }).replace(/ /g, ' ')

                  dataSquadHTML += `
                  <tr>
                      <td>${index+1}. </td>
                      <td>${squad.name}</td>
                      <td>${squad.role} - ${squad.position}</td>
                      <td>${squad.nationality}</td>
                      <td>${squad.countryOfBirth}, ${tgl_lahir}</td>
                  </tr>`
              }); 

              tableSquadHTML = `
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
              resolve(data);
          })
          .catch(error);
  });
}

function resultTeamDetail(dataTeam) {
  dataTeam = JSON.parse(JSON.stringify(dataTeam).replace(/http:/g, 'https:'));
  document.getElementById("detail_teamName").innerHTML = dataTeam.name + "</br> ("+ dataTeam.tla + ")";
  document.getElementById("detail_teamLogo").src = dataTeam.crestUrl;
  document.getElementById("detail_name").innerHTML = dataTeam.name;
  document.getElementById("detail_shortName").innerHTML = dataTeam.shortName;
  document.getElementById("detail_tla").innerHTML = dataTeam.tla;
  document.getElementById("detail_address").innerHTML = dataTeam.address;
  document.getElementById("detail_phone").innerHTML = dataTeam.phone;
  document.getElementById("detail_website").innerHTML = dataTeam.website;
  document.getElementById("detail_email").innerHTML = dataTeam.email;
  document.getElementById("detail_founded").innerHTML = dataTeam.founded;
  document.getElementById("detail_clubColors").innerHTML = dataTeam.clubColors;
  document.getElementById("detail_venue").innerHTML = dataTeam.venue;
  document.getElementById("detail_preloader").innerHTML = ''; // loading
}

function resultFavoritClub(data) {
  
  var dataClubListHeader = `
  <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
  <table class="bordered centered highlight striped responsive-table">
  <thead>
      <tr>
          <th></th>
          <th style="display:none;"></th>
          <th>Nama Club</th>                           
          <th>Venue</th>
          <th>Tahun berdiri</th>
      </tr>
  </thead>
  <tbody id="teamsRow">
  
  `

  var dataClubListHTML = ''

  data.forEach(function (team, index) {
      dataClubListHTML += `

      <tr>
        <td>${index+1}</td>
        <td style="display:none;">${team.teamId}</td>
        <td>${team.name}</td>
        <td>${team.venue}</td>
        <td>${team.founded}</td>
      </tr>`

  });

  dataClubListHTML += `
      </tbody>
      </table>

      </div>
      `

  var dataClubFavoritHTML = ''

 data.forEach(function (team, index) {
  dataClubFavoritHTML += `

  <div class="col s12 m6 l6">
      <div class="card teal lighten-1" style="border-radius:2%;">
          <div class="card-content">
              <div>
                  <h5 class="center-align">
                      <a class="yellow-text" href="./detaildata.html?id=${team.id}">    
                          <img src="${team.crestUrl}" style="width:150px;height:150px;" alt="crestimage"/><br/>
                          <span>${team.name} (${team.tla})</span>
                          </br>
                          <span class="black-text">${team.venue}</span>
                      </a>
                  </h5>          
              </div>

          </div>
      </div>
  </div> 
      
      `
 
  });


  document.getElementById("datafavorit").innerHTML = dataClubListHeader + dataClubListHTML + dataClubFavoritHTML;
}