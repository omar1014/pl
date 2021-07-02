function conexionrest() {
        // var conexion = 'https://www.playfoot.cl:8443/';
        var conexion = 'https://782f0210c8db.ngrok.io/';
        return conexion;
}

//Se encarga que cuando exista un error de conexión se consulte reconectar
function errorTimeOutConnect(){
        /*Ennvia solicitud de juego al partido */
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            function onConfirConnect(buttonIndex) {
                if(buttonIndex==1){
                        var curr = window.location.href;
                        window.location.href = curr;
                }
            }
            navigator.notification.confirm(
                'Ha ocurrido un error de conexión al servicio, ¿Desea reintentar la conexión?', // message
                 onConfirConnect,  // callback to invoke with index of button pressed
                'Error de conexión',  // title
                ['Reintentar','']     // buttonLabels
            );
        }
}

var hostname = conexionrest();

$( "#formlogin" ).submit(function( event ) {

        var usu = $('#usern').val();
        var pas = $('#passn').val();

        if(usu.trim()==''){
                showBottom("Ingrese nombre de usuario.");
                event.preventDefault();
        }else if(usu.length>20){
                showBottom("Nombre de usuario supera el máximo.");
                event.preventDefault();
        }else if(pas.trim()==''){
                showBottom("Ingrese su clave.");
                event.preventDefault();
        }else if(pas.length>10){
                showBottom("Clave supera máximo de 10 crts.");
                event.preventDefault();
        }else if($('#lat1').val()=="" || $('#lon1').val()==""){
                showBottom("Error en coordenadas de ubicación.");
                event.preventDefault();
        }else if($('#playerid').val()==""){
                showBottom("Error en Player ID.");
                event.preventDefault();
        }else if($('#deviceid').val()==""){
                showBottom("Error en ID del dispositivo.");
                event.preventDefault();
        }else{
                return;
        }

});


function validafecha(fecha){
        var resp;
        var fechat = fecha.toString().substring(0,4);
        var fechanum = parseInt(fechat);
        var d = new Date();
        var ano = d.getFullYear();
        var dif = 0;
        dif = ano - fechanum;
        if(dif>15){
                resp = 1;
        }else{
                resp = 0;
        }
        return resp;
}

function validaLogin(){
        var usu = $('#usern').val();
        var pas = $('#passn').val();
        loginUser(usu,pas,$('#lat1').val(),$('#lon1').val(),$('#playerid').val(),$('#deviceid').val());
}

function recargaMenFro(){
        cuentaMisMensajes($('#idutext').text());
        actualizaCaliAsis($('#idutext').text());
}

function loginUser(username,passwd,actlat,actlon,player,device){
        var parametros = {
                "username" : username,
                "passwd" : passwd,
                "actlat" : actlat,
                "actlon" : actlon,
                "player" : player,
                "device" : device
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/loginusuario.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#reslogin").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#reslogin").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    var len = response.length;
                    for(var i=0; i<=len; i++){
                        $("#reslogin").html('');
                        if(response[i].idu==0){
                                showBottom("Usuario o clave incorrectos.");
                        }else{
                                if(response[i].est=="PD"){
                                        window.location.href = "#activa";
                                        showBottom("Usuario pendiente activación.");
                                }else{
                                        if(response[i].lat.toString().substring(0,7)!=response[i].alat.toString().substring(0,7) || response[i].lng.toString().substring(0,7)!=response[i].alng.toString().substring(0,7)){
                                                window.location.href = "inicio.html?userid="+response[i].idu+"&latbd="+response[i].lat+"&lonbd="+response[i].lng+"&actlat="+response[i].alat+"&actlon="+response[i].alng+"&actest=AC";
                                        }else{
                                                window.location.href = "inicio.html?userid="+response[i].idu+"&latbd="+response[i].lat+"&lonbd="+response[i].lng+"&actlat="+response[i].alat+"&actlon="+response[i].alng+"&actest=NAC";
                                        }
                                }

                        }

                    }
                }
        });
}

$( "#formactiva" ).submit(function( event ) {

        if($("#codacti").val().trim()==""){
                showBottom("Ingrese código de validación");
                event.preventDefault();
        }else{
                return; 
        }
});

function activaCuentaE(){
        activandoCuenta($("#deviceid").val(),$("#codacti").val());
}

function activandoCuenta(device,codac){
        var parametros = {
                "device" : device,
                "codac" : codac
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/activacuenta.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resactiva").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resactiva").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#resactiva").html('');
                    var len = response.length;
                    for(var i=0; i<len; i++){
                        if(response[i].estac=="AC"){
                                showBottom("Cuenta activada exitosamente.");
                                window.location.href = "#inicio";
                        }else{
                                showBottom("Código de validación incorrecto!");   
                        }
                    }

                }
        });
}

function obtieneDatos(idusuario){
        var parametros = {
                "idusuario" : idusuario
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/obtienerusuario.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resdata").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resdata").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    var len = response.length;
                    for(var i=0; i<len; i++){
                        $("#resdata").html('');
                        if(response[i].pref=="Futbolito"){
                                $("#prefpl").val("FO");
                        } else if(response[i].pref=="Salon"){
                                $("#prefpl").val("FS");
                        }else{
                                $("#prefpl").val("FU");
                        }
                        $("#nomd").text(response[i].nom.toUpperCase());
                        $("#aped").text(response[i].ape.toUpperCase());
                        chartsNota(response[i].pro.substring(0,3),'circles-1');
                        chartsHabiliadad(response[i].por,'circles-3');
                        chartsJugados(response[i].asi,'circles-2');
                    }

                }
        });
}

function actualizaHogar(idusuario,lat,lon){
        var parametros = {
                "idusuario" : idusuario,
                "lat" : lat,
                "lon" : lon
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/actualizahogar.jsp',
                type:  'post',
                timeout: 10000,
                error: function(){
                        $("#resdata").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resdata").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                        $("#resdata").html('');
                    if(response.trim()=="OK"){
                        showBottom("Hogar actualizado");
                        generaMapa(lat,lon);
                    }else{
                        showBottom("Error, re-intente!");   
                    }
                }
        });
    }

var d = new Date();
var dia = d.getDate();
var mes = d.getMonth();
var ano = d.getFullYear();
var mesf = mes + 1;
var diaf = '';

if(dia<10){
        diaf = '0'+dia;
}else{
        diaf = dia;
}

if(mesf<10){
        var fefi = ano +'-0'+ mesf +'-'+diaf;     
}else{
        var fefi = ano +'-'+ mesf +'-'+diaf;
}

var horas = d.getHours();
var minu = d.getMinutes();
var horaf = horas+':'+minu;
var hri = horas+3;
var horafi = hri+':'+minu;

$( "#formnupart" ).submit(function( event ) {

        if($('#direc').val().trim()==''){
                showBottom("Ingrese centro deportivo!");
                event.preventDefault();
        } else if($('#direc').val().length>42){
                showBottom("Dirección supera 30 crts!");
                event.preventDefault();
        }else if($('#titpar').val().trim()==''){
                showBottom("Ingrese titulo partido!");
                event.preventDefault();
        } else if($('#titpar').val().length>35){
                showBottom("Largo del titulo supera 30 crts!");
                event.preventDefault();
        }else if($('#fecha').val()==''){
                showBottom("Seleccione fecha!");
                event.preventDefault();
        } else if($('#fecha').val() < fefi){
                showBottom("Seleccione fecha actual o mayor!");
                event.preventDefault();
        } else if($('#hora').val()==''){
                showBottom("Seleccione hora!");
                event.preventDefault();
        } else if($('#fecha').val()==fefi && $('#hora').val() < horafi){
                showBottom("Hora debe ser 3 horas mayor a la actual!");
                event.preventDefault();
        } else if($('#quorum').val()==0){
                showBottom("Quorum debe ser al menos 1!");
                event.preventDefault();
        } else if($('#valcam').val().trim()==''){
                showBottom("Ingrese valor camiseta!");
                event.preventDefault();
        } else if($('#valcam').val()<1 ){
                showBottom("Valor camiseta debe ser mayor a 0!");
                event.preventDefault();
        } else if($('#tpart').val()==""){
                showBottom("Seleccione tipo partido!");
                event.preventDefault();
        }else {
                return;
        }

});


function validaDatoPartido(){
        registraPartido($('#idutext').text(),
                $('#fecha').val(),
                $('#hora').val(),
                $('#titpar').val(),
                $('#direc').val(),
                $('#quorum').val(),
                $('#valcam').val(),
                $('#tpart').val(),
                $('#visi').val(),
                $('#soyj').val()
        );
}


function registraPartido(idusuario,fecha,hora,titpar,direc,quorum,valcam,tpart,visi,soyj){
        var parametros = {
                "idusuario" : idusuario,
                "fecha" : fecha,
                "hora" : hora,
                "titpar" : titpar,
                "direc" : direc,
                "quorum" : quorum,
                "valcam" : valcam,
                "tpart" : tpart,
                "visi" : visi,
                "soyj" : soyj
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/registrapartido.jsp',
                type:  'post',
                timeout: 10000,
                error: function(){
                        $("#respar").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#respar").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#respar").html('');
                    if(response.trim()=='OK'){
                        showBottom("Registro exitoso.");
                        $('#fecha').val("");
                        $('#hora').val("");
                        $('#titpar').val("");
                        $('#direc').val("");
                        $('#valcam').val("");
                        $('#tpart').val("");
                        document.getElementById("quorum").value = "1";
                        $('#lqr').text('1');
                        llamaInterstitial();
                    }else{
                        showBottom("Error, intente nuevamente.");  
                    }
                }
        });
    }

    function obtNumRg(d,a){
        var x = document.getElementById(""+d+"").value;
        $(a).text(x);
        if(x<4){
                $(a).css({"background-color": "#a03434", "color": "#FFF"});
        }else if(x>3 && x<7){
                $(a).css({"background-color": "#a6a806", "color": "#FFF"});
        }else{
                $(a).css({"background-color": "#588b05", "color": "#FFF"});
        }
    }

    function obtNumRg2(d,a){
        var x = document.getElementById(""+d+"").value;
        $(a).text(x);
    }

    function cabeceraPartido(idusu){
        $("#idusupublic").val(idusu);
        var parametros = {
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/cabecerapartido.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#rescabpar").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#rescabpar").html('');
                },
                success:  function (response) {
                    var len = response.length;
                    for(var i=0; i<len; i++){
                        var rimg = response[i].img; $('#cpimg').css('background-image', 'url('+rimg+')');
                        var rnom = response[i].nom; $("#cpnom").text(rnom);
                        var rape = response[i].ape; $("#cpape").text(rape);
                        var rpos = response[i].pos; $("#cppos").text(rpos);
                        var rpie = response[i].pie; $("#cppie").text(rpie);
                        var reda = response[i].eda; $("#cpedad").text(reda);
                    }

                }
        });
    }


    function previoEnviaSolicitud(idpart,namep){
        var pst = "#pst"+idpart+"";
        var texto = $(pst).text();

        if(texto=='ACEPTADO'){
                showBottom("Solicitud ya fue aceptada.");
        }else if(texto=='PENDIENTE'){
                showBottom("Solicitud ya fue enviada.");
        }else{
                enviaSolicitud(idpart,namep);
        }
    }

    function enviaSolicitud(idpart,namep){
        /*Ennvia solicitud de juego al partido */
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            
            function onConfirmSoli(buttonIndex) {
                if(buttonIndex==1){

                        var parametros = {
                                "iduser" : $('#idutext').text(),
                                "idpart" : idpart
                        };
                        $.ajax({
                                data:  parametros,
                                url:   hostname+'SoccerApp/solicitudpartido.jsp',
                                type:  'post',
                                timeout: 10000,
                                error: function(){
                                        $("#ressoliju").html('');
                                        errorTimeOutConnect();
                                },
                                beforeSend: function () {
                                        $("#ressoliju").html('<div class="loading">Loading&#8230;</div>');
                                },
                                success:  function (response) {
                                    $("#ressoliju").html('');
                                    if(response.trim()=="NKQ"){
                                        showBottom("Partido completo su quorum.");
                                    } else if(response.trim()=="NKE"){
                                        showBottom("Solicitud existente."); 
                                    }  else if(response.trim()=="EXAGE"){
                                        showBottom("Ya existe un partido en esta fecha y hora."); 
                                    }  else {
                                        showBottom("Solicitud enviada.");
                                        var pst = "#pst"+idpart+"";
                                        $(pst).text("PENDIENTE");
                                        $(pst).css("background-color", "#d6b80e");
                                    }

                                }
                        });

                }
            }
            
            navigator.notification.confirm(
                'Desea enviar solicitud para jugar en '+namep, // message
                 onConfirmSoli,            // callback to invoke with index of button pressed
                'Solicitud de Juego',           // title
                ['Enviar','No']     // buttonLabels
            );

        }

    }
    

