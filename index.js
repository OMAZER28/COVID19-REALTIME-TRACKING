const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const fetch = require('node-fetch');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('assets'));



app.get('/', (req, res) => {
    fetch("https://pomber.github.io/covid19/timeseries.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            var data = [];
            var tabdate = [];
            var tabconf = [];
            var tabdeat = [];
            var tabrecov = [];
            var rank = 0;
            var conf = 0;
            var deat = 0;
            var recov = 0;
            var nc = 0;
            var nd = 0;
            var ac = 0;
            var lu = "";
            var r1 = "";
            var r1conf = 0;
            var r1ac = 0;
            var r1deat = 0;
            var r1recov = 0;
            var confy = 0;
            var deaty = 0;
            var recovy = 0;
            var fin = false;

            for (p in json) {
                for (pays in json) {
                    if (json[pays][json[pays].length - 1].confirmed >= json[p][json[p].length - 1].confirmed) {
                        rank += 1;
                        lu = json[pays][json[pays].length - 1].date;
                    }
                }
                if (!fin) {
                    for (var i = 0; i < json[p].length; i++) {
                        tabdate.push(json[p][i].date);
                        tabconf.push(0);
                        tabdeat.push(0);
                        tabrecov.push(0);
                    }
                    fin = true;
                }

                for (var i = 0; i < json[p].length; i++) {
                    tabconf[i] += json[p][i].confirmed;;
                    tabdeat[i] += json[p][i].deaths;
                    tabrecov[i] += json[p][i].recovered;
                }


                conf += json[p][json[p].length - 1].confirmed;
                deat += json[p][json[p].length - 1].deaths;
                nd += json[p][json[p].length - 1].deaths - json[p][json[p].length - 2].deaths;
                recov += json[p][json[p].length - 1].recovered;

                confy += json[p][json[p].length - 2].confirmed;
                deaty += json[p][json[p].length - 2].deaths;
                recovy += json[p][json[p].length - 2].recovered;

                nc += json[p][json[p].length - 1].confirmed - json[p][json[p].length - 2].confirmed;
                ac += json[p][json[p].length - 1].confirmed - json[p][json[p].length - 1].deaths - json[p][json[p].length - 1].recovered;
                if (p == "Taiwan*") {
                    if (rank == 1) {
                        r1 = "Taiwan";
                        r1conf = json[p][json[p].length - 1].confirmed;
                        r1ac = json[p][json[p].length - 1].confirmed - json[p][json[p].length - 1].deaths - json[p][json[p].length - 1].recovered;
                        r1deat = json[p][json[p].length - 1].deaths;
                        r1recov = json[p][json[p].length - 1].recovered;
                    }
                    data.push({
                        "rank": rank,
                        "pays": "Taiwan",
                        "confirmed": json[p][json[p].length - 1].confirmed,
                        "deaths": json[p][json[p].length - 1].deaths,
                        "newdeaths": json[p][json[p].length - 1].deaths - json[p][json[p].length - 2].deaths,
                        "recovered": json[p][json[p].length - 1].recovered,
                        "newcases": json[p][json[p].length - 1].confirmed - json[p][json[p].length - 2].confirmed,
                        "activecases": json[p][json[p].length - 1].confirmed - json[p][json[p].length - 1].deaths - json[p][json[p].length - 1].recovered
                    });
                }
                else {
                    if (rank == 1) {
                        r1 = p;
                        r1conf = json[p][json[p].length - 1].confirmed;
                        r1ac = json[p][json[p].length - 1].confirmed - json[p][json[p].length - 1].deaths - json[p][json[p].length - 1].recovered;
                        r1deat = json[p][json[p].length - 1].deaths;
                        r1recov = json[p][json[p].length - 1].recovered;
                    }
                    data.push({
                        "rank": rank,
                        "pays": p,
                        "confirmed": json[p][json[p].length - 1].confirmed,
                        "deaths": json[p][json[p].length - 1].deaths,
                        "newdeaths": json[p][json[p].length - 1].deaths - json[p][json[p].length - 2].deaths,
                        "recovered": json[p][json[p].length - 1].recovered,
                        "newcases": json[p][json[p].length - 1].confirmed - json[p][json[p].length - 2].confirmed,
                        "activecases": json[p][json[p].length - 1].confirmed - json[p][json[p].length - 1].deaths - json[p][json[p].length - 1].recovered
                    });
                }
                var rank = 0;
            }
            res.render('index', {
                data: data,
                wdata: {
                    "pays": "World", "confirmed": conf, "deaths": deat, "newdeaths": nd, "recovered": recov,
                    "newcases": nc, "activecases": ac, "lastupdate": lu, "confy": conf - confy, "deaty": deat - deaty, "recovy": recov - recovy,
                    "r1": r1, "r1conf": r1conf, "r1ac": r1ac, "r1deat": r1deat, "r1recov": r1recov, "tabconf": tabconf, "tabdate": tabdate,
                    "tabdeat": tabdeat, "tabrecov": tabrecov
                }
            });
        });
})

