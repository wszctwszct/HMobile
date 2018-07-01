/**
 * Created by Christopher on 2016/1/12.
 */
//var HMobile = require('./HMobile.js');
//require('./pep.min.js');
var myApp = new HMobile({
    pushState:true,
    // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
});
var mainView = myApp.addView('.view-main');
document.getElementById('loadPage').addEventListener('pointerup',function(e){
    loadPage()
});
function loadPage(){
    mainView.router.loadPage('test.html',function(){
        document.getElementById('back').addEventListener('pointerup',function(){
            mainView.router.back();
        });
        document.getElementById('test2').addEventListener('pointerup',function(){
            mainView.router.loadPage('test2.html',function(){
                document.getElementById('back2').addEventListener('pointerup',function(){
                    mainView.router.back();
                });
            });
        })
    });
}
/*
document.body.addEventListener('pointerdown',function(down){console.log(down);
    document.body.addEventListener('pointermove',function(move){
        var x = move.screenX-down.screenX;
        var y = move.screenY-down.screenY;
        if(x>0){
            console.log(x)
        }
    })
});*/
