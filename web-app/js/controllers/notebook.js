'use strict';

application.controller('NotebookController', function($scope, $location,
  $routeParams, Elements, appConfig, $modal, alertService, $http, apiUrl) {
    var notebookId = $routeParams.notebookId;

    var load = function () {
      $scope.notebook = null;

      Elements.getNotebookById(notebookId).then(function(response) {
        $scope.notebook = response.data;
      });
    };

    var reloadShares = function() {
      $scope.shares = null;

      $http.get(apiUrl + "/notebooks/" + notebookId + "/shares")
      .then(function(response) {
        $scope.shares = response.data;
      });
    };

    $scope.edit = function() {
      $modal.open({
        templateUrl: 'templates/notebookEditorDialog.html',
        controller: 'NotebookEditorDialogController',
        resolve: {
          toEdit: function() {
            return $scope.notebook;
          },
          libraryId: function() { return $scope.notebook.libraryId; }
        }
      }).result.then(load);
    };

    $scope.delete = function() {
      var notebook = $scope.notebook;
      alertService.deleteConfirm(
        "Está a punto de eliminar el cuaderno \"" +
        notebook.name + "\". Perderá todo el contenido, incluyendo páginas.\n\n" +
        "Para confirmar que esto no es un error, escriba el nombre del cuaderno a continuación:",
        notebook.name)
      .then(function() {
        return $http.delete(apiUrl + "/notebooks/" + notebook.id);
      }).then(function() {
        $location.path("/");
      });
    };

    $scope.editShares = function() {
      $modal.open({
        templateUrl: 'templates/sharesEditorDialog.html',
        controller: 'SharesEditorDialogController',
        resolve: {
          notebookId: function() { return $scope.notebook.id; }
        }
      }).result.then(reloadShares);
    };

    load();
    reloadShares();

    $scope.mode = "Draw"; //Default setting
    $scope.color = "#000000";
    $scope.svg = "";

    $scope.$watch('svg', function() {
      // TODO: save the svg
    });

    var initialLeftPanel = [
      {
        title: "Cámara",
        buttonClass: "glyphicon glyphicon-camera",
        action: "Nothing"
      },
      {
        title: "Widget 2",
        buttonClass: "glyphicon glyphicon-edit",
        action: "Nothing"
      }
    ];

    var initialRightPanel = [
      {
        title: "Dibujar",
        buttonClass: "glyphicon glyphicon-pencil",
        action: "Draw"
      },
      {
        title: "Borrar",
        buttonClass: "glyphicon glyphicon-erase",
        action: "Erase"
      },
        {
            title: "Texto",
            buttonClass: "glyphicon glyphicon-font",
            action: "Text"
        }

    ];

    $scope.leftPanel = initialLeftPanel;
    $scope.rightPanel = initialRightPanel;

    $scope.$watch(function() {
      return appConfig.getUserIsLeftHanded();
    }, function(newValue) {
      if (newValue) {
        $scope.leftPanel = initialRightPanel;
        $scope.rightPanel = initialLeftPanel;
      } else {
        $scope.leftPanel = initialLeftPanel;
        $scope.rightPanel = initialRightPanel;
      }
    });

    $scope.defineCurrentObject = function(currentObject) {
        $scope.mode = currentObject;
    };

});
