import React, { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    state = {
            char: {},
            loading: true,
            error: false
     
        
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
        // this.timerId = setInterval(this.updateChar, 3000);
    }

    componentWillUnmount (){
        clearInterval(this.timerId);
        console.log('unmount');
    }


    onCharLoading = ()=>{
        this.setState({
            loading: true
        })
    }
    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    };

    retryLoadChar = () => {
        this.setState({
            error: false,
            loading: true
        });
        this.updateChar();
    };

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
            
        });
    };

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    };

    render() {
        const { char, loading, error } = this.state;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? <View char={char} /> : null;

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Случайный персонаж для сегодня!<br />
                        Хотите узнать его лучше?
                    </p>
                    <p className="randomchar__title">Или выберите другого</p>
                    <button className="button button__main"  onClick={this.retryLoadChar}>
                        <div className="inner">Попробовать</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        );
    }
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki } = char;
    let descriptionText = description ? description : 'Для этого персонажа нет описания.';
    const maxDescriptionLength = 200;
    // Если описание длиннее 200 символов, обрезаем его и добавляем "..."
    if (descriptionText.length > maxDescriptionLength) {
        descriptionText = descriptionText.slice(0, maxDescriptionLength) + '...';
    }
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Случайный персонаж" className="randomchar__img"  style={imgStyle} />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{descriptionText}</p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">Домашняя страница</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Википедия</div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RandomChar;