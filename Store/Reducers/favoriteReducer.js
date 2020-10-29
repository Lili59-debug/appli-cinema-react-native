const initialState = {
    favoriteFilms: []
}

function toggleFavorite(state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'TOGGLE_FAVORITE':
            const favoriteFilmIndex = state.favoriteFilms.findIndex(item => item.id === action.value.id)
            if (favoriteFilmIndex !== -1) {
                //le film est déjà dans les favoris, on le supprime de la liste
                nextState = {
                    ...state,
                    favoriteFilms: state.favoriteFilms.filter(
                        (item, index) => index !== favoriteFilmIndex)
                    }
                }
                else {
                    //le film n'est pas encore dans les films favoris, on l'ajoute
                    nextState = {
                        ...state,
                        favoriteFilms: [...state.favoriteFilms, action.value]
                    }
                }
                return nextState || state //on met state si jamais ça se passe mal pour ne pas planter l'app
                default: return state
            }
    }

export default toggleFavorite