import React from 'react';
import ReactDOM from 'react-dom'; 
class EditArrayJSON extends React.Component{
	componentDidMount(){
		this.setState(this.props.data);
	}
	componentWillReceiveProps(props){
		this.setState(props.data);
	}
    addRow(config , data){
        var json = {
        }
        for(var i =0; i<config.list.length; i++){
            var key = config.list[i].key;
            json[key] = '';
        }
        json.id = parseInt(new Date().getTime() + '' + parseInt(Math.random() * 1000))
        data.push(json);
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
    editString(e){
        $(e.currentTarget).find('div').hide();
        $(e.currentTarget).find('input').show()[0].focus();
    }
    blur(e){
        $(e.currentTarget).prev().show();
        $(e.currentTarget).hide();
    }
	input(row , key , e){
        row[key] = e.target.value;
        this.setState({data : this.state.data});
    }
	edit(config , data , index){
		this.props.pushHeap({
			config : config , 
			data : data[config.key] ,
            index : index
		})
    }
    print(){
        console.log(this.state);
    }
	render(){
        let self = this;
        if(!this.state){
        	return (<div />)
        }
        let config = this.state.config;
        let data = this.state.data;
        if(!data){
            data= [];
        }
        let width = 120;
        config.list.map(function(item){
            if(item.type == 'string') width += 230;
            else if(item.type == 'select') width += 120;
            else width += 100;
        })

        return (
            <div className='edit-array-json'>
                <div >
                    <table className="table table-hover" style={{width : width + 'px'}}>
                        <thead>
                            <tr>
                                <th className='del'></th>
                                {config.list.map(function(item){
                                    let c = 'edit';
                                    if(item.type == 'string') c = 'string';
                                    if(item.type == 'select') c = 'select';
                                    return <th className={c} title={item.key}><div>{item.name}</div></th>
                                })}
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
                                            {config.list.map(function(item){
                                                if((item.type == 'array' || item.type == 'array[json]') && !row[item.key]){
                                                    row[item.key] = [];
                                                }
                                                if(item.type == 'json' && !row[item.key]){
                                                    row[item.key] = {};
                                                }
                                                if(item.type == 'string'){
                                                    return (
                                                        <td className='string' onClick={self.editString} >
                                                            <div>{row[item.key]}</div>
                                                            <input className="form-control" placeholder={item.desc} onBlur={self.blur} 
                                                            onInput={self.input.bind(self , row , item.key)} value={row[item.key]} />
                                                        </td>
                                                    )
                                                }
                                                else if(item.type == 'select'){
                                                    if(!row[item.key] && item.list.length > 1){
                                                        row[item.key] = item.defaultValue || item.list[0].key;
                                                    }
                                                    return (
                                                        <td className='select'>
                                                            <select className="form-control" onChange={self.input.bind(self , row , item.key)} value={row[item.key]}>
                                                                {
                                                                    item.list.map(function(o){
                                                                        return (<option value={o.key}>{o.value}</option>)
                                                                    })
                                                                }
                                                            </select>
                                                        </td>
                                                    )
                                                }
                                                else{
                                                    return (
                                                        <td className='edit'>
                                                            <button type="button" className="btn btn-primary btn-sm" 
                                                            onClick={self.edit.bind(self , item , row , i)}>
                                                                <span>&#xe61b;</span>编辑
                                                            </button>
                                                        </td>
                                                    )
                                                }
                                            })}
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
                    <div className='client-width' style={{width : width + 200 + 'px'}}></div>
                    <div className='left-client-width' style={{width : width + document.body.clientWidth / 2 + 50 + 'px'}}></div>
                </div>
                <button type="button" className="btn btn-primary" onClick={this.addRow.bind(self ,config , data)}><span>&#xe64e;</span>添加一行</button>
                <button type="button" className="btn btn-default btn-debug" onClick={self.print}>打印</button>
            </div>
        )
    }
};
export default EditArrayJSON


