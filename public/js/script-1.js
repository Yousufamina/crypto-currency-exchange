$(document).ready(function(){
	$('#select_product_main .product-box').on("click", function(){
		$('#show-products').modal("hide");
		$('#product-designs').modal("show");
	});

	$('#select_product_design .product-box').on("click", function(){
		$('#product-designs-fixtures').modal("show");
		$('#product-designs').modal("hide");
	});
	
	$('#select_product_design .product-box').on("click", function(){
		$('#product-designs-fixtures').modal("show");
		$('#product-designs').modal("hide");
	});
});

$('#text_box_close').on('click', function(){
	$('#right_area .bottom_box').css("display","none");
});

$('.add_item_text').on('click', function(){
	$('#right_area .bottom_box').css("display","block");
});