app.get('/country/:nompays', (req, res) => {
    var nompays = req.params.nompays;
    if (nompays == "Taiwan") {
        nompays = "Taiwan*";
    }
    fetch("https://pomber.github.io/covid19/timeseries.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            var data = [];
            var tabdate = [];
            var tabconf = [];
            var tabdeat = [];
            var tabrecov = [];
            var rank = 0;
            var conf = 0;
            var deat = 0;
            var recov = 0;
            var r1nc = 0;
            var r1nd = 0;
            var nc = 0;
            var nd = 0;
            var ac = 0;
            var lu = "";
            var r1conf = 0;
            var r1ac = 0;
            var r1deat = 0;
            var r1recov = 0;
            var confy = 0;
            var deaty = 0;
            var recovy = 0;
            var fin = false;

            for (p in json) {
                for (pays in json) {
                    if (json[pays][json[pays].length - 1].confirmed >= json[`${nompays}`][json[`${nompays}`].length - 1].confirmed) {
                        rank += 1;
                        lu = json[pays][json[pays].length - 1].date;
                    }
                }
                if (!fin) {
                    for (var i = 0; i < json[p].length; i++) {
                        tabdate.push(json[p][i].date);
                        tabconf.push(0);
                        tabdeat.push(0);
                        tabrecov.push(0);
                    }
                    fin = true;
                }

                for (var i = 0; i < json[`${nompays}`].length; i++) {
                    tabconf[i] = json[`${nompays}`][i].confirmed;;
                    tabdeat[i] = json[`${nompays}`][i].deaths;
                    tabrecov[i] = json[`${nompays}`][i].recovered;
                }

                conf += json[p][json[p].length - 1].confirmed;
                ac += json[p][json[p].length - 1].confirmed - json[p][json[p].length - 1].deaths - json[p][json[p].length - 1].recovered;
                deat += json[p][json[p].length - 1].deaths;
                recov += json[p][json[p].length - 1].recovered;

                nd += json[p][json[p].length - 1].deaths - json[p][json[p].length - 2].deaths;
                nc += json[p][json[p].length - 1].confirmed - json[p][json[p].length - 2].confirmed;

                confy = json[`${nompays}`][json[`${nompays}`].length - 2].confirmed;
                deaty = json[`${nompays}`][json[`${nompays}`].length - 2].deaths;
                recovy = json[`${nompays}`][json[`${nompays}`].length - 2].recovered;

                r1nd = json[`${nompays}`][json[`${nompays}`].length - 1].deaths - json[`${nompays}`][json[`${nompays}`].length - 2].deaths;
                r1nc = json[`${nompays}`][json[`${nompays}`].length - 1].confirmed - json[`${nompays}`][json[`${nompays}`].length - 2].confirmed;
                r1conf = json[`${nompays}`][json[`${nompays}`].length - 1].confirmed;
                r1ac = json[`${nompays}`][json[`${nompays}`].length - 1].confirmed - json[`${nompays}`][json[`${nompays}`].length - 1].deaths - json[`${nompays}`][json[`${nompays}`].length - 1].recovered;
                r1deat = json[`${nompays}`][json[`${nompays}`].length - 1].deaths;
                r1recov = json[`${nompays}`][json[`${nompays}`].length - 1].recovered;
                if (p == "Taiwan*") {
                    data.push({
                        "rank": rank,
                        "pays": "Taiwan",
                        "confirmed": json[p][json[p].length - 1].confirmed,
                    });
                } else {
                    data.push({
                        "rank": rank,
                        "pays": p,
                        "confirmed": json[p][json[p].length - 1].confirmed,
                    });

                }

                var rank = 0;
            }
            if (nompays == "Taiwan*") {
                nompays = "Taiwan";
                res.render('content', {
                    data: data,
                    wdata: {
                        "pays": "World", "confirmed": conf, "deaths": deat, "newdeaths": nd, "recovered": recov,
                        "newcases": nc, "activecases": ac, "lastupdate": lu, "confy": r1conf - confy, "deaty": r1deat - deaty, "recovy": r1recov - recovy,
                        "r1": `${nompays}`, "r1conf": r1conf, "r1ac": r1ac, "r1deat": r1deat, "r1recov": r1recov, "tabconf": tabconf, "tabdate": tabdate,
                        "tabdeat": tabdeat, "tabrecov": tabrecov, "r1nc": r1nc, "r1nd": r1nd
                    }
                });
            } else {
                res.render('content', {
                    data: data,
                    wdata: {
                        "pays": "World", "confirmed": conf, "deaths": deat, "newdeaths": nd, "recovered": recov,
                        "newcases": nc, "activecases": ac, "lastupdate": lu, "confy": r1conf - confy, "deaty": r1deat - deaty, "recovy": r1recov - recovy,
                        "r1": `${nompays}`, "r1conf": r1conf, "r1ac": r1ac, "r1deat": r1deat, "r1recov": r1recov, "tabconf": tabconf, "tabdate": tabdate,
                        "tabdeat": tabdeat, "tabrecov": tabrecov, "r1nc": r1nc, "r1nd": r1nd
                    }
                });
            }

        });
});


