var tagApp = angular.module('tagApp',['ngEmailTagsInput']);
tagApp.controller('mainController', ['$scope', function($scope){ 
  $scope.emails = ["sidorov@mail.ru"];
  $scope.fileName = "File name";
  
  $scope.getRandomInt = function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  $scope.addRandomEmail = function(){
    var emailAdress = "t" + $scope.getRandomInt(1000,9999).toString() + "@mail.ru";
    $scope.emails.push(emailAdress);    
  }
  
  $scope.alertEmailsCount = function(){
    alert("Emails: " + $scope.emails.length);
  }
}]);

//Directive code
var Keyboard = {
  BACKSPACE : 8,
  ENTER : 13
}
var ngRtbTagsInput = angular.module('ngEmailTagsInput', [])
ngRtbTagsInput.directive('emailInput', function(){
  return {
    replace: true,
    scope: {
      emails: "="
    },
    link: function(scope, elem, attr){
      scope.newEmail = "";
      
      //add new email to list
      scope.addEmail = function(email){
        var trimmedEmail = email !== undefined ? email.trim() : scope.newEmail.trim();
        if(trimmedEmail !== ""){
          if(scope.emails.indexOf(trimmedEmail) < 0){
            scope.emails.push(trimmedEmail);
          }
        }
        if(!email){
          scope.newEmail = "";
        }
      }
      
      scope.handleKeyDown = function(event){
        switch(event.keyCode){
          case Keyboard.ENTER: 
            event.preventDefault();
            break;
          case Keyboard.BACKSPACE:
            if(scope.newEmail === ""){
              scope.emails.pop();
            }
            break;
        }
      }

      scope.$watch('newEmail', function(newVal, oldVal){
        if(newVal.indexOf(",") >= 0){
          var newEMails = newVal.split(",");
          for(var i = 0; i < newEMails.length; i++){
            scope.addEmail(newEMails[i]);        
          }
          scope.newEmail = "";
        }
      });

      scope.inputLostFocus = function(){
        scope.addEmail();
      }

      scope.inputWatch = function(event){
        if (event.keyCode == Keyboard.ENTER && scope.newEmail !== ""){
          scope.addEmail();
        }
      }

      scope.delEmail = function(index){
        if(index >= 0 && index < scope.emails.length){
          scope.emails.splice(index, 1);
        }
      }
      
      scope.isEmailValid = function(email){
        var reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reEmail.test(email);
      }
    },
    template: '<div class="email-input"><span ng-repeat="email in emails" class="email-tag"><span class="email-tag__text" ng-class="{\'email-tag__text_error\': !isEmailValid(email)}">{{email}}</span> <span class="email-tag__cross" ng-click="delEmail($index)">&times</span></span> <textarea class="email-input__textarea" name="text" placeholder="add more people…" ng-model="newEmail" ng-keydown="handleKeyDown($event)" ng-keyup="inputWatch($event)" ng-blur="inputLostFocus()"></textarea></div>'
  }      
});