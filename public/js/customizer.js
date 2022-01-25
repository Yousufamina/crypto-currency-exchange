var canvas = '';
var textarea = {};
var products = [];
var product_mod = [];
var product_type = [];
var order = {
    wordCount:0,
    images:[]
}
var designArea = $(".design-area");
$(function () {
    var fonts = ["Harrington", "Tolkien regular", "Times Roman Italic", "Times New Roman", "syracuseeotversion, syracuse", "Poor Richard", "Old English", "Maiandra", "Lucida", "Kidsn", "Kabos", "Geometric", "Gaze", "Footlight", "Brush Script", "Bookman Old Style", "Monotype Corsiva", "Celtic", "Celtgael", "Calligra", "Caligula", "Black Chancery", "Bakersignet", "Antique"]

    var fonts = [
        "Abadi MT Condensed Light",
        "Albertus Extra Bold",
        "Albertus Medium",
        "Antique Olive",
        "Arial",
        "Arial Black",
        "Arial MT",
        "Arial Narrow",
        "Bazooka",
        "Book Antiqua",
        "Bookman Old Style",
        "Boulder",
        "Calisto MT",
        "Calligrapher",
        "Century Gothic",
        "Century Schoolbook",
        "Cezanne",
        "CG Omega",
        "CG Times",
        "Charlesworth",
        "Chaucer",
        "Clarendon Condensed",
        "Comic Sans MS",
        "Copperplate Gothic Bold",
        "Copperplate Gothic Light",
        "Cornerstone",
        "Coronet",
        "Courier",
        "Courier New",
        "Cuckoo",
        "Dauphin",
        "Denmark",
        "Fransiscan",
        "Garamond",
        "Geneva",
        "Haettenschweiler",
        "Heather",
        "Helvetica",
        "Herald",
        "Impact",
        "Jester",
        "Letter Gothic",
        "Lithograph",
        "Lithograph Light",
        "Long Island",
        "Lucida Console",
        "Lucida Handwriting",
        "Lucida Sans",
        "Lucida Sans Unicode",
        "Marigold",
        "Market",
        "Matisse ITC",
        "MS LineDraw",
        "News GothicMT",
        "OCR A Extended",
        "Old Century",
        "Pegasus",
        "Pickwick",
        "Poster",
        "Pythagoras",
        "Sceptre",
        "Sherwood",
        "Signboard",
        "Socket",
        "Steamer",
        "Storybook",
        "Subway",
        "Tahoma",
        "Technical",
        "Teletype",
        "Tempus Sans ITC",
        "Times",
        "Times New Roman",
        "Times New Roman PS",
        "Trebuchet MS",
        "Tristan",
        "Tubular",
        "Unicorn",
        "Univers",
        "Univers Condensed",
        "Vagabond",
        "Verdana",
        "Westminster",
    ]
    var content = ''

    for(var i = 0;i<fonts.length;i++){
        content += '<a class="box-font" href="javascript:void(0)">';
        content += '<h2 class="margin-0" style="font-family:'+fonts[i]+' !important;" data-font="'+fonts[i]+'">abc zyz</h2>';
        content += fonts[i];
        content += '</a>';
    }
    $(".list-fonts").html(content);


    $.get('/stones/products/',function(data) {

        products = data.data;

        var productContent = '';
        for (var i = 0; i < products.length; i++) {
            productContent += '<div data-product_id="' + products[i].id + '" class="product-box col-xs-12">';
            productContent += '<div class="thumbnail">';
            productContent += '<img src="' + products[i].image + '" alt="' + products[i].title + '" class="img-responsive">';
            productContent += '<div class="caption">' + products[i].title + '</div>';
            productContent += '</div>';
            productContent += '</div>';
        }

        $("#select_product_main").html(productContent);

        $(document).on('click', ".product-box", function () {
            $(".modal").modal('hide');
            product_type = [];
            $("#product-designs").modal('show')
            var productId = $(this).attr('data-product_id');
            order.productId = productId;
            for (var i = 0; i < products.length; i++) {
                if (products[i].id == productId) {
                    product_type = products[i].type;
                    $("#widthInputRange").attr('max',products[i].width_max)
                    $("#widthInputRange").attr('min',products[i].width_min)
                    $("#heightInputRange").attr('max',products[i].height_max)
                    $("#heightInputRange").attr('min',products[i].height_min)
                    $("#widthInputRange").val(products[i].width_min)
                    $("#heightInputRange").val(products[i].height_min)
                    order.width_min = products[i].width_min;
                    order.width_max= products[i].width_max;
                    order.height_max = products[i].height_max;
                    order.height_min= products[i].height_min;
                    order.price= products[i].price_min;
                    order.price_min= products[i].price_min;
                    order.price_max= products[i].price_max;
                    var productDesign = '';
                    $("#widthInput").val(products[i].width_min)
                    $("#heightInput").val(products[i].height_min)

                    for (var j = 0; j < product_type.length; j++) {
                        productDesign += '<div data-product_type="' + product_type[j].id + '"  class="product-design-box col-xs-16 col-sm-4 col-md-3">';
                        productDesign += '<div class="thumbnail">';
                        productDesign += '<img src="' + product_type[j].image + '" alt="' + product_type[j].title + '" class="img-responsive">';
                        productDesign += '<div class="caption">' + product_type[j].title + '</div>';
                        productDesign += '</div>';
                        productDesign += '</div>';
                    }
                    productDesign += '<div class="clearfix"></div>'
                    $("#select_product_design").html(productDesign);
                    orderAmount()
                }
            }


        })
        $(document).on('click', ".product-mod-box", function () {
            $(".modal").modal('hide');
            product_type = [];
            var productId = $(this).attr('data-product_mod');
            order.mod = productId;
            fabric.Image.fromURL(order.image_back, function (img) {
                img.set({
                    width: order.width_min,
                    height: order.height_min,
                    type: "image",
                    isMain:true,
                    price: order.price,
                    left: 0,
                    top: 0,
                    angle: 0,
                    active:true
                })
                canvas.add(img).renderAll().setActiveObject(img);
                canvas.renderAll()
                var activeObject = canvas.getActiveObject();
                if(activeObject){
                    var w = $("#widthInput").val()*2
                    activeObject.setWidth(w/2);
                    var h = $("#heightInput").val()*2;
                    activeObject.setHeight(h/2);
                    activeObject.setScaleX(1);
                    activeObject.setScaleY(1);
                    canvas.renderAll()
                    if(activeObject.isMain==true){
                        orderAmount()
                    }
                }

            });


        })
        $(document).on('click', ".product-design-box", function () {
            $(".modal").modal('hide');
            product_mod = []

            $("#product-designs-fixtures").modal('show')
            var productId = $(this).attr('data-product_type');
            order.product_type = productId;
            for (var i = 0; i < product_type.length; i++) {
                if (product_type[i].id == productId) {
                    product_mod = product_type[i].mods;
                    var productDesign = '';

                    order.image = product_type[i].image;
                    order.image_back= product_type[i].image_back;
                    for (var j = 0; j < product_mod.length; j++) {
                        productDesign += '<div data-product_mod="' + product_mod[j].id + '"  class="product-mod-box col-xs-16 col-sm-4 col-md-3">';
                        productDesign += '<div class="thumbnail">';
                        productDesign += '<img src="' + product_mod[j].image + '" alt="' + product_mod[j].title + '" class="img-responsive">';
                        productDesign += '<div class="caption">' + product_mod[j].title + '</div>';
                        productDesign += '</div>';
                        productDesign += '</div>';
                    }
                    productDesign += '<div class="clearfix"></div>'
                    $("#product-fixture").html(productDesign);
                }
            }


        })
        document.getElementById("canvas").width = designArea.width()

        var heightInput = $("#heightInput");
        var widthInput = $("#widthInput");
        var heightInputRange = $("#heightInputRange");
        var widthInputRange = $("#widthInputRange");
        /*
         var image = window.location.hostname+'/images/irregslateplq.jpg'
         */
        canvas = new fabric.Canvas('canvas');

        canvas.on('object:modified', function (options) {
            options.target.set({opacity: 1});

            var object = canvas.getActiveObject()



            heightInput.val(parseInt(options.target.getHeight()))
            widthInput.val(parseInt(options.target.getWidth()))
            heightInputRange.val(parseInt(options.target.getHeight()))
            widthInputRange.val(parseInt(options.target.getWidth()))

            if(object.isMain==true){
                orderAmount()
            }

            canvas.renderAll()

        });


        canvas.on('object:selected', function (options) {
            var object = canvas.getActiveObject()
            console.log(object)
            console.log(object.canvas.width)
/*
            heightInput.val(parseInt(object.height))
            widthInput.val(parseInt(object.width))
*/
            heightInput.val(parseInt(options.target.getHeight()))
            widthInput.val(parseInt(options.target.getWidth()))

            if (object) {
                if(object.color) {
                    var color = object.color;
                    console.log(color)
                    $("#text-color").val(color)
                    $("#text-color").css('background',color)

                }


                if (object.type == 'image') {

                } else if (object.type == 'text') {

                    $('#textEditor').val(object.text)

                    $("#txt-fontfamily").html(object.fontFamily);
                    $("#text-color").val(object.fill)
                    $("#text-color").css('background-color',object.fill);

                    $('#textEditor').attr('data-id', object.id)


                }


            }
            canvas.renderAll()

        });

        $(document).on('keyup', "#heightInput", function () {

            var activeObject = canvas.getActiveObject();
            if(activeObject){
                var w = $("#widthInput").val()*2
                activeObject.setWidth(w/2);
                var h = $("#heightInput").val()*2;
                activeObject.setHeight(h/2);
            }
            activeObject.setScaleX(1);
            activeObject.setScaleY(1);
            canvas.renderAll()
            $("#heightInputRange").val($(this).val())

            if(activeObject.isMain==true){
                orderAmount()
            }

        });
        $(document).on('keyup', "#widthInput", function () {

            if($(this).val()>=order.width_min ){

            }else{
                var activeObject = canvas.getActiveObject();
                if (activeObject) {
                    var w = order.width_min * 2
                    activeObject.setWidth(w / 2);
                    var h = $("#heightInput").val() * 2;
                    activeObject.setHeight(h / 2);
                }
                activeObject.setScaleX(1);
                activeObject.setScaleY(1);
                $("#widthInput").val(order.width_min )
                $("#widthInputRange").val(order.width_min)
                canvas.renderAll()
                if(activeObject.isMain==true){
                    orderAmount()
                }

                return false
            }
            if ($(this).val()<=order.width_max) {

                var activeObject = canvas.getActiveObject();
                if (activeObject) {
                    var w = $(this).val() * 2
                    activeObject.setWidth(w / 2);
                    var h = $("#heightInput").val() * 2;
                    activeObject.setHeight(h / 2);
                }
                activeObject.setScaleX(1);
                activeObject.setScaleY(1);
                $("#widthInputRange").val($(this).val())
                if(activeObject.isMain==true){
                    orderAmount()
                }

                canvas.renderAll()
            }else{
                var activeObject = canvas.getActiveObject();
                if (activeObject) {
                    var w = order.width_max* 2
                    activeObject.setWidth(w / 2);
                    var h = $("#heightInput").val() * 2;
                    activeObject.setHeight(h / 2);
                }
                activeObject.setScaleX(1);
                activeObject.setScaleY(1);
                $("#widthInput").val(order.width_max)
                $("#widthInputRange").val(order.width_max)
                canvas.renderAll()
                if(activeObject.isMain==true){
                    orderAmount()
                }

                return false
            }

        });

    })
})
function deleteObjects(){

    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeObject && !activeObject.isMain && activeObject.isMain==false) {
        if (confirm('Are you sure?')) {

            var id = activeObject.id;
            if(activeObject.type=='image'){
                order.images.splice(order.images.indexOf(id),1)
            }
            canvas.remove(activeObject);

            if(activeObject.type=='text'){
                var wordCount = $("#textEditor").val()
                order.wordCount -= wordCount;
                textarea[activeObject.id].set("text",'');
                $("#textEditor").val('')
            }

            addImageAmount();
        }
    }
    else if (activeGroup) {
/*
        if (confirm('Are you sure?')) {
            var objectsInGroup = activeGroup.getObjects();
            canvas.discardActiveGroup();
            objectsInGroup.forEach(function(object) {
                canvas.remove(object);
            });
        }
*/
        alert("Please delete single item")
    }
    canvas.renderAll()
}