app.get('/all', (req, res) => {
    fetch("https://pomber.github.io/covid19/timeseries.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            var data = [];
            var tabdate = [];
            var tabconf = [];
            var tabdeat = [];
            var tabrecov = [];
            var rank = 0;
            var conf = 0;
            var deat = 0;
            var recov = 0;
            var nc = 0;
            var nd = 0;
            var ac = 0;
            var lu = "";
            var r1 = "";
            var r1conf = 0;
            var r1ac = 0;
            var r1deat = 0;
            var r1recov = 0;
            var confy = 0;
            var deaty = 0;
            var recovy = 0;
            var fin = false;

            for (p in json) {
                for (pays in json) {
                    if (json[pays][json[pays].length - 1].confirmed >= json[p][json[p].length - 1].confirmed) {
                        rank += 1;
                        lu = json[pays][json[pays].length - 1].date;
                    }
                }
                if (!fin) {
                    for (var i = 0; i < json[p].length; i++) {
                        tabdate.push(json[p][i].date);
                        tabconf.push(0);
                        tabdeat.push(0);
                        tabrecov.push(0);
                    }
                    fin = true;
                }

                for (var i = 0; i < json[p].length; i++) {
                    tabconf[i] += json[p][i].confirmed;;
                    tabdeat[i] += json[p][i].deaths;
                    tabrecov[i] += json[p][i].recovered;
                }


                conf += json[p][json[p].length - 1].confirmed;
                deat += json[p][json[p].length - 1].deaths;
                nd += json[p][json[p].length - 1].deaths - json[p][json[p].length - 2].deaths;
                recov += json[p][json[p].length - 1].recovered;

                confy += json[p][json[p].length - 2].confirmed;
                deaty += json[p][json[p].length - 2].deaths;
                recovy += json[p][json[p].length - 2].recovered;

                nc += json[p][json[p].length - 1].confirmed - json[p][json[p].length - 2].confirmed;
                ac += json[p][json[p].length - 1].confirmed - json[p][json[p].length - 1].deaths - json[p][json[p].length - 1].recovered;
                if (p == "Taiwan*") {
                    if (rank == 1) {
                        r1 = "Taiwan";
                        r1conf = json[p][json[p].length - 1].confirmed;
                        r1ac = json[p][json[p].length - 1].confirmed - json[p][json[p].length - 1].deaths - json[p][json[p].length - 1].recovered;
                        r1deat = json[p][json[p].length - 1].deaths;
                        r1recov = json[p][json[p].length - 1].recovered;
                    }
                    data.push({
                        "rank": rank,
                        "pays": "Taiwan",
                        "confirmed": json[p][json[p].length - 1].confirmed,
                        "deaths": json[p][json[p].length - 1].deaths,
                        "newdeaths": json[p][json[p].length - 1].deaths - json[p][json[p].length - 2].deaths,
                        "recovered": json[p][json[p].length - 1].recovered,
                        "newcases": json[p][json[p].length - 1].confirmed - json[p][json[p].length - 2].confirmed,
                        "activecases": json[p][json[p].length - 1].confirmed - json[p][json[p].length - 1].deaths - json[p][json[p].length - 1].recovered
                    });
                }
                else {
                    if (rank == 1) {
                        r1 = p;
                        r1conf = json[p][json[p].length - 1].confirmed;
                        r1ac = json[p][json[p].length - 1].confirmed - json[p][json[p].length - 1].deaths - json[p][json[p].length - 1].recovered;
                        r1deat = json[p][json[p].length - 1].deaths;
                        r1recov = json[p][json[p].length - 1].recovered;
                    }
                    data.push({
                        "rank": rank,
                        "pays": p,
                        "confirmed": json[p][json[p].length - 1].confirmed,
                        "deaths": json[p][json[p].length - 1].deaths,
                        "newdeaths": json[p][json[p].length - 1].deaths - json[p][json[p].length - 2].deaths,
                        "recovered": json[p][json[p].length - 1].recovered,
                        "newcases": json[p][json[p].length - 1].confirmed - json[p][json[p].length - 2].confirmed,
                        "activecases": json[p][json[p].length - 1].confirmed - json[p][json[p].length - 1].deaths - json[p][json[p].length - 1].recovered
                    });
                }
                var rank = 0;
            }
            res.render('content2', {
                data: data,
                wdata: {
                    "pays": "World", "confirmed": conf, "deaths": deat, "newdeaths": nd, "recovered": recov,
                    "newcases": nc, "activecases": ac, "lastupdate": lu, "confy": conf - confy, "deaty": deat - deaty, "recovy": recov - recovy,
                    "r1": r1, "r1conf": r1conf, "r1ac": r1ac, "r1deat": r1deat, "r1recov": r1recov, "tabconf": tabconf, "tabdate": tabdate,
                    "tabdeat": tabdeat, "tabrecov": tabrecov
                }
            });
        });
})

app.listen(3000, () => {
    console.log('Server is running at port 3000');
});
