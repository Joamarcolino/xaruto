import React from 'react';

const Tempomes = () => {
    return (
        <div className="tempomes">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="white"/>
                <path d="M7 12H9V14H7V12ZM11 12H13V14H11V12ZM15 12H17V14H15V12ZM7 16H9V18H7V16ZM11 16H13V18H11V16ZM15 16H17V18H15V16Z" fill="white"/>
            </svg>
        </div>
    );
};

const Navbar = () => {
    return (
        <header className="cabecario">
            <div className="xarutodiv">
                <div className="xarutodiv2">
                    <img src="/logo.png" alt="Xaruto Logo" className="logo" />
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