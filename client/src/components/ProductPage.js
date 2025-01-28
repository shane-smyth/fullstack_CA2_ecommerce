import React, { Component } from "react"
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants";

export default class ProductPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: [],
        }
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/products/${this.props.match.params.id}`)
            .then(res => {
                if (res.data) {
                    this.setState({
                        product: res.data
                    })
                }
            })
    }

    render() {
        const { product } = this.state
        console.log(product)
        return (
            <div className="wholeProductPage">
                <div className="productPage">
                    <div className="productName boxes">
                        <h2>{product.name}</h2>
                    </div>
                    <div className="productImgBox boxes">
                        <img src={product.images} alt=""/>
                    </div>

                    <div className="productMainBox boxes">
                        <h1>{product.price}</h1>
                    </div>

                    <div className="productSpecsBox boxes">
                        <h2>specs</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci aut consectetur deserunt
                            ducimus eaque facere facilis fugit ipsam iure natus odio, officiis quas quos recusandae
                            saepe
                            soluta tempore unde!</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
                        adipisci aut consectetur deserunt
                        ducimus eaque facere facilis fugit ipsam iure natus odio, officiis quas quos recusandae saepe
                        soluta tempore unde!</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci
                        aut consectetur deserunt
                        ducimus eaque facere facilis fugit ipsam iure natus odio, officiis quas quos recusandae saepe
                        soluta tempore unde!</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci
                        aut consectetur deserunt
                        ducimus eaque facere facilis fugit ipsam iure natus odio, officiis quas quos recusandae saepe
                        soluta tempore unde!</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci
                        aut consectetur deserunt
                        ducimus eaque facere facilis fugit ipsam iure natus odio, officiis quas quos recusandae saepe
                        soluta tempore unde!</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci
                        aut consectetur deserunt
                        ducimus eaque facere facilis fugit ipsam iure natus odio, officiis quas quos recusandae saepe
                        soluta tempore unde!</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci
                        aut consectetur deserunt
                        ducimus eaque facere facilis fugit ipsam iure natus odio, officiis quas quos recusandae saepe
                        soluta tempore unde!</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci
                        aut consectetur deserunt
                        ducimus eaque facere facilis fugit ipsam iure natus odio, officiis quas quos recusandae saepe
                        soluta tempore unde!</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci
                        aut consectetur deserunt
                        ducimus eaque facere facilis fugit ipsam iure natus odio, officiis quas quos recusandae saepe
                        soluta tempore unde!</p>
                    </div>
                </div>

                <div className="otherProducts boxes">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    A alias animi blanditiis consequuntur
                    debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis, perspiciatis
                    quam quia quidem quo voluptatem.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
                    alias animi blanditiis consequuntur
                    debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis, perspiciatis
                    quam quia quidem quo voluptatem.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    A alias animi blanditiis consequuntur
                    debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis, perspiciatis
                    quam quia quidem quo voluptatem.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
                    alias animi blanditiis consequuntur
                    debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis, perspiciatis
                    quam quia quidem quo voluptatem.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    A alias animi blanditiis consequuntur
                    debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis, perspiciatis
                    quam quia quidem quo voluptatem.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    A alias animi blanditiis consequuntur
                    debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis, perspiciatis
                    quam quia quidem quo voluptatem.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p>
                </div>
            </div>
        )
    }
}
