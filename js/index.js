var rtbApp = angular.module('rtbApp',['ngRtbTagsInput']);
rtbApp.controller('mainController', ['$scope', function($scope){
  var self = {};  
  $scope.emails = ["sidorov@mail.ru"];
  $scope.boardName = "Board name";
  
  self.getRandomInt = function(min, max)
  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  $scope.addRndEmail = function(){
    var emailAdress = "t" + self.getRandomInt(1000,9999).toString() + "@mail.ru";
    $scope.emails.push(emailAdress);    
  }
  
  $scope.alertEmailsCount = function(){
    alert("Emails: " + $scope.emails.length);
  }
}]);

var ngRtbTagsInput = angular.module('ngRtbTagsInput', [])
ngRtbTagsInput.directive('emailInput', function(){
  return {
    replace: true,
    scope: {
      emails: "="
    },
    link: function(scope, elem, attr){
      //utils here
      var self = {};
      
      scope.newMail = "";
      
      //add new email to list
      self.addEmail = function(email){
        var trimmedEmail = email != null ? email.trim() : scope.newMail.trim();
        if(trimmedEmail != ""){
          if(scope.emails.indexOf(trimmedEmail) < 0){
            scope.emails.push(trimmedEmail);
          }
        }
        if(!email){
          scope.newMail = "";
        }
      }
      
      scope.handleKeyDown = function(event){
        switch(event.keyCode){
          case 13: 
            event.preventDefault();
            break;
          case 8:
            if(scope.newMail == ""){
              scope.emails.pop();
            }
            break;
        }
      }

      scope.$watch('newMail', function(newVal, oldVal){
        if(newVal.indexOf(",")>=0){
          var newEMails = newVal.split(",");
          for(var i=0; i<newEMails.length; i++){
            self.addEmail(newEMails[i]);        
          }
          scope.newMail = "";
        }
      });

      scope.inputLostFocus = function(){
        self.addEmail();
      }

      scope.inputWatch = function(event){
        if (event.keyCode == 13 && scope.newMail != ""){
          self.addEmail();
        }
      }

      scope.delElement = function(index){
        if(index>=0 && index<scope.emails.length){
          scope.emails.splice(index, 1);
        }
      }
      
      self.validateEmail = function(email){
        var reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reEmail.test(email);
      }
      
      scope.getEmailClass = function(email){
        return self.validateEmail(email) ? "ng-emailinput-email-text-valid" : "ng-emailinput-email-text-error";
      }
    },
    template: '<div class="ng-emailinput-area"> <span ng-repeat="email in emails"> <span class="ng-emailinput-email-tag"> <div ng-class="getEmailClass(email)">{{email}}</div> <div class="ng-emailinput-tag-btn-cross" ng-click="delElement($index)">&times</div> </span> </span> <textarea name="text" placeholder="add more people…" ng-model="newMail" ng-keydown="handleKeyDown($event)" ng-keyup="inputWatch($event)" ng-blur="inputLostFocus()"></textarea> </div>'
  }      
});