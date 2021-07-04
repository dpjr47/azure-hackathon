function mainshow1(){
    document.getElementById("faq").style.display="inline";
    document.getElementById("home").style.display="none";
    document.getElementById("test").style.display="none";
    document.getElementById("account").style.display="none";
}

function mainshow2(){
    document.getElementById("test").style.display="inline";
    document.getElementById("home").style.display="none";
    document.getElementById("faq").style.display="none";
    document.getElementById("account").style.display="none";
}

function mainshow3(){
    document.getElementById("home").style.display="inline";
    document.getElementById("faq").style.display="none";
    document.getElementById("test").style.display="none";
    document.getElementById("account").style.display="none";
}

function mainshow4(){
    document.getElementById("account").style.display="inline";
    document.getElementById("home").style.display="none";
    document.getElementById("test").style.display="none";
    document.getElementById("faq").style.display="none";
}

//news api

var url = 'https://newsapi.org/v2/everything?q=covid&apiKey=86a2d82c7f75420e96cb797a13c66dfd'
var req = new Request(url);
fetch(req)
    .then(function(response) {
       // console.log(response.json());
      return response.json();
      }).then(function(jsonResult){
        console.log(jsonResult)
        //console.log(jsonResult['articles'])

        var disp1 = document.getElementById('ubox');
        var disp2 = document.getElementById('ubox2');
        for (var i=0;i<jsonResult['articles'].length;i++)
        {
           console.log(jsonResult['articles'][i]['title']);
           var divs = document.createElement('li');
           var hr = document.createElement('hr')
            divs.innerHTML = jsonResult['articles'][i]['title']+"\n";
            var kaali_div = document.createElement('div')
            kaali_div.innerHTML = "\n";
            disp1.appendChild(divs);
            disp1.appendChild(kaali_div)
            disp1.appendChild(hr)
            
        }

      })

// statistics

fetch("https://covid-19-data.p.rapidapi.com/country/code?code=in", {
    "method": "GET",
    "headers": {
        "x-rapidapi-key": "202ec55053msh42d87d43690c628p129cdcjsn64494601e657",
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com"
    }
})
.then(function(response) {
       // console.log(response.json());
      return response.json();
      }).then(function(jsonResult){
        console.log(jsonResult)
        console.log(jsonResult[0])

        var disp1 = document.getElementById('ubox');
        var disp2 = document.getElementById('ubox2');


        var code = jsonResult[0]['country'];
        var conf = jsonResult[0]['confirmed'];
        var cri =  jsonResult[0]['critical'];
        var dea =  jsonResult[0]['deaths'];
        var rec =  jsonResult[0]['recovered'];

        var disp2 = document.getElementById('ubox2');

        var divs = document.createElement('li');
        var hr4 = document.createElement('hr')
        divs.innerHTML = code;
        disp2.appendChild(divs);
        divs.innerHTML = "confirmed "+conf;
        disp2.appendChild(hr4);

        var divs = document.createElement('li');
        var hr = document.createElement('hr')
        divs.innerHTML = "Critical "+cri;
        disp2.appendChild(divs);
        disp2.appendChild(hr);

        var divs = document.createElement('li');
        var hr2 = document.createElement('hr')
        divs.innerHTML = "Deaths "+dea;
        disp2.appendChild(divs);
        disp2.appendChild(hr2);

        var divs = document.createElement('li');
        var hr3 = document.createElement('hr')
        divs.innerHTML = "Recovered "+rec;
        disp2.appendChild(divs);
        disp2.appendChild(hr3);



      })