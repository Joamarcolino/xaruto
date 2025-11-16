import React from 'react';
import imagemxaruto from "../Images/imagemxaruto.jpg"
import Tempomes from './tempodomes';

const Navbar = () => {
    return (
        <header className="cabecario">
            <div className="xarutodiv">
                <div className="xarutodiv2">
                    <div className='xarutodiv3'>
                        <h1 className="xarutotitulo">Xaruto</h1>
                        <p className="subtitulo">Controle Financeiro Inteligente</p>
                    </div>
                </div>
                <Tempomes />
            </div>
        </header>
    );
};

export default Navbar;