$(document).on("click",'.box-font',function(){
    var font =  $(this).find("h2").attr('data-font');

    $("#txt-fontfamily").html(font.replace(/'/g,''));
    $("#font-family").modal("hide")
    var id = $('#textEditor').attr('data-id');
    loadAndUse(font,id)
    //     textarea[id].set("fontFamily",font);
    //     canvas.renderAll()
})


$(document).on("keyup","#textEditor",function(){


    var id = $(this).attr('data-id');
    var font = $("#txt-fontfamily").html();


    var color = $("#text-color").val()
    $("#text-color").css('background-color',color);

    var val = $(this).val();
    if(!textarea[id]){
        textarea[id]  = new fabric.Text(val, {
            left: 0,
            type:"text",
            top: 0,
            fill:color,
            id:id,
            width: 12,
            fontSize: 20
        });
    }else{

        textarea[id].setText(val)
        textarea[id].setColor(color)

    }
    loadAndUse(font,id)
    canvas.add(textarea[id])
    canvas.renderAll()

})


$(document).on('change','#text-color',function(){
    var activeObject = canvas.getActiveObject();
    var color = $("#text-color").val()
    $("#text-color").css('background-color',color);
    if (activeObject)
    {
        if(activeObject.type=="text"){
            activeObject.set({'fill':color})
            canvas.renderAll()
        }else if (activeObject.type=="image"){


           var image =  activeObject.src+"?color="+color.replace("#",'');

            var positionScale = activeObject.getScaleX();
            var positionLeft = activeObject.getLeft();
            var positionTop = activeObject.getTop();
            var positionAngle = activeObject.getAngle();
            var w = activeObject.getWidth()
            var h = activeObject.getHeight();

            var id = activeObject.id;
            canvas.remove(activeObject);

        fabric.Image.fromURL(image, function(img) {
                logo = img.set({
                    left: positionLeft,
                    type:'image',
                    width:w,
                    isMain:false,
                    height:h,
                    color:color,
                    id:id,
                    src:activeObject.src,
                    top: positionTop,
                    angle: positionAngle
                })
                canvas.add(logo);


                canvas.renderAll();
             canvas.getObjects().map(function(o) {
                console.log(o)
                if(o.id && o.id==id) {
                    return o.set('active', true);
                }
                 addImageAmount()
            });
        });

        }
        canvas.renderAll();
    }
})

function loadAndUse(font,id) {
     var myfont = new FontFaceObserver(font)
     myfont.load()
     .then(function() {
    console.log(font)
    var id = $("#textEditor").attr('data-id');
    textarea[id].set({"fontFamily": font});
    canvas.renderAll();
     }).catch(function(e) {
     console.log(e)
         var id = $("#textEditor").attr('data-id');
         textarea[id].set({"fontFamily": font});
         canvas.renderAll();

//         alert('font loading failed ' + font);
     });
}
function uploadingImg(input) {



    $('.progress').show()
    var percent = $('.progress');
    var bar = $('#progressBar');

    var formData = new FormData();
    var file = $("#files-upload")[0].files[0];
    formData.append('image',file)
    $.ajax({
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
            $("#files-upload").val('')
            xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    percentComplete = parseInt(percentComplete * 100);
                    console.log(percentComplete );
                    bar.width(percentComplete+"%" );
                    bar.html(percentComplete+"%" );

                    if (percentComplete === 100) {

                        setTimeout(function(){

                            $(".progress").hide();
                        },2000)

                    }

                }
            }, false);

            return xhr;
        },
        url: '/uploadFile.php',
        type: "POST",
        contentType: false,
        processData: false,
        data: formData,
        success: function(result) {
            console.log(result)
            console.log(result.status)
            result = JSON.parse((result))
            if(result.status) {




                var uploadedImage ='';
                if(localStorage.getItem('uploadedImage'))uploadedImage = localStorage.getItem('uploadedImage');

                if(uploadedImage==''){
                    uploadedImage = result.file;
                }else{
                    uploadedImage = uploadedImage+','+ result.file;
                }

                console.log(uploadedImage)
                localStorage.setItem('uploadedImage',uploadedImage);
                loadUploadedImage()

            }
        }
    });
}

