'use strict';

application.controller('CalendarController', function($scope, $modal, $http,
    Elements, apiUrl, editEvent, alertService) {
    $scope.calendarView = 'month';
    $scope.currentDay = new Date();
    $scope.events = [];

    var load = function () {
        Elements.getEvents().then(function(response) {
            $scope.events = response.data;
        }, function() {
            alertService.error("Error", "Error al obtener los eventos");
        });
    };

    $scope.toggle = function($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();
        event[field] = !event[field];
    };

    $scope.add = function() {
        $modal.open({
            templateUrl: 'templates/eventEditorDialog.html',
            controller: 'EventEditorDialogController'
        }).result.then(load);
    };

    $scope.edit = function(event) {
        editEvent.setEvent(event);
        $scope.add();
    };

    $scope.delete = function(event) {
        $http.delete(apiUrl + "/events/" + event.id).then(function() {
          load();
        }, function(response) {
          $scope.errors = response.data && response.data['errors'];
        });
    };

    $scope.update = function(event) {
        event.startsAt = new Date(event.startsAt).getTime();
        event.endsAt = new Date(event.endsAt).getTime();
        $http.put(apiUrl + "/events/" + event.id, event).then(function() {
          load();
        }, function(response) {
          $scope.errors = response.data && response.data['errors'];
        });
    };

    $scope.$on("auth.changed", load);
    load();
});