function showBottom(textin) {
        window.plugins.toast.showWithOptions({
                message: textin,
                duration: "long", // 2000 ms
                position: "center",
                styling: {
                  opacity: 0.9, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                  backgroundColor: '#ffffff', // make sure you use #RRGGBB. Default #333333
                  textColor: '#2b2b2b', // Ditto. Default #FFFFFF
                  textSize: 18, // Default is approx. 13.
                  cornerRadius: 50, // minimum is 0 (square). iOS default 20, Android default 100
                  horizontalPadding: 14, // iOS default 16, Android default 50
                  verticalPadding: 14 // iOS default 12, Android default 30
                }
              });
}


function cargaMensajes(idusu){
        var parametros = {
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/mensajes.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resmensa").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resmensa").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                        $("#resmensa").html('');
                    var len = response.length;
                    var titcomt = "MÍOS";
                    for(var i=0; i<len; i++){
                        var idr = response[i].id;
                        var dsd = response[i].desde;
                        var tit = response[i].titulo;
                        var msj = response[i].mensaje;
                        var dti = response[i].dati;
                        var fecmmj = response[i].fechm.substring(0,16);

                        if(tit=="Solicitud de Juego"){
                                var menu = '<div class="opace"><a href="#" onclick="aceptaRechazaSol('+dti+','+dsd+','+idusu+',1,'+idr+')">ACEPTAR</a></div><div class="oprec"><a href="#" onclick="aceptaRechazaSol('+dti+','+dsd+','+idusu+',2,'+idr+')">RECHAZAR</a></div></div>';
                                $("#resmensa").append('<div class="cardmensaje" id="card'+idr+'"><div class="titmen">'+tit+' <span id="mmjfech">'+fecmmj+'</span> </div><div class="mensa" onclick="detalleJugador('+dsd+',1)">'+msj+'</div><div class="opmen">'+menu+'</div>');
                        }else if(tit=="Primeros pasos"){
                                var menu = '<div class="opace"><a href="#" onclick="mesnajeLeidoOk('+idr+')">BORRAR</a></div><div class="oprec"><a href="#playfoodet" onclick="obtienePerfilUsuario('+idusu+')">VER ENLACE</a></div></div>';
                                $("#resmensa").append('<div class="cardmensaje" id="card'+idr+'"><div class="titmen">'+tit+' <span id="mmjfech">'+fecmmj+'</span> </div><div class="mensa">'+msj+'</div><div class="opmen">'+menu+'</div>');
                        }else if(tit=="Nuevo comentario"){
                                var menu = '<div class="opace"><a href="#" onclick="mesnajeLeidoOk('+idr+')">BORRAR</a></div><div class="oprec"><a href="#comentario" onclick="obtieneComentario('+idusu+','+"'MÍOS'"+',2)" >VER COMENTARIOS</a></div></div>';
                                $("#resmensa").append('<div class="cardmensaje" id="card'+idr+'"><div class="titmen">'+tit+' <span id="mmjfech">'+fecmmj+'</span> </div><div class="mensa">'+msj+'</div><div class="opmen">'+menu+'</div>');
                        }else if(tit=="Solicitud de Amistad"){
                                var menu = '<div class="opace"><a href="#" onclick="aceRecSoliAmistad('+dsd+','+idusu+',1,'+idr+')">ACEPTAR</a></div><div class="oprec"><a href="#" onclick="aceRecSoliAmistad('+dsd+','+idusu+',1,'+idr+')">RECHAZAR</a></div></div>';
                                $("#resmensa").append('<div class="cardmensaje" id="card'+idr+'"><div class="titmen">'+tit+' <span id="mmjfech">'+fecmmj+'</span> </div><div class="mensa" onclick="detalleJugador('+dsd+',1)">'+msj+'</div><div class="opmen">'+menu+'</div>');
                        }else if(tit=="Solicitud de Juego Aceptada"){
                                var menu = '<div class="opace"><a href="#" onclick="mesnajeLeidoOk('+idr+')">BORRAR</a></div><div class="oprec"><a href="#agenda" onclick="cargaDatosAgenda('+idusu+')">VER AGENDA</a></div></div>';
                                $("#resmensa").append('<div class="cardmensaje" id="card'+idr+'"><div class="titmen">'+tit+' <span id="mmjfech">'+fecmmj+'</span> </div><div class="mensa">'+msj+'</div><div class="opmen">'+menu+'</div>');
                        }else{
                                var menu = '<div class="opace"></div><div class="oprec"><a href="#" onclick="mesnajeLeidoOk('+idr+')">BORRAR</a></div></div>';
                                $("#resmensa").append('<div class="cardmensaje" id="card'+idr+'"><div class="titmen">'+tit+' <span id="mmjfech">'+fecmmj+'</span> </div><div class="mensa">'+msj+'</div><div class="opmen">'+menu+'</div>');
                        }

                    }
                    if(len==0){
                        $("#resmensa").append('<div class="notfound"><i class="material-icons">warning_amber</i><br>LISTA DE MENSAJES VACIA!</div>');
                    }
                    $("#resmensa").append('<div id="espacer"></div>');
                }
        });
}



