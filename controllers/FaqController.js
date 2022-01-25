const FaqModel = require("../models/Faq");
const AboutUsModel = require("../models/AboutUs");
const faqController={

    addFaq: async(request , response) =>{


        console.log("====== Add Faq API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        const {question , answer} = request.body;

        try{

            let obj = {
                question: question,
                answer: answer
            };
            let faq = new FaqModel(obj);
            faq.save();

        response
            .status(200)
            .json({
                status: true,
                msg: "FAQ added successfully"
            });
        }catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    updateFaq: async(request , response) =>{
        console.log("====== Update Faq API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        console.log("=== Request Params: ===" + (request.params));
        const {question , answer } = request.body;
        const faqId = request.params.id;

        try{
            let updated = await FaqModel.findOneAndUpdate({_id: faqId}, { $set: { question:question,answer:answer} });

            response
            .status(200)
            .json({
                status: true,
                msg: "FAQ updated successfully"
            });
        }catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    deleteFaq: async(request , response) =>{
        console.log("====== Remove FAQ API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        const {id} = request.body;

        try{
            let content = await FaqModel.deleteOne({_id: id});
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

    getAllFaq: async(request , response) =>{

        console.log("====== Get All FAQ API =======");

        try {
            // get content  by id
            let faqs = await FaqModel.find().exec();
               response
                .status(200)
                .json({
                    status: true,
                    faqs,
                    msg: "FAQ found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getFaqById: async(request , response) =>{

        console.log("====== Get Faq By Id API =======");
        console.log("Params");
        console.log(request.params.id);

        try {
            // get content  by id
            let faq = await FaqModel.findOne({_id:request.params.id}).exec();
               response
                .status(200)
                .json({
                    status: true,
                    faq,
                    msg: "FAQ found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    addAboutUs: async(request , response) =>{
        console.log("====== Add AboutUs API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        const {content} = request.body;

        try{
            let obj = {
                content: content
            };
            let aboutUs = new AboutUsModel(obj);
            aboutUs.save();

            response
                .status(200)
                .json({
                    status: true,
                    msg: "AboutUs added successfully"
                });
        }catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    updateAboutUs: async(request , response) =>{
        console.log("====== Update aboutUs API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));
        console.log("=== Request Params: ===" + (request.params));
        const {content } = request.body;
        const id = request.params.id;

        try{
            let updated = await AboutUsModel.findOneAndUpdate({_id: id}, { $set: { content:content , updatedDate:Date.now() }});

            response
                .status(200)
                .json({
                    status: true,
                    msg: "About Us  updated successfully"
                });
        }catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

    getAboutUs: async(request , response) =>{

        console.log("====== Get About Us API =======");

        try {
            // get content  by id
            let aboutUs = await AboutUsModel.findOne().exec();
            response
                .status(200)
                .json({
                    status: true,
                    aboutUs,
                    msg: "About Us found successfully."
                });
        } catch (err) {
            console.log(err);
            response
                .status(500)
                .json({msg: err});
        }
    },

}

module.exports = faqController;