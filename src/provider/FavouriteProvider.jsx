import { FavouriteContext } from "../context";
import { useLocalStorage } from "../hooks";

const FavouriteProvider = ({ children }) => {
    const [favourites, setFavourites] = useLocalStorage("favourites", []);

    const addToFavourites = (latitude, longitude, location) => {
        setFavourites([
            ...favourites,
            {
                latitude: latitude,
                longitude: longitude,
                location: location,
            },
        ]);
    };

    const removeFromFavourites = (location) => {
        const rest = favourites.filter((fav) => fav.location !== location);

        setFavourites(rest);
    };

    return (
        <FavouriteContext.Provider
            value={{ addToFavourites, removeFromFavourites, favourites }}
        >
            {children}
        </FavouriteContext.Provider>
    );
};

export default FavouriteProvider;
