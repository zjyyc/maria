import React from 'react';
import ReactDOM from 'react-dom'; 
class EditArray extends React.Component{
	componentDidMount(){
		this.setState(this.props.data);
	}
	componentWillReceiveProps(props){
		this.setState(props.data);
	}
    addRow( data){
        data.push('');
        this.setState({data : this.state.data});
    }
    delRow(list , i){
        list.splice(i , 1);
        this.setState({data : this.state.data});
    }
    up(list , i){
        let temp = list[i];
        list[i] = list[i-1];
        list[i-1] = temp;
        this.setState({data : this.state.data});
    }
    down(list , i){
        let temp = list[i];
        list[i] = list[i+1];
        list[i+1] = temp;
        this.setState({data : this.state.data});
    }
	input(row , key , e){
        row[key] = e.target.value;
        this.setState({data : this.state.data});
    }
	
    editString(e){
        $(e.currentTarget).find('div').hide();
        $(e.currentTarget).find('input').show()[0].focus();
    }
    blur(e){
        $(e.currentTarget).prev().show();
        $(e.currentTarget).hide();
    }
    print(){
        console.log(this.state);
    }
	render(){
		var self = this;
		if(!this.state){
			return (<div />);
		}
		let config = this.state.config;
        let data = this.state.data;
		if(!data){
            data = [];
        }
		return (
			<div className='edit-array' >
				<div >
                    <table className="table table-hover" style={{width : '350px'}}>
                        <thead>
                            <tr>
                                <th className='del'></th>
                                <th className='string' title={config.key}><div>{config.name}</div></th>
                                <th className='up'></th>
                                <th className='down'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map(function(row , i){
                                    return (
                                        <tr>
                                            <td className='del' title='删除这行' onClick={self.delRow.bind(self , data , i)}>&#xe623;</td>
                                            <td className='string' onClick={self.editString} >
                                                <div>{row}</div>
                                                <input className="form-control" placeholder={config.desc} onBlur={self.blur} 
                                                onInput={self.input.bind(self , data ,i )} value={row} />
                                            </td>
                                            {
                                                i > 0 ? (<td className='up' title='上移' onClick={self.up.bind(self , data , i)}>&#xe645;</td>) : (<td className='up' />)
                                            }
                                            {
                                                i < data.length - 1 ? (<td className='down' title='下移' onClick={self.down.bind(self , data , i)}>&#xe644;</td>) : (<td className='down' />)
                                            }
                                        </tr>
                                    )
                                })
                            }
                            
                        </tbody>
                    </table>
                </div>
                <button type="button" className="btn btn-primary" onClick={this.addRow.bind(self  , data)}><span>&#xe64e;</span>添加一行</button>
                <button type="button" className="btn btn-default btn-debug" onClick={self.print}>打印</button>
			</div>
		);
	}
};

export default EditArray


