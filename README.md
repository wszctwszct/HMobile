# HMobile

A lighter and cleaner HTML5 WebAPP router

use it for HTML
--------------
- link the css

      <link rel="stylesheet" href="HMobile.css"/>
    
- load the javascript

       <script src="HMobile.js"></script>
- add HTML content

       <!-- Views -->
       <div class="views">
           <!-- Your main view, should have "view-main" class -->
           <div class="view view-main">
               <!-- Pages container, because we use fixed-through navbar and toolbar, it has additional appropriate classes-->
               <div class="pages navbar-through toolbar-through">
                   <!-- Page, "data-page" contains page name -->
                   <div class="page page-on-center" data-page="index" >
                       <p id="loadPage">index</p>
                   </div>
               </div>
           </div>
       </div>
       
- initialization

      var myApp = new HMobile({
          pushState:true,//show hash location or not
          // Hide and show indicator during ajax requests
          onAjaxStart: function (xhr) {
              myApp.showIndicator();
          },
          onAjaxComplete: function (xhr) {
              myApp.hideIndicator();
          }
      });
      
**Get the HMobile/index.html for example**

**API will coming soon**
