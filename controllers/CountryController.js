const CountryModel = require("../models/Country");
const countryController={

    addCountry: async(request , response) =>{


        console.log("====== Add Country API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        const {name} = request.body;

        try{

            let obj = {
                name: name
            };
            let country = new CountryModel(obj);
            country.save();

            response
                .status(200)
                .json({
                    status: true,
                    msg: "Contry added successfully"
                });
        }catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    updateCountry: async(request , response) =>{
        console.log("====== Update Country API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        console.log("=== Request Params: ===" + (request.params));
        const {name } = request.body;
        const countryId = request.params.id;

        try{
            let updated = await CountryModel.findOneAndUpdate({_id: countryId}, { $set: { name:name} });

            response
                .status(200)
                .json({
                    status: true,
                    msg: "Country Name updated successfully"
                });
        }catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    deleteCountry: async(request , response) =>{
        console.log("====== Remove Country API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        const {id} = request.body;

        try{
            let content = await CountryModel.deleteOne({_id: id});
            response
                .status(200)
                .json({
                    status: true,
                    msg: "Country removed successfully"
                });
        }catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }



    },

    getAllCountries: async(request , response) =>{

        console.log("====== Get All Countries API =======");

        try {
            let countries = await CountryModel.find().exec();
            response
                .status(200)
                .json({
                    status: true,
                    countries,
                    msg: "Countries found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getCountryById: async(request , response) =>{

        console.log("====== Get Country By Id API =======");
        console.log("Params");
        console.log(request.params.id);

        try {
            // get content  by id
            let country = await CountryModel.findOne({_id:request.params.id}).exec();
            response
                .status(200)
                .json({
                    status: true,
                    country,
                    msg: "Country found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    addState: async(request , response) =>{

        console.log("====== Add State API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        const {name, countryId} = request.body;

        try{
            let obj = {
                name: name
            };
            await CountryModel.updateOne({ _id: countryId}, {
                $push: {
                    states: [{name:name}]
                }
            });
            response
                .status(200)
                .json({
                    status: true,
                    msg: "State added successfully"
                });
        }catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    updateState: async(request , response) =>{

        console.log("====== Update State API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        console.log("=== Request Params: ===" + (request.params));
        const {name  } = request.body;
        const stateId = request.params.id;

        try{

            await CountryModel.updateOne({ "states._id": stateId }, {
                $set: {
                    "states.$.name": name
                }
            });
            response
                .status(200)
                .json({
                    status: true,
                    msg: "State Name updated successfully"
                });
        }catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    deleteState: async(request , response) =>{
        console.log("====== Remove States API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        const {id} = request.body;

        try{

            let country = await CountryModel.findOne(
                {"states._id":id }, {_id: 1, states: {$elemMatch: {_id: id}}});

            await CountryModel.findOneAndUpdate({ "_id": country._id }, {
                $pull: {
                    states: {"_id":id}
                },
            },{ safe: true, multi: false });
            response
                .status(200)
                .json({
                    status: true,
                    msg: "State removed successfully"
                });
        }catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getAllStates: async(request , response) => {

        console.log("====== Get All States API =======");
        console.log(request.params.id);

        try {
            let arr = request.params.id;
            arr = arr.split(',')
            console.log(arr);
            let countries = await CountryModel.find({"_id": { $in: arr}}).exec();
            console.log(countries);
            let statesArr = [];
            countries.forEach(function(country){
                let states = country.states;
                console.log(states);
                states.forEach(function(state){
                    console.log(state);
                    statesArr.push(state);
                });
            });
console.log(statesArr);
            response
                .status(200)
                .json({
                    status: true,
                    statesArr,
                    msg: "States found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getStateById: async(request , response) =>{

        console.log("====== Get State By Id API =======");
        console.log("Params");
        console.log(request.params.id);

        try {
            // get state  by id
            let country = await CountryModel.findOne({"states._id":request.params.id }, {_id: 1, states: {$elemMatch: {_id: request.params.id}}});
            response
                .status(200)
                .json({
                    status: true,
                    country,
                    msg: "State found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    }

}

module.exports = countryController;