function aceRecSoliAmistad(idori,iddest,opc,idmjs){
        var parametros = {
                "idori" : idori,
                "iddest" : iddest,
                "opc" : opc,
                "idmjs" : idmjs
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/aceptarechsoliamistad.jsp',
                type:  'post',
                timeout: 10000,
                error: function(){
                        $("#resmensa").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resmensa").html('');
                },
                success:  function (response) {
                    if(response.trim()=="OKA"){
                        showBottom("Solicitud aceptada");
                        $("#card"+idmjs+"").hide();
                    }else{
                        showBottom("Solicitud rechazada");
                        $("#card"+idmjs+"").hide();
                    }
                    cargaMensajes($('#idutext').text());
                    cuentaMisMensajes($('#idutext').text());
                }
        });
    }


    function cargaPartidosPublicos(idusu,myid){
        
        var parametros = {
                "idusu" : idusu,
                "myid" : myid
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/partidospublicos.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#partpubli").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#partpubli").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                        $("#partpubli").html('');
                    var len = response.length;
                    var ressoli;
                    for(var i=0; i<len; i++){

                        var idr = response[i].id;
                        var fcr = response[i].fec;
                        var hrr = response[i].hor;
                        var ttr = response[i].tit;
                        var ddr = response[i].dire;
                        var qdr = response[i].quo;
                        var vlc = response[i].val;
                        var rtp = response[i].tpr;
                        var ttrf = "'"+ttr+"'";

                        var pr1 = '<div class="boxpartido" onclick="previoEnviaSolicitud('+idr+','+ttrf+')">';
                        if(response[i].soli=="PD"){
                                ressoli = 'PENDIENTE';
                                var pr2 = '<p class="boxsubtpt">'+rtp.toUpperCase()+'</p> <p class="boxsubtpt" style="background-color: #d6b80e;" id="pst'+idr+'">'+ressoli+'</p>';
                        } else if(response[i].soli=="AC"){
                                ressoli = 'ACEPTADO';
                                var pr2 = '<p class="boxsubtpt">'+rtp.toUpperCase()+'</p> <p class="boxsubtpt" id="pst'+idr+'">'+ressoli+'</p>';
                        } else{
                                ressoli = 'NO ENVIADO';
                                var pr2 = '<p class="boxsubtpt">'+rtp.toUpperCase()+'</p> <p class="boxsubtpt" style="background-color: #d47217;" id="pst'+idr+'">'+ressoli+'</p>';
                        }
                        
                        var pr3 = '<div class="bxico"><img src="img/minicheck.png"></div><div class="bxtitulo"><p>'+ttr.toUpperCase()+'</p></div>';
                        var pr4 = '<div class="bxico"><img src="img/miniplace.png"></div><div class="bxtitulo"><p>'+ddr+'</p></div>';
                        var pr5 = '<div class="bxico"><img src="img/minitime.png"></div><div class="bxtitulo"><p>'+fcr+' '+hrr+' horas.</p></div>';
                        var pr6 = '<p class="boxsubtptbj">VALOR $: '+vlc+'</p> <p class="boxsubtptbj">CUPOS: '+qdr+'</p>';
                        var pr7 = '</div>';

                        $("#partpubli").append(''+pr1+''+pr2+''+pr3+''+pr4+''+pr5+''+pr6+''+pr7+'');

                    }
                    $("#partpubli").append('<div id="espacer"></div>');
                    cabeceraPartido(idusu);

                }
        });
    }

    function validaSolicitudEnviada(myid,idpartido){
        var parametros = {
                "myid" : myid,
                "idpartido" : idpartido
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/validasolicitudenviada.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                },
                success:  function (response) {
                    var len = response.length;
                        for(var i=0; i<=len; i++){
                                response[i].porc;
                        }
                }
        }); 
    }


    function obtieneCabMensaje(idusu){
        var parametros = {
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/cabeceramensajes.jsp',
                type:  'post',
                timeout: 10000,
                error: function(){
                        $("#rescabmen").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#rescabmen").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#rescabmen").html(response);
                }
        });
    }


    function aceptaRechazaSol(idpar,idusu,desde,indi,idcard){
        var parametros = {
                "idpar" : idpar,
                "idusu" : idusu,
                "desde" : desde,
                "indi" : indi
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/aceptarechmensaje.jsp',
                type:  'post',
                timeout: 10000,
                error: function(){
                        $("#resop").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resop").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#resop").html('');
                    if(response.trim()=="AC"){
                        showBottom("Aceptado.");
                    }else{
                        showBottom("Rechazado.");
                    }
                    mesnajeLeidoOk(idcard);
                    cuentaMisMensajes($('#idutext').text());
                    cargaMensajes($('#idutext').text());
                }
        });
    }

    function mesnajeLeidoOk(idcard){
        $("#card"+idcard+"").hide();
        var parametros = {
                "idcard" : idcard
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/eliminamensaje.jsp',
                type:  'post',
                timeout: 10000,
                error: function(){
                        $("#rescabmen").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#rescabmen").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#rescabmen").html(response);
                    cuentaMisMensajes($('#idutext').text());
                    cargaMensajes($('#idutext').text());
                }
        });
    }

    function fresh(vel,ata,pas,dis,defe,reg) {
        var str = vel / 10;
        var agi = ata / 10;
        var mag = pas / 10;
        var hp = dis / 10;
        var mp = defe / 10;
        var def = reg / 10;

        $(".djtop1").text("VELOCIDAD: "+vel);
        $(".djrg").text("REGATE: "+reg);
        $(".djdf").text("DEFENSA: "+defe);
        $(".djat").text("ATAQUE: "+ata);
        $(".djps").text("PASE: "+pas);
        $(".djbott1").text("DISPARO: "+dis);

        hexagon.init('demo', 85, ['','','','','','']);
        hexagon.draw([str, agi, mag, hp, mp, def]);
    }

    
    function detalleJugador(idusu,ori){

        if(ori==1){ //mensajes
                $("#dtjback").attr("href", "#mensaje");
                $("#dtjstart").hide();
                $("#dtjright").hide();
                $("#dtjsport").hide();
                $("#dtjppri").hide();
        }else if(ori==2){//amigos
                $("#dtjback").attr("href", "#amigos");
                $("#dtjstart").show();
                $("#dtjright").show();
                $("#dtjsport").show();
                $("#dtjppri").show();
        } else if(ori==3){
                $("#dtjback").attr("href", "#jugagenda");
                $("#dtjstart").hide();
                $("#dtjright").hide();
                $("#dtjsport").hide();
                $("#dtjppri").hide();
        } else if(ori==4){
                $("#dtjback").attr("href", "#partidoopt");
                $("#dtjstart").hide();
                $("#dtjright").hide();
                $("#dtjsport").hide();
                $("#dtjppri").hide();
        } else if(ori==5){
                $("#dtjback").attr("href", "#comentario");
                $("#dtjstart").hide();
                $("#dtjright").show();
                $("#dtjsport").hide();
                $("#dtjppri").hide();
        }

        window.location.href = '#detjug';

        var parametros = {
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/detallejugador.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resdetjug").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resdetjug").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                        $("#resdetjug").html('');
                        $("#iddetami").val(idusu);
                        var len = response.length;

                        for(var i=0; i<=len; i++){

                                var rimg = response[i].img;
                                $("#imgdjbig").attr("src",""+rimg+"");
                                var rnom = response[i].nom;
                                var rape = response[i].ape;
                                var rpos = response[i].pos;
                                var reda = response[i].eda;
                                var rpie = response[i].pie;
                                var rreg = response[i].reg;
                                var rvel = response[i].vel;
                                var rdis = response[i].dis;
                                var rdef = response[i].def;
                                var rpas = response[i].pas;
                                var rata = response[i].ata;
                                var rpor = response[i].por;
                                var rasi = response[i].asi;
                                var rpro = response[i].pro;

                                fresh(rvel,rata,rpas,rdis,rdef,rreg);
                                chartsNota(rpro.substring(0,3),'circles-4');
                                chartsJugados(rasi,'circles-5');
                                chartsHabiliadad(rpor,'circles-6');
                                $("#nomdj").text(rnom.toUpperCase());
                                $("#apedj").text(rape.toUpperCase());
                                $("#posdj").text(rpos.toUpperCase());
                                $('#imgdj').css('background-image', 'url('+rimg+')');
                                $("#edadj").text(reda);
                                if(rpie=="Ambos"){
                                        $("#piedj").text("Diestro".toUpperCase());
                                        $("#dtjupie").attr("src", "img/double-arrow.png");
                                }else{
                                        
                                        if(rpie=="Derecho"){
                                                $("#piedj").text(rpie.toUpperCase());
                                                $("#dtjupie").attr("src", "img/right-arrow.png");
                                        }else{
                                                $("#piedj").text(rpie.toUpperCase());
                                                $("#dtjupie").attr("src", "img/left-arrow.png");
                                        }
                                        
                                }

                        }
                }
                });
        }


function actualizaHabilidades(){

        idusu = $('#idutext').text();
        var parametros = {
                "idusu" : idusu,
                "reg" : $('#reg').val(),
                "vel" : $('#vel').val(),
                "dis" : $('#dis').val(),
                "def" : $('#def').val(),
                "pas" : $('#pas').val(),
                "ata" : $('#ata').val()
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/actualizahabilidades.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#reshab").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#reshab").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#reshab").html('');
                    var len = response.length;
                        for(var i=0; i<=len; i++){
                                showBottom(response[i].resp);
                                chartsHabiliadad(response[i].porc,"circles-3");
                        }
                }
        }); 
}


function obtieneHabilidades(){
        idusu = $('#idutext').text();
        obtienePerfilUsuario2(idusu);
        var parametros = {
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/obtienehabilidades.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#reshab").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#reshab").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#reshab").html('');
                    var len = response.length;
                        for(var i=0; i<=len; i++){
                                var rreg = response[i].hreg;
                                document.getElementById("reg").value = rreg;
                                $("#lreg").text(rreg);
                                colorHabilidades(rreg,"#lreg");
                                var rvel = response[i].hvel;
                                document.getElementById("vel").value = rvel;
                                $("#lvel").text(rvel);
                                colorHabilidades(rvel,"#lvel");
                                var rdis = response[i].hdis;
                                document.getElementById("dis").value = rdis;
                                $("#ldis").text(rdis);
                                colorHabilidades(rdis,"#ldis");
                                var rdef = response[i].hdef;
                                document.getElementById("def").value = rdef;
                                $("#ldef").text(rdef);
                                colorHabilidades(rdef,"#ldef");
                                var rpas = response[i].hpas;
                                document.getElementById("pas").value = rpas;
                                $("#lpas").text(rpas);
                                colorHabilidades(rpas,"#lpas");
                                var rata = response[i].hata;
                                document.getElementById("ata").value = rata;
                                $("#lataq").text(rata);
                                colorHabilidades(rata,"#lataq");
                        }
                }
        }); 
}

function colorHabilidades(x,a){
        if(x<4){
                $(a).css({"background-color": "#a03434", "color": "#FFF"});
        }else if(x>3 && x<7){
                $(a).css({"background-color": "#a6a806", "color": "#FFF"});
        }else{
                $(a).css({"background-color": "#588b05", "color": "#FFF"});
        }
    }

function obtieneAmigos(){
        idusu = $('#idutext').text();
        var parametros = {
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/obtieneamigos.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resamigo").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resamigo").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#resamigo").html('');
                    var len = response.length;
                        for(var i=0; i<len; i++){
                                
                                var l1 = '<div class="cardamigo" data-transition="slidefade" onclick="detalleJugador('+response[i].idusu+',2)">';
                                var l2 = '<div class="imgami">';
                                var l3 = '<div class="imgcenter">';
                                var l4 = '<a href="#" class="ratio img-responsive img-circle" id="imgam" style="background-image: url('+response[i].uimg+');" ></a>';
                                var l5 = '</div>';   
                                var l6 = '</div>';
                                var l8 = '<div class="nomami">'+response[i].name+' '+response[i].last+'</div>';
                                var l9 = '<div class="usuami">'+response[i].uname+'</div>';
                                var l0 = '</div>';


                                var afi = l1+l2+l3+l4+l5+l6+l8+l9+l0;
                                $("#resamigo").append(afi);
                        }
                        if(len==0){
                                $("#resamigo").append('<div class="notfound"><i class="material-icons">warning_amber</i><br>LISTA DE AMIGOS VACIA!</div>');
                        }
                        $("#resamigo").append('<div id="espacer"></div>');
                }
        }); 
}


function buscarAmigos(){

        if($("#txtbusam").val().length>3){

                let busca      = $("#txtbusam").val(),
                buscaArray = busca.split(' '),
                ultima      = buscaArray[buscaArray.length - 1];
                
	        cantidadPalabras = busca.split(' ').length

                if(cantidadPalabras<2){
                       let primera1  = $("#txtbusam").val(),
                       primeraf = primera1.split(' ')[0]
                       resultadoBusAmigos(primeraf,''); 
                } else {
                       
                        if(ultima!=""){
                                let primera  = $("#txtbusam").val(),
                                primeraf = primera.split(' ')[0]
                                resultadoBusAmigos(primeraf,ultima); 
                        }

                }
        }else{
                $("#resbusamigo").html('');
        }

}


function resultadoBusAmigos(txtnom,txtape){
        var myid = $("#idutext").text();
        var parametros = {
                "primera" : txtnom,
                "segunda" : txtape,
                "myid" : myid
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/buscaramigos.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resbusamigo").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resbusamigo").html('...');
                },
                success:  function (response) {
                    $("#resbusamigo").html('');
                    var len = response.length;
                    var estsol;
                    if(len==0){
                        $("#resbusamigo").append('<div class="notfound"><i class="material-icons">warning_amber</i><br>BÚSQUEDA SIN RESULTADOS!</div>');
                    }else{
                        for(var i=0; i<len; i++){
                                var namegt = "'"+response[i].nameb+"'";
                                if(response[i].idb!=$('#idutext').text()){

                                        if(response[i].soli=="P"){
                                                estsol="Pendiente";
                                                var l7 = '<div class="opami" style="color: #bbaf04;"><i class="material-icons">pending</i></div>';
                                        }else if(response[i].soli=="A"){
                                                estsol="Aceptado";
                                                var l7 = '<div class="opami" style="color: #338503;"><i class="material-icons">check</i></div>';
                                        }else{
                                                estsol="";
                                                var l7 = '<div class="opami" style="color: #FFF;"><i class="material-icons" id="cdam'+response[i].idb+'">add_circle_outline</i></div>';
                                        }

                                        var l1 = '<div class="cardamigo" onclick="validaExistenciaAmigo('+response[i].idb+','+$('#idutext').text()+','+namegt+','+response[i].idb+')">';
                                        var l2 = '<div class="imgami">';
                                        var l3 = '<div class="imgcenter">';
                                        var l4 = '<a href="#" class="ratio img-responsive img-circle" id="imgam" style="background-image: url('+response[i].uimgb+');" ></a>';
                                        var l5 = '</div>';   
                                        var l6 = '</div>';
                                        var l8 = '<div class="nomami">'+response[i].nameb+' '+response[i].lastb+'</div>';
                                        var l9 = '<div class="usuami">'+response[i].unameb+' <span id="ia'+response[i].idb+'">'+estsol+'</span> </div>';
                                        var l0 = '</div>';

                                        var afi = l1+l2+l3+l4+l5+l6+l7+l8+l9+l0;
                                        $("#resbusamigo").append(afi);
                                }
                                
                        }
                        $("#resbusamigo").append('<div id="espacer"></div>');
                    }
                }
        }); 
}


