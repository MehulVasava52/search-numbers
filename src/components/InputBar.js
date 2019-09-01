import React from 'react';
import {Button, OutlinedInput}  from '@material-ui/core';
import '../resources/Inputbar.css';

class InputBar extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            Numbers : [],
            input : '',
            cache : {},
            repetedItems : [],
            invalidInput : false
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(e) {
        let isInvalid = this.checkInvalidInput(e.target.value);
        if(isInvalid) {
            this.setState({
                invalidInput : true
            })
            return;
        } else {
            this.setState({
                invalidInput : false
            }) 
        }

        this.setState({
            input : e.target.value
        });
    }

    checkInvalidInput(input) {
        var numbers = /[^-,0-9]+$/;
        if(input.match(numbers))
        { 
           return true;
        }    
        return false;
    }

    onSubmitHandler() {
        if(this.state.invalidInput) {
            return
        }
// implement SET to avoid duplicates
        let inputAr = this.state.input.split(',');
        let list = Object.assign({}, this.state.cache);
        let repetedItems = [];
        inputAr.forEach((num)=>{
            let isRange = Number(num) ? false : true;
            if(isRange) {
                let listAndRepeted = this.insertRange(num, list, repetedItems);
                list = listAndRepeted.list;
                repetedItems = listAndRepeted.repetedItems;    
                return;
            }

            let isAlreadyExist = list.hasOwnProperty(num);            ;
            if (!isAlreadyExist) {
                list[num] = true;
            } else {
                repetedItems.push(num);
            }
        });

        repetedItems = repetedItems.length ?  repetedItems : [];
        this.setState({
            cache : list,
            repetedItems  
        });
    }

    insertRange(num, list, repetedItems) {
        const range = num.split('-');
        const start = range[0];
        const end = range[1];

        for (let curr = start; curr <= end; curr++) {
            if (!list.hasOwnProperty(curr)) {
                list[curr] = true;
            } else {
                repetedItems.push(curr);
            }
        }
        return {list, repetedItems};
    }

    render() {
        const errorStyle = this.state.invalidInput ? {display : 'block'} : { display : 'none'};
        const repetingItems = this.state.repetedItems.join(',');
        return (
            <div className="inputBar">
                <div className = "inputItems">
                    <OutlinedInput type="text"className="inputField" onChange = {this.onChangeHandler} />
                    <Button variant="contained" color="primary" onClick = {this.onSubmitHandler} > Submit </Button>
                </div>
                <div style = {errorStyle} className = "errorMsg" >
                    Invalid Input. (Input should only include '0-9'  '-'  ',') 
                </div>  
                {this.state.repetedItems.length ?<div className = "repeatNumContainer">
                    <span>{ `${repetingItems} items are repeating`} </span>
                </div>: ''}  
            </div>
        );
    }
    
}

export default InputBar;
