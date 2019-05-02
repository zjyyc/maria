import React from 'react';
import ReactDOM from 'react-dom'; 
class EditJSON extends React.Component{
	componentDidMount(){
		this.setState(this.props.data);
	}
	componentWillReceiveProps(props){
		this.setState(props.data);
	}
	input(row , key , e){
        row[key] = e.target.value;
        this.setState({data : this.state.data});
    }
	edit(config , data){
		this.props.pushHeap({
			config : config , 
			data : data[config.key]
		})
    }
    print(){
        console.log(this.state);
    }
	render(){
		let self = this;
		if(!this.state){
			return (<div />);
		}
		let config = this.state.config;
		let data = this.state.data;
        return (
            <div className='edit-json'>
                {
                    config.list.map(function(item){
                        if((item.type == 'array' || item.type == 'array[json]') && !data[item.key]){
                            data[item.key] = [];
                        }
                        if(item.type == 'json' && !data[item.key]){
                            data[item.key] = {};
                        }
                        if(item.type == 'string'){
                            return (
                                <div className="form-group">
                                    <label >{item.name}</label>
                                    <input className="form-control"  placeholder={item.desc} 
                                       onInput={self.input.bind(self , data , item.key)} value={data[item.key]} 
                                      />
                                </div>
                            )
                        }
                        else if(item.type == 'select' && item.list.length > 1){
                            if(!data[item.key]){
                                data[item.key] = item.defaultValue || item.list[0].key;
                            }
                            return (
                                <div className="form-group">
                                    <label >{item.name}</label>
                                    <select className="form-control" onChange={self.input.bind(self , data , item.key)} 
                                    value={data[item.key]}>
                                        {
                                            item.list.map(function(o){
                                                return <option value={o.key}>{o.value}</option>
                                            })
                                        }
                                    </select>
                                </div>  
                            )
                        }
                        else{
                            return (
                                <div className="form-group">
                                    <label >{item.name}</label>
                                    <button type="button" className="btn btn-primary btn-sm" 
                                    onClick={self.edit.bind(self , item , data)}>
                                        <span>&#xe61b;</span>编辑
                                    </button>
                                </div>
                            )
                        }
                    })
                }
                <button type="button" className="btn btn-default btn-debug" onClick={self.print}>打印</button>
            </div>
        )
	}
};
export default EditJSON


