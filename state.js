// module: state.js
// author: Ben Riegel
// overview: declares and exports the State class. Instances of this class are
// contained in store objects. The class contains various getters and setters
// for the state variables. It also contains the set method which updates the
// state based on an object representing a partial state. The object contains
// all or some of the state properties and new values for those properties.
// The state is updated with those new values and a result object is returned.
// This result object specifies whether each state property has changed or not
// and what the new and old values are.


//----- export code block ------------------------------------------------------

export default class State{

  //----- private code block -----

  //object that stores the state properties and values
  #vars;

  //----- public api -----

  constructor(initValueObj){
    this.#vars = initValueObj;
  }

  getVar(varName){
    return this.#vars[varName];
  }

  setVar(varName, value){
    this.#vars[varName] = value;
  }

  getKeys(){
    return Object.keys(this.#vars);
  }

  //iife used here so merge and compare functions are only available to the
  //returned function
  set = (function(){
    function merge(currentState, newPartialState){
      return Object.entries(currentState).reduce( (prev, [key, value]) => {
        prev[key] = (key in newPartialState) ? newPartialState[key] : currentState[key];
        return prev;
      }, {} );
    }
    function compare(currentState, newState){
      return Object.keys(currentState).reduce( (prev, key) => {
        const newValue = newState[key];
        const oldValue = currentState[key];
        const hasChanged = (newValue !== oldValue);
        prev[key] = {newValue, oldValue, hasChanged};
        return prev;
      }, {} );
    }
    //example of functional-style programming
    //The merge function takes the old state and the partial state and creates
    //a new object with the old and new values. The newState is then compared
    //to the old state, and a result object is return, which contains for all
    //state properties, anobject specifiying whether they have changed or not,
    //plus new and old values.
    return function(newPartialState){
      const oldState = this.#vars;
      const newState = merge(oldState, newPartialState);
      this.#vars = newState;
      const results = compare(oldState, newState);
      return results;
    }
  })();

}