$('#zoomIn').click(function(){
    canvas.setZoom(canvas.getZoom() * 1.1 ) ;
}) ;

$('#zoomOut').click(function(){
    canvas.setZoom(canvas.getZoom() / 1.1 ) ;
}) ;
$(document).on('click','.box-art',function () {
    $('.modal').modal('hide')

    var color = $("#text-color").val();
    var image = $(this).find('img').attr('src');
    var id = new Date().getTime();
    var im = image+"?color="+color.replace("#",'');
    fabric.Image.fromURL(im, function(img){
        img.set({
            width:200,
            height:200,
            type:"image",
            isMain:false,
            id:id,
            color:color,
            src:image,
            left: 10,
            top: 10,
            angle: 0,
            opacity: 0.85
        })
        canvas.add(img).renderAll().setActiveObject(img);
        canvas.renderAll()

        order.images.push(id)
        addImageAmount();

    });
})

function loadUploadedImage(){
    if(localStorage.getItem('uploadedImage')){

        var images = localStorage.getItem('uploadedImage');
        images  = images.split(',');
        var content = ''

        for(var i = 0;i<images.length;i++){
            var img = "http://173.212.225.102:5500/"+images[i];
            content +='<div class="col-md-2 col-sm-3 col-xs-6 imageU">';
            content +='<a href="javascript:void(0);" data-id="'+i+'"  class="pull-right removeUpload">x</a>';
            content +='<div class="box-art">';
            content +='<a href="javascript:void(0);" >';
            content +='<img src="'+img+'" alt="skull shapaed alien head">';
            content +='</a>';
            content +='</div>';
            content +='</div>';
        }
        $("#uploadedImage").html(content);

    }else{
        $("#uploadedImage").html("<p>Please Upload Images First</p>");

    }
}
loadUploadedImage()
$(document).on("click",'.removeUpload',function(){
    if(localStorage.getItem('uploadedImage')) {

        var images = localStorage.getItem('uploadedImage');
        images = images.split(',')
        var id =$(this).attr('data-id');
        $(this).parent('.imageU').remove();
        images.splice(id,1);
        images = images.join('')
        localStorage.setItem('uploadedImage',images);
    }

})
/*  $(document).on('click','.text-update',function(){
 $('.text-update').removeClass('active');
 $(this).addClass('active');
 var val =  $(this).attr('data-val');
 var id = $("#textEditor").attr('data-id')

 textarea[id].set('textAlign',val)

 })
 */
