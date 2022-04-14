import './styles/main.scss';
import {Elm} from './elm/Main.elm';

const appContainer = document.createElement('div');
document.body.appendChild(appContainer);

const app = Elm.Main.init({
    node: appContainer,
    flags: {...elmFlags},
});
