
var app = angular.module('stoneApp', ['ui.bootstrap',"ui.router",'angular-loading-bar','ngStorage','ui.sortable']);

app.config(["$stateProvider","$urlRouterProvider","$httpProvider",function(t,e)
{
    e.otherwise("/contents"),
        t
            .state("contents",{
            url:"/contents",
            templateUrl:"/js/templates/contents.html",
            controller:'contents'
            })
            .state("add-content",{
                url:"/add-content",
                templateUrl:"/js/templates/add-content.html",
                controller:'add-content'
            })
            .state("edit-content",{
            url:"/content/{id}",
            templateUrl:"/js/templates/add-content.html",
            controller:'edit-content'
            })
            .state("faq",{
                url:"/faq",
                templateUrl:"/js/templates/faq.html",
                controller:'faq'
            })
            .state("add-faq",{
                url:"/add-faq",
                templateUrl:"/js/templates/add-faq.html",
                controller:'add-faq'
            })
            .state("edit-faq",{
            url:"/faq/{id}",
            templateUrl:"/js/templates/add-faq.html",
            controller:'edit-faq'
            })
            .state("country",{
                url:"/country",
                templateUrl:"/js/templates/country.html",
                controller:'country'
            })
            .state("add-country",{
                url:"/add-country",
                templateUrl:"/js/templates/add-country.html",
                controller:'add-country'
            })
            .state("edit-country",{
                url:"/country/{id}",
                templateUrl:"/js/templates/add-country.html",
                controller:'edit-country'
            })
            .state("state",{
                url:"/state",
                templateUrl:"/js/templates/states.html",
                controller:'state'
            })
            .state("add-state",{
                url:"/add-state",
                templateUrl:"/js/templates/add-state.html",
                controller:'add-state'
            })
            .state("edit-state",{
                url:"/state/{id}",
                templateUrl:"/js/templates/edit-state.html",
                controller:'edit-state'
            })
            .state("aboutUs",{
                url:"/aboutUs",
                templateUrl:"/js/templates/aboutUs.html",
                controller:'aboutUs'
            })
            .state("showFeedback",{
                url:"/showFeedback/{id}",
                templateUrl:"/js/templates/showFeedback.html",
                controller:'showFeedback'
            })

}]);
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
    
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                try {
                    scope.$apply(function () {

                        modelSetter(scope, element[0].files[0]);
                    });
                }catch(e) {

                }
            });
        }
    };
}]);
app.controller("contents",function($scope,$http,$location,$localStorage){

    $scope.dated = dateAndTimeFormat;
    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/getAllContentsForWeb",
        }).success(function (result) {
            if (result.status == true) {
                $scope.data=result.contents;
                console.log($scope.data);
            } else {
                window.location.href = '/';
            }
        })    
    }
    $scope.getCountries = function(countries){
        let names = ' ';
        if(countries){
            if (countries.length == 0 ) names = 'No Country Added';
            countries.forEach(function(country){
                names += country.name + ' ' ;
            });
        }
        else{
                names = 'No Country Added';
        }
        return names;
    }
    $scope.getData();
    $scope.alreadyexecuteRating = function(val,id, classN) {
    
         let className = id+' '+classN;
        let arr = document.getElementsByClassName(className);
        const stars = [];
        for(let k=0;k<5;k++){
            stars.push(arr[k]);
        }
            // const stars = [...document.getElementsByClassName(className)];
            const starClassActive = className+" fa fa-star";
            // stars.map((star) => {
            //     console.log(val);
                    let i = val-1;
                    for (i; i >= 0; --i) {
                        stars[i].className = starClassActive
                    }
            // });
        
        }

    $scope.removingId = '';
    $scope.removeData = function(id){
        $scope.removingId = id;
        $("#confirmation").modal("show")
    }

    $scope.removeConfirmed  = function(){
        if($scope.removingId!="") {

            var fd = new FormData();
                fd.append('id',$scope.removingId);

            $http.post('/delete/content', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){
                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#confirmation").modal("hide");
                    window.toastr.success(data.msg);
                    $scope.getData();

                }
                else {
                    $("#confirmation").modal("hide")

                }
            })
        }
    }

    $scope.sortableOptions = {
        stop: function(e, ui) {
            let logEntry = [];
            $scope.data.map(function(i,ind){
                logEntry.push(i._id);
            });

            $scope.save=function(){
                var fd = new FormData();

                fd.append('position', logEntry);

                $http.post('/addPosition', fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                    .success(function(result){
                    })
                    .error(function(result){
                    });
            }();
        }
    };

});
app.controller("add-content",function($scope,$http,$location,$localStorage){

    $scope.heading = 'Add New Content';
    $scope.content = {
        name:'',
        url:'',
        tradingFees:'',
        assets:'',
        countryId:'',
        currency:'',
        promotion:'',
        easeOfUse :'',
        reputation :'',
        depositMethods :'',
        fees :'',
        image:'',
        detail:'',
        keyFeatures:''
        }
    CKEDITOR.replace( 'editor1' );

    $scope.executeRating = function(className) {
    
        const stars = [...document.getElementsByClassName(className)];
        const starClassActive = className+" fa fa-star";
        const starClassInactive = className+ " fa fa-star-o";
        const starsLength = stars.length;
        let i;
        stars.map((star) => {
            star.onclick = () => {
                i = stars.indexOf(star);
                $scope.content.easeOFUse = i+1;
                let ind = i+1;
                
                if (star.className === starClassInactive) {
                    for (i; i >= 0; --i) stars[i].className = starClassActive;
                } else {
                    for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
                }
            };
        });
    };
    $scope.alreadyexecuteRating = function() {

        for(let k=1; k<5; k++){
            let className = "rating__star"+k;
            const stars = [...document.getElementsByClassName(className)];
            const starClassActive = className+" fa fa-star";
            const starClassInactive = className+" fa fa-star-o";
            const starsLength = stars.length;
            let i;
            stars.map((star) => {
                star.onclick = () => {
                    i = stars.indexOf(star);
                    if(className == "rating__star1") {
                        $scope.content.easeOfUse = i + 1;
                    }
                    if(className == "rating__star2") {
                        $scope.content.reputation = i + 1;
                    }
                    if(className == "rating__star3") {
                        $scope.content.depositMethods = i + 1;
                    }
                    if(className == "rating__star4") {
                        $scope.content.fees = i + 1;
                    }
                    let ind = i+1;
                    if (star.className === starClassInactive) {
                        for (i; i >= 0; --i) stars[i].className = starClassActive;
                    } else {
                        for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
                    }
                };
            });
        }

        const stars1 = [...document.getElementsByClassName('rating__star1')];
        const stars2 = [...document.getElementsByClassName('rating__star1')];
        const stars3 = [...document.getElementsByClassName('rating__star1')];
        const stars4 = [...document.getElementsByClassName('rating__star1')];

    }();

    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/getAllCountries",
        }).success(function (result) {
            if (result.status == true) {
                $scope.countries=result.countries;
            } else {
                window.location.href = '/';
            }
        })
    }();

    $scope.getStates = function(){

        $http({
            method: "GET",
            url: "/getAllStates/"+$scope.content.countryId,
        }).success(function (result) {
            if (result.status == true) {
                $scope.states=result.statesArr;
            }
        })
    }

    $scope.save=function(){
        $scope.content.keyFeatures = CKEDITOR.instances["editor1"].getData();
     
        var fd = new FormData();
        for(var k in $scope.content){
            if(!$scope.content[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '));
                return false;
            }
            fd.append(k, $scope.content[k]);
        }
        var div = document.getElementById('waitSpinner');
        div.style.visibility = 'visible';
        $http.post('/createContent', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                div.style.visibility = 'hidden';
                $location.path('contents');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                div.style.visibility = 'hidden';
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("edit-content",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.heading = 'Update Content';
    $scope.content = {
        name:'',
        url:'',
        tradingFees:'',
        assets:'',
        countryId:'',
        currency:'',
        promotion:'',
        easeOfUse :'',
        reputation :'',
        depositMethods :'',
        fees :'',
        image:'',
        detail:'',
        keyFeatures:''
    }

    $scope.getCountriesData = function(){
        $http({
            method: "GET",
            url: "/getAllCountries",
        }).success(function (result) {
            if (result.status == true) {
                $scope.countries=result.countries;
            } else {
                window.location.href = '/';
            }
        })
    }();
    $scope.getStates = function(){

        $http({
            method: "GET",
            url: "/getAllStates/"+$scope.content.countryId,
        }).success(function (result) {
            if (result.status == true) {
                $scope.states=result.statesArr;
            }
        })
    };

    $scope.executeRating = function(className) {
      
        const stars = [...document.getElementsByClassName(className)];
        const starClassActive = className+" fa fa-star";
        const starClassInactive = className+ " fa fa-star-o";
        const starsLength = stars.length;
        let i;
        stars.map((star) => {
            star.onclick = () => {
                i = stars.indexOf(star);
                $scope.content.easeOFUse = i+1;
              
                let ind = i+1;
               
                if (star.className === starClassInactive) {
                    for (i; i >= 0; --i) stars[i].className = starClassActive;
                } else {
                    for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
                }
            };
        });
    };
    $scope.alreadyexecuteRating = function() {

        for(let k=1; k<5; k++){
            let className = "rating__star"+k;
            const stars = [...document.getElementsByClassName(className)];
            const starClassActive = className+" fa fa-star";
            const starClassInactive = className+" fa fa-star-o";
            const starsLength = stars.length;
            let i;
            stars.map((star) => {
                star.onclick = () => {
                    i = stars.indexOf(star);
                    if(className == "rating__star1") {
                        $scope.content.easeOfUse = i + 1;
                    }
                    if(className == "rating__star2") {
                        $scope.content.reputation = i + 1;
                    }
                    if(className == "rating__star3") {
                        $scope.content.depositMethods = i + 1;
                    }
                    if(className == "rating__star4") {
                        $scope.content.fees = i + 1;
                    }
                    let ind = i+1;
                    if (star.className === starClassInactive) {
                        for (i; i >= 0; --i) stars[i].className = starClassActive;
                    } else {
                        for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
                    }
                };
            });
        }

        const stars1 = [...document.getElementsByClassName('rating__star1')];
        const stars2 = [...document.getElementsByClassName('rating__star1')];
        const stars3 = [...document.getElementsByClassName('rating__star1')];
        const stars4 = [...document.getElementsByClassName('rating__star1')];

    }();

    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/content/"+$stateParams.id,
        }).success(function (result) {
            if (result.status == true) {
                var data =result.content;
                $scope.content.name=data.name;
                $scope.content.url=data.url;
                $scope.content.tradingFees =data.tradingFees;
                $scope.content.assets =data.assets;
                $scope.content.countryId = data.countryId;
                $scope.getStates();
                $scope.content.stateId = data.stateId;
                $scope.content.currency = data.currency;
                $scope.content.promotion = data.promotion;
                $scope.content.easeOfUse = data.easeOfUse;
                $scope.content.reputation = data.reputation;
                $scope.content.depositMethods = data.depositMethods;
                $scope.content.fees = data.fees;
                $scope.content.image = data.image;
                $scope.content.detail = data.detail;
                $scope.content.keyFeatures = data.keyFeatures;

                CKEDITOR.replace( 'editor1' );
                CKEDITOR.instances["editor1"].setData($scope.content.keyFeatures);
            } else {
                window.location.href = '/';
            }
        });
    }
    $scope.getData();

    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.content){
            if(!$scope.content[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.content[k]);
        }
        var div = document.getElementById('waitSpinner');
        div.style.visibility = 'visible';
        $http.put('/updateContent/'+$stateParams.id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                div.style.visibility = 'hidden';
                $location.path( 'contents');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                div.style.visibility = 'hidden';
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("websiteContents",function($scope,$http,$location,$localStorage){

    $scope.dated = dateAndTimeFormat;
    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/getAllWebsiteContents",
        }).success(function (result) {
            if (result.status == true) {
                $scope.data=result.contents;
            } else {
                window.location.href = '/';
            }
        })

    }

    $scope.getData();
    $scope.removingId = '';
    $scope.removeData = function(id){
        $scope.removingId = id;
        $("#confirmation").modal("show")
    }

    $scope.removeConfirmed  = function(){
        if($scope.removingId!="") {

            var fd = new FormData();
            fd.append('id',$scope.removingId);

            $http.post('/delete/websiteContent', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){
                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#confirmation").modal("hide");
                    window.toastr.success(data.msg);
                    $scope.getData();

                }
                else {
                    $("#confirmation").modal("hide")

                }
            })
        }

    }

});
app.controller("add-website-content",function($scope,$http,$location,$localStorage){

    $scope.heading = 'Add New Website Content';
    $scope.content = {
        heading:'',
        description:'',
        image:'',
    }

    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.content){
            if(!$scope.content[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.content[k]);
        }
        var div = document.getElementById('waitSpinner');
        div.style.visibility = 'visible';
        $http.post('/createWebsiteContent', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                div.style.visibility = 'hidden';
                $location.path('web-content');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                div.style.visibility = 'hidden';
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("edit-website-content",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.heading = 'Update Content';
    $scope.content = {
        heading:'',
        description:'',
        image:''
    }

    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/websiteContent/"+$stateParams.id,
        }).success(function (result) {
            if (result.status == true) {
                var data =result.content;
                $scope.content.heading=data.heading;
                $scope.content.description=data.description;
                $scope.content.image=data.image;
            } else {
                window.location.href = '/';
            }
        });
    }
    $scope.getData();

    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.content){
            if(!$scope.content[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.content[k]);
        }
        var div = document.getElementById('waitSpinner');
        div.style.visibility = 'visible';
        $http.put('/updateWebsiteContent/'+$stateParams.id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                div.style.visibility = 'hidden';
                $location.path( 'web-content');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                div.style.visibility = 'hidden';
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("add-faq",function($scope,$http,$location,$localStorage){

    $scope.heading = 'Add New FAQ';
    $scope.faq = {
        question:'',
        answer:''
        }

    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.faq){
            if(!$scope.faq[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.faq[k]);
        }
        $http.post('/addFaq', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('faq');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("faq",function($scope,$http,$location,$localStorage){

    $scope.dated = dateAndTimeFormat;
    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/getAllFaq",
        }).success(function (result) {
            if (result.status == true) {
                $scope.data=result.faqs;
            } else {
                window.location.href = '/';
            }
        })
    }

    $scope.getData();
    $scope.removingId = '';
    $scope.removeData = function(id){
        $scope.removingId = id;
        $("#confirmation").modal("show")
    }

    $scope.removeConfirmed  = function(){
        if($scope.removingId!="") {

            var fd = new FormData();
            fd.append('id',$scope.removingId);

            $http.post('/delete/faq', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){
                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#confirmation").modal("hide");
                    window.toastr.success(data.msg);
                    $scope.getData();
                }
                else {
                    window.toastr.warning(data.msg);
                    $("#confirmation").modal("hide")

                }
            })
        }

    }


});
app.controller("edit-faq",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.heading = 'Update FAQ';
    $scope.faq = {
        question:'',
        answer:''
    }

    $scope.getData = function() {
        $http({
            method: "GET",
            url: "/getFaq/" + $stateParams.id,
        }).success(function (result) {
            if (result.status == true) {
                var data = result.faq;
                $scope.faq.question = data.question;
                $scope.faq.answer = data.answer;
            } else {
                window.location.href = '/';
            }
        });
    }
    $scope.getData();
    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.faq){
            if(!$scope.faq[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '));
                return false;
            }
            fd.append(k, $scope.faq[k]);
        }

        $http.put('/updateFaq/'+$stateParams.id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path( 'faq');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("aboutUs",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.heading = 'Update AboutUS';
    $scope.aboutUs = {
        content:''
    }
    let id ;

    $scope.getData = function() {
        $http({
            method: "GET",
            url: "/getAboutUs",
        }).success(function (result) {
            if (result.aboutUs) {
                var data = result.aboutUs;
                id = data._id;
                $scope.aboutUs.content = data.content;
                CKEDITOR.replace( 'editor1' );
                CKEDITOR.instances["editor1"].setData($scope.aboutUs.content);
            } else {
                CKEDITOR.replace( 'editor1' );
            }
        });
    }
    $scope.getData();
    $scope.save=function(){
        $scope.aboutUs.content = CKEDITOR.instances["editor1"].getData();
        var fd = new FormData();
        for(var k in $scope.aboutUs){
            if(!$scope.aboutUs[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '));
                return false;
            }
            fd.append("content",CKEDITOR.instances["editor1"].getData());
        }

        $http.put('/updateAboutUs/'+id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path( 'aboutUs');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("showFeedback",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.heading = 'Feedback';
    $scope.dated = dateAndTimeFormat;

    $scope.alreadyexecuteRating = function(val,id, classN) {

        val = Math.round(val);
        let className = id+' '+classN;
        let arr = document.getElementsByClassName(className);
        const stars = [];
        for(let k=0;k<5;k++){
            stars.push(arr[k]);
        }
        const starClassActive = className+" fa fa-star";
        let i = val-1;
        for (i; i >= 0; --i) {
            stars[i].className = starClassActive
        }
    }

    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/content/"+$stateParams.id,
        }).success(function (result) {
            if (result.status == true) {
                var data =result.content;
                $scope.notes=data.notes;
            } else {
                window.location.href = '/';
            }
        });
    }
    $scope.getData();

    $scope.removingId = '';
    $scope.removeData = function(id){
        $scope.removingId = id;
        $("#confirmation").modal("show")
    }

    $scope.removeConfirmed  = function(){
        if($scope.removingId!="") {

            var fd = new FormData();
            fd.append('id',$scope.removingId);
            fd.append('contentId',$stateParams.id);

            $http.post('/delete/notes', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){
                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#confirmation").modal("hide");
                    window.toastr.success(data.msg);
                    $scope.getData();
                }
                else {
                    $("#confirmation").modal("hide")

                }
            })
        }
    }

});
app.controller("add-country",function($scope,$http,$location,$localStorage){

    $scope.heading = 'Add New Country';
    $scope.country = {
        name:''
    }

    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.country){
            if(!$scope.country[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.country[k]);
        }
        $http.post('/addCountry', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('country');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("country",function($scope,$http,$location,$localStorage){

    $scope.dated = dateAndTimeFormat;
    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/getAllCountries",
        }).success(function (result) {
            if (result.status == true) {
                $scope.data=result.countries;
            } else {
                window.location.href = '/';
            }
        })
    }

    $scope.getData();
    $scope.removingId = '';
    $scope.removeData = function(id){
        $scope.removingId = id;
        $("#confirmation").modal("show")
    }

    $scope.removeConfirmed  = function(){
        if($scope.removingId!="") {

            var fd = new FormData();
            fd.append('id',$scope.removingId);

            $http.post('/delete/country', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){
                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#confirmation").modal("hide");
                    window.toastr.success(data.msg);
                    $scope.getData();
                }
                else {
                    window.toastr.warning(data.msg);
                    $("#confirmation").modal("hide")

                }
            })
        }
    }
});
app.controller("edit-country",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.heading = 'Update Country';
    $scope.country = {
        name:''
    }

    $scope.getData = function() {
        $http({
            method: "GET",
            url: "/getCountry/" + $stateParams.id,
        }).success(function (result) {
            if (result.status == true) {
                var data = result.country;
                $scope.country.name = data.name;
            } else {
                window.location.href = '/';
            }
        });
    }
    $scope.getData();
    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.country){
            if(!$scope.country[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '));
                return false;
            }
            fd.append(k, $scope.country[k]);
        }

        $http.put('/updateCountry/'+$stateParams.id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path( 'country');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("add-state",function($scope,$http,$location,$localStorage){

    $scope.heading = 'Add New State';
    $scope.state = {
        name:'',
        countryId: ''
    }

    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/getAllCountries",
        }).success(function (result) {
            if (result.status == true) {
                $scope.countries=result.countries;
            } else {
                window.location.href = '/';
            }
        })
    }();

    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.state){
            if(!$scope.state[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '))
                return false;
            }
            fd.append(k, $scope.state[k]);
        }
        $http.post('/addState', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path('state');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                window.toastr.warning(result.msg)
            });
    }

});
app.controller("state",function($scope,$http,$location,$localStorage){

    $scope.dated = dateAndTimeFormat;

    $scope.getData = function(){
        $http({
            method: "GET",
            url: "/getAllCountries",
        }).success(function (result) {
            if (result.status == true) {
                let countries = result.countries;
                $scope.data = [];
                countries.forEach((country)=>{
                    if(country.states.length){
                        let states = country.states;
                        let stateName = '';
                        states.forEach((state)=>{
                            state.countryName = country.name;
                            state.creatdDate = country.createdDate;
                            $scope.data.push(state);
                        });
                    }
                });
            } else {
                window.location.href = '/';
            }
        })
    }

    $scope.getData();
    $scope.removingId = '';
    $scope.removeData = function(id){
        $scope.removingId = id;
        $("#confirmation").modal("show")
    }

    $scope.removeConfirmed  = function(){
        if($scope.removingId!="") {

            var fd = new FormData();
            fd.append('id',$scope.removingId);

            $http.post('/delete/state', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){
                if (data.status) {
                    $("#"+$scope.removingId).remove();
                    $("#confirmation").modal("hide");
                    window.toastr.success(data.msg);
                    $scope.getData();
                }
                else {
                    window.toastr.warning(data.msg);
                    $("#confirmation").modal("hide")

                }
            })
        }
    }
});
app.controller("edit-state",function($scope,$http,$location,$localStorage,$stateParams){

    $scope.heading = 'Update State';
    $scope.state = {
        name:'',
    }

    $scope.getData = function() {
        $http({
            method: "GET",
            url: "/getState/" + $stateParams.id,
        }).success(function (result) {
            if (result.status == true) {
                var data = result.country;
                $scope.state.name = data.states[0].name;
            } else {
                window.location.href = '/';
            }
        });
    }
    $scope.getData();

    $scope.save=function(){
        var fd = new FormData();
        for(var k in $scope.state){
            if(!$scope.state[k]){
                window.toastr.warning("Please provide "+k.toUpperCase().replace('_',' '));
                return false;
            }
            fd.append(k, $scope.state[k]);
        }

        $http.put('/updateState/'+$stateParams.id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(result){
                $location.path( 'state');
                window.toastr.success(result.msg)
            })
            .error(function(result){
                window.toastr.warning(result.msg)
            });
    }

});


function dateAndTimeFormat(date){
    date = new Date(date)
    var month = date.getMonth()+1
    if(month<10){
        month = '0'+month;
    }
    var day = (date.getDate())
    if(day<10){
        day = '0'+day;
    }

    var hours = date.getHours();

    var newformat = hours >= 12 ? 'PM' : 'AM';

    // Find current hour in AM-PM Format
    hours = hours % 12;

    // To display "0" as "12"
    hours = hours ? hours : 12;

    var min = date.getMinutes()
    if(min<10){
        min = '0'+min;
    }
    return date.getFullYear()+"-"+month+"-"+day +"  " + hours+":"+min +' ' + newformat;
}
function dateFormat(date){
    date = new Date(date)
    var month = date.getMonth()+1
    if(month<10){
        month = '0'+month;
    }
    var day = (date.getDate())
    if(day<10){
        day = '0'+day;
    }

    return date.getFullYear()+"-"+month+"-"+day ;
}
function showMessage(){
    $.ajax({
        url: 'admin/sendChangePasswordRequest',
        type: 'get',
        success:function(result){
            window.toastr.success(result.msg);
        }
    });

}
