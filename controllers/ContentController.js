const ContentModel = require("../models/Content");
const UserModel = require("../models/User");
const FavoriteModel = require("../models/Favorites");
const PositionModel = require("../models/Position");
const helper = require("../helpers/helper");
const fs = require('fs');
const { uploader, cloudinaryConfig } =  require("../config/cloudinaryConfig");
const DatauriParser = require("datauri/parser");// const dUri = new Datauri()
const parser = new DatauriParser();
const path = require("path");

const contentController = {

    createContent: async (request, response) => {

        console.log("====== Content Create API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));

        try {
            // check if there is any record with same content name
            const contentByName = await ContentModel.findOne({name: body.name});

            if (contentByName) {
                return response
                    .status(422)
                    .json({msg: "Content with this name already exists"});
            }

            if(request.file) {
                const file = parser.format(
                    path.extname(request.file.originalname).toString(),
                    request.file.buffer
                ).content;
                return uploader.upload(file).then((result) => {
                    const image = result.url;
                    console.log(image);
                    console.log("Your image has been uploaded successfully to cloudinary");

                    let contentObj;
                        contentObj = {
                            name: body.name,
                            url: body.url,
                            tradingFees: body.tradingFees,
                            country: body.country,
                            currency: body.currency,
                            promotion: body.promotion,
                            easeOfUse: body.easeOfUse,
                            reputation: body.reputation,
                            depositMethods: body.depositMethods,
                            fees: body.fees,
                            image: image,
                            detail: body.detail,
                            keyFeatures: body.keyFeatures,
                        };
                        let content = new ContentModel(contentObj);
                        content.save();

                        response
                            .status(200)
                            .json({
                                msg: "Content is successfully added"
                            });
                        });
            }
              // for server
            // helper.uploadImage(request, 'image', function (image) {
            //
            //     let contentObj;
            //     contentObj = {
//                             name: body.name,
//                             url: body.url,
//                             tradingFees: body.tradingFees,
//                             country: body.country,
//                             currency: body.currency,
//                             promotion: body.promotion,
//                             image: image,
//                             detail: body.detail,
//                             keyFeatures: body.keyFeatures,
//                             easeOfUse: body.easeOfUse,
//                             reputation: body.reputation,
//                             depositMethods: body.depositMethods,
//                             fees: body.fees,
//                         };
            //     let content = new ContentModel(contentObj);
            //     content.save();

            //     response
            //         .status(200)
            //         .json({
            //             msg: "Content is successfully added"
            //         });
            //     });


        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    updateContent: async (request, response) => {

        console.log("====== Content Update API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));
        const id = request.params.id;
        try {
            // check if there is any record with same content name
            const contentByName = await ContentModel.findOne({_id: {$ne: id}, name: body.name});
            if (contentByName) {
                return response
                    .status(422)
                    .json({msg: "Content with this name already exists"});
            }

            if(request.file) {
                const file = parser.format(
                    path.extname(request.file.originalname).toString(),
                    request.file.buffer
                ).content;
                return uploader.upload(file).then((result) => {
                    const image = result.url;
                    console.log(image);
                    console.log("Your image has been uploaded successfully to cloudinary");

                    let obj = {
                        name: body.name,
                        url: body.url,
                        tradingFees: body.tradingFees,
                        country: body.country,
                        currency: body.currency,
                        promotion: body.promotion,
                        image: image,
                        detail: body.detail,
                        keyFeatures: body.keyFeatures,
                        easeOfUse: body.easeOfUse,
                        reputation: body.reputation,
                        depositMethods: body.depositMethods,
                        fees: body.fees,
                    }
                    let content = ContentModel.findOneAndUpdate({_id: id}, {$set: obj}, {new: true}).then(() => {
                        response
                            .status(200)
                            .json({
                                status: true,
                                msg: "Content is successfully updated."
                            });
                    });
                });
            }
            else{
                console.log("else works");
                let content =  await  ContentModel.findOneAndUpdate({ _id:id }, { $set: body }, { new: true });
                response
                    .status(200)
                    .json({
                        status:true,
                        msg: "Content is successfully updated."
                    });
            }

             // for image to save on server
            // helper.uploadImage(request, 'image', function (image) {
            //     let obj;
            //     obj = {
            //         name: body.name,
            //         url: body.url,
            //         games: body.games,
            //         bonus: body.bonus,
            //         freeSpins: body.freeSpins,
            //         detail: body.detail
            //     };
            //     if (image) {
            //         obj.image = image;
            //     }
            //     let content = ContentModel.findOneAndUpdate({_id: id}, {$set: obj}, {new: true}).then(() => {
            //             response
            //                 .status(200)
            //                 .json({
            //                     status: true,
            //                     msg: "Content is successfully updated."
            //                 });
            //         });
            //
            // });

        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getAllContents: async (request, response) => {

        console.log("====== Contents Get All API =======");
        try {
            // get all contents
            let contents = await ContentModel.find().select('-detail,-keyFeatures').lean().exec();

            for(let k=0; k<contents.length; k++){
                let content = contents[k];
                let starObj = {star1:0,star2:0,star3:0,star4:0,star5:0};
                let globalRatings = 0;
                if(content.notes){
                    let notes = content.notes;
                    let totalRatings = notes.length;
                    if(notes.length){
                        // calculate each star rating percentage
                        for(let i=0; i<notes.length; i++){
                            let star = notes[i].star;
                            if (star >= 1 && star < 2) {
                                starObj.star1 += 1;
                            }
                            if (star >= 2 && star < 3) {
                                starObj.star2 += 1;
                            }
                            if (star >= 3 && star < 4) {
                                starObj.star3 += 1;
                            }
                            if (star >= 4 && star < 5) {
                                starObj.star4 += 1;
                            }
                            if (star==5) {
                                starObj.star5 += 1;
                            }
                        }

                        //calculate global rating
                        // (5*252 + 4*124 + 3*40 + 2*29 + 1*33) / (252+124+40+29+33) = 4.11 and change
                        // That's a weighted average, where you weigh each rating with the number of votes it got:
                        globalRatings =  (starObj.star1 * 1  + starObj.star2 * 2 + starObj.star3 * 3 + starObj.star4 * 4 + starObj.star5 * 5) / (totalRatings);

                    }
                    delete contents[k].notes;
                }
                contents[k].globalRatings = globalRatings;
            }

            response
                .status(200)
                .json({
                    status: true,
                    contents,
                    msg: "Contents found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getAllContentsForWeb: async (request, response) => {

        console.log("====== getAllContentsForWeb  API =======");
        try {
            // get all contents
            let contents = await ContentModel.find().select('-notes').lean().exec();

            response
                .status(200)
                .json({
                    status: true,
                    contents,
                    msg: "Contents found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getContentById: async (request, response) => {

        console.log("====== Content Get API =======");
        console.log("Params");
        console.log(request.params.id);

        try {
            // get content  by id
            let content = await ContentModel.findOne({_id: request.params.id}).lean().exec();
            let ratings ={};
            let starObj = {star1:0,star2:0,star3:0,star4:0,star5:0};
            let notes = content.notes;
            let totalRatings = notes.length;
            let globalRatings = 0;
            if(notes.length){
                // calculate each star rating percentage
                for(let i=0; i<notes.length; i++){
                    let star = notes[i].star;
                    if (star >= 1 && star < 2) {
                        starObj.star1 += 1;
                    }
                    if (star >= 2 && star < 3) {
                        starObj.star2 += 1;
                    }
                    if (star >= 3 && star < 4) {
                        starObj.star3 += 1;
                    }
                    if (star >= 4 && star < 5) {
                        starObj.star4 += 1;
                    }
                    if (star==5) {
                        starObj.star5 += 1;
                    }
                }
                let totalRatings = notes.length;
                let star1percentage = starObj.star1 * 100 / totalRatings +'%';
                let star2percentage = starObj.star2 * 100 / totalRatings +'%';
                let star3percentage = starObj.star3 * 100 / totalRatings +'%';
                let star4percentage = starObj.star4 * 100 / totalRatings +'%';
                let star5percentage = starObj.star5 * 100 / totalRatings +'%';
                ratings = {'1 star':star1percentage , '2 star':star2percentage , '3 star':star3percentage , '4 star':star4percentage, '5 star':star5percentage }

                //calculate global rating
                // (5*252 + 4*124 + 3*40 + 2*29 + 1*33) / (252+124+40+29+33) = 4.11 and change
                // That's a weighted average, where you weigh each rating with the number of votes it got:
                globalRatings =  (starObj.star1 * 1  + starObj.star2 * 2 + starObj.star3 * 3 + starObj.star4 * 4 + starObj.star5 * 5) / (totalRatings);

            }
            content.ratings = ratings;
            content.globalRatings = globalRatings;
            response
                .status(200)
                .json({
                    status: true,
                    content,
                    msg: "Content found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    deleteContent: async (request, response) => {

        console.log("====== Content Delete API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        console.log((request.body));

        const body = JSON.parse(JSON.stringify(request.body));
        try {

            let content = await ContentModel.deleteOne({_id: body.id});
            response
                .status(200)
                .json({
                    status: true,
                    msg: "Content deleted successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    addNotes : async (request , response) =>{

        console.log("====== Add Notes API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        const body = JSON.parse(JSON.stringify(request.body));
        const id = body.contentId;
        try {

            let note = {
                deviceId: body.deviceId,
                feedback: body.feedback,
                star: body.star
            };
            let updated = await ContentModel.findOneAndUpdate({_id: id}, { $push: { notes: [note] } });
            response
                .status(200)
                .json({
                    status: true,
                    msg: "Notes successfully added"
                });

        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    viewNotesByContentId: async (request , response) =>{

        console.log("====== Notes Get API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        const {deviceId , contentId} = request.body;

        try {
            // get content  by id
            let content = await ContentModel.findOne({_id: contentId, "notes.deviceId" : deviceId },{'notes.$': 1,'name':1,'image':1,'bonus':1 , 'games':1 , 'freeSpins':1});
            let msg;
            console.log(content)
            if(content){
                msg = "Notes found successfully"
            }
            else{
                msg = "No notes found"
            }
            response
                .status(200)
                .json({
                    status: true,
                    content,
                    msg: msg
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    viewAllNotes: async (request , response) =>{

        console.log("====== Notes Get All API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        const {deviceId} = request.body;

        try {
            // get content by id
            let contents = await ContentModel.find({"notes.deviceId" : deviceId },{'notes.$': 1,'name':1,'image':1,'bonus':1 , 'games':1 , 'freeSpins':1});
            let msg;
            if(contents.length){
                msg = "Notes found successfully"
            }
            else{
                msg = "No notes found"
            }
            response
                .status(200)
                .json({
                    status: true,
                    contents,
                    msg: msg
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    editNotesByContentId: async (request , response) =>{

        console.log("====== Notes Edit API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        const {deviceId , contentId, feedback , star} = request.body;

        try {
              // edit content notes by id
            let updated = await ContentModel.findOneAndUpdate({"_id": contentId , "notes.deviceId": deviceId},
                {   $set: { "notes.$.feedback" : feedback , "notes.$.star" : star , date : Date.now() } },  {new: true});

            response
                .status(200)
                .json({
                    status: true,
                    msg: "Notes successfully updated."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    deleteNotes: async (request , response) =>{

        console.log("====== Notes Delete API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        const {deviceId , contentId} = request.body;

        try {
              // edit content notes by id
            let updated = await ContentModel.findOneAndUpdate({ "_id": contentId},
                { $pull: {notes:{ deviceId : deviceId}} } );
            response
                .status(200)
                .json({
                    status: true,
                    msg: "Content Notes deleted successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    addFavorite: async(request , response) =>{
        console.log("====== Add Favorite API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        const {deviceId , contentId} = request.body;

        try{
              // check if deviceId exists
            let user = await FavoriteModel.findOne({deviceId : deviceId});
            if(user){
                   // update
                let favObj = { contentId: contentId};
                let updated = await FavoriteModel.findOneAndUpdate({deviceId: deviceId}, { $push: { favorites : [favObj] } });
            }
            else{
                 // insert
                let fav = {contentId : contentId};
                let obj = {
                    deviceId: deviceId,
                    favorites: [fav]
                };
                let favorite = new FavoriteModel(obj);
                favorite.save();

            }
            response
                .status(200)
                .json({
                    status: true,
                    msg: "favorite added successfully"
                });
        }catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    removeFavorite: async(request , response) =>{
        console.log("====== Remove Favorite API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        const {deviceId , contentId} = request.body;

        try{
            let updated = await FavoriteModel.findOneAndUpdate({deviceId: deviceId }, { $pull: {favorites:{ contentId : contentId}} });
            response
                .status(200)
                .json({
                    status: true,
                    msg: "favorite removed successfully"
                });
        }catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }



    },

    getAllFavorites: async(request , response) =>{

        console.log("====== Get All Favorites API =======");
        console.log("Params");
        console.log(request.params.id);

        try {
            // get content  by id
            let favoritesObj = await FavoriteModel.findOne({deviceId: request.params.id}).exec();
            console.log(favoritesObj);
            let favorites = favoritesObj.favorites;
            let arrFav=[];
            for(let i=0;i<favorites.length;i++){
                arrFav.push(favorites[i].contentId);
            }
            console.log("fav content");

            let contents = await ContentModel.find({_id : { $in :arrFav}}).lean().exec();

            for(let k=0; k < contents.length; k++){
                let content = contents[k];
                let starObj = {star1:0,star2:0,star3:0,star4:0,star5:0};
                let notes = content.notes;
                let totalRatings = notes.length;
                let globalRatings = 0;
                if(notes.length){
                    // calculate each star rating percentage
                    for(let i=0; i<notes.length; i++){
                        let star = notes[i].star;
                        if (star >= 1 && star < 2) {
                            starObj.star1 += 1;
                        }
                        if (star >= 2 && star < 3) {
                            starObj.star2 += 1;
                        }
                        if (star >= 3 && star < 4) {
                            starObj.star3 += 1;
                        }
                        if (star >= 4 && star < 5) {
                            starObj.star4 += 1;
                        }
                        if (star==5) {
                            starObj.star5 += 1;
                        }
                    }

                    //calculate global rating
                    // (5*252 + 4*124 + 3*40 + 2*29 + 1*33) / (252+124+40+29+33) = 4.11 and change
                    // That's a weighted average, where you weigh each rating with the number of votes it got:
                    globalRatings =  (starObj.star1 * 1  + starObj.star2 * 2 + starObj.star3 * 3 + starObj.star4 * 4 + starObj.star5 * 5) / (totalRatings);

                }
                contents[k].globalRatings = globalRatings;
            }

            response
                .status(200)
                .json({
                    status: true,
                    contents,
                    msg: "Favorites found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

}

module.exports = contentController;
