import React, { Component} from 'react';
import './addpayment.css';
import axios from 'axios';


const initialState = {
    amount:'',
    cardNumber:'',
    cardName:'',
    cvv:'',
    expiryDate:''
}

class CreatePayment extends Component{

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onPaymentSelect = this.onPaymentSelect.bind(this);
        this.state = initialState;
    }

    state = {
        cards: [],
        totalAmount:0

    };


    componentDidMount() {




        axios
            .get("http://localhost:5000/card/getByCardId/61485559e9dd81c314f75d5c")
            .then((res) => {
                this.state = {amount:'',
                    cardNumber:'',
                    cardName:'',
                    cvv:'',
                    expiryDate:''
                };
                //const payments = res.data.data;
                console.log(res.data.data);
                this.setState({ cards: res.data });
                //console.log(products);
                // this.setState({products:res.data.data});
            })
            .catch((err) => err.message);

        // this.setState({totalAmount:this.state.params.total})
    }



    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onPaymentSelect(e) {
        this.setState({[e.target.name]: e.target.value})
    }
    //sampe

    onSubmit(e) {
        e.preventDefault();
        let payment = {
            amount: this.props.match.params.total,
            cardType: this.state.cardType,
            cardNumber: this.state.cardNumber,
            cardName: this.state.cardName,
            cvv:this.state.cvv,
            expiryDate: this.state.expiryDate
        };
        console.log('DATA TO SEND', payment)
        axios.post('http://localhost:5000/payment/addPayment',payment)
            .then(response => {
                alert('Payment added successfully')
                window.location.href="/";
            })
            .catch(error => {
                console.log(error.message);
                alert(error.message)
            })
    }

    render(){
        return(
            <div>
                <center>
                    <div className="login-page"  style={{  height: 680,borderColor:"teal"}}>
                        <h2> Payment </h2>
                        <form onSubmit={this.onSubmit}>
                            <br></br>

                            <h3>Amount Payable: {this.props.match.params.total}</h3>

                            <input
                                type="number"
                                className="form-control"
                                id="subjectName"
                                name="amount"
                                required={false}
                                placeholder="Amount"
                                value={this.props.match.params.total}
                                onChange={this.onChange}
                            />





                            <input
                                type="text"
                                className="form-control"
                                id="subjectName"
                                name="cardNumber"
                                required={true}
                                placeholder="Enter Card Number"
                                value={this.state.cardNumber}
                                onChange={this.onChange}
                            />



                            <input
                                type="text"
                                className="form-control"
                                id="subjectAmount"
                                name="cardName"
                                required={true}
                                placeholder="Enter Card Name"
                                value={this.state.cardName}
                                onChange={this.onChange}
                            />



                            <input
                                type="text"
                                className="form-control"
                                id="subjectAmount"
                                name="cvv"
                                required={true}
                                placeholder="Enter CVV"
                                value={this.state.cvv}
                                onChange={this.onChange}
                            />



                            <input
                                type="text"
                                className="form-control"
                                id="subjectAmount"
                                name="expiryDate"

                                required={true}
                                placeholder="Enter Expiry Date"
                                value={this.state.expiryDate}
                                onChange={this.onChange}
                            />



                            <button type="submit" className="btn btn-primary">Confirm</button>
                        </form>
                    </div>
                </center>
            </div>
        )
    }

}
export default CreatePayment;