function validaExistenciaAmigo(idrecibe,idenvia,nomusu,idb){

        var s = "#ia"+idb;
        var texto = $(s).text();
        if(texto=="Aceptado"){
                showBottom(nomusu+" ya es tu amigo.");
        } else if(texto=="Pendiente"){
                showBottom("ya se envio una solicitud a "+ nomusu);
        } else {
                enviaSolicitudAmigo(idrecibe,idenvia,nomusu,idb);
        }
}

function enviaSolicitudAmigo(idrecibe,idenvia,nomusu,idb){
        /*Ennvia solicitud de juego al partido */
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            function onConfirmSoliA(buttonIndex) {
                if(buttonIndex==1){
                        enviandoSoliAmistad(idrecibe,idenvia,nomusu);
                        var s = "#ia"+idb;
                        var cd = "#cdam"+idb;
                        $(s).text("Pendiente");
                        $(cd).text('pending');
                        $(cd).css("color","#bbaf04");
                }
                if(buttonIndex==2){
                        window.location.href = "#comentario";
                        obtieneComentario(idrecibe,nomusu,2)
                }
            }
            navigator.notification.confirm(
                'Enviar solicitud de amistad a '+nomusu+'?', // message
                 onConfirmSoliA,            // callback to invoke with index of button pressed
                'Solicitud de Amistad',  // title
                ['Enviar','Comentarios']     // buttonLabels
            );
        }

}


function eliminarMisAmigos(idrecibe,idenvia,nomusu){
        /*Ennvia solicitud de juego al partido */
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            function onConfirmSoliA(buttonIndex) {
                if(buttonIndex==1){
                        eliminandoAmigoSolic(idrecibe,idenvia);
                }
            }
            navigator.notification.confirm(
                'Deseas eliminar a '+nomusu.toLowerCase()+' de tus amigos?', // message
                 onConfirmSoliA,            // callback to invoke with index of button pressed
                'Eliminar Amigo',  // title
                ['Aceptar','Cancelar']     // buttonLabels
            );
        }

}


function enviandoSoliAmistad(idusu,idesd,nomus){
        var parametros = {
                "idusu" : idusu,
                "idesd" : idesd,
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/enviasoliamistad.jsp',
                type:  'post',
                timeout: 10000,
                error: function(){
                        $("#ressoliam").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#ressoliam").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#ressoliam").html('');
                    if(response.trim()=="OK"){
                        showBottom("Solicitud enviada");
                        //locat1
                    } else if(response.trim()=="EXP"){
                        showBottom("Solicitud existente");
                    } else {
                        showBottom(nomus+" ya es tu amigo");
                    }
                }
        });
}

function eliminandoAmigoSolic(idusu,desde){
        var parametros = {
                "idusu" : idusu,
                "desde" : desde,
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/eliminaamigo.jsp',
                type:  'post',
                timeout: 10000,
                error: function(){
                        $("#resdetjug").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resdetjug").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#resdetjug").html('');
                    if(response.trim()=="OK"){
                        showBottom("Eliminado correctamente");
                        obtieneAmigos();
                        window.location.href = '#amigos';
                    } else {
                        showBottom("Error");
                    }
                }
        });
}


function calificaAmigo(nombre){

        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
                showPrompt();
                // process the promp dialog results
                function onPrompt(results) {
                        if (results.buttonIndex==1){

                                if(results.input1 > 0 && results.input1 < 8){
                                        calificaAmigoSolic(results.input1,$("#iddetami").val(),$('#idutext').text());
                                } else {
                                        showBottom("Error: ingrese nota entre 1 y 7");
                                }

                        }
                }
                function showPrompt() {
                        navigator.notification.prompt(
                        'Ingrese nota entre 1 y 7 para calificar a '+nombre.toLowerCase()+":",  // message
                        onPrompt,                  // callback to invoke
                        'Calificar amigo',            // title
                        ['Enviar','Cancelar']              // buttonLabels
                        );
                }

        }

}

function calificaAmigoSolic(nota,uid,uidesde){
        var parametros = {
                "nota" : nota,
                "uid" : uid,
                "uidesde" : uidesde
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/calificaramigo.jsp',
                type:  'post',
                timeout: 10000,
                error: function(){
                        $("#resdetjug").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resdetjug").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#resdetjug").html('');
                    if(response.trim()=="INSER"){
                        showBottom("Calificaci\u00F3n exitosa");
                    } else {
                        showBottom("Calificaci\u00F3n actualizada");
                    }
                }
        });
}


function cargaMisPartidos(idusu){
        var myid = 0;
        var parametros = {
                "idusu" : idusu,
                "myid" : myid
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/mispartidos.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resmispartidos").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resmispartidos").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                        $("#resmispartidos").html('');
                    var len = response.length;
                    for(var i=0; i<len; i++){

                        var idr = response[i].id;
                        var fcr = response[i].fec;
                        var hrr = response[i].hor;
                        var ttr = response[i].tit;
                        var ddr = response[i].dire;
                        var qdr = response[i].quo;
                        var vlr = response[i].val;
                        var rtp = response[i].tpr;
                        var vir = response[i].vis;

                        var ttrf = "'"+ttr+"'";
                        var fcrf = "'"+fcr+"'";
                        var rtpf = "'"+rtp+"'";

                        var pr1 = '<div class="boxpartido" onclick="detalleMisPartidos('+idr+','+ttrf+','+fcrf+','+qdr+','+rtpf+')">';
                        var pr2 = '<p class="boxsubtpt">'+rtp.toUpperCase()+'</p> <p class="boxsubtpt">'+vir.toUpperCase()+'</p>';
                        var pr3 = '<div class="bxico"><img src="img/minicheck.png"></div><div class="bxtitulo"><p>'+ttr.toUpperCase()+'</p></div>';
                        var pr4 = '<div class="bxico"><img src="img/miniplace.png"></div><div class="bxtitulo"><p>'+ddr+'</p></div>';
                        var pr5 = '<div class="bxico"><img src="img/minitime.png"></div><div class="bxtitulo"><p>'+fcr+' '+hrr+' horas.</p></div>';
                        var pr6 = '<p class="boxsubtptbj">VALOR $: '+vlr+'</p> <p class="boxsubtptbj">FALTAN: '+qdr+'</p>';
                        var pr7 = '</div>';

                        $("#resmispartidos").append(''+pr1+''+pr2+''+pr3+''+pr4+''+pr5+''+pr6+''+pr7+'');

                    }
                    if(len==0){
                        $("#resmispartidos").append('<div class="notfound"><i class="material-icons">warning_amber</i><br>LISTA DE PARTIDOS VACIA!</div>');
                    }
                    $("#resmispartidos").append('<div id="espacer"></div>');

                }
        });
    }

    function cargaMisPartidosPrivados(idusu,nom){
        llamaInterstitial();
        $("#nomdjpr").text(nom);
        var myid = $("#idutext").text();
        var parametros = {
                "idusu" : idusu,
                "myid" : myid
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/mispartidos.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#respartpri").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#respartpri").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                        $("#respartpri").html('');
                    var len = response.length;
                    for(var i=0; i<len; i++){

                        var idr = response[i].id;
                        var fcr = response[i].fec;
                        var hrr = response[i].hor;
                        var ttr = response[i].tit;
                        var ddr = response[i].dire;
                        var qdr = response[i].quo;
                        var vlr = response[i].val;
                        var rtp = response[i].tpr;
                        var vir = response[i].vis;
                        //aquitrace
                        var ttrf = "'"+ttr+"'";

                        var pr1 = '<div class="boxpartido" onclick="previoEnviaSolicitud('+idr+','+ttrf+')">';
                        if(response[i].soli=="PD"){
                                ressoli = 'PENDIENTE';
                                var pr2 = '<p class="boxsubtpt">'+rtp.toUpperCase()+' - '+vir.toUpperCase()+'</p> <p class="boxsubtpt" style="background-color: #d6b80e;" id="pst'+idr+'">'+ressoli+'</p>';
                        } else if(response[i].soli=="AC"){
                                ressoli = 'ACEPTADO';
                                var pr2 = '<p class="boxsubtpt">'+rtp.toUpperCase()+' - '+vir.toUpperCase()+'</p> <p class="boxsubtpt" id="pst'+idr+'">'+ressoli+'</p>';
                        } else{
                                ressoli = 'NO ENVIADO';
                                var pr2 = '<p class="boxsubtpt">'+rtp.toUpperCase()+' - '+vir.toUpperCase()+'</p> <p class="boxsubtpt" style="background-color: #d47217;" id="pst'+idr+'">'+ressoli+'</p>';
                        }

                        var pr3 = '<div class="bxico"><img src="img/minicheck.png"></div><div class="bxtitulo"><p>'+ttr.toUpperCase()+'</p></div>';
                        var pr4 = '<div class="bxico"><img src="img/miniplace.png"></div><div class="bxtitulo"><p>'+ddr+'</p></div>';
                        var pr5 = '<div class="bxico"><img src="img/minitime.png"></div><div class="bxtitulo"><p>'+fcr+' '+hrr+' horas.</p></div>';
                        var pr6 = '<p class="boxsubtptbj">VALOR $: '+vlr+'</p> <p class="boxsubtptbj">FALTAN: '+qdr+'</p>';
                        var pr7 = '</div>';

                        $("#respartpri").append(''+pr1+''+pr2+''+pr3+''+pr4+''+pr5+''+pr6+''+pr7+'');

                    }
                    if(len==0){
                        $("#respartpri").append('<div class="notfound"><i class="material-icons">warning_amber</i><br>LISTA DE PARTIDOS VACIA!</div>');
                    }
                    $("#respartpri").append('<div id="espacer"></div>');

                }
        });
    }


    function detalleMisPartidos(id,titp,fechp,quo,tipopart){
        window.location.href = '#partidoopt';
        $("#lptit").text(""+titp+"");
        $("#lpfec").text(""+fechp+"");
        $("#lpquo").text(""+quo+"");
        $("#idprdet").val(id);
        $("#partitext").val(tipopart);
        obtieneAsistentes(id);
    }


    function obtieneAsistentes(idpart){
        cabeceraMisPartidos(idpart);
        $("#juname").html("");
        var parametros = {
                "idpart" : idpart
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/asistentespartido.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resjugpar").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resjugpar").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#resjugpar").html('');
                    var len = response.length;
                        for(var i=0; i<len; i++){

                                var porcent = calculaPorcentaje(response[i].total);
                                var colpro;
                                var colpro2;
                                if(porcent>75){
                                        colpro = "#5c9b09";
                                }else if(porcent>50 && porcent<75){
                                        colpro = "#c1ce07";
                                }else{
                                        colpro = "#af4405";
                                }
                                if(response[i].aest=="AC"){
                                        var estado = "Aceptado";
                                        colpro2 = "#5c9b09";
                                }else{
                                        var estado = "Pendiente";
                                        colpro2 = "#af4405";
                                }
                                var l1 = '<div class="cardamigo" onclick="detalleJugador('+response[i].aid+',4)">';
                                var l2 = '<div class="imgami">';
                                var l3 = '<div class="imgcenter">';
                                var l4 = '<a href="#" class="ratio img-responsive img-circle" id="imgam" style="background-image: url('+response[i].aimg+');" ></a>';
                                var l5 = '</div>';   
                                var l6 = '</div>';
                                var l7 = '<div class="opami"><div class="ciropami" style="border-top: 3px solid '+colpro+';">'+porcent+'%</div></div>';
                                var l8 = '<div class="nomami">'+response[i].anom+' '+response[i].aape+'</div>';
                                var l9 = '<div class="usuami">'+response[i].apos.toUpperCase()+' <div class="cjest" style="background-color: '+colpro2+';">'+estado+'</div> </div>';
                                var l0 = '</div>';
                                var afi = l1+l2+l3+l4+l5+l6+l7+l8+l9+l0;
                                $("#resjugpar").append(afi);
                                /* agrega asistentes al select de formación */
                                $("#juname").append('<option value="'+response[i].anom+'">'+response[i].anom+' - '+response[i].apos+'</option>');
                        }
                        if(len==0){
                                $("#resjugpar").append('<br><div class="notfound"><i class="material-icons">warning_amber</i><br>LISTA DE ASISTENTES VACIA!</div>');
                        }
                        $("#resjugpar").append('<div id="espacer"></div>');
                }
        }); 
}

