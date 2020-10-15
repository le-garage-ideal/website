
import React, {useState} from 'react';
import './Menu.css';

export const CHOOSE_IMAGES_MENU = "Choose images";
export const CREATE_UPDATE_DELETE_VARIANTS = "CRUD cars"

export const Menu = ({ menuSelect }) => {
        
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <nav className="css-menu">
            <button className={`menu-item${selectedItem === CHOOSE_IMAGES_MENU ? ' selected' : ''}`}
                onClick={() => { setSelectedItem(CHOOSE_IMAGES_MENU); menuSelect(CHOOSE_IMAGES_MENU); }}>
                {CHOOSE_IMAGES_MENU}
            </button>
            <button className={`menu-item${selectedItem === CREATE_UPDATE_DELETE_VARIANTS ? ' selected' : ''}`}
                onClick={() => { setSelectedItem(CREATE_UPDATE_DELETE_VARIANTS); menuSelect(CREATE_UPDATE_DELETE_VARIANTS); }}>
                {CREATE_UPDATE_DELETE_VARIANTS}
            </button>
            <div className="animation start-home"></div>
        </nav>
    );

};
