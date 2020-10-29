import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Button, FlatList, Text, ActivityIndicator } from 'react-native';
import FilmItem from './FilmItem';
import { getFilmsFromApiWithSearchedText} from '../API/TMDBApi'
import { connect } from 'react-redux'

  const renderItem = ({ item }) => (
    <Item title={item.title} />
  );

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

class Search extends Component {

    constructor(props) {
        super(props)
        this.searchedText = ""
        this.page = 0
        this.totalPages = 0
        this.state = {
            films: [],
            isLoading: false
        }
    }

    //Définition des méthodes privées
_loadFilms() {
    //tester si argument de recherche a bien été rempli
    if (this.searchedText.length>0) {
        this.setState({isLoading: true})
        //lancement du chargement + ajout page pour qu'il ne charge pas toujours la même page
        getFilmsFromApiWithSearchedText(this.searchedText, this.page + 1).then
        (data => {
            this.page = data.page
            this.totalPages = data.total_pages
            this.setState({
                films: [...this.state.films, ...data.results], //concaténation de 2 tableaux
                isLoading: false
            })
        })
    }
}

//fonction _searchFilms créée pour le scroll infini qui réinitialise tout quand on change de mot clé
_searchFilms() {
    this.page = 0
    this.totalPages = 0
    this.setState({
        films: [],
    }, () => {
        //appel lorsque le setState est terminé car setState est asynchrone
        console.log("Page : " + this.page + " / Total Pages : " + this.totalPages + " / Nombre de films : " + this.state.films.length)
        this._loadFilms()
    })
}

_searchTextInputChanged(text) {
    this.searchedText = text.trim()
}

_displayDetailForFilm = (idFilm) => {
    console.log("Display film with id " + idFilm)
    this.props.navigation.navigate("FilmDetail", {idFilm:idFilm})
}

_displayLoading() {
    if (this.state.isLoading) {
        return (
            <View style={styles.loading_container}>
                <ActivityIndicator size='large'
                color='#0000ff' />
            </View>
        )
    }
}

    render() {
        return (
            <View style={styles.main_vue}>
                
                
                <TextInput
                    style={styles.textinput}
                    placeholder="Trouver un film..."
                    onChangeText={(text) => this._searchTextInputChanged(text)}
                    onSumbmitEditing={() => this._searchFilms()}
                />
                <Button title="Rechercher" onPress={() => this._searchFilms()} />
                <FlatList
                    data={this.state.films}
                    extraData={this.props.favoriteFilms}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) =>
                    <FilmItem film={item}
                    //gérer le favori
                    isFilmFavorite={(this.props.favoriteFilms.findIndex(film => film.id === item.id) !== -1)? true:false}
                    displayDetailForFilm={this._displayDetailForFilm}/>}
                    onEndReachedThreshold={0.5} //pour que charge la suite au milieu du dernier film
                    onEndReached={() => {
                        if (this.page < this.totalPages) {
                            this._loadFilms()
                        } //pour qu'il charge la suite
                    }}    
                />
                {this._displayLoading()} 
      <Text style={styles.note}>Source : themoviedb</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_vue: {
        marginTop: 40,
        flex:1,
    },
    textinput: {
        marginLeft: 5,
        marginRight: 2.5,
        marginBottom: 5,
        padding: 5,
        borderColor: '#999',
        borderWidth: 1,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
      },
      title: {
        fontSize: 32,
      },
      note: {
          textAlign: "center",
          fontSize: 12,
      },
      
      loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center"
      }
})

//connexion au store redux
const mapStateToProps = state => {
    return {
        favoriteFilms: state.favoriteFilms
    }
}

export default connect(mapStateToProps) (Search)