function cabeceraMisPartidos(idpart){
        var parametros = {
                "idpart" : idpart
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/cabeceradetpartido.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        console.log('');
                },
                success:  function (response) {
                    var len = response.length;
                    for(var i=0; i<len; i++){

                        var racep = response[i].acep;
                        var rpend = response[i].pend;
                        var totr = response[i].tota;
                        $("#lbac").text(racep);
                        $("#lbpd").text(rpend);
                        $("#lpquo").text(totr);

                    }

                }
        });
    }


    function eliminaPartido(idpart,nompart){

        /*Ennvia solicitud de juego al partido */
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            function onConfirmEliPar(buttonIndex) {
                if(buttonIndex==1){
                        eliminandoPartido(idpart);
                }
            }
            navigator.notification.confirm(
                'Seguro que deseas eliminar el partido '+nompart+'?', // message
                 onConfirmEliPar,            // callback to invoke with index of button pressed
                'Eliminar Partido',  // title
                ['Aceptar','Cancelar']     // buttonLabels
            );
        }

    }

    function eliminandoPartido(idpart){
        var parametros = {
                "idpart" : idpart
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/eliminapartido.jsp',
                type:  'post',
                timeout: 10000,
                error: function(){
                        $("#reseli").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#reseli").html('');
                },
                success:  function (response) {
                    if(response.trim()=="OK"){
                        window.location.href = '#mispartidos';
                        showBottom("Partido eliminado exitosamente");
                        cargaMisPartidos($('#idutext').text());
                    }else{
                        showBottom("Error");
                    }
                }
        });
    }

    function fechaActual(){
        //carga los marcadores de los partidos cercanos
        var fefi;
        var d = new Date();
        var dia = d.getDate();
        var mes = d.getMonth();
        var ano = d.getFullYear();
        var mesf = mes + 1;
        if(mesf<10){
                if(dia<10){
                        fefi = ano +'-0'+ mesf +'-0'+dia; 
                }else{
                        fefi = ano +'-0'+ mesf +'-'+dia;
                }    
        } else{
                fefi = ano +'-'+ mesf +'-'+dia;
        }
        return fefi;
    }

    function cargaDatosAgenda(idusu){
        var parametros = {
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/cargaagenda.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resagenda").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resagenda").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#resagenda").html('');
                    var actualfech = fechaActual();
                    var len = response.length;
                    var l1a;
                    for(var i=0; i<len; i++){
                        
                        var rid = response[i].id;
                        var rfec = response[i].fec;
                        var rfecsf = response[i].fecsf;
                        var rhor = response[i].hor;
                        var rtit = response[i].tit;
                        var rdir = response[i].dire;
                        var rval = response[i].val;
                        var rest = response[i].est;

                        var ttrf = "'"+rtit+"'";

                        numfec = rfec.split(' ')[0];
                        mesfec = rfec.split(' ')[1];

                        if(rfecsf==actualfech){
                                l1a = '<div id="agecard"><div class="agefecha2">'+numfec+'<br>'+mesfec.substr(0,3).toUpperCase()+'</div>';
                        }else{
                                l1a = '<div id="agecard"><div class="agefecha">'+numfec+'<br>'+mesfec.substr(0,3).toUpperCase()+'</div>';
                        }

                        if(rest=="Confirmado"){
                                var lbc = '<strong style="color: #2b8a06;" class="estage">';
                        }else{
                                var lbc = '<strong style="color: #aa7709;" class="estage">';
                        }

                        var l0 = '<a class="alink" href="#jugagenda" onclick="obtieneAsistentesAge('+rid+','+ttrf+')" data-transition="slidefade">';
                        var l1 = l1a;
                        var l2 = '<div class="agedata">';
                        var l4 = '<strong>'+rtit+'</strong><br>';
                        var l5 = ''+rdir+'<br>';
                        var l6 = 'Hora: '+rhor+' - Valor: $'+rval+'<br>';
                        var l7 = ''+lbc+''+rest+'</strong></div></div>';
                        var l8 = '</a>';

                        var fage = l0 + l1 + l2 + l4 + l5 + l6 + l7 + l8;
                        $("#resagenda").append(fage);

                    }
                    if(len==0){
                        $("#resagenda").append('<br><div class="notfound"><i class="material-icons">warning_amber</i><br>LISTA DE PARTIDOS VACIA!</div>');
                    }
                    $("#resagenda").append('<div id="espacer"></div>');

                }
        });
    }

    function obtieneAsistentesAge(idpart,nomtit){
        $("#idprage").val(idpart);
        $("#nomprage").text(nomtit);
        var parametros = {
                "idpart" : idpart
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/asistentespartido.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resjugage").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resjugage").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#resjugage").html('');
                    var myid = $('#idutext').text();
                    var len = response.length;
                        for(var i=0; i<len; i++){

                                var porcent = calculaPorcentaje(response[i].total);
                                var colpro;
                                var colpro2;
                                if(porcent>75){
                                        colpro = "#5c9b09";
                                }else if(porcent>50 && porcent<75){
                                        colpro = "#c1ce07";
                                }else{
                                        colpro = "#af4405";
                                }
                                if(response[i].aid==myid && response[i].aest=="AC"){
                                        $("#preguntali").show();
                                }else if(response[i].aid==myid && response[i].aest=="PD"){
                                        $("#preguntali").hide();
                                }
                                if(response[i].aest=="AC"){
                                        var estado = "Aceptado";
                                        colpro2 = "#5c9b09";
                                }else{
                                        var estado = "Pendiente";
                                        colpro2 = "#af4405";
                                }
                                var l1 = '<div class="cardamigo" onclick="detalleJugador('+response[i].aid+',3)">';
                                var l2 = '<div class="imgami">';
                                var l3 = '<div class="imgcenter">';
                                var l4 = '<a href="#" class="ratio img-responsive img-circle" id="imgam" style="background-image: url('+response[i].aimg+');" ></a>';
                                var l5 = '</div>';   
                                var l6 = '</div>';
                                var l7 = '<div class="opami"><div class="ciropami" style="border-top: 3px solid '+colpro+';">'+porcent+'%</div></div>';
                                var l8 = '<div class="nomami">'+response[i].anom+' '+response[i].aape+'</div>';
                                var l9 = '<div class="usuami">'+response[i].apos.toUpperCase()+' <div class="cjest" style="background-color: '+colpro2+';">'+estado+'</div> </div>';
                                var l0 = '</div>';

                                var afi = l1+l2+l3+l4+l5+l6+l7+l8+l9+l0;
                                $("#resjugage").append(afi);
                        }
                        if(len==0){
                                $("#resjugage").append('<br><div class="notfound"><i class="material-icons">warning_amber</i><br>LISTA DE ASISTENTES VACIA!</div>');
                        }
                        $("#resjugage").append('<div id="espacer"></div>');
                }
        }); 
}

function calculaPorcentaje(total){
        var tot = parseInt(total);
        var res = parseInt(tot*100/60);
        return res;
}


function cuentaMisMensajes(idusu){
        var parametros = {
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/cuentamensajes.jsp',
                type:  'post',
                timeout: 10000,
                error: function(){
                        console.log("msj e");
                },
                beforeSend: function () {
                        console.log("recarga mensajes");
                },
                success:  function (response) {
                    $(".badgemsj").html('');
                    if(response.trim()==0){
                        console.log("sin mensajes");
                        $(".badgemsj").append('');
                    } else {
                        $(".badgemsj").append('<span class="colbadg">'+response+'</span>');
                    }
                }
        });
}


function salirPartido(idpart,idusu,nompart){
        /*Ennvia solicitud de juego al partido */
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            function onConfirmsalPar(buttonIndex) {
                if(buttonIndex==1){
                        saliendoPartido(idpart,idusu);
                }
            }
            navigator.notification.confirm(
                'Desea dejar el partido '+nompart+'?', // message
                 onConfirmsalPar,            // callback to invoke with index of button pressed
                'Salir del Partido',  // title
                ['Aceptar','Cancelar']     // buttonLabels
            );
        }

    }


    function saliendoPartido(idpart,idusu){
        var parametros = {
                "idpart" : idpart,
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/salirdelpartido.jsp',
                type:  'post',
                timeout: 10000,
                error: function(){
                        $("#ressalir").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#ressalir").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#ressalir").html('');
                    if(response.trim()!=""){
                        showBottom("Has salido correctamente.");
                        cargaDatosAgenda($('#idutext').text());
                        window.location.href = '#agenda';
                    } else {
                        showBottom("Error al salir.");
                    }
                }
        });
}

