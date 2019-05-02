import React from 'react';
import ReactDOM from 'react-dom'; 
import './pagination.less';
class Pagination extends React.Component{
	componentDidMount(){
		// this.setState(this.props.data);
	}
	componentWillReceiveProps(props){
		// this.setState(this.props.data);
	}
	render(){
		var self = this;
		if(!this.props.data){
			return (<div />);
		}
		let current = this.props.data.current;
		let total = this.props.data.total;
		let list = [];
		// debugger;
		if(total < 6){
			for(var i=1;i<total+1;i++) list.push(i);
		}
		else if(current < 5){
			for(var i=1;i<Math.min(total , 6);i++) list.push(i);
			if(total > 6) list.push('...');
			list.push(total);
		}
		else if(current > total-5 ){
			list = [1];
			if(total>6) list.push('...');
			for(var i=total-5;i<Math.min(current+5 , total);i++) list.push(i);
			list.push(total);
		}
		else{
			list=[1 , '...'];
			for(var i=Math.max(1 , current-2); i<Math.min(current+3 , total+1);i++)list.push(i);
			list.push('...');
			list.push(total);
		}

		return (
			<div className='pagination' >
				<div className='prev' onClick={self.props.goPage.bind(self , 1)}>&#xe64b;</div>
					{list.map(function(i){
						if(current == i ){
							return <span>{i}</span>
						}
						else if(i == '...'){
							return <span>&#xe656;</span>
						}
						else{
							return <div onClick={self.props.goPage.bind(self , i)}>{i}</div>
						}
					})}
				<div className='next' onClick={self.props.goPage.bind(self , total)}>&#xe64a;</div>
			</div>
		);
	}
};

export default Pagination