$(document).on('click','#text-style-b',function(){
    var val =  $(this).attr('data-isBold');
    var id = $("#textEditor").attr('data-id');
    if(val==0){
        textarea[id].set('fontWeight','bold')
        $(this).addClass('active');
        $(this).attr('data-isBold',1)
    }else{
        textarea[id].set('fontWeight','normal')
        $(this).removeClass('active');
        $(this).attr('data-isBold',0)
    }
    canvas.renderAll();
})
$(document).on('click','#text-style-i',function(){
    var val =  $(this).attr('data-isItalic');
    var id = $("#textEditor").attr('data-id');
    if(val==0){
        textarea[id].set('fontStyle','italic')
        $(this).addClass('active');
        $(this).attr('data-isItalic',1);
    }else{
        textarea[id].set('fontStyle','normal')
        $(this).removeClass('active');
        $(this).attr('data-isItalic',0);
    }
    canvas.renderAll();
})
$(document).on("focus",'#widthInput',function(){
        $("#widthInputRange").show()
        $("#widthInputRange").addClass('selected')
})
$(document).on("focus",'#heightInput',function(){
        $("#heightInputRange").show()
        $("#heightInputRange").addClass('selected')
})
$(document).on("blur",'#heightInputRange',function(){
    $("#heightInputRange").removeClass('selected')

    if($('#heightInputRange').hasClass('selected')==false) {
        $("#heightInputRange").hide()
    }
})
$(document).on("blur",'#widthInputRange',function(){
    $("#widthInputRange").removeClass('selected')

    if($('#widthInputRange').hasClass('selected')==false) {
        $("#widthInputRange").hide()
    }
})
$(document).on("focus",'#widthInputRange',function(){
    $("#widthInputRange").show()
    $("#widthInputRange").addClass('selected')
})
$(document).on("focus",'#heightInputRange',function(){
    $("#heightInputRange").show()
    $("#heightInputRange").addClass('selected')
})
$(document).on("change",'#widthInputRange',function(){
    var activeObject = canvas.getActiveObject();
    if(activeObject){
        var w = $(this).val()*2
        activeObject.setWidth(w/2);
        var h = $("#heightInput").val()*2;
        activeObject.setHeight(h/2);
        activeObject.setScaleX(1);
        activeObject.setScaleY(1);
        canvas.renderAll()

        $("#widthInput").val($(this).val())
        if(activeObject.isMain==true){
            orderAmount()
        }

    }
})
$(document).on("change",'#heightInputRange',function(){
    var activeObject = canvas.getActiveObject();
    if(activeObject){
        var w = $("#widthInput").val()*2
        activeObject.setWidth(w/2);
        var h = $(this).val()*2;
        activeObject.setHeight(h/2);
        activeObject.setScaleX(1);
        activeObject.setScaleY(1);
        canvas.renderAll()
        $("#heightInput").val($(this).val())
        if(activeObject.isMain==true){
            orderAmount()
        }
    }
})
function orderAmount(){
    var total = order.price;
    var h = parseFloat($("#heightInput").val());
    var w = parseFloat($("#widthInput").val());

    order.width = w;
    order.height= h;
    var v = h*w;
    var perSq= order.price_min/(order.width_min*order.height_min);

    total = v*perSq;
    total += order.images.length * 7;
    if(order.wordCount>30 && order.productId==1){

        var wordCount =order.wordCount-30;
        total +=wordCount;
    }
    if(order.price_max>=total) {
        order.price = total;
        $("#orderAmount").html(total.toFixed(2))
    }else{
        order.price = order.price_max;
        $("#orderAmount").html(order.price_max.toFixed(2))

    }
}

function addImageAmount(){
    var total = order.price;
    var h = parseFloat(order.height);
    var w = parseFloat(order.width);

    var v = h*w;
    var perSq= order.price_min/(order.width_min*order.height_min);

    total = v*perSq;
    total += order.images.length * 7;

    if(order.wordCount>30 && order.productId==1){

        var wordCount =order.wordCount-30;
        total +=wordCount;
    }


    if(order.price_max>=total) {
        order.price = total;
        $("#orderAmount").html(total.toFixed(2))
    }else{
        order.price = order.price_max;
        $("#orderAmount").html(order.price_max.toFixed(2))

    }
}