function obtienePerfilUsuario(idusu){
        var parametros = {
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/obtieneperfil.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resperfilusu").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resperfilusu").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    var len = response.length;
                    for(var i=0; i<len; i++){
                        $("#resperfilusu").html('');
                        $("#pfusu").text(response[i].usn);
                        $("#pfcor").text(response[i].cor);
                        $("#pfnom").text(response[i].nom);
                        $("#pfape").text(response[i].ape);
                        $('#imgu').css('background-image', 'url("'+response[i].img+'")');
                        $("#pfeda").text(response[i].eda);
                    }

                }
        });
    }

    function obtienePerfilUsuario2(idusu){
        var parametros = {
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/obtieneperfil.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resperfilusu").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resperfilusu").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    var len = response.length;
                    for(var i=0; i<len; i++){
                        $("#resperfilusu").html('');
                        $("#pfpos").text(response[i].pos);
                        $("#pfhab").text(response[i].pie);
                        $("#pfpre").text(response[i].pre);
                    }

                }
        });
    }


    function validaactuperfil(){
        var idusu = $('#idutext').text();
        if($("#tpos").val()==""){
                showBottom("Debe seleccionar posición");
        }else if($("#tpie").val()==""){
                showBottom("Debe seleccionar pie hábil");
        }else if($("#tpref").val()==""){
                showBottom("Debe seleccionar partido preferido");
        }else{
                var pos = $("#tpos").val();
                var pie = $("#tpie").val();
                var pref = $("#tpref").val();
                actualizaPerfilUsuario(idusu,pos,pie,pref);
        }
    }

    function actualizaPerfilUsuario(idusu,pos,pie,pref){
        var parametros = {
                "idusu" : idusu,
                "pos" : pos,
                "pie" : pie,
                "pref" : pref
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/actualizaperfiljugador.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#respperfjug").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#respperfjug").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    var len = response.length;
                    for(var i=0; i<len; i++){
                        $("#respperfjug").html('');
                        $("#pfpos").text(response[i].pjpos);
                        $("#pfhab").text(response[i].pjpie);
                        $("#pfpre").text(response[i].pjpre);
                        showBottom("Perfil actualizado correctamente.");
                    }

                }
        });
    }


function shareApp(){
        /*Ennvia solicitud de juego al partido */
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            
                navigator.share({
                        title: "Playfoot",
                        text: "Descarga Playfoot la app de los partidos amateur",
                        url: "https://www.playfoot.cl"
                    }).then(() => {
                        console.log("Compartida exitosamente!");
                    }).catch((err) => {
                        console.error("Error: ", err.message);
                    });

        }

}


function cerrarSession(idusu){

        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            function onConfirmsalPar(buttonIndex) {
                if(buttonIndex==1){
                        cerrarSesionOK(idusu);
                }
            }
            navigator.notification.confirm(
                'Desea salir de la aplicación?', // message
                 onConfirmsalPar,            // callback to invoke with index of button pressed
                'Cerrar sesión',  // title
                ['Aceptar','Cancelar']     // buttonLabels
            );
        }

}


function cerrarSesionOK(idusu){
        var parametros = {
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/cerrarsesion.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#rescierrses").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#rescierrses").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    var len = response.length;
                    for(var i=0; i<len; i++){
                        $("#rescierrses").html('');
                        if(response[i].sesid==idusu){
                                $("#idlogin").val(0);
                                $("#idutext").text(0);
                                window.location.href = 'index.html';
                        }else{
                                showBottom("Error al cerrar sesión");
                        }

                    }

                }
        });
}


    function guardaImagen(idusu,url64){

        if(url64.trim()==""){
                showBottom("Primero debe recortar una imagen!");
        }else{
                
                var parametros = {
                        "idusu" : idusu,
                        "url64" : url64
                };
                $.ajax({
                        data:  parametros,
                        url:   hostname+'SoccerApp/actualizaimagen.jsp',
                        type:  'post',
                        dataType: 'JSON',
                        timeout: 10000,
                        error: function(){
                                $("#respactualizada").html('');
                                showBottom("Error: recorte muy grande!");
                        },
                        beforeSend: function () {
                                $("#respactualizada").html('<div class="loading">Loading&#8230;</div>');
                        },
                        success:  function (response) {
                            var len = response.length;
                            for(var i=0; i<len; i++){
                                $("#respactualizada").html('');
                                $('#imgu').css('background-image', 'url("'+response[i].newimg+'")');
                                $("#editor").text("");
                                $("#preview").text("");
                                $("#base64").text("");
                                const miCanvas = document.querySelector('#preview');
                                // Contexto del canvas
                                const contexto = miCanvas.getContext('2d');
                                contexto.clearRect(0, 0, miCanvas.width, miCanvas.height);
                                showBottom("Foto de perfil actualizada correctamente.");
                            }
            
                        }
                });

        }

    }


    function actualizaCaliAsis(idusu){
        var parametros = {
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/actucaliasis.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#rescaliasi").html('');
                        console.log("msj e");
                },
                beforeSend: function () {
                        $("#rescaliasi").html('');
                },
                success:  function (response) {
                    var len = response.length;
                    for(var i=0; i<len; i++){
                        $("#rescaliasi").html('');

                        var notact = $("#circles-1").text();
                        var asiact = $("#circles-2").text();

                        if(asiact < response[i].asi || asiact > response[i].asi){
                                chartsJugados(response[i].asi,'circles-2');
                        }

                        if(notact < response[i].pro || notact > response[i].pro){
                                chartsNota(response[i].pro.substring(0,3),'circles-1');
                        }

                    }

                }
        });
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function obtieneComentario(idusu,nomjug,pg){
        if(pg==2){
                $("#addcommt").hide();
        }else{
                $("#addcommt").show();
        }

        $("#usucoment").text(nomjug.toUpperCase());
        var parametros = {
                "idusu" : idusu
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/cargacomentarios.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#rescomnt").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#rescomnt").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#rescomnt").html('');
                    var len = response.length;
                        for(var i=0; i<len; i++){
                                var fecht = response[i].fec.substring(0,16);
                                var l1 = '<div class="cardamigo" data-transition="slidefade" onclick="detalleJugador('+response[i].iduc+',4)">';
                                var l2 = '<div class="imgami">';
                                var l3 = '<div class="imgcenter">';
                                var l4 = '<a href="#" class="ratio img-responsive img-circle" id="imgam" style="background-image: url('+response[i].imgu+');" ></a>';
                                var l5 = '</div>';
                                var l6 = '</div>';
                                var l7 = '<div class="nomamic"><p style="color: rgb(207, 207, 207);">'+response[i].nom+' '+response[i].ape+'</p></div>';
                                var l8 = '<div class="usuamic"><p>'+response[i].coment+'</p></div>';
                                var l9 = '<div class="usuamic"><p style="color: rgb(4, 146, 182);">Fecha: '+fecht+'</p></div>';
                                var l0 = '</div>';
                                var afi2 = l1+l2+l3+l4+l5+l6+l7+l8+l9+l0;

                                $("#rescomnt").append(afi2);
                        }
                        if(len==0){
                                $("#rescomnt").append('<div class="notfound"><i class="material-icons">warning_amber</i><br>LISTA DE COMENTARIOS VACIA!</div>');
                        }
                        $("#rescomnt").append('<div id="espacer"></div>');
                }
        }); 
}


function agregaComentario(nombre){
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
                showPrompt();
                // process the promp dialog results
                function onPrompt(results) {
                        if (results.buttonIndex==1){
                                if(results.input1.length < 91 && results.input1.length > 5){
                                        validaOfensas(results.input1,1);
                                } else {
                                        showBottom("Comentario contiene "+results.input1.length+" ctrs,mínimo 5 y máximo 90.");
                                }
                        }
                }
                function showPrompt() {
                        navigator.notification.prompt(
                        'Escriba un comentario para '+nombre+":",  // message
                        onPrompt,                  // callback to invoke
                        'Agregar Comentario',            // title
                        ['Enviar','Cancelar']              // buttonLabels
                        );
                }

        }
}

function validaOfensas(cadena,ind){
        
        let termino = "ql";
        let termino2 = "qliao";
        let termino3 = "culiao";
        let termino4 = "wn";
        let termino5 = "weon";
        let termino6 = "ctm";
        let termino7 = "conchetumadre";
        let termino8 = "chuchetumadre";
        let termino9 = "wea";
        let termino10 = "conchetumare";
        let termino11 = "longi";
        let termino12 = "maricon";
        // para buscar la palabra hacemos
        let posicion = cadena.indexOf(termino);
        let posicion2 = cadena.indexOf(termino2);
        let posicion3 = cadena.indexOf(termino3);
        let posicion4 = cadena.indexOf(termino4);
        let posicion5 = cadena.indexOf(termino5);
        let posicion6 = cadena.indexOf(termino6);
        let posicion7 = cadena.indexOf(termino7);
        let posicion8 = cadena.indexOf(termino8);
        let posicion9 = cadena.indexOf(termino9);
        let posicion10 = cadena.indexOf(termino10);
        let posicion11 = cadena.indexOf(termino11);
        let posicion12 = cadena.indexOf(termino12);
        if (posicion !== -1 || posicion2 !== -1 || posicion3 !== -1 || posicion4 !== -1 || posicion5 !== -1 || posicion6 !== -1
        || posicion7 !== -1 || posicion8 !== -1 || posicion9 !== -1 || posicion10 !== -1 || posicion11 !== -1 || posicion12 !== -1){
                showBottom("No se permiten palabras ofensivas.");
        }else{
                if(ind==1){
                        guardarComentario($('#idutext').text(),$('#iddetami').val(),cadena);
                } else if(ind==2){
                        registraPreguntaPartido($('#idutext').text(),$('#idprage').val(),cadena);
                } else {
                        ingresaRespuestaPreg(cadena,$('#idutext').text(),ind);
                }
        }
}

function guardarComentario(idenvia,idrecibe,textocm){
        var parametros = {
                "idenvia" : idenvia,
                "idrecibe" : idrecibe,
                "textocm" : textocm,
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/registracomentario.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#rescomnt").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#rescomnt").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    var len = response.length;
                    $("#rescomnt").html('');
                    for(var i=0; i<len; i++){
                        if(response[i].idcom>0){
                                showBottom("Comentario ingresado exitosamente.");
                                obtieneComentario($('#iddetami').val(),$('#nomdj').text());
                        }else{
                                showBottom("Error, intente nuevamente.");
                        }
                    }

                }
        });
}





function agregaPreguntaPartido(){
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
                showPrompt();
                // process the promp dialog results
                function onPrompt(results) {
                        if (results.buttonIndex==1){
                                if(results.input1.length < 51 && results.input1.length > 5){
                                        validaOfensas(results.input1,2);
                                } else {
                                        showBottom("Mensaje contiene "+results.input1.length+" ctrs, mínimo es 5 y máximo 50.");
                                }
                        }
                }
                function showPrompt() {
                        navigator.notification.prompt(
                        'Escriba su pregunta: ',  // message
                        onPrompt,                  // callback to invoke
                        'Preguntas del Partido',            // title
                        ['Enviar','Cancelar']              // buttonLabels
                        );
                }

        }

}


$( "#formrecup" ).submit(function( event ) {

        if($("#recucorr").val().trim()==""){
                showBottom("Ingrese correo electrónico");
                event.preventDefault();
        }else{
                return; 
        }
});

function recuperaCuenta(){
        validaRecuperaClave($("#recucorr").val());
}

function validaRecuperaClave(correoid){
        var parametros = {
                "correoid" : correoid
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/recuperaclave.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resrecup").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resrecup").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    var len = response.length;
                    $("#resrecup").html('');
                    for(var i=0; i<len; i++){
                        if(response[i].resp=="OK"){
                                showBottom("Correo de recuperación enviado exitosamente.");
                                $("#recucorr").val("");
                        }else{
                                showBottom("Correo electrónico ingresado no registrado.");
                        }
                    }

                }
        });
}



