import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { getFilmDetailFromApi } from '../API/TMDBApi'
import { getImageFromApi } from '../API/TMDBApi'
import numeral from 'numeral'
import moment from 'moment'
import { connect } from 'react-redux'

//faire fonctionne numeral
// load a locale
numeral.register('locale', 'fr', {
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal: function (number) {
        return number === 1 ? 'er' : 'e';
    },
    currency: {
        symbol: '€'
    }
});

// switch between locales
numeral.locale('fr');
moment.locale('fr')


class FilmDetail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            film: undefined

        }
    }

    componentDidMount() {
        console.log(this.props)
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
            this.setState({
                film: data
            })
        })
    }

    _toggleFavorite() {
        //définition de notre action ici
        const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
        this.props.dispatch(action)
    }

    _displayFavoriteImage() {
        let sourceImage = require('../Images/ic_no_favorite.png')
        if (this.props.favoriteFilms.findIndex(item => item.id === this.state.film.id) !== -1) {
            //film dans nos favoris
            sourceImage = require('../Images/ic_favorite.png')
        }
        return (
            <Image
                style={styles.favorite_image}
                source={sourceImage}
            />
        )
    }

    _displayFilm() {
        if (this.state.film != undefined) {
            //afficher infos du film
            //utilisation de numeral pour afficher le budget
            var budget = numeral(this.state.film.budget).format('0,0[.]00 $');
            //utilisation de momentjs pour afficher la date
            var date = moment(this.state.film.release_date).format('L');

            return (
                <ScrollView style={styles.scrollview_container}>
                    <Text style={styles.titre}>{this.state.film.title}</Text>

                    {this.state.film.original_language != 'fr' ? <Text style={styles.original}>{this.state.film.original_title} ({this.state.film.original_language})</Text> : null}

                    <TouchableOpacity
                        style={styles.favorite_container}
                        onPress={() => this._toggleFavorite()}
                    >
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>

                    <Image style={styles.image} source={{ uri: getImageFromApi(this.state.film.poster_path) }} />

                    <View style={styles.description_container}>
                        <Text style={styles.overview}>{this.state.film.overview}</Text>
                    </View>

                    <View style={styles.gras}>
                        <Text>Sorti le {date}</Text>
                        <Text>Note : {this.state.film.vote_average}/10</Text>
                        <Text>Nombre de votes : {this.state.film.vote_count}</Text>
                        <Text>Budget : {budget}</Text>
                        <Text>
                            Genre(s) : {this.state.film.genres.map(function (genre) {
                            return genre.name;
                        }).join(" / ")}
                        </Text>
                        <Text>
                            Compagnie(s) : {this.state.film.production_companies.map(function (compagny) {
                            return compagny.name;
                        }).join(" / ")}
                        </Text>
                        <Text>
                            Pays : {this.state.film.production_countries.map(function (pays) {
                            return pays.name;
                        }).join(" / ")}
                        </Text>
                    </View>
                </ScrollView>
            )
        }
    }

    render() {
        console.log("Component FilmDetail rendu {this.props.navigation.state.params.idFilm}")
        return (
            <View style={styles.main_container}>
                <Text>Détail du film {this.props.navigation.state.params.idFilm}</Text>
                {this._displayFilm()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#EEE'
    },
    image: {
        resizeMode: 'contain',
        height: 200,
        margin: 5
    },
    titre: {
        textAlign: "center",
        fontWeight: 'bold',
        margin: 5,
        fontSize: 22,
        flex: 1,
        flexWrap: 'wrap'
    },
    original: {
        fontSize: 16,
        flex: 1,
        color: 'red',
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    gras: {
        fontWeight: "bold"
    },
    description_container: {
        marginTop: 5,
        marginBottom: 5
    },
    overview: {
        fontStyle: 'italic',
        color: '#555'
    },
    scrollview_container: {
        flex: 1
    },
    favorite_container: {
        alignItems: 'center',
    },
    favorite_image: {
        width: 40,
        height: 40
    }
})

//Connexion du state de l'application aves les props du composant FilmDetail
const mapStateToProps = (state) => {
    return {
        favoriteFilms: state.favoriteFilms
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => { dispatch(action) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilmDetail)