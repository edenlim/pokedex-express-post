const express = require('express');
const jsonfile = require('jsonfile');
// Init express app
const app = express();
const FILE = 'pokedex.json';
const myFile = 'eden.json';

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

 //Allows use for request.body
const methodOverride = require('method-override')
app.use(methodOverride('_method'));


app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

const reactEngine = require('express-react-views').createEngine();
app.engine('jsx', reactEngine);
app.set('views', __dirname+'/views');
app.set('view engine', 'jsx');



/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/pokemon', (request,response)=>{
    console.log(request.body);
    response.render('home.jsx');
})

app.post('/pokemon', (request,response)=>{
    response.send(request.body)
})

app.get('/pokemon/sort?',(request,response)=>{
    console.log("My request query",request.query);
    if(request.query.path === "height"){
        console.log("Wow height");
        jsonfile.readFile(FILE, (err,obj)=>{
            let str = "List of pokemon by height: <br>";

            let tempArr = obj["pokemon"]
            tempArr.sort((a,b) => (parseFloat(a["height"]) < parseFloat(b["height"])) ? 1: -1)

            tempArr.forEach(function(a){
                str = str + `<img src="${a["img"]}">` + "<br>" + "Name: " +a["name"] + "  Height: " + a["height"] +"<br>"
            })


                response.send(str);
        })
    } else if (request.query.path === "weight"){
        console.log("Wow weight");
        jsonfile.readFile(FILE, (err,obj)=>{
            let str = "List of pokemon by weight: <br>";

            let tempArr = obj["pokemon"]
            tempArr.sort((a,b) => (parseFloat(a["weight"]) < parseFloat(b["weight"])) ? 1: -1)

            tempArr.forEach(function(a){
                str = str +`<img src="${a["img"]}">` + "<br>" + "Name: " +a["name"] + "  Weight: " + a["weight"] +"<br>"
            })

            response.send(str);
        })
    }
})

app.get('/pokemon/new?', (request,response)=>{
    response.render('addPokemon.jsx');
})


app.post('/pokemon/new', (request, response) => {
    console.log("Post is working!");
    jsonfile.readFile(FILE, (err,obj)=>{

        if(err){
            console.log(err)
        }

        console.log("Data given by user: ",request.body);
        request.body.img = `http://www.serebii.net/pokemongo/pokemon/${request.body.num}.png`
        obj["pokemon"].push(request.body);
        jsonfile.writeFile(FILE, obj, (err)=>{
            // let resp = JSON.stringify(request.body)
            let name = `<p>Name: ${request.body.name}</p>`;
            let weight = `<p>Weight: ${request.body.weight}</p>`;
            let height = `<p>Height: ${request.body.height}</p>`;
            let num = `<p>Num: ${request.body.num}</p>`;
            let img = `<img src="${request.body.img}">`;
            let resp = img + name + weight + height + num;
            response.send(resp)
        })
    })
});

app.get('/pokemon/show', (request, response)=>{
    jsonfile.readFile(FILE, (err,obj)=>{
        let dex = obj["pokemon"];
        let str = "List of pokemon:<br>"

        // for(var i=0; i< dex.length; i++){
        //     str = str +`<img src="${dex[i]["img"]}">`
        // }

        const data = {
            dex: dex,
        }
        response.render('allMons.jsx',data);
    });
})


app.get('/pokemon/:id/edit',(request, response)=>{
    let id = request.params.id;
    jsonfile.readFile(FILE, (err, obj) => {
        //PokemonObj is an object of a pokemon of that specified id
        let pokemonObj = obj["pokemon"][id]
        const data = {
            id: id,
            pokemonObj: pokemonObj, //IT IS AN OBJECT
        }
        console.log(pokemonObj)
        response.render('selectedPkm.jsx', data)
    });
});

app.get('/pokemon/:id', (request,response)=>{
    let id = request.params.id;
    jsonfile.readFile(FILE, (err,obj)=>{
        let pokemonObj = obj["pokemon"][id];
        const data = {
            pokemonObj: pokemonObj,
        }
        response.render('render.jsx',data)
    })


})

app.put('/pokemon/:id',(request,response)=>{
    var pokemonId = request.params.id;
    var dataReceived = request.body;
    console.log(pokemonId);
    console.log(dataReceived);
    jsonfile.readFile(FILE,(err,obj)=>{
        let pokemon = obj["pokemon"][pokemonId];
        pokemon.weight = dataReceived.weight;
        pokemon.height = dataReceived.height;
        pokemon.num = dataReceived.num
        pokemon.name = dataReceived.name
        pokemon.img = `http://www.serebii.net/pokemongo/pokemon/${dataReceived.num}.png`
        console.log(pokemon.name + ": " +pokemon.weight);
        jsonfile.writeFile(FILE, obj,(err) =>{
            response.send(`New weight of ${pokemon.name}: ${pokemon.weight}`)
        })
    })
})



/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));