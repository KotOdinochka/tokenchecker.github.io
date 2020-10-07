if(Cookies.get("token")) {
    $("#token").val(Cookies.get("token"));
}

$("#token").change(() => {
    Cookies.set("token", $("#token").val())
})

if(getParameterByName("token")) {
    $("#token").val(getParameterByName("token"));
    go();
} else {
    setupPage();
}

$("#tokenForm").submit(async (ev) => {
    ev.preventDefault();
    go();
})

function go() {
    setupPage();

    $(".lds-roller").removeClass("hidden");
    window.client = new Discord.Client();

    client.on("ready", async () => {
        const application = await client.fetchApplication();

        let result = `
        <div class="info">
                <i style="cursor: pointer;" onclick="client.downloadJSONuser();"><strong>Скачать информацию клиента</strong></i><br><br>
        
                Юзеров <strong>${client.users.size}</strong>, серверов <strong>${client.guilds.size}</strong><br>
                Создан <strong>${moment(client.user.createdTimestamp).format("DD.MM.YYYY HH:mm:ss")}</strong><br>
                Владелец <strong>${application.owner.tag}</strong><br>
                Статус <strong>${client.user.presence.status}</strong><br>
                Приглашение <a href="${await client.generateInvite([])}"><strong>НАЖМИ</strong></a><br>
                ${client.guilds.size > 0 ? `                <strong style="cursor: pointer;" onclick="writeFile('guilds.txt', \`${client.guilds.map(g => `${g.name} (${g.id}) | ${g.memberCount} members | ${g.owner.user.tag} (${g.owner.id})`).join("\n ")}\`)"><span>Скачать список серверoв</span></strong>                ` : ""}
                </div>
            <div class="user">
                <img width="128" src="${client.user.avatarURL}?size=128" style="border-radius: 100%;" alt="">
                ${client.user.tag}<br>
                ${client.user.id}
            </div>
        `
        setTimeout(() => {
            client.downloadJSONuser = () => {
                html2canvas(document.querySelector('.data'), {
                    useCORS: true
                }).then( 
                    function (canvas) { 
                        console.log(canvas);
                        var link = document.createElement('a');
                        link.download = client.user.tag + '.png';
                        link.href = canvas.toDataURL()
                        link.click();
                    })    
            }
        });
                $(".data").html(result);
        client.destroy().then(u => {
            $(".lds-roller").addClass("hidden")
        });
    })
    
    client.login($("#token").val()).then(l => {
        console.log(l);
    }).catch(e => {
        $("#error").html(e.message);
    })
}

function setupPage() {
    $("#error").html(null);
    $(".data").html(null);
    $(".lds-roller").addClass("hidden");
}

function writeFile(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
    function utf8_to_b64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }
    
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    