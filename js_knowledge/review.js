//bind function complate
Function.prototype.newBind = function() {
    const self = this,
          context = [].shift.call(arguments),
          args = [].slice.call(arguments)
    return function() {
        return self.apply(context, args.concat(arguments))
    }
}

//Promise principle complate
const PROMISE_STATUS = {
    PENGDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
}

const isFunction = (fn) => typeof fn === 'function';

class MyPromise {

    constructor(handle) {
        if (!isFunction(handle)) {
            throw new Error('MyPromise must accept a function as a params');
        }

        //init status and value
        this._status = PROMISE_STATUS.PENGDING;
        this._value = undefined;
        
        //add callback function queue
        this._fulfilledQueues = []
        this._rejectedQueues = []

        try {
            handle(this._resolve.bind(this), this._reject.bind(this));
        } catch(e) {
            this._reject(e)
        }
        
    }

    //resole function complate
    _resolve(value) {

        if(this._status !== PROMISE_STATUS.PENGDING) return;
        this._value = value;
        this._status = PROMISE_STATUS.RESOLVED;
        
    }

    //reject function complate
    _reject(value) {

        if(this._status !== PROMISE_STATUS.PENGDING) return;
        this._value = value;
        this._status = PROMISE_STATUS.REJECTED;

    }

    then(onFulfilled, onRejected) {

        const { _value, _status } = this;
        return new MyPromise((onFulfilledNext, onRejectedNext) => {

            let fulfilled = (value) => {
                try {
                    if (!isFunction(onFulfilled)) {
                        onFulfilledNext(value);
                    } else {
                        let res = onFulfilled(value);
                        if (res instanceof MyPromise) {
                            res.then(onFulfilledNext, onRejectedNext);
                        } else {
                            onFulfilledNext(res);
                        }
                    }
                } catch(e) {
                    onRejectedNext(e);
                }
            }

            let rejected = (error) => {
                try {
                    if (!isFunction(onRejected)) {
                        onRejectedNext(error);
                    } else {
                        let res = onRejected(error);
                        if(res instanceof MyPromise) {
                            res.then(onFulfilledNext, onRejectedNext);
                        } else {
                            onRejectedNext(res);
                        }
                    }
                } catch(e) {
                    onRejectedNext(e);
                }
            }

            switch(_status) {
                case PROMISE_STATUS.PENGDING:
                    this._fulfilledQueues.push(fulfilled);
                    this._rejectedQueues.push(rejected);
                    break;
                case PROMISE_STATUS.FULFILLED:
                    fulfilled(_value);
                    break;
                case PROMISE_STATUS.REJECTED:
                    rejected(_value);
                    break;
            }
        })

    }
    
}

//redux principle complate
function createStore(stateChange) {

    let state = null;
    const listeners = [];
    const subscribe = listener => listeners.push(listener);
    const getState = () => state;
    const dispatch = (action) => {
        state = stateChange(state, action);
        listeners.forEach(listener => listener());
    }

    dispatch({});

    return { getState, subscribe, dispatch };
}  

import React, { Component } from 'react';
import PropTyeps, { func } from 'prop-types';

export const connect = (mapStateToProps, mapDispatchToProps) => (WrapperComponent) => {
    class Connect extends Component {

        static contextTypes  = { 
            store: PropTyeps.object
        }

        constructor() {
            super();
            this.state = {
                allProps: {}
            }
        }

        componentDidMount() {

            const { store } = this.context;
            this._updateProps();
            store.subscribe(() => this._updateProps())

        }

        _updateProps() {

            const { store } = this.context;
            let stateProps = mapStateToProps ? mapStateToProps(store,getState(), this.props) : {};
            let dispatchProps = mapDispatchToProps ? mapDispatchToProps(store.dispatch, this.props) : {};
            this.setState({
                ...stateProps,
                ...dispatchProps,
                ...this.props
            })
        }

        render() {
            return(
                <WrapperComponent {...this.state.props} />
            )
        }

    }
    
    return Connect;
}


//array flat

function flat(arr) {

    let cur = [];
    arr.forEach(item => Array.isArray(item) ? cur = cur.concat(flat(item)) : cur.push(item));
    return cur;

}

//deepclone
function deepClone(target, origin) {

    var target = target || {},
        toStr = Object.prototype.toString,
        obArr = '[object Array]';
    
    for( let item in origin) {
        if (origin.hasOwnProperty(item)) {
            if (origin[item] !== 'null' && typeof origin[item] === 'object') {
                if(toStr.call(origin[item]) === obArr) {
                    target[item] = [];
                } else {
                    target[item] = {};
                }
                deepClone(target[item], origin[item]);
            } else {
                target[item] = origin[item];
            }
        }
    }

    return target;
}

//function curry

function FixedParams(fn) {
    var args = [].slice.call(arguments, 1);
    return function(){
        var newArgs = args.concat([].slice.call(arguments, 0));
        return fn.apply(this, newArgs);
    }
}

function curry(fn, length) {
    var length = fn.length || length;
    return function() {
        if (arguments.length < length) {
            var combined = [fn].slice.call(arguments, 0);
            return curry(FixedParamsa.apply(this, combined), length - arguments.length);
        } else {
            fn.apply(this, arguments);
        }
    }
}

