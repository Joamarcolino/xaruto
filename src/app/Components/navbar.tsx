import React from 'react';
import imagemxaruto from "../Images/imagemxaruto.jpg"
import Tempomes from './tempodomes';
import icone from '../favicon.ico' 

import Image from 'next/image';

const Navbar = () => {
    return (
        <header className="cabecario">
            <div className="xarutodiv">
                <div className="xarutodiv2">
                    <Image className="xarutotituloicone" alt={"Xaruto"} src={icone} width={65}/>
                    <div className='xarutodiv3'>
                         <h1 className="xarutotitulo"> Xaruto</h1>
                        <p className="subtitulo">Controle Financeiro Inteligente</p>
                    </div>
                </div>
                <Tempomes />
            </div>
        </header>
    );
};

export default Navbar;