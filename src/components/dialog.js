import React from 'react';
import ReactDOM from 'react-dom';
import './dialog.less';
class Dialog extends React.Component{
	componentDidMount(){
		// this.setState(this.props.data);
	}
	close(){
		$('#dialog').hide();
	}
	render(){
		var self = this;
		return (
			<div>
				<div className="modal"  id="dialog">
					<div className='mask'></div>
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" onClick={this.close} className="close" data-dismiss="modal" ><span aria-hidden="true">&times;</span></button>
								<h4 className="modal-title"></h4>
							</div>
							<div className="modal-body">
								<p></p>
							</div>
							<div className="modal-footer">
								<button type="button" onClick={this.close} className="btn btn-default" >关闭</button>
								<button type="button" className="btn btn-primary">确定</button>
							</div>
						</div>
					</div>
				</div>
				<div className='waiting' >
					<div className='mask'></div>
					<img src='https://loading.io/spinners/microsoft/index.rotating-balls-spinner.svg' />
				</div>
			</div>
		);
	}
};

export default Dialog


