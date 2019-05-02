import React from 'react';
import ReactDOM from 'react-dom'; 
import './editor.less';
import EditArrayJSON from './edit-array-json.js';
import EditArray from './edit-array.js';
import EditJSON from './edit-json.js';
class Editor extends React.Component{
	componentDidMount(){
		let json = this.props.data;
		json.heap = [{
                        config : json.config,
                        data : json.data
                    }];
		this.setState(json);
	}
	componentWillReceiveProps(props){
		// this.setState(props.data);
	}
	pushHeap(item){
		this.state.heap.push(item);
		this.setState({heap : this.state.heap});
	}
	jump(i){
		if(i == this.state.heap.length - 1){
			return;
		}
        this.state.heap = this.state.heap.slice(0 , i+1);
        this.setState({
            heap : this.state.heap
        })
    }
	renderNode(item){
		if(item.config.type == 'json'){
            return <EditJSON data={item} pushHeap={this.pushHeap.bind(this)}></EditJSON>;
        }
        else if(item.config.type == 'array[json]'){
            return <EditArrayJSON data={item} pushHeap={this.pushHeap.bind(this)}></EditArrayJSON>;
        }
        else if(item.config.type == 'array'){
            return <EditArray data={item}></EditArray>;
        }
        
	}

	render(){
		var self = this;
		if(!this.state){
			return (<div />);
		}
        console.log(this.state.heap);
		return (
			<div className='editor' >
				<div className='editor-nav'>
					{
                        this.state.heap.map(function(item , i){
                        	let name = item.config.name;
                        	if(!isNaN(item.index)){
                        		let prev = self.state.heap[i-1];
                        		name = prev.data[item.index][prev.config.relative] || name
                        	}
                            return (<div onClick={self.jump.bind(self , i)}>{name}</div>)
                        })
                    }
				</div>
				<div className='editor-bd'>
					{
						this.renderNode(this.state.heap[this.state.heap.length-1])
					}
				</div>
			</div>
		);
	}
};

export default Editor


