/**
 * Created by hender on 27/01/16.
 */

(function(){
    angular.module('whathelol')
        .service('TodoService',
            ['$http', '$q', todoService]
        )
    ;
    function todoService($http, $q) {
        return {
            'getTodos': getTodos,
            'addTodo': addTodo,
            'removeTodo': removeTodo
        };
        function getTodos() {
            var defer = $q.defer();
            $http.get('/todo/getTodos').success(function (resp) {
                defer.resolve(resp);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
        function addTodo(todo){
            var defer = $q.defer();
            $http.post('/todo/addTodo', todo).success(function (resp) {
                defer.resolve(resp);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
        function removeTodo(){
            var defer = $q.defer();
            $http.post('/todo/removeTodo', todo).success(function(resp){
                defer.resolve(resp);
            }).error( function(err) {
                defer.reject(err);
            });
            return defer.promise;
        }
    }

})();