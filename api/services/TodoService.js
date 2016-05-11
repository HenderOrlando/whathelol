/**
 * Created by hender on 27/01/16.
 * TodoController
 *
 * @description :: Server-side service for managing Todoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getTodos: function(next) {
        Todo.find().exec(function(err, todos) {
            if(err) throw err;
            next(todos);
        });
    },
    addTodo: function(todoVal, next) {
        Todo.create({value: todoVal}).exec(function(err, todo) {
            if(err) throw err;
            next(todo);
        });
    },
    removeTodo: function(todoVal, next) {
        Todo.destroy({value: todoVal}).exec(function(err, todo) {
            if(err) throw err;
            next(todo);
        });
    }
};