function cargaPreguntasPartido(idpart){
        var parametros = {
                "idpart" : idpart
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/obtienepreguntas.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resprguntas").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resprguntas").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                        $("#resprguntas").html('');
                    var len = response.length;
                    for(var i=0; i<len; i++){

                        var idpre = response[i].idp;
                        var pregtext = "'"+response[i].pre+"'";
                        
                        var prs1 ='<div class="cardamigo" data-transition="slidefade" onclick="" id="pgrbx'+response[i].idp+'">';
                        var prs2 ='<div class="imgamipreg">';
                        var prs3 ='<div class="imgcepreg">';
                        var prs4 ='<a href="#" class="ratio img-responsive img-circle" id="imgam"><img src="img/question.png" alt="imgqs" width=""45" height="45"></a>';
                        var prs5 ='</div></div>';
                        var prs6 ='<div class="icoreply" onclick="agregaRespuesta('+pregtext+','+idpre+')"><i class="material-icons" style="color: rgb(199, 202, 202);">reply</i></div>';
                        var prs7 ='<div class="nomamipr">'+response[i].nom+' '+response[i].ape+' <span class="contrp">Respuestas '+response[i].ctn+'</span></div>';
                        var prs8 ='<div class="pregpr"><p>'+response[i].pre+'</p></div>';
                        var prs9 ='<p style="color: rgb(163, 163, 163); font-size: 11px; padding-bottom: 5px;">Enviado: '+response[i].fec+'</p>';
                        var prs10 ='</div>';

                        $("#resprguntas").append(''+prs1+''+prs2+''+prs3+''+prs4+''+prs5+''+prs6+''+prs7+''+''+prs8+''+''+prs9+''+''+prs10+'');

                        if(response[i].ctn>0){
                                obtieneRespPreguntas(idpre);   
                        }

                    }
                    if(len==0){
                        $("#resprguntas").append('<div class="notfound"><i class="material-icons">warning_amber</i><br>LISTA DE PREGUNTAS VACIA!</div>');
                    }
                    $("#resprguntas").append('<div id="espacer"></div>');

                }
        });
    }


function registraPreguntaPartido(idusu,idpart,pregunta){
        var parametros = {
                "idusu" : idusu,
                "idpart" : idpart,
                "pregunta" : pregunta
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/registrapregunta.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#respinsertpre").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#respinsertpre").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    var len = response.length;
                    $("#respinsertpre").html('');
                    for(var i=0; i<len; i++){
                        if(response[i].resp=="OK"){
                                cargaPreguntasPartido(idpart);
                                showBottom("Pregunta registrada exitosamente");
                        }else{
                                showBottom("Error, pregunta ya fue enviada");
                        }
                    }

                }
        });
}

function obtieneRespPreguntas(idpreg){
        var parametros = {
                "idpreg" : idpreg
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/obtienerespuestas.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#respinsertpre").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#respinsertpre").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    var len = response.length;
                    var blockid = '#pgrbx'+idpreg;
                    $("#respinsertpre").html('');
                    for(var i=0; i<len; i++){
                        var rps1 ='<p class="bxresp">';
                        var rps2 ='<i class="material-icons" style="color: rgb(199, 202, 202);">subdirectory_arrow_right</i>';
                        var rps3 ='<span class="respin">'+response[i].nom+' '+response[i].ape+'</span><br>';
                        var rps4 ='<span>'+response[i].res+'</span><br>';
                        var rps5 ='<span style="color: rgb(163, 163, 163); font-size: 11px; padding-bottom: 5px;">Recibida '+response[i].fec+'</span>';
                        var rps6 ='</p>';
                        $(blockid).append(''+rps1+''+rps2+''+rps3+''+rps4+''+rps5+''+rps6+'');
                    }
                }
        });
}

function agregaRespuesta(pretext,idpreg){
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
                showPrompt();
                // process the promp dialog results
                function onPrompt(results) {
                        if (results.buttonIndex==1){
                                if(results.input1.length < 51 && results.input1.length > 5){
                                        validaOfensas(results.input1,idpreg);
                                } else {
                                        showBottom("Respuesta contiene "+results.input1.length+" ctrs,mínimo 5 y máximo 50.");
                                }
                        }
                }
                function showPrompt() {
                        navigator.notification.prompt(
                        'Escriba su respuesta para ',  // message
                        onPrompt,                  // callback to invoke
                        'Respuesta a '+pretext,            // title
                        ['Enviar','Cancelar']             // buttonLabels
                        );
                }

        }
}

function ingresaRespuestaPreg(respuesta,idusu,idpreg){
        var parametros = {
                "respuesta" : respuesta,
                "idusu" : idusu,
                "idpreg" : idpreg,
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/insertarespuesta.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#respinsertpre").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#respinsertpre").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    var len = response.length;
                    $("#respinsertpre").html('');
                    for(var i=0; i<len; i++){
                        if(response[i].resp=="OK"){
                                showBottom("Respuesta ingresada exitosamente.");
                                cargaPreguntasPartido($("#idprage").val());
                        }else{
                                showBottom("Error, respuesta ya existe.");
                        }
                    }
                }
        });
}


function formacionaccion(){
        var idpart = $('#idprdet').val();
        var qacep = $('#lbac').text();
        var tipopart = $('#partitext').val();

        cargaListaPosicion(tipopart);

        if(tipopart=="Futbolito" && qacep>=7){
                obtieneFormacion(idpart,tipopart);
        }else if(tipopart=="Fútbol" && qacep>=11){
                obtieneFormacion(idpart,tipopart);
        }else if(tipopart=="Salon" && qacep>=5){
                obtieneFormacion(idpart,tipopart);
        }else if(tipopart=="Futbolito" && qacep<7){
                $("#resformacion").html("");
                $("#resformacion").append('<br><div class="notfound"><i class="material-icons">warning_amber</i><br>Partido de Futbolito debe tener al menos 6 jugadores para formación!</div>');
        }else if(tipopart=="Fútbol" && qacep<11){
                $("#resformacion").html("");
                $("#resformacion").append('<br><div class="notfound"><i class="material-icons">warning_amber</i><br>Partido de Fútbol debe tener al menos 11 jugadores para formación!</div>');
        }else if(tipopart=="Salon" && qacep<5){
                $("#resformacion").html("");
                $("#resformacion").append('<br><div class="notfound"><i class="material-icons">warning_amber</i><br>Partido de Salón debe tener al menos 5 jugadores para formación!</div>');
        }
}


function obtieneFormacion(idpart,tipo){
        var parametros = {
                "idpart" : idpart
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/obtieneformacion.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resformacion").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resformacion").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#resformacion").html('');
                    var len = response.length;
                    for(var i=0; i<len; i++){
                        if(response[i].esquema!=""){
                                $("#resformacion").append(response[i].esquema);
                                if(tipo=='Futbolito'){
                                        $("#cajaself").html("");
                                        var f0 ='<select id="selforma" onchange="formacionFutbolito(this.value)" data-mini="true">';
                                        var f1 = '<option value="33">Formación 3-3</option>';
                                        var f2 = '<option value="222">Formación 2-2-2</option>';
                                        var f3 ='</select>';
                                        var self = f0+f1+f2+f3;
                                        $("#cajaself").append(self);
                                }else if(tipo=='Fútbol'){
                                        $("#cajaself").html("");
                                        var f0 ='<select id="selforma" onchange="formacionFutbol(this.value)" data-mini="true">';
                                        var f1 = '<option value="532">Formación 5-3-2</option>';
                                        var f2 = '<option value="343">Formación 3-4-3</option>';
                                        var f3 = '<option value="352">Formación 3-5-2</option>';
                                        var f4 = '<option value="442">Formación 4-4-2</option>';
                                        var f5 ='</select>';
                                        var self = f0+f1+f2+f3+f4+f5;
                                        $("#cajaself").append(self);
                                }else{
                                        $("#cajaself").html("");  
                                }
                        }else{
                                if(tipo=='Futbolito'){
                                        $("#cajaself").html("");
                                        var f0 ='<select id="selforma" onchange="formacionFutbolito(this.value)" data-mini="true">';
                                        var f1 = '<option value="33">Formación 3-3</option>';
                                        var f2 = '<option value="222">Formación 2-2-2</option>';
                                        var f3 ='</select>';
                                        var self = f0+f1+f2+f3;
                                        $("#cajaself").append(self);
                                        formacionFutbolito(33);
                                }else if(tipo=='Fútbol'){
                                        $("#cajaself").html("");
                                        var f0 ='<select id="selforma" onchange="formacionFutbol(this.value)" data-mini="true">';
                                        var f1 = '<option value="532">Formación 5-3-2</option>';
                                        var f2 = '<option value="343">Formación 3-4-3</option>';
                                        var f3 = '<option value="352">Formación 3-5-2</option>';
                                        var f4 = '<option value="442">Formación 4-4-2</option>';
                                        var f5 ='</select>';
                                        var self = f0+f1+f2+f3+f4+f5;
                                        $("#cajaself").append(self);
                                        formacionFutbol(532);
                                }else if(tipo=='Salon'){
                                        $("#cajaself").html("");
                                        formacionSalon();
                                }
                        }
                    }
                }
        });
}


