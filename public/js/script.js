document.addEventListener('DOMContentLoaded', function(){

	// SIDEBAR NAVIGATION
	const elems = document.querySelectorAll('.sidenav');
	M.Sidenav.init(elems);
	loadNav();

	function loadNav()
	{
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState === 4){
				if(this.status != 200) return;

				// Muat daftar tautan menu
				document.querySelectorAll(".topnav, .sidenav ")
				.forEach(function(elm){
					elm.innerHTML = xhttp.responseText;
				});

				// Daftarkan event listener untuk setiap tautan menu
				document.querySelectorAll('.sidenav a, .topnav a ')
				.forEach(function(elm){
					elm.addEventListener('click', function(event){
						// Tutup sidenav
						var sidenav = document.querySelector('.sidenav');
						M.Sidenav.getInstance(sidenav).close();
						
						// Muat konten halaman yang dipanggil 
						page = event.target.getAttribute('href').substr(1);
						loadPage(page);
					});
				});
			}
		};
		xhttp.open("GET", 'nav.html', true);
		xhttp.send();
	}
	
	// Load page content
	var page = window.location.hash.substr(1);
	if(page == '') page = 'home';
	loadPage(page);

	function loadPage(page)
	{
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState === 4){
				var content = document.querySelector(".body-content");
				
				// tambahan
				if (page === "home") {
                    getStandings();
                } else if (page === "jadwal") {
                    getJadwalPertandingan();
                } else if (page === "favoritclub") {
                    getDataFavorit();
                }
				
				
				
				if(this.status == 200) {
					content.innerHTML = xhttp.responseText;
				} else if(this.status == 404) {
					content.innerHTML = "<p>Halaman tidak ditemukan. Panggil Sherlock Holmes!</p>";
				} else {
					content.innerHTML = "<p>Oopsie Dipsie.. halaman tidak dapat diakses. Rahasia Negara</p>";
				}
			}
		};
		//xhttp.open("GET", 'pages/'+page+'.html', true);
		xhttp.open("GET", `pages/${page}.html`, true);
		xhttp.send();
	}

});
