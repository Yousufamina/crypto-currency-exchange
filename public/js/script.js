$(document).ready(function(){
	$('#select_product_main .product-box').on("click", function(){
		$('#show-products').modal("hide");
		$('#product-designs').modal("show");
	});

	$('#select_product_design .product-box').on("click", function(){
		$('#product-designs-fixtures').modal("show");
		$('#product-designs').modal("hide");
	});
	
	$('.side_designs .product-box').on("click", function(){
		$('#product-designs-fixtures').modal("show");
		$('#product-designs').modal("hide");
	});
});

$('#text_box_close').on('click', function(){
	$('#left_area .bottom_box').css("display","none");
});

$('.add_item_text').on('click', function(){
	var dis = $('#left_area .bottom_box').css("display");
	if(dis=='none')
	{
		$('#left_area .bottom_box').css("display","block");
        $('#left_area .bottom_box textarea').attr("data-id",new Date().getTime());
        $('#left_area .bottom_box textarea').val('');
    }else{
        $('#left_area .bottom_box').css("display","none");

	}

});

$('#product_box_close').on('click', function(){
	$('.side_designs').css("display","none");
});

$('.add_product_house').on('click', function(){
	$('.side_designs').css("display","block");
});