function formacionFutbol(tipo){
        $("#resformacion").html("");
        if(tipo==532){

                var l1='<div class="bkarq"><div class="bkply bkp"><br>1<br><span class="nju" id="jn1">Pendiente</span></div></div>';
                var l2='<div class="bkply bkj"><br>2<br><span class="nju" id="jn2">Pendiente</span></div>';
                var l3='<div class="bkply bkj"><br>6<br><span class="nju" id="jn6">Pendiente</span></div>';
                var l4='<div class="bkply bkj"><br>3<br><span class="nju" id="jn3">Pendiente</span></div>';
                var l5='<div class="bkply bkj"><br>5<br><span class="nju" id="jn5">Pendiente</span></div>';
                var l6='<div class="bkply bkj"><br>4<br><span class="nju" id="jn4">Pendiente</span></div><br>';
                var l7='<div class="bkply bkj"><br>8<br><span class="nju" id="jn8">Pendiente</span></div>';
                var l8='<div class="bkply bkj"><br>10<br><span class="nju" id="jn10">Pendiente</span></div>';
                var l9='<div class="bkply bkj"><br>7<br><span class="nju" id="jn7">Pendiente</span></div><br>';
                var l10='<div class="bkply bkj"><br>9<br><span class="nju" id="jn9">Pendiente</span></div>';
                var l11='<div class="bkply bkj"><br>11<br><span class="nju" id="jn11">Pendiente</span></div>';
                var forma = l1+l2+l3+l4+l5+l6+l7+l8+l9+l10+l11;
                $("#resformacion").append(forma);

        }else if(tipo==343){

                var l1='<div class="bkarq"><div class="bkply bkp"><br>1<br><span class="nju" id="jn1">Pendiente</span></div></div>';
                var l2='<div class="bkply bkj"><br>2<br><span class="nju" id="jn2">Pendiente</span></div>';
                var l3='<div class="bkply bkj"><br>3<br><span class="nju" id="jn3">Pendiente</span></div>';
                var l4='<div class="bkply bkj"><br>4<br><span class="nju" id="jn4">Pendiente</span></div><br>';
                var l5='<div class="bkply bkj"><br>8<br><span class="nju" id="jn8">Pendiente</span></div>';
                var l6='<div class="bkply bkj"><br>6<br><span class="nju" id="jn6">Pendiente</span></div>';
                var l7='<div class="bkply bkj"><br>5<br><span class="nju" id="jn5">Pendiente</span></div>';
                var l8='<div class="bkply bkj"><br>7<br><span class="nju" id="jn7">Pendiente</span></div><br>';
                var l9='<div class="bkply bkj"><br>9<br><span class="nju" id="jn9">Pendiente</span></div>';
                var l10='<div class="bkply bkj"><br>10<br><span class="nju" id="jn10">Pendiente</span></div>';
                var l11='<div class="bkply bkj"><br>11<br><span class="nju" id="jn11">Pendiente</span></div>';
                var forma = l1+l2+l3+l4+l5+l6+l7+l8+l9+l10+l11;
                $("#resformacion").append(forma);

        }else if(tipo==352){

                var l1='<div class="bkarq"><div class="bkply bkp"><br>1<br><span class="nju" id="jn1">Pendiente</span></div></div>';
                var l2='<div class="bkply bkj"><br>2<br><span class="nju" id="jn2">Pendiente</span></div>';
                var l3='<div class="bkply bkj"><br>3<br><span class="nju" id="jn3">Pendiente</span></div>';
                var l4='<div class="bkply bkj"><br>4<br><span class="nju" id="jn4">Pendiente</span></div><br>';
                var l5='<div class="bkply bkj"><br>5<br><span class="nju" id="jn5">Pendiente</span></div>';
                var l6='<div class="bkply bkj"><br>8<br><span class="nju" id="jn8">Pendiente</span></div>';
                var l7='<div class="bkply bkj"><br>10<br><span class="nju" id="jn10">Pendiente</span></div>';
                var l8='<div class="bkply bkj"><br>6<br><span class="nju" id="jn6">Pendiente</span></div>';
                var l9='<div class="bkply bkj"><br>7<br><span class="nju" id="jn7">Pendiente</span></div><br>';
                var l10='<div class="bkply bkj"><br>9<br><span class="nju" id="jn9">Pendiente</span></div>';
                var l11='<div class="bkply bkj"><br>11<br><span class="nju" id="jn11">Pendiente</span></div>';
                var forma = l1+l2+l3+l4+l5+l6+l7+l8+l9+l10+l11;
                $("#resformacion").append(forma);

        }else if(tipo==442){

                var l1='<div class="bkarq"><div class="bkply bkp"><br>1<br><span class="nju" id="jn1">Pendiente</span></div></div>';
                var l2='<div class="bkply bkj"><br>2<br><span class="nju" id="jn2">Pendiente</span></div>';
                var l3='<div class="bkply bkj"><br>3<br><span class="nju" id="jn3">Pendiente</span></div>';
                var l4='<div class="bkply bkj"><br>5<br><span class="nju" id="jn5">Pendiente</span></div>';
                var l5='<div class="bkply bkj"><br>4<br><span class="nju" id="jn4">Pendiente</span></div><br>';
                var l6='<div class="bkply bkj"><br>6<br><span class="nju" id="jn6">Pendiente</span></div>';
                var l7='<div class="bkply bkj"><br>10<br><span class="nju" id="jn10">Pendiente</span></div>';
                var l8='<div class="bkply bkj"><br>8<br><span class="nju" id="jn8">Pendiente</span></div>';                
                var l9='<div class="bkply bkj"><br>7<br><span class="nju" id="jn7">Pendiente</span></div><br>';
                var l10='<div class="bkply bkj"><br>9<br><span class="nju" id="jn9">Pendiente</span></div>';
                var l11='<div class="bkply bkj"><br>11<br><span class="nju" id="jn11">Pendiente</span></div>';
                var forma = l1+l2+l3+l4+l5+l6+l7+l8+l9+l10+l11;
                $("#resformacion").append(forma);

        }

}

function formacionFutbolito(tipo){
        $("#resformacion").html("");
        if(tipo==33){

                var l1='<div class="bkarq"><div class="bkply bkp"><br>1<br><span class="nju" id="jn1">Pendiente</span></div></div>';
                var l2='<div class="bkply bkj"><br>2<br><span class="nju" id="jn2">Pendiente</span></div>';
                var l3='<div class="bkply bkj"><br>3<br><span class="nju" id="jn3">Pendiente</span></div>';
                var l4='<div class="bkply bkj"><br>4<br><span class="nju" id="jn4">Pendiente</span></div><br>';
                var l5='<div class="bkply bkj"><br>7<br><span class="nju" id="jn7">Pendiente</span></div>';
                var l6='<div class="bkply bkj"><br>10<br><span class="nju" id="jn10">Pendiente</span></div>';
                var l7='<div class="bkply bkj"><br>9<br><span class="nju" id="jn9">Pendiente</span></div>';
                var forma1 = l1+l2+l3+l4+l5+l6+l7;
                $("#resformacion").append(forma1);

        }else if(tipo==222){

                var l1='<div class="bkarq"><div class="bkply bkp"><br>1<br><span class="nju" id="jn1">Pendiente</span></div></div>';
                var l2='<div class="bkply bkj"><br>2<br><span class="nju" id="jn2">Pendiente</span></div>';
                var l3='<div class="bkply bkj"><br>3<br><span class="nju" id="jn3">Pendiente</span></div><br>';
                var l4='<div class="bkply bkj"><br>4<br><span class="nju" id="jn4">Pendiente</span></div>';
                var l5='<div class="bkply bkj"><br>10<br><span class="nju" id="jn10">Pendiente</span></div><br>';
                var l6='<div class="bkply bkj"><br>7<br><span class="nju" id="jn7">Pendiente</span></div>';
                var l7='<div class="bkply bkj"><br>9<br><span class="nju" id="jn9">Pendiente</span></div>';
                var forma2 = l1+l2+l3+l4+l5+l6+l7;
                $("#resformacion").append(forma2);

        }

}

function formacionSalon(){
        $("#resformacion").html("");
                var l1='<div class="bkarq"><div class="bkply bkp"><br>1<br><span class="nju" id="jn1">Pendiente</span></div></div>';
                var l2='<div class="bkply bkj"><br>2<br><span class="nju" id="jn2">Pendiente</span></div>';
                var l3='<div class="bkply bkj"><br>4<br><span class="nju" id="jn4">Pendiente</span></div><br>';
                var l4='<div class="bkply bkj"><br>8<br><span class="nju" id="jn8">Pendiente</span></div>';
                var l5='<div class="bkply bkj"><br>10<br><span class="nju" id="jn10">Pendiente</span></div>';
                var forma = l1+l2+l3+l4+l5;
                $("#resformacion").append(forma);

}

function cargaListaPosicion(tipo){
        $("#jposi").html("");
        if(tipo=="Fútbol"){
                $("#jposi").append('<option value="1">Camiseta 1</option>');
                $("#jposi").append('<option value="2">Camiseta 2</option>');
                $("#jposi").append('<option value="3">Camiseta 3</option>');
                $("#jposi").append('<option value="4">Camiseta 4</option>');
                $("#jposi").append('<option value="5">Camiseta 5</option>');
                $("#jposi").append('<option value="6">Camiseta 6</option>');
                $("#jposi").append('<option value="7">Camiseta 7</option>');
                $("#jposi").append('<option value="8">Camiseta 8</option>');
                $("#jposi").append('<option value="9">Camiseta 9</option>');
                $("#jposi").append('<option value="10">Camiseta 10</option>');
                $("#jposi").append('<option value="11">Camiseta 11</option>');

        } else if(tipo=="Futbolito"){

                $("#jposi").append('<option value="1">Camiseta 1</option>');
                $("#jposi").append('<option value="2">Camiseta 2</option>');
                $("#jposi").append('<option value="3">Camiseta 3</option>');
                $("#jposi").append('<option value="4">Camiseta 4</option>');
                $("#jposi").append('<option value="7">Camiseta 7</option>');
                $("#jposi").append('<option value="9">Camiseta 9</option>');
                $("#jposi").append('<option value="10">Camiseta 10</option>');

        } else {
                $("#jposi").append('<option value="1">Camiseta 1</option>');
                $("#jposi").append('<option value="2">Camiseta 2</option>');
                $("#jposi").append('<option value="4">Camiseta 4</option>');
                $("#jposi").append('<option value="8">Camiseta 8</option>');
                $("#jposi").append('<option value="10">Camiseta 10</option>');
        }
}

function asignaJugador(nomjug,numcam){
        var idjtext = "#jn"+numcam;
        if(nomjug!="" && numcam>0){

                if($(idjtext).text()=="Pendiente"){
                        $(idjtext).text(nomjug);
                        $("#icsvf").css({"color": "#db490f"});
                }else{
                        confirmaRemplaJugador($(idjtext).text(),nomjug,numcam);
                }

        }else{
                showBottom("Error, seleccione camiseta y jugador.");
        }
}


function confirmaRemplaJugador(prinom,segnom,pos){
        /*Ennvia solicitud de juego al partido */
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            function onConfirConnect(buttonIndex) {
                if(buttonIndex==1){
                        var idjtext = "#jn"+pos;
                        $(idjtext).text(segnom);
                        $("#icsvf").css({"color": "#db490f"});
                }
            }
            navigator.notification.confirm(
                'Ya existe el jugador '+prinom+' en la camiseta '+pos+', ¿Desea remplazarlo por '+segnom+'?', // message
                 onConfirConnect,  // callback to invoke with index of button pressed
                'Remplazar jugador',  // title
                ['Remplazar','Cancelar']     // buttonLabels
            );
        }
}


function actualizaFormacion(idpart,esque,numfor){
        var parametros = {
                "idpart" : idpart,
                "esque" : esque,
                "numfor" : numfor
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/actualizaformacion.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#respactfor").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#respactfor").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    var len = response.length;
                    $("#respactfor").html('');
                    for(var i=0; i<len; i++){
                        if(response[i].resp=="OK"){
                                showBottom("Formación actualizada correctamente.");
                                $("#icsvf").css({"color": "#fff"});
                        }else{
                                showBottom("Error, respuesta servidor.");
                        }
                    }
                }
        });
}

function obtieneFormacionage(idpart){
        var parametros = {
                "idpart" : idpart
        };
        $.ajax({
                data:  parametros,
                url:   hostname+'SoccerApp/obtieneformacion.jsp',
                type:  'post',
                dataType: 'JSON',
                timeout: 10000,
                error: function(){
                        $("#resforage").html('');
                        errorTimeOutConnect();
                },
                beforeSend: function () {
                        $("#resforage").html('<div class="loading">Loading&#8230;</div>');
                },
                success:  function (response) {
                    $("#resforage").html('');
                    var len = response.length;
                    for(var i=0; i<len; i++){
                        if(response[i].esquema!=""){
                                $("#resforage").append(response[i].esquema);
                        }else{
                                $("#resforage").append('<br><div class="notfound"><i class="material-icons">warning_amber</i><br>Formación inicial pendiente publicación.</div>');
                        }
                    }
                